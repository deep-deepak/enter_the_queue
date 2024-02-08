// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { Config, uniqueUsernameGenerator } from 'unique-username-generator';
import moment from 'moment';
import { ethers } from 'ethers';
import { setCookies } from 'cookies-next'

import { JWT } from '../../utils/jwt';
import { UserInputFields, UserWalletAddress } from '../../../@types';
import { User } from '../../../backend/models';
import { SECRET } from '../../../backend/constants';


interface requestBodyProps {
    address: UserWalletAddress
}

const dictionary = [
    "Iron Man", "Captain America", "Hulk", "Thor", "Ant-Man", "Wasp", "Doctor Strange",
    "Black Widow", "Black Panther", "Shuri", "Okoye", "Wintor Soldier", "Howkeye",
    "Falcon", "Maria Hill", "Vision", "Hulkbuster", "War Machine", "Nick Fury"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { address = "" }: requestBodyProps = req.body || {};
            const isValidAddress = ethers.utils.isAddress(address);
            if (isValidAddress) {
                const data = await checkLoginUser(address, req, res);
                let token: string = data?.token || "";
                const user = data.user;
                if(!token) {
                    const jwt = new JWT();
                    token = jwt.createToken(data.user);
                    setCookies(SECRET, token, { req, res, maxAge: 60 * 60 * 3 });
                }
                delete user.password;
                res.status(200).json({
                    status: "success",
                    data: { token, user }
                })
            } else {
                res
                    .status(403)
                    .json({
                        status: "error",
                        message: "Invalid user address"
                    });
            }
        } else {
            res
                .status(403)
                .json({
                    status: "error",
                    message: "Invalid method"
                });
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

const checkLoginUser = async (userAddress: UserWalletAddress, req: NextApiRequest, res: NextApiResponse) => {
    const { accounts = {}, authData = {} } = req.body;
    const userModel = new User(req, res);
    const loginData: any = await userModel.getLoginUser();
    let inputData = {
        authData: authData,                
        accounts: accounts,
        ethAddress: userAddress
    };
    let token = loginData?.token || "";
    let userData: any = loginData?.user || false;
    if(!userData) {
        userData = await userModel.first(userAddress, {}, "ethAddress");
    } else {
        if(userAddress !== userData.ethAddress) {
            throw new Error(`Wallet address mismatched!`);
        }
        token = userData.token;
        if(userData.ethAddress) {
            delete inputData.ethAddress
        }
    }
    let userId = userData?.id?.toString() || "";
    if(!userData) {
        const random: any = Math.floor(Math.random() * dictionary.length);
        const name = dictionary?.[random] || "noname";
        const firstName = (name.split(" "))?.[0] || "etq";
        const username: string = firstName.toLocaleLowerCase()+moment().valueOf();

        const inputData: UserInputFields = {
            name: name,
            email: "",
            password: "",
            ethAddress: userAddress,
            username: username,
            description: "",
            colors: getColors(4),
            accounts: accounts,
            socialLinks: {},
            isVarified: false,
            theme: "light",
            banner: "",
            image: "",
            authData: authData,
            role: "USER",
            isApproved: false,
            isMarketplaceAdmin: false,
            canAdminApprove: false,
            rememberToken: "",
            status: true
        };
        const result = await userModel.insert(inputData);
        userId = result._id.toString();
    } else {
        await userModel.update(userId, inputData);
    }
    const loginUser = await userModel.first(userId);
    return {
        token,
        user: loginUser
    };
}

const getColors = (length: number = 1) => {
    const colors = [];
    for (let index = 0; index < length; index++) {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colors.push(`#${randomColor}`);
    }
    return colors;
}