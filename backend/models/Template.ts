import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class Template extends Model {

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("templates", req, res);
    }
}