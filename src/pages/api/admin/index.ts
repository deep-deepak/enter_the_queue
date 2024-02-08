import type { NextApiRequest, NextApiResponse } from 'next'

import { EthTransaction, User as UserModel } from '../../../../backend/models'
import { validateAdminData } from '../../../../backend/schema/admin';
import Hash from 'utils/server/hash';
import moment from 'moment';
import { ObjectId } from 'mongodb';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const userId = await createOrUpdateWithValidate(req, res);
            if (req.body.blockchain) {
                const ethTransaction = new EthTransaction(req, res);
                await ethTransaction.insert({
                    ...(req.body.tx || {}),
                    type: "user",
                    subType: "admin",
                    moduleId: new ObjectId(userId),
                });
            }
            res.status(200).json({
                status: "success",
                message: "Admin created or updated successfully!",
                data: userId
            })
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

const createOrUpdateWithValidate = async (req: NextApiRequest, res: NextApiResponse) => {
    const formData = req.body;
    const userModel: any = new UserModel(req, res);
    const validated = await validateAdminData(formData);
    if (!validated.status) {
        throw new Error(validated.errors.shift());
    }
    let userData = await userModel.first(formData.email, {}, "email");
    if (!userData) {
        userData = await userModel.first(formData.address, {}, "ethAddress");
    } else {
        const checkUniqueAddress = await userModel.first(formData.address, {
            _id: { $ne: userData.id }
        }, "ethAddress");
        if(checkUniqueAddress) {
            throw new Error("Wallet address is already exist!")
        }
    }
    if (!userData) {
        const hashPassword = Hash.make(formData.password);
        const firstName = (formData.name.split(" "))?.[0] || "etq";
        const username: string = firstName.toLocaleLowerCase() + moment().valueOf();
        return await userModel.createOrUpdateAdmin({
            name: formData.name,
            email: formData.email,
            password: hashPassword,
            ethAddress: formData.address,
            username: username,
            description: "",
            colors: [],
            accounts: [
                formData.address
            ],
            socialLinks: {},
            isVarified: false,
            theme: "light",
            banner: "",
            image: "undefined",
            authData: {},
            role: "ADMIN",
            isApproved: true,
            isMarketplaceAdmin: formData.blockchain,
            canAdminApprove: false,
            rememberToken: "",
            status: true
        });
    }
    let inputData: any = {
        name: formData.name,
        email: formData.email,
        role: "ADMIN",
        isApproved: true,
        isMarketplaceAdmin: true,
        canAdminApprove: false,
        rememberToken: "",
        status: true
    }
    if (!userData.ethAddress) {
        inputData.ethAddress = formData.address;
    }
    const userId = userData.id.toString();
    await userModel.createOrUpdateAdmin(userId, inputData);
    return userId;

}
