import type { NextApiRequest, NextApiResponse } from 'next'

import { Category as CategoryModel } from '../../../../backend/models'
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const Category = new CategoryModel(req, res);
        if (req.method === "GET") {
            const options: any = {};
            let ids = req.query['ids[]'] || [];
            ids = typeof ids == "string" ? [ids] : ids;
            if(ids.length) {
                const oIds = ids.map(id => new ObjectId(id));
                options._id = { $in: oIds}
            }
            const categories = await Category.get(options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    categories
                }
            })
        } else {
            res
                .status(403)
                .json({
                    status: "error",
                    msg: "Invalid method",
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