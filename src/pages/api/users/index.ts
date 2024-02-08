import type { NextApiRequest, NextApiResponse } from 'next'
import { uniqueUsernameGenerator, Config } from 'unique-username-generator';

import { User as UserModel } from '../../../../backend/models'
import { getColors } from '../../../helpers';

import type { optionProps, UserInputFields } from '../../../../@types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const User = new UserModel(req, res);
        if (req.method === "POST") {
            const inputData = validateFormData(req);
            const result = await User.insert(inputData);
            res.status(200).json({
                status: 'success',
                message: "Successfully create new user.",
                data: result
            })
        } else {
            const options: optionProps = getOptions(req);
            const users = await User.getAll(options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    users,
                }
            })
        }
    } catch (error: any) {
        res
            .status(500)
            .json({
                status: "error",
                message: error.message || "something went wrong."
            });
    }
}

const getOptions = (req: NextApiRequest) => {
    const {
        limit = 0,
        skip = 0,
        ownedNft = true,
        createdNft = true,
        collection = true,
        follower = true,
        following = true,
        sortBy = "updatedAt",
        sort = -1,
        artist = false,
        artistoruser = false,
        admin = false,
        from = "",
        authorizer = false,
        isAuthorizers = false,

    }: any = req.query;
    let match: any = {};
    const isAuthorizer: boolean = (typeof isAuthorizers === "boolean" && isAuthorizers) || isAuthorizers === "true" ? true : false;
    const owned: Boolean = typeof ownedNft === "boolean" && ownedNft || ownedNft === "true" ? true : false;
    const created: Boolean = typeof createdNft === "boolean" && createdNft || createdNft === "true" ? true : false;
    const Collection: Boolean = typeof collection === "boolean" && collection || collection === "true" ? true : false;
    const Follower: Boolean = typeof follower === "boolean" && follower || follower === "true" ? true : false;
    const Following: Boolean = typeof following === "boolean" && following || following === "true" ? true : false;
    if (typeof artist === "boolean" && artist || artist === "true") {
        match.role = "ARTIST";
        match.isApproved = true;
    }

    if (typeof artistoruser === "boolean" && artistoruser || artistoruser === "true") {
        match.role = {
            $in: ['USER', 'ARTIST']
        }
    }
    if (typeof admin === "boolean" && admin || admin === "true") {
        match.role = "ADMIN";
        match.isApproved = true;
    }
    if (typeof authorizer === "boolean" && authorizer || authorizer === "true") {
        match.role = "AUTHORIZER";
        match.isApproved = true;
    }
    if (from === "admin") {
        match.role = {
            $in: ['USER', 'ARTIST', 'AUTHORIZER', 'ADMIN']
        }
    }
    if (isAuthorizer) {
        match.role = "AUTHORIZER";
    }

    const options: optionProps = {
        limit: parseInt(limit.toString()),
        skip: parseInt(skip.toString()),
        ownedNft: owned,
        createdNft: created,
        collection: Collection,
        follower: Follower,
        following: Following,
        sortBy: { [sortBy]: sort },
        match
    };
    return options;
}

const validateFormData = (req: NextApiRequest) => {
    if (typeof req.body === "object") {
        const formData = req.body;
        const config: Config = {
            dictionaries: [formData.name.split(" ")],
            separator: '',
            style: 'lowerCase',
            randomDigits: 3,
            length: 25
        }
        const username: string = uniqueUsernameGenerator(config);
        const validateDate: UserInputFields = {
            name: formData.name,
            ethAddress: formData.ethAddress,
            username: username,
            email: formData.email || "",
            password: "",
            description: formData.description,
            colors: getColors(4),
            accounts: formData.accounts,
            socialLinks: formData.socialLinks || {},
            isVarified: false,
            theme: "light",
            banner: undefined,
            image: undefined,
            authData: formData.authData || {},
            status: false,
            isArtist: false
        };
        return validateDate;
    } else {
        throw new Error("Invalid form data");

    }

}