import { NextApiRequest, NextApiResponse } from "next";
import { Nft } from "../../../../../backend/models";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { slug } = req.query;
        let [nftId = "", type = "", actionId = ""]: any = slug;
        if (req.method === "PUT") {
            let message = "";
            const nftModel = new Nft(req, res);
            switch (type) {
                case "refund":
                    await nftModel.refundOfferAmountToOfferer(nftId, {
                        transaction: req.body.transaction,
                        offerId: actionId
                    });
                    message = "successfully refund amount to offerer!";
                    break;
                case "transfer":
                    await nftModel.transferNftItemByAdmin(nftId, {
                        transaction: req.body.transaction,
                        auctionId: actionId
                    });
                    message = "successfully transfer nft to higher bidder!";
                    break;

                default:
                    throw new Error("Invalid type!");
                    break;
            }
            res.status(200).json({
                status: 'success',
                message: message
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