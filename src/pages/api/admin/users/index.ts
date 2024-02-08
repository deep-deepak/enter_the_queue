import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../../backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userModel = new User(req, res);
        if (req.method === "POST") {
            
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