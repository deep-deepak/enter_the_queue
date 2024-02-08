import { Typography } from '@mui/material';
import DVAsset from '../miscellaneous/DVAsset';
import { CryptoToken } from '../miscellaneous/web3';
import { subString } from '../../helpers';
import Link from 'next/link';
import React from 'react'
import { Tooltip } from '@mui/material';

function SimpleNftCard(props: any) {
    const {
        asset = {},
        title,
        price = {
            eth: "0.00",
            dollar: "0.00"
        },
        tokenId,
        id = "",
        marketplace = {},
        category = {},
        createdBy,
        ownedBy,
        isItemOnSale = false
    } = props;

    return (
        <Link
            href={`/discover/${id}`}
            passHref
            legacyBehavior
        >
            <div className="artistscol cursor-pointer aos-init aos-animate"
                data-aos="flip-left"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="300"
                data-aos-duration="2000"
            >
                <div className="artistscol_image">
                    <DVAsset
                        className={``}
                        type={asset.type}
                        url={asset.file || "/images/portfolio-04.jpg"}
                        alt="Nft image"
                        size={{
                            height: 100,
                            width: 100
                        }}
                    />
                </div>
                <div className="content">
                    {
                        isItemOnSale ? (
                            <div className="ribbon-1 left">On Sale</div>
                        ) : ""
                    }
                    {
                        price.eth > 0 ? (
                            <p className="dark:text-white text-blue-500 artsist_columnpricebox"><CryptoToken /> {price.eth}</p>
                        ) : ""
                    }
                    <div className="pt-0">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white z-10 text-center">
                            <Tooltip title={title}><span>{subString(title ,20)}</span></Tooltip>
                            <Tooltip title="Category"><span className="ml-2">({category.name})</span></Tooltip>
                        </h5>
                        <div className="artsist_col_ownerrow" style={{
                            borderBottom: isItemOnSale ? "1px solid #6b6e6f38 !important" : "none"
                        }}>
                            <blockquote className="md:flex  flex justify-between  items-center">
                                <p className="dark:text-white text-white">
                                    {
                                        price.eth > 0 ? (
                                            "Owned By :"
                                        ) : "Created By :"
                                    }
                                </p>
                                <p className="dark:text-white text-white">Token</p>

                            </blockquote>
                            <blockquote className="md:flex flex justify-between items-center">
                                <p className="dark:text-white text-blue-500">{price.eth > 0 ? (
                                    <Link href={`/creator/${ownedBy.id || ""}`} passHref legacyBehavior>
                                        <Typography component="a" sx={{ color: "#1729a7" }}>@{ownedBy.username}</Typography>
                                    </Link>
                                ) : (
                                    <Link href={`/creator/${createdBy.id || ""}`} passHref legacyBehavior>
                                        <Typography component="a" sx={{ color: "#1729a7" }}>@{createdBy.username}</Typography>
                                    </Link>
                                )}</p>
                                <p className="dark:text-white text-blue-500">#{tokenId}</p>
                            </blockquote>
                        </div>
                        {
                            isItemOnSale && marketplace.action === "open_for_bids" ? (
                                <blockquote className="md:flex pt-2 flex justify-center  pb-1 items-center">
                                    <button className="bg-[#1729a7] hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-full">Make Offer</button>
                                </blockquote>
                            ) : ""
                        }
                        {
                            isItemOnSale && marketplace.action === "fixed_price" ? (
                                <blockquote className="md:flex pt-2 flex justify-center  pb-1 items-center">
                                    <button className="bg-[#1729a7] hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded-full">Buy Now</button>
                                </blockquote>
                            ) : ""
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default SimpleNftCard;
