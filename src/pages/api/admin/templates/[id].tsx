import type { NextApiRequest, NextApiResponse } from 'next'
import { Template } from '../../../../../backend/models/Template';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const templateModel = new Template(req, res);
        if (req.method === "GET") {
            const id: any = req.query.id;
            const column: any = req.query.column || "_id";
            const page = await templateModel.first(id, {}, column);
            res.status(200).json({
                status: 'success',
                message: "",
                data: page
            })
        } else if (req.method === "PUT") {
            const id: any = req.query.id;
            const formData = req.body;
            await templateModel.update(id, formData);
            res.status(200).json({
                status: 'success',
                message: "Template updated successfully!",
            })
        } else {
            throw new Error('Invalid request!');
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