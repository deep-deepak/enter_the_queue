import React, { useState, useEffect } from 'react'

import { NoDataFound } from '../miscellaneous'
import Card from '../nft/Card';
import { getAllItems } from '../../services';

function VideoGallery({ title = "", nfts = [] }) {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [videNfts, setVideoNfts] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if(nfts.length) {
        setIsLoading(true);
        const results = await getAllItems({
          limit: 20,
          sort: { "createdAt": -1 },
          type: "video",
          ids: nfts
        });
        setVideoNfts(results);
        setIsLoading(false);
      }
    })();
  }, [nfts]);

  return (
    <section className="videobox">
      <div className={videNfts.length ? "container" : "container"}>
        <h2 className="text-5xl text-white font-bold text-center artistssection_subtitle mainheading" data-aos="fade-up" data-aos-duration="3000">{title ? title : "Video Arts"}</h2>
        {isLoading ? (
          <NoDataFound>Loading...</NoDataFound>
        ) : videNfts.length ? (
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-2  sm:grid-cols-1  gap-4">
              {
                videNfts.map((nft: any, key: number) => {
                  return (
                    <Card {...nft} key={key} />
                  )
                })
              }
            </div>
          </>
        ) : (
          <NoDataFound />
        )}
      </div>
    </section>
  )
}

export default VideoGallery