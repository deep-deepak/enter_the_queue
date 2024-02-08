import type { NextApiRequest, NextApiResponse } from 'next'
import { Template } from '../../../../../backend/models/Template';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const templateModel = new Template(req, res);
        let templates = await templateModel.get();
        templates = templates.map(template => {
            template.id = template._id;
            delete template._id;
            return template;
        })
        res.status(200).json({
            status: 'success',
            data: {
                templates
            }
        })
    } catch (error: any) {
        res
            .status(500)
            .json({
                status: "error",
                message: error.message || "something went wrong."
            });
    }
}