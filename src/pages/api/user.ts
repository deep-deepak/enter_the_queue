// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteCookie } from 'cookies-next'

import { User } from '../../../backend/models';
import { SECRET } from '../../../backend/constants';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userModel = new User(req, res);
        if(!userModel.checkAuthentication()){
            throw new Error('You are not authenticated!');
        }
        const loginUserData = await userModel.getLoginUser();
        if(!loginUserData) {
            throw new Error('You are not authenticated!');
        }
        res
            .status(200)
            .json({
                status: "success",
                data: loginUserData
            });
    } catch (error: any) {
        deleteCookie(SECRET, { req, res });
        res
            .status(500)
            .json({
                status: "error",
                message: error.message || "something went wrong."
            });
    }
}