import { useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import { OurArts, ArtistDigitalNfts, TopArts, VideoGallery } from "./landing_page";

// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import 'react-tabs/style/react-tabs.css';
import { getTemplateById } from "services/templates";
import { SiteLoader } from "./miscellaneous/Loader";

function Home() {

  useEffect(() => {
    var tl = gsap.timeline({ repeat: -1 });
    tl.to("h1", 30, { backgroundPosition: "-960px 0" });
  })

  const [landingPageData, setLandingPageData] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTemplateById("landing-page", {
        column: "slug"
      });
      setLandingPageData(result);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
    {
      isLoading ? <SiteLoader /> : (
        <>
        <section className="banner_sec">
  
          <video autoPlay loop muted width="100%" data-aos="zoom-in">
            <source src={landingPageData?.banner?.video || "img/banner.mp4"} type="video/mp4" />
          </video>
          <div className="banner_cont container">
            <div className="grid grid-cols-1 items-center">
  
              <div className="banner_sec_leftcontent">
  
                <div style={{
                  display: "table",
                  margin: "0 auto"
                }}>
  
                  <div data-aos="zoom-in"></div>
                  <div className="banner_image_col_image">
                    <Image
                      src={landingPageData?.banner?.logo ? landingPageData.banner.logo : '/img/banner_logo.png'}
                      alt="Enter The Queue Banner Logo"
                      className={`border border-gray-100 shadow-sm`}
                      height={275}
                      width={275}
                    />
                  </div>
                  {/* <div className="banner_heading">
                    <h3 className="animate-charcter" data-aos="zoom-in"> Where Real World Art Comes To Life In The Digital World
                    </h3>
                    <button className="banner_sec_btn   rounded-full">
                      Contact Us
                    </button>
                  </div> */}
                </div>
              </div>
              <div className="banner_image_col"></div>
            </div>
  
          </div>
        </section>
  
        <section className="bannersectionheading">
          <h3 className="" data-aos="zoom-in">{landingPageData?.banner?.title ? landingPageData.banner.title : "Where Real World Art Comes To Life In The Digital World"}</h3>
        </section>
  
        {/* 
        <section className="homepage_icon" data-aos="fade-up"
          data-aos-duration="3000" >
          <div className="center">
            <div className="pulse">
              <AiOutlineDown />
            </div>
          </div>
        </section> */}
  
  
        {/* Start New Releases */}
        <TopArts {...(landingPageData?.sections?.[0] || { title: "", nfts: []})} />
        {/* End New Releases */}
  
        {/**************artists section************/}
        <ArtistDigitalNfts  {...(landingPageData?.sections?.[1] || { title: "", nfts: []})} />
        {/**********end artists section*************/}
  
  
        {/*********************** */}
        <OurArts  {...(landingPageData?.sections?.[2] || { title: "", categories: []})} />
  
  
        <VideoGallery  {...(landingPageData?.sections?.[3] || { title: "", nfts: []})} />
  
  
        <section className="join_section">
          <div className="container">
            <h2 className="text-5xl text-white font-bold text-center  ">{landingPageData?.join_us?.title || "JOIN OUR COMMUNITY"}</h2>
            <p className="text-white">{landingPageData?.join_us?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}</p>
  
            <div className=" text-center ">
              <button className="join_section_btn rounded-full">{landingPageData?.join_us?.button_text || "CONTACT US"}</button>
            </div>
          </div>
        </section>
        </>
      )
    }

    </>
  );
}



export default Home;
