import Layout from "../components/Layout"
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Metamask } from "../context"

import DVAsset from "../components/miscellaneous/DVAsset";
import 'react-tabs/style/react-tabs.css';
// import { GiQueenCrown } from 'react-icons/fa';
import gsap from "gsap";

import { getAllItems } from '../services';
import { DvAvatar, NoDataFound } from '../components/miscellaneous';
import { getRandomValue, subString, trimString } from '../helpers';

// import { DvAvatar, NoDataFound } from '../miscellaneous';
import { getUsers } from '../services';
// import { trimString, subString } from 'helpers'
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoAlbum from "react-photo-album";
// import required modules
import { Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { arrayChunk, checkImageUrl } from '../helpers';
import Link from 'next/link';
import dynamic from 'next/dynamic'
const Tabs = dynamic(import('react-tabs').then(mod => mod.Tabs), { ssr: false }) // disable ssr

import { Tab, TabList, TabPanel } from 'react-tabs';
import { SITE_TOKEN } from "../utils";
import { NftOwnerOrCreator } from "../components/nft";
import { OurArts } from "../components/landing_page";


export default function BaseHome() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [artists, setArtists] = useState<any[]>([]);
    const [nfts, setNfts] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);
    const [videoArts, setVideoArts] = useState<any[]>([]);
    const { isAuthenticated }: any = Metamask.useContext();

    const AlertTitle = (props: any) => {
        const { title = "Please Sign In!" } = props;
        return <span className="text-dark">{title}</span>;
    };

    useEffect(() => {
        var tl = gsap.timeline({ repeat: -1 });
        tl.to("h1", 30, { backgroundPosition: "-960px 0" });

    }, [])

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getAllItems({
                limit: 12,
                sort: { "createdAt": -1 },
                type: 'image'
            });
            const galleryPhotos = results.map((photo: any) => {
                return {
                    src: photo.image,
                    height: getRandomValue(200, 100),
                    width: getRandomValue(800, 400),
                }
            })
            let artistsData = await getUsers({
                limit: 8
            });
            const videoResult = await getAllItems({
                limit: 8,
                sort: { "createdAt": -1 },
                type: 'video'
            });
            setVideoArts(videoResult);
            setArtists(artistsData);
            setNfts(results.slice(0, 8));
            setPhotos(galleryPhotos);
            setIsLoading(false);
        })();
    }, [])

    const handleChangeUrl = (event: any) => {
        const isBuySection = event.target.closest('.nft-card-buy-section');
        if (isBuySection) {
            event.preventDefault();
        }
    }



    return (
        <Layout className="second-home" title="Queue" noHome={false}>
            <section className="banner_sec">
                <video autoPlay loop muted width="100%">
                    <source src="img/video333.mov" type="video/mp4" />
                </video>

                <div className="banner_cont">
                    <div style={{
                        display: "table",
                        margin: "0 auto"
                    }}>
                        <Image
                            src="/img/banner_logo.png"
                            className="banner_logo"
                            width={250}
                            height={250}
                            alt="Site Logo"
                        />

                    </div>

                </div>



                {/* <Wave text="LOADING DATA1" effect="stretch" effectChange={2.0} /> */}
            </section>
            <section className="second-section">
                <div className="banner-bottom">
                    <h1 className="title">Where Real World Art Comes To Life In The Digital World</h1>
                </div>
            </section>

            <section className="top-artwork pt-20 pb-20">
                <div className="container mx-auto">
                    <div className="banner__info">
                    </div>
                    <div className="flex flex-row space-x-4 pb-7">
                        <h2 className="text-5xl text-white dark:text-white font-bold">New Releases</h2>
                    </div>

                    {
                        isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : nfts.length ? (

                            <div className="grid grid-cols-4 gap-4">
                                {
                                    nfts.map((nft, key): any => {
                                        return <Link
                                            href={`/discover/${nft.id}`}
                                            passHref
                                            key={key}
                                            legacyBehavior
                                        >
                                            <a
                                                className="mb-5"
                                                data-aos="flip-left"
                                                data-aos-anchor-placement="top-bottom"
                                                data-aos-delay="300"
                                                data-aos-duration="2000"
                                                onClick={handleChangeUrl}
                                            >
                                                <div className="releasebox">
                                                    <DVAsset
                                                        className={`border border-gray-100 shadow-sm`}
                                                        type={nft.asset.type}
                                                        url={nft.image || "/images/portfolio-04.jpg"}
                                                        alt="Nft image"
                                                        size={{
                                                            height: 275,
                                                            width: 275
                                                        }}
                                                    />
                                                    <div className="w-full etherium"><h5>{subString(nft.title)} #{nft.tokenId}</h5></div>
                                                    <div className="flex  releasebox-content">
                                                        <div className="w-1/2"><p>{nft.price.eth} {SITE_TOKEN}</p></div>
                                                        <div className="w-1/2 releasetopright flex">
                                                            <DvAvatar colors={nft.ownedBy?.colors} name={nft.ownedBy?.name} imageUrl={nft.ownedBy?.image} size={30} />
                                                            <p>{nft.createdBy?.name || ""}</p>
                                                        </div>
                                                    </div>
                                                    <Link href={`/discover/${nft.id}`} className="place-bid btn" passHref>
                                                        Place Bid
                                                    </Link>
                                                </div>
                                            </a>
                                        </Link>
                                    })
                                }
                            </div>
                        ) : (
                            <NoDataFound>No Data Found</NoDataFound>
                        )
                    }


                </div>


            </section>



            <section className="Artistbox">
                <div className='container'>
                    <h2>Artist</h2>
                    {
                        isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : (
                            <>
                                {
                                    artists.length ? (
                                        <div className="row">
                                            {
                                                artists.map((artist: any, key: number) => {
                                                    return (
                                                        <div className="col-md-4 rounded border-2 border-sky-500" key={key}>
                                                            <Link
                                                                href={`creators/${artist.id}`}
                                                                passHref
                                                                data-aos="fade-up"
                                                                data-aos-duration="3000"
                                                                legacyBehavior>
                                                                <Image
                                                                    src={artist.image || "/images/Image_not_available.png"}
                                                                    className="banner_logo"
                                                                    width={250}
                                                                    height={250}
                                                                    alt="Artist Profile"
                                                                />
                                                            </Link>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <NoDataFound>No Artist Found</NoDataFound>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </section>





            <section className="artists second-artist pt-20 pb-20">
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-4 pb-7">
                        <h2 className="text-5xl text-black font-bold">Gallary</h2>
                    </div>
                    {
                        photos.length ? (
                            <div className="row">
                                <PhotoAlbum layout="rows" photos={photos} />
                            </div>
                        ) : (
                            <NoDataFound>No Gallery Found</NoDataFound>
                        )
                    }
                </div>
            </section>

            <OurArts />

            <section className="videobox">
                <div className='container'>
                    <h2>Video Art</h2>
                    {
                        isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : videoArts.length ? (
                            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                                {
                                    videoArts.map((videoArt, key): any => {
                                        return <div key={key}>
                                            <video autoPlay loop muted width="100%">
                                                <source src={videoArt.image} type="video/mp4" />
                                            </video>
                                        </div>
                                    })
                                }
                            </div>
                        ) : (
                            <NoDataFound>No Videos Found</NoDataFound>
                        )
                    }
                </div>
            </section>

            <section className="video-second-box">
                <div className="container">
                    <div className="video_wrap-head">
                        <h2>Video Art1</h2>
                    </div>
                    {
                        isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : videoArts.length ? (
                            <div className="video-list-wrap">
                                {
                                    videoArts.slice(0, 4).map((videoArt, key): any => {
                                        return <div key={key} className="col-md-6">
                                            <div className="middle-box">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <div className="video-box">
                                                            <video autoPlay loop muted width="100%">
                                                                <source src={videoArt.image} type="video/mp4" />
                                                            </video>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="video-content">
                                                            <h5>{subString(videoArt.title)} #{videoArt.tokenId}</h5>
                                                            <p><b>Price:</b> {videoArt.price.eth} {SITE_TOKEN}</p>
                                                            <p>{videoArt.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        ) : (
                            <NoDataFound>No Video Arts Found</NoDataFound>
                        )
                    }
                </div>

            </section>


        </Layout >
    );
}

