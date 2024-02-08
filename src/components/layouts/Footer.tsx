import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getTemplateById } from "services/templates";

const Footer = () => {

  const [footerData, setFooterData] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await getTemplateById("footer", {
        column: "slug"
      });
      setFooterData(result);
      setIsLoading(false);
    })();
  }, []);

  const sections = footerData?.sections?.map(section => section.trim()).filter(section => section) || [];
  return (
    <footer>
      <div className="footer--box container">
        <Grid container sx={{
          p: 3
        }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} className="footer_box">
          {
            sections?.length ? (
              sections.map((content: string, key: number) => {
                return (
                  <Grid key={key} item xs={2} sm={12 / sections.length} md={12 / sections.length} className="pr-4 footer_colone footercolumn">
                    <div className="container mx-auto px-10" dangerouslySetInnerHTML={{ __html: content }}></div>
                  </Grid>
                )
              })
            ) : (
              <>
                <Grid item xs={2} sm={4} md={4} className="pr-4 footer_colone footercolumn">
                  <Image
                    src="/img/logo.png"
                    alt="Logo"
                    className="ftr_logo"
                    width={100}
                    height={100}
                  />
                  <p className="py-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusantium, iusto?
                  </p>

                  <ul className="copyright_footer_lists ">
                    <li>
                      <a className="p-3" target="_blank" href={""} rel="noopener noreferrer">
                        <FiFacebook />
                      </a>
                    </li>
                    <li>
                      <a className="p-3" target="_blank" href={""} rel="noopener noreferrer">
                        <FiTwitter />
                      </a>
                    </li>
                    <li>
                      <a className="p-3" target="_blank" href={""} rel="noopener noreferrer">
                        <FiInstagram />
                      </a>
                    </li>
                    <li>
                      <a className="p-3" target="_blank" href={""} rel="noopener noreferrer">
                        <FiYoutube />
                      </a>
                    </li>
                    <li>
                      <a className="p-3" target="_blank" href={""} rel="noopener noreferrer">
                        <FaDiscord />
                      </a>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={2} sm={4} md={3} className="footer_coltwo footercolumn">
                  <h3 className="text-2xl text-white font-bold  text-white">Latest Nfts</h3>
                  <ul className="ftr_menu">
                    <li>
                      <Link href="/" passHref className="nav-link">
                        Queue
                      </Link>
                    </li>
                    <li>
                      <Link href="/Gallery" passHref className="nav-link">
                        Gallery
                      </Link>
                    </li>
                    <li>
                      <Link href="/Artists" passHref className="nav-link">
                        Artists
                      </Link>
                    </li>
                    <li>
                      <Link href="/discover" passHref className="nav-link">
                        Marketplace
                      </Link>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={2} sm={4} md={2} className="footer_colthree footercolumn">
                  <h3 className="text-2xl text-white font-bold  text-white">Important links</h3>
                  <ul className="ftr_menu">
                    <li>
                      <Link href="/" passHref className="nav-link">
                        Queue
                      </Link>
                    </li>
                    <li>
                      <Link href="/Gallery" passHref className="nav-link">
                        Gallery
                      </Link>
                    </li>
                    <li>
                      <Link href="/Artists" passHref className="nav-link">
                        Artists
                      </Link>
                    </li>
                    <li>
                      <Link href="/discover" passHref className="nav-link">
                        Marketplace
                      </Link>
                    </li>
                  </ul>
                </Grid>

                <Grid item xs={2} sm={4} md={3} className="footer_contact_col footer_colfour footercolumn" >
                  <h3 className="text-2xl text-white font-bold  text-white">Contact Us</h3>
                  <ul className="ftr_menu">
                    <li>
                      <div className="footer_contact">
                        <h6>Address</h6>
                        <p className="text-base		">Some city, Some country</p>
                      </div>
                    </li>
                    <li>
                      <div className="footer_contact">
                        <h6>Phone</h6>
                        <a href="tel:9999999999" target="_blank" rel="noreferrer">+99 9999 9999</a>
                      </div>
                    </li>
                    <li>
                      <div className="footer_contact">
                        <h6>Mail Us</h6>
                        <a href="mailto:info@gmail.com" target="_blank" rel="noreferrer" >info@gmail.com</a>
                      </div>
                    </li>
                    <li>

                    </li>
                  </ul>
                </Grid>
              </>
            )
          }

        </Grid>

        <Grid container className="copyright_footer">
          <Grid item xs={12} sm={12} md={12}>
            {
              footerData?.content ? (
                <div className="container mx-auto px-10" dangerouslySetInnerHTML={{ __html: footerData.content }}></div>
              ) : "© 2022 NFT. All rights reserved"
            }
          </Grid>
        </Grid>


      </div>
    </footer>
  );
};

export default Footer;
