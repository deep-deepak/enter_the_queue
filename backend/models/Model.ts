import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClientOptions, ObjectId } from 'mongodb'

import { MongoDbClient } from '../../src/utils/api/mongodb';
import { SECRET } from '../constants';

import type { InsertInputProps, UpdateInputProps } from '../../@types';
import { getCookie } from 'cookies-next';
import { getTokenData } from '../../src/services';

export class Model extends MongoDbClient {

    protected request: NextApiRequest;
    protected response: NextApiResponse;
    protected userToken: string;
    protected user: any = {};
    protected collection: string;
    private notAuthenticatedUrls: any;

    private MongodbClientOptions: MongoClientOptions = {
        // serverSelectionTimeoutMS: 10, 
        connectTimeoutMS: 20000
    };

    constructor(collection: string, req: NextApiRequest, res: NextApiResponse, urls: any = []) {
        super();
        this.collection = collection;
        this.request = req;
        this.response = res;
        this.notAuthenticatedUrls = urls?.length ? urls.filter((url: string) => url) : typeof urls === "string" && urls === "*" ? "*" : [];
        const token: any = getCookie(SECRET, { req, res });
        const tokenData = getTokenData(token);
        // if(!tokenData) throw new Error("Invalid token");

        this.userToken = token;
        if (tokenData) {
            this.user = tokenData.user;
        }
    }

    connectDb = async () => {
        await this.connect(`${this.mongodbUri}/${this.database}`, this.collection, this.MongodbClientOptions);
        if (!this.db) {
            throw new Error("Database connection failed!");
        }
    }

    async get(options: any = {}) {
        try {
            await this.connectDb();
            const result = await this.db.find(options).toArray();
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async first(
        value: any,
        options: any = {},
        column: string = "_id"
    ) {
        try {
            await this.connectDb();
            if (column === "_id") {
                options._id = new ObjectId(value);
            } else {
                options[column] = value;
            }
            let result = await this.get(options);
            if (result.length) {
                result = result.shift();
                result.id = result._id;
                delete result._id;
                return result;
            }
            return false;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async insert(inputData: any, options: any = {}) {
        try {
            await this.connectDb();
            const newInputData: any = {
                ...inputData,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            if(this.user?.id) {
                newInputData.createdBy = new ObjectId(this.user.id);
                newInputData.updatedBy = new ObjectId(this.user.id);
            }
            const result = await this.db.insertOne(newInputData);
            return {
                _id: result.insertedId ? result.insertedId.toString() : ""
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async update(value: any, inputData: any, options: any = {}, column: string = "_id") {

        try {
            await this.connectDb();
            const query: any = {};
            if (column === "_id") {
                query._id = new ObjectId(value);
            } else {
                query[column] = value;
            }
            if (typeof inputData.createdAt !== "undefined") delete inputData.createdAt;
            if (typeof inputData.createdBy !== "undefined") delete inputData.createdBy;
            const newInputData: UpdateInputProps = {
                ...inputData,
                updatedBy: new ObjectId(this.user.id),
                updatedAt: new Date(),
            }
            const result = await this.db.updateOne(
                query,
                { $set: newInputData }
            )
            return result.acknowledged ? true : false;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async delete(value: any, column: string = "column") {
        try {
            await this.connectDb();
            const query: any = {};
            if (column === "_id") {
                query._id = new ObjectId(value);
            } else {
                query[column] = value;
            }
            try {
                const result = await this.db.deleteOne(query);;
                return result;
            } catch (error: any) {
                throw new Error(error.message);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    aggregate = async (pipeline: any, res: string = "multi") => {
        try {
            await this.connectDb();
            let result = (await this.db?.aggregate(pipeline).toArray()) || [];
            result = result.filter((i: any) => {
                i.id = i._id;
                delete i._id;
                return i
            });
            if (res === "single") {
                return result?.shift() || false;
            }
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    checkAuthentication = () => {
        const query: any = this.request.query || {};
        const currentUrl = this.request.url?.slice(-1) === "/" ? this.request.url?.slice(0, -1) : (this.request.url || "");
        if (this.notAuthenticatedUrls === "*") {
            return true;
        } else {
            for (let index = 0; index < this.notAuthenticatedUrls.length; index++) {
                var url = this.notAuthenticatedUrls[index];
                url = url?.slice(-1) === "/" ? url?.slice(0, -1) : (url || "");
                const params = url.match(/[^[\]]+(?=])/g) || [];
                params.forEach((param: string) => {
                    url = url.replace(`[${param}]`, query[param]);
                });
                const checkUrl = '/api' + url;
                if (currentUrl === checkUrl) return true;
            }
            return false;
        }

    }
}


export default Model