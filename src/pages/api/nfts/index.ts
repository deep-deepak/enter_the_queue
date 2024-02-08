import type { NextApiRequest, NextApiResponse } from 'next'
import { EthTransaction, Nft as UserNftModel } from '../../../../backend/models'
import type { NftInputFields, optionPropsNft } from '../../../../@types';
import { ObjectId } from 'mongodb';
import { User } from '../../../utils/api/user';
import moment from 'moment';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const NftModel = new UserNftModel(req, res);
        const LoginUser = new User(req, res);
        const loginUserId = LoginUser.get('id') || "";
        if (req.method === "POST") {
            console.log(req.body, "inputdata")
            const inputData = await validateFormData(req, res);
            if (loginUserId) {
                inputData.ownedBy = new ObjectId(loginUserId);
            }
            const result = await NftModel.insert(inputData);
            if (result._id) {
                const ethTransaction = new EthTransaction(req, res);
                await ethTransaction.insert({
                    ...inputData.transactions,
                    type: "nft",
                    subType: "mint",
                    moduleId: new ObjectId(result._id),
                });

                await NftModel.createHistory(
                    result._id.toString(),
                    "mint",
                    loginUserId,
                    loginUserId,
                    inputData.transactions,
                    inputData.price
                );
            }
            res.status(200).json({
                status: 'success',
                message: "Successfully created new NFT.",
                data: result
            })
        } else {
            const options: optionPropsNft = getOptions(req);
            const nfts = await NftModel.getAll(options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    nfts
                }
            })
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

const getOptions = (req: NextApiRequest) => {
    let {
        limit = 0,
        skip = 0,
        createdBy = "",
        ownedBy = "",
        sort = { "updatedAt": -1 },
        trending = false,
        auction = false,
        collectionId = "",
        categoryId = "",
        status = ["publish", "on_sale", "on_auction"],
        type = false,
        search = "",
        offer = false,
        collection = "",
        category = "",
        minimum = "",
        maximum = "",
        from = "",
    }: any = req.query;

    sort = IsJsonString(sort) ? IsJsonString(sort) : { "updatedAt": -1 };
    const isAuction = (typeof auction === "boolean" && auction) || auction === "true" ? true : false;
    const Trending: Boolean = typeof trending === "object" || trending !== "true" ? false : true;
    offer = typeof offer === "object" || offer !== "true" ? false : true;
    auction = typeof auction === "object" || auction !== "true" ? false : true;
    status = status ? typeof status === "object" ? status : status.trim().split(',') : [];
    const options: optionPropsNft = {
        limit: parseInt(limit.toString()),
        skip: parseInt(skip.toString()),
        sort,
        trending: Trending,
        match: {},
        offer: offer,

    };
    if (status.length) {
        options.match.status = {
            $in: status
        }
    }


    // if (from) { options.match.form = ["open_for_bids"] }
    if (createdBy) { options.match.createdBy = new ObjectId(createdBy); }
    if (ownedBy) { options.match.ownedBy = new ObjectId(ownedBy); }
    if (collectionId) { options.match.collection = new ObjectId(collectionId); }
    if (categoryId) { options.match.category = new ObjectId(categoryId); }
    if (collection) { options.match.collection = new ObjectId(collection); }
    if (category) { options.match.category = new ObjectId(category); }
    if (minimum) { options.match.price = { $min: minimum } }
    if (maximum) { options.match.price = { $max: maximum } }
    if (isAuction) {
        let auctionOption: any = {
            onMarketPlace: true,
            "marketplace.type": "timed_auction"
        }
        if (from !== "admin") {
            auctionOption["marketplace.endDate"] = { $gte: moment().format() };
        }
        options.match = { ...options.match, ...auctionOption };
    }

    if (type) { options.match.fileType = type; }
    // if (auction) {
    //     options.match = {
    //         ...options.match,
    //         status: "on_auction",
    //         "marketplace.endDate": { $gte: moment().format() }
    //     }
    // }
    if (offer) {
        options.match = {
            ...options.match,
            onMarketPlace: true,
            "marketplace.type": 'open_for_bids'
        }
    }
    if (auction) {
        options.match = {
            ...options.match,
            onMarketPlace: true,
            "marketplace.type": 'timed_auction'
        }
    }
    if (search) {
        options.match.title = { $regex: search, $options: "i" }
    }
    let ids = req.query['ids[]'] || [];
    ids = typeof ids == "string" ? [ids] : ids;
    if(ids.length) {
        const oIds = ids.map(id => new ObjectId(id));
        options.match._id = { $in: oIds}
    }
    return options;
}

const validateFormData = async (req: NextApiRequest, res: NextApiResponse) => {
    if (typeof req.body === "object") {
        const user = new User(req, res);
        const formData = req.body;
        const validateDate: NftInputFields = {
            title: formData.title,
            description: formData.description,
            tokenId: formData.tokenId,
            itemId: formData.itemId,
            transactions: formData.transactions,
            approveTokenTransaction: formData.approveTokenTransaction,
            image: formData.image,
            metadata: formData.metadata,
            extrenalLink: formData.externalLink,
            collection: new ObjectId(formData.collection),
            properties: formData.properties || [],
            price: formData.price || "",
            fileType: formData.fileType,
            explicitSensitiveContent: formData.explicitSensitiveContent || false,
            category: new ObjectId(formData.category),
            ownedBy: "",
            onSaleToken: "",
            onMarketPlace: false,
            marketplace: {},
            status: 'publish',
        };
        return validateDate;
    } else {
        throw new Error("Invalid form data");

    }

}


const IsJsonString = (str: string | any) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}











