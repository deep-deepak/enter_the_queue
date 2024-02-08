import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import { getAllItems } from '../../services';
import Card from '../nft/Card';
import { NoDataFound } from '../miscellaneous';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";



function OurArts({ title = "", nfts = [] }) {
    const [topArts, setTopArts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if(nfts.length) {
                setIsLoading(true);
                const result = await getAllItems({
                    limit: 10,
                    sort: { "createdAt": -1 },
                    status: "publish,on_sale,on_auction",
                    ids: nfts
                });
                setTopArts(result);
                setIsLoading(false);
            }
        })();
    }, [nfts])

    return (


        <section className="top-artwork pt-20 pb-20">
            <div className="container mx-auto">
                <div className="banner__info">
                </div>
                <div className="flex flex-row space-x-4 pb-7 " >
                    <h2 className="text-5xl text-white font-bold text-center artistssection_subtitle mainheading">{ title ? title : "New Releases"}</h2>
                </div>
                {
                    isLoading ? (
                        <NoDataFound>Loading...</NoDataFound>
                    ) : topArts.length ? (
                        <Swiper
                            slidesPerView={4}
                            loop={topArts.length > 4 ? true : false}
                            pagination={true}
                            className="mySwiper cardboxes_row new-releases"
                            breakpoints={{
                                1024: {
                                    width: 1024,
                                    slidesPerView: 3,
                                },
                                991: {
                                    width: 991,
                                    slidesPerView: 3,
                                },
                                320: {
                                    width: 320,
                                    slidesPerView: 1,
                                },
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                        >
                            {
                                topArts.map((nft, key) => {
                                    return <SwiperSlide key={key}>
                                        <Card {...nft} />
                                    </SwiperSlide>
                                })
                            }
                        </Swiper>
                    ) : (
                        <NoDataFound>No Data Found</NoDataFound>
                    )
                }

                <div className="artsist_button text-center mb-3 mt-5">
                    {/* <Link href="/discover?type=new-releases">
                        <button className="banner_sec_btn   rounded-full">
                            View All
                        </button>
                    </Link> */}
                </div>




            </div>


        </section>



    )

}




export default OurArts