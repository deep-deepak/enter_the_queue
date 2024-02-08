import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../../../backend/models";
import { validateArtistForm } from "../../../../../schemas";




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { userId }: any = req.query || {};
            const formData = req.body ;
            const userModel = new User(req, res);
            const user = await userModel.first(userId);
            if (!user) throw new Error("Invalid user id!");
            const validateRes: any = await validateArtistForm(formData);
            if(!validateRes.status) throw new Error(validateRes.errors.shift() || "Something went wrong!");
            const result = await userModel.update(userId,{
                ...validateRes.data,
                role:'ARTIST',
                isApproved:false,
                canAdminApprove: true
            })
            res.status(200).json({
                status: "success",
                data: result
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