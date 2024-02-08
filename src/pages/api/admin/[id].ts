import type { NextApiRequest, NextApiResponse } from 'next'

import { User } from '../../../../backend/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "DELETE") {
            const userModel = new User(req, res);
            const userId: any = req.query.id;
            await userModel.removeAuthorizerByAdmin(userId, "user");
            res.status(200).json({
                status: "success",
                message: "Remove user from admin successfully!!",
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
