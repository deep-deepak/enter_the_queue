import { optionProps } from '../../@types';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class User extends Model {

    collection: string = "users";

    public defaultPipeline = [
        {
            $lookup: {
                from: "followers",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "followings",
            }
        },
        {
            $lookup: {
                from: "followers",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$userId", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "followers",
            }
        },
        {
            $lookup: {
                from: "nfts",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$ownedBy", "$$userId"] }
                        }
                    },
                    { $count: "count" }
                ],
                as: "ownedNft",
            },
        },
        {
            $lookup: {
                from: "nfts",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    { $count: "count" }
                ],
                as: "createdNft",
            },
        },
        {
            $lookup: {
                from: "collections",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "collections",
            }
        }
    ]

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("users", req, res, [
            'login',
            '/admin/login',
            '/user'
        ]);
    }

    getAll = async (options: optionProps) => {
        let {
            match,
            skip = 0,
            limit = 0,
            sortBy = { "updatedAt": -1 },
            others = []
        } = options;
        if (this.user?.id) {
            match.$expr = { $ne: ["$_id", new ObjectId(this.user.id)] };
        }

        let pipeline: any = [...this.defaultPipeline, { $sort: sortBy }, ...others];
        if (match) {
            pipeline = [...pipeline, { $match: match }];
        }
        if (limit > 0) {
            pipeline = [...pipeline, { $limit: limit + skip }];
        }
        if (skip > 0) {
            pipeline = [...pipeline, { $skip: skip }];
        }

        return await this.aggregate(pipeline);
    }


    getDetails = async (objectId: ObjectId, options: any = {}) => {
        options = typeof options === 'object' && options ? options : {};
        const { artist = false } = options;
        let match: any = { _id: objectId };
        if (artist) {
            match.role = "ARTIST";
            match.isApproved = true;
        }
        const pipeline: any = [...this.defaultPipeline, { $match: match }];
        return await this.aggregate(pipeline, "single");
    }


    approveArtist = async (id: string = "", status = true) => {
        if (this.user.role === "ADMIN") {
            const { userId = id }: any = this.request.query || {};
            if (!userId) throw new Error("Invaluid user id");
            return await this.update(userId, {
                isApproved: status,
                canAdminApprove: status,
                rememberToken: "",
                role: 'ARTIST'
            });
        } else {
            throw new Error("You are not Authorised");
        }
    }


    createOrUpdateAdmin = async (inputData: any, id: string = "") => {
        if (this.user.role === "ADMIN") {
            if(id) {
                await this.update(inputData, id);
                return id;
            } else {
               const result = await this.insert(inputData);
               return result._id;
            }
        } else {
            throw new Error("You are not Authorised");
        }
    }

    removeAuthorizerByAdmin = async (id: string = "", userType: any = "artist") => {
        if (this.user.role === "ADMIN") {
            if (!id) throw new Error("Invalid user id");
            if (userType === "artist") {
                return await this.update(id, {
                    isApproved: true,
                    isMarketplaceAdmin: false,
                    canAdminApprove: true,
                    rememberToken: "",
                    role: 'ARTIST'
                });
            } else if (userType === "user") {
                return await this.update(id, {
                    isApproved: false,
                    isMarketplaceAdmin: false,
                    canAdminApprove: false,
                    rememberToken: "",
                    role: 'USER'
                });
            }
        } else {
            throw new Error("You are not Authorised");
        }
    }



    setAdminOrArtistOrAuthorize = async (value: any, type: string = "artist", column = "_id") => {
        try {
            await this.connectDb();
            let inputData = {};
            if (type === "artist") {
                inputData = {
                    role: "ARTIST",
                    isApproved: true
                }
            } else if (type === "admin") {
                inputData = {
                    role: "ADMIN",
                    isApproved: true
                }
            } else if (type === "authorizer") {
                inputData = {
                    role: "AUTHORIZER",
                    isApproved: true
                }
            }
            const query = {
                [column]: value
            }
            if (Object.keys(inputData).length) {
                const result = await this.db.updateOne(
                    query,
                    { $set: inputData }
                )
                return result.acknowledged ? true : false;
            }
            return false;
        } catch (error) {
            return false
        }
    }

    getLoginUser = async () => {
        if(!Object.keys(this.user).length) return false;
        const result = await this.first(this.user.id.toString());
        if(result) {
            delete result.password;
            return {
                token: this.userToken,
                user: result
            };
        }
        return false;
    }


}