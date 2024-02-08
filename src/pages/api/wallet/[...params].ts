import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { params }: any = req.query;
        const userModel = new User(req, res);
        const [address, type] = params || [];
        const result = await userModel.setAdminOrArtistOrAuthorize(address, type, "ethAddress");
        res.status(200).json({
            status: 'success',
            message: "Updated successfully!",
            data: {
                result,
                params
            }
        })
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}