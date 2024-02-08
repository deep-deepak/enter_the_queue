import Link from "next/link";
import { FC, useState } from "react";
import Countdown from "react-countdown";
import { Tooltip } from "@mui/material";
import { saveNftLike, unLikeNft } from "../../services";
import { subString } from "../../helpers";
import { SITE_TOKEN } from "../../utils";
import DVAsset from "../miscellaneous/DVAsset";
import { CryptoToken } from "../miscellaneous/web3";

interface AuctionProps {
    nft: any;
}

interface DVCountDownProps {
    date: string | number | Date;
    className?: string;
}

const Auction: FC<AuctionProps> = (props: any) => {
    const {
        asset = {},
        title,
        price = {
            eth: "0.00",
            dollar: "0.00"
        },
        tokenId,
        id = "",
        category = {},
        marketplace = {},
        createdBy,
        ownedBy,
        isItemOnSale = true
    } = props;

    // const [favourite, setFavourite] = useState<Boolean>(isLiked);
    // const [nftLikes, setNftLikes] = useState<number>(parseInt(likeCount));

    // const handleLike = async (e: any) => {
    //     e.preventDefault();
    //     if (!favourite) {
    //         const result = await saveNftLike(id);
    //         if (result.status === "success") {
    //             setFavourite(true);
    //             setNftLikes(nftLikes + 1);
    //         }
    //     } else {
    //         const result = await unLikeNft(id);
    //         if (result.status === "success") {
    //             setFavourite(false)
    //             setNftLikes(nftLikes - 1)
    //         }
    //     }
    // }

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
                <DVCountDown date={marketplace.data.endDate} />
                <div className="content">
                    {
                        isItemOnSale ? (
                            <div className="ribbon-1 left">On Sale</div>
                        ) : ""
                    }

                    <div className="pt-0">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white z-10 text-center">
                            <Tooltip title={title}><span>{subString(title, 20)}</span></Tooltip>
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
                                <p className="dark:text-white text-blue-500">@{
                                    price.eth > 0 ? createdBy.username : ownedBy.username
                                }</p>
                                <p className="dark:text-white text-blue-500">#{tokenId}</p>
                            </blockquote>
                        </div>


                        <div className="artistscol_bidrow">
                            <div className="artistscol_min">
                                <h6>Min Bid</h6>
                                <span><CryptoToken /> {marketplace.data.minBid.eth}</span>
                            </div>
                            <div className="artistscol_max">
                                <h6>Max Bid</h6>
                                <span><CryptoToken /> {marketplace.data.maxBid.eth}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

const DVCountDown: FC<DVCountDownProps> = (props) => {
    const { date, className = "col-span-2" } = props;

    return (
        <div>
            <Countdown
                date={date}
                renderer={renderer}
                className={className}
            />
        </div>
    )
}


// Renderer callback with condition
const renderer = ({ formatted, completed }: any) => {
    const { seconds, minutes, hours, days } = formatted;

    if (completed) {
        return "";
    }

    return (
        <div className="artistscol_timer">
            <div className="artistscol_timer_days">
                <h6>{days}</h6>
                <span>Days</span>
            </div>

            <div className="artistscol_timer_hours">
                <h6>{hours}</h6>
                <span>Hours</span>
            </div>

            <div className="artistscol_timer_min">
                <h6>{minutes}</h6>
                <span>Min</span>
            </div>

            <div className="artistscol_timer_sec">
                <h6>{seconds}</h6>
                <span>Sec</span>
            </div>

        </div>
    )
};

export default Auction;