import { NextApiRequest, NextApiResponse } from "next";
import { Nft, User } from "../../../../../../backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userModel: any = new User(req, res)
        if (req.method === "PUT") {
            if (userModel.user?.role !== "ADMIN") throw new Error("You are not Authentictaed");
            const { id, auctionId }: any = req.query;
            const nftModel = new Nft(req, res);
            const result = await nftModel.transferNftItemByAdmin(id, {
                transaction: req.body.transaction,
                auctionId
            });
            res.status(200).json({
                status: 'success',
                message: "successfully buy nft!",
                data: {}
            })

        } else {
            throw new Error("Invalid method");
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}