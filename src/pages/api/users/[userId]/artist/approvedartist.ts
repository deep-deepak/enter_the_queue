import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../../../backend/models";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const userModel = new User(req, res);
            const user: any = await userModel.approveArtist();
            
            res.status(200).json({
                status: "success",
                data: user
            })
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