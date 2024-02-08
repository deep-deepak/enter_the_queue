import type { NextApiRequest, NextApiResponse } from 'next'

import { User as UserModel } from '../../../../../backend/models'
import { Config, uniqueUsernameGenerator } from 'unique-username-generator';
import { ARTIST_REGISTRATION_SECRET, isValidUserWalletAddress } from '../../../../utils';
import { JWT } from '../../../../utils/jwt';
import { getColors } from '../../../../helpers';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const User: any = new UserModel(req, res);
        if (req.method === "PUT") {
            if (User.user?.role !== "ADMIN") throw new Error("You are not Authentictaed");
            const jwt = new JWT(ARTIST_REGISTRATION_SECRET, "24h");
            let result = false;
            const inputData = validateFormData(req);
            let user = await User.first(inputData.ethAddress, {}, "ethAddress");
            if (user) {
                var token = jwt.createToken({
                    id: user.id,
                    address: user.ethAddress
                });
                result = await User.update(user.id.toString(), {
                    email: inputData.email,
                    name: inputData.name,
                    role: "ARTIST",
                    isApproved: false,
                    rememberToken: token,
                    canAdminApprove: false
                })
            } else {
                const resData: any = await User.insert(inputData, {
                    restricted: false
                });
                if (resData?._id) {
                    const user = await User.first(resData?._id.toString());
                    var token = jwt.createToken({
                        id: user.id,
                        address: user.ethAddress
                    });
                    result = await User.update(user.id.toString(), {
                        role: "ARTIST",
                        isApproved: false,
                        rememberToken: token,
                        canAdminApprove: false
                    })
                }
            }
            if (result) {
                res.status(200).json({
                    status: "success",
                    message: "User created successfully!",
                    data: result
                })
            } else {
                throw new Error("User not created!");
            }
        } else {
            throw new Error("Invalid method!");
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

const validateFormData = (req: NextApiRequest) => {
    if (typeof req.body === "object") {
        const formData = req.body;
        if (!formData?.name) throw new Error("Name must be required!");
        if (!formData?.email) throw new Error("Email must be required!");
        if (!isValidUserWalletAddress(formData?.address)) throw new Error("!Invalid wallet address!");
        const config: Config = {
            dictionaries: [formData.name.split(" ")],
            separator: '',
            style: 'lowerCase',
            randomDigits: 3,
            length: 25
        }
        const username: string = uniqueUsernameGenerator(config);
        return {
            name: formData.name,
            ethAddress: formData.address,
            email: formData.email || "",
            username: username,
            description: "",
            colors: getColors(4),
            accounts: [],
            socialLinks: {},
            isVarified: false,
            theme: "light",
            banner: undefined,
            image: undefined,
            authData: {},
            role: "ARTIST",
            isApproved: false,
            canAdminApprove: false,
            status: true
        };
    } else {
        throw new Error("Invalid form data");

    }

}
