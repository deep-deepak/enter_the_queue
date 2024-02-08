import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../backend/models";
import Hash from "../../../../backend/hash";
import { JWT } from "utils/jwt";
import { setCookies } from "cookies-next";
import { SECRET } from "../../../../backend/constants";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userModel = new User(req, res);
        if (req.method === "POST") {
            const {email, password, remember = false} = req.body;
            const result = await userModel.first(email, {}, 'email');
            if(!result) {
                throw new Error("Invalid credentials!");
            }
            const isMatched = await Hash.check(password, result.password);
            if(!isMatched) {
                throw new Error("Invalid credentials!");
            }
            delete result.password;
            
            const jwt = new JWT();
            var token = jwt.createToken(result);
            setCookies(SECRET, token, { req, res, maxAge: 60 * 60 * (remember ? 24 : 3) });
            res.status(200).json({
                status: "success",
                data: { 
                    token,
                    data: result
                }
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