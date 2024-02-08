import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../../../backend/models";
import { ARTIST_REGISTRATION_SECRET } from "utils";
import { JWT } from "utils/jwt";




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { userId }: any = req.query || {};
            const userModel = new User(req, res);
            const user = await userModel.first(userId);
            if (!user) throw new Error("Invalid user id!");
            const jwt = new JWT(ARTIST_REGISTRATION_SECRET, '24h');
            var token = jwt.createToken({
                id: user.id,
                address: user.ethAddress
            });
            if (token) {
                await userModel.update(userId, { rememberToken: token, role: 'ARTIST', isApproved: false })
            }
            res.status(200).json({
                status: "success",
                data: { token }
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