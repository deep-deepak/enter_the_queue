import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Select from 'react-select'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { BiSearch } from 'react-icons/bi';

import { arrayChunk } from 'helpers';
import { NoDataFound } from 'components/miscellaneous';
import { getAllItems, getUsers } from 'services';
import DVAsset from 'components/miscellaneous/DVAsset';

interface OptionProps {
    label: string;
    value: string;
}

interface SearchProps {
    artist: string;
    value: string;
}

function ArtistDigitalNfts({ title = "", nfts = [] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [digitalNfts, setDigitalNfts] = useState<any[]>([]);
    const [options, setOptions] = useState<OptionProps[]>([]);
    const [searchData, setSearchData] = useState<SearchProps>({
        artist: "",
        value: ""
    })

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if(nfts.length) {
                let result = await getAllItems({
                    limit: 10,
                    sort: { "createdAt": -1 },
                    ids: nfts
                });
                setDigitalNfts(result);
            }
            const users = await getUsers({
                artist: true
            });
            const artistOptions = users.map((artist: { name: string, id: string }) => ({
                label: artist.name,
                value: artist.id
            }));
            setOptions(artistOptions);
            setIsLoading(false);
        })();

    }, [nfts]);

    const handleSelect = (option: any, { name }: any) => {
        const { value = "" } = option || {};
        setSearchData({ ...searchData, [name]: value });
        setIsLoading(false);
    }

    const handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSearchData({ ...searchData, [name]: value });
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);
        let result = await getAllItems({
            limit: 10,
            sort: { "createdAt": -1 },
            search: searchData.value,
            createdBy: searchData.artist
        });
        setDigitalNfts(result);
        setIsLoading(false);
    }

    return (
        <section className="artistssection">
            <div className='container-fluid'>
                <h6 className="text-2xl text-white font-400 text-center artistssection_title" data-aos="fade-up" data-aos-duration="3000"> Artists </h6>
                <h2 className="text-5xl text-white font-bold text-center artistssection_subtitle mainheading" data-aos="fade-up" data-aos-duration="3000">{ title ? title : "Digital Nft's"}</h2>
                <div className="artistssection_form">
                    <div className="">
                        <form
                            action="/"
                            method="get"
                            data-aos="fade-up"
                            data-aos-duration="3000"
                            onSubmit={handleSubmit}
                        >
                            <div className="artistssection_form_select">
                                <Select options={options} name="artist" placeholder="Select Artists" onChange={handleSelect} />
                            </div>
                            <div className="artistssection_form_input">
                                <input
                                    onChange={handleChange}
                                    name="value"
                                    id="header-search"
                                    value={searchData.value}
                                    type="text"
                                    placeholder="Search Nft"
                                />
                            </div>

                            <div className="artistssection_form_submit">
                                <button type="submit"><BiSearch /></button>
                            </div>
                        </form>

                    </div>
                </div>

                <div>
                    <section className="artists ">

                        <div className="container mx-auto">
                            <div className="row">
                                {
                                    isLoading ? (
                                        <NoDataFound>Loading...</NoDataFound>
                                    ) : (
                                        <>
                                            {
                                                digitalNfts.length ? (
                                                    <Swiper
                                                        pagination={{
                                                            type: "fraction",
                                                        }}
                                                        navigation={true}
                                                        modules={[Pagination, Navigation]}
                                                        className="mySwiper"
                                                    >
                                                        {
                                                            arrayChunk(digitalNfts, 5).map((chunkNfts: any, key: number) => {
                                                                return (
                                                                    <SwiperSlide className="slide-one-box" key={key}>
                                                                        <div className="grid lg:grid-cols-3 md:grid-cols-2  sm:grid-cols-1 gap-4 content-center digitalnfts_col" >
                                                                            {
                                                                                chunkNfts.map((nft: any, index: number) => {
                                                                                    return (
                                                                                        <div className={`cursor-pointer ${index === 1 ? "row-span-2 align-middle " : "single-box"}`} key={index} >
                                                                                            <Link
                                                                                                href={`discover/${nft.id}`}
                                                                                                passHref
                                                                                                data-aos="fade-up"
                                                                                                data-aos-duration="3000"
                                                                                                legacyBehavior
                                                                                            >
                                                                                                <DVAsset
                                                                                                    className={`border border-gray-100 shadow-sm bg-white digitalnfts_col_image rounded`}
                                                                                                    type={nft.asset.type}
                                                                                                    url={nft.image || "/images/portfolio-04.jpg"}
                                                                                                    alt={nft.title}
                                                                                                    size={{
                                                                                                        height: 275,
                                                                                                        width: 275
                                                                                                    }}
                                                                                                />
                                                                                            </Link>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </SwiperSlide>
                                                                );
                                                            })
                                                        }
                                                    </Swiper>
                                                ) : (
                                                    <NoDataFound />
                                                )
                                            }
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
}

export default ArtistDigitalNfts