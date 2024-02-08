import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdOutlineSecurity, MdSupportAgent } from "react-icons/md";
import { SlBadge } from 'react-icons/sl';
import { ImEarth } from 'react-icons/im'
import { getTemplateById } from "services/templates";


function About() {
  const [content, setContent] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTemplateById("about-us", {
        column: "slug"
      });
      setContent(result?.content || "");
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <div>
        {
          isLoading ? (
            <div>
              Loading...
            </div>
          ) : (
            <>
            {
              content ? (
                <div className="aboutpage_about_section">
                  <div className="container mx-auto px-10" dangerouslySetInnerHTML={{__html: content}}></div>
                </div>
              ) : (
                  <>
                    <section className="aboutpage_about_section">
                      <div className="container mx-auto px-10 ">
                        <div className="lg:flex md:flex block flex-row  aboutpage_box_leftcol ">
                          <div className="basis-6/12 lg:pr-5 md:pr-5 pr-0 aboutpage_about_section_imgcol">
                            <Image
                              src="/img/img3.png"
                              className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                              alt="my image"
                              height={250}
                              width={300}
                            />
                          </div>
                          <div
                            className="basis-6/12   px-0 flex flex-col justify-center  aboutpage_box_rightcol"
                            data-aos="flip-left"
                            data-aos-anchor-placement="top-bottom"
                            data-aos-delay="300"
                            data-aos-duration="2000"
                          >
                            <h6 className="text-[#1729a7] font-medium text-lg  text-left py-3">
                              About Us
                            </h6>

                            <h2 className="text-5xl text-[#000]  dark:text-white font-bold ">
                              About Our Company
                            </h2>
                            <p className="dark:text-[#acacac] text-[#666666] text-base lg:mt-10 md:mt-5 mt-0  ">
                              Lorem Ipsum is simply dummy text of the printing and typesetting
                              industry. Lorem Ipsum has been the industry standard dummy text
                              ever since the 1500s
                            </p>

                            <p className="dark:text-[#acacac] text-[#666666] text-base  ">
                              Lorem Ipsum is simply dummy text of the printing and typesetting
                              industry. Lorem Ipsum has been the industry standard dummy text
                              ever since the 1500s, when an unknown printer took a galley of
                              type and scrambled it to make a type specimen book.
                            </p>
                          </div>
                        </div>

                      </div>
                    </section>


                    <section className="about_secondsection">
                      <div className="container mx-auto px-10">
                        <div className="about_secondsection_row">

                          <div className="about_secondsection_col">
                            <div className="about_secondsection_column">
                              <div className="icon">
                                <MdOutlineSecurity />
                              </div>
                              <h5 className="text-[#000] dark-[#fff] font-medium text-lg  text-left py-3">
                                High Security Assets Transfer

                              </h5>

                            </div>
                          </div>

                          <div className="about_secondsection_col">
                            <div className="about_secondsection_column">
                              <div className="icon">
                                <MdSupportAgent />
                              </div>
                              <h5 className="text-[#000] dark-[#fff] font-medium text-lg  text-left py-3">
                                24/7 live Support with Email

                              </h5>

                            </div>
                          </div>

                          <div className="about_secondsection_col">
                            <div className="about_secondsection_column">
                              <div className="icon">
                                <SlBadge />
                              </div>
                              <h5 className="text-[#000] dark-[#fff] font-medium text-lg  text-left py-3">
                                Top Class And NFT Products

                              </h5>

                            </div>
                          </div>

                          <div className="about_secondsection_col">
                            <div className="about_secondsection_column">
                              <div className="icon">
                                <ImEarth />
                              </div>
                              <h5 className="text-[#000] dark-[#fff] font-medium text-lg  text-left py-3">
                                Regular Training & Seller Courses

                              </h5>

                            </div>
                          </div>

                        </div>
                      </div>
                    </section>


                    <section className="about_teamection">

                      <div className="">
                        <h2 className="text-5xl text-white font-bold text-center artistssection_subtitle mainheading text-center">Our Team</h2>
                      </div>



                      <div className="container mx-auto px-10">
                        <div className="about_teamection_row">

                          <div className="about_teamection_col">

                            <div className="team-card">

                              <Image
                                src="/img/team-4.jpg"
                                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                                alt="my image"
                                height={250}
                                width={300}
                              />
                              <div className="team-info">
                                <h3>Olivia Jenor</h3>
                                <span>Head Of Operations</span>

                              </div>
                            </div>
                          </div>

                          <div className="about_teamection_col">

                            <div className="team-card">

                              <Image
                                src="/img/team-4.jpg"
                                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                                alt="my image"
                                height={250}
                                width={300}
                              />
                              <div className="team-info">
                                <h3>Olivia Jenor</h3>
                                <span>Head Of Operations</span>

                              </div>
                            </div>
                          </div>

                          <div className="about_teamection_col">

                            <div className="team-card">

                              <Image
                                src="/img/team-4.jpg"
                                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                                alt="my image"
                                height={250}
                                width={300}
                              />
                              <div className="team-info">
                                <h3>Olivia Jenor</h3>
                                <span>Head Of Operations</span>

                              </div>
                            </div>
                          </div>

                          <div className="about_teamection_col">

                            <div className="team-card">

                              <Image
                                src="/img/team-4.jpg"
                                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                                alt="my image"
                                height={250}
                                width={300}
                              />
                              <div className="team-info">
                                <h3>Olivia Jenor</h3>
                                <span>Head Of Operations</span>

                              </div>
                            </div>
                          </div>


                        </div>
                      </div>

                    </section>
                  </>
              )
            }
            </>
          )
        }

      </div>
    </>
  );
}

export default About;
