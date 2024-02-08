import React, { useState } from "react";
import { useRouter } from "next/router";
import { saveNftLike, unLikeNft } from "../../services";
import { Metamask, MetamaskContextResponse } from "../../context";
import { Auction, SimpleNftCard } from "../card";
import moment from "moment";

function Card(props: any) {
  const router = useRouter();
  const {
    image = "/images/portfolio-04.jpg",
    asset = {},
    title,
    price = {
      eth: "0.00",
      dollar: "0.00"
    },
    id = "",
    likeCount = 0,
    viewCount = 0,
    ownedBy = false,
    createdBy = {},
    isLiked = false,
    marketplace = {},
    category = {},
    onMarketPlace = false,
    useUpdate
  } = props;

  const [favourite, setFavourite] = useState<Boolean>(isLiked);
  const [nftLikes, setNftLikes] = useState<number>(parseInt(likeCount));

  const { login, isAuthenticated, user }: MetamaskContextResponse = Metamask.useContext();


  const handleLike = async (e: any) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (!favourite) {
        const result = await saveNftLike(id);
        if (result.status === "success") {
          setFavourite(true);
          setNftLikes(nftLikes + 1);
        }
      } else {
        const result = await unLikeNft(id);
        if (result.status === "success") {
          setFavourite(false)
          setNftLikes(nftLikes - 1)
        }
      }
    } else {
      await login();
      return;
    }
  }

  const handleChangeUrl = (event: any) => {
    const isBuySection = event.target.closest('.nft-card-buy-section');
    if (isBuySection) {
      event.preventDefault();
    }
  }

  const isOnSale = () => {
    if (!onMarketPlace) return false;
    if (marketplace.action === "timed_auction") {
      return moment().isBefore(marketplace.data.endDate);
    }
    return true;
  }

  return (

    <>
      {
        marketplace.action === "timed_auction" && isOnSale() ? (
          <Auction {...props} isItemOnSale={isOnSale()} />
        ) : (
          <SimpleNftCard {...props} isItemOnSale={isOnSale()} />
        )
      }
    </>
  );
}

export default Card;

