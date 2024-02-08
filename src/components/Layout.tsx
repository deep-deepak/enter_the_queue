import React, { useEffect } from "react";
import Head from "next/head";
import { CircularProgress } from '@mui/material';

import { Header, Footer } from "../components/layouts";
import { useCommonContext } from "../context/Common";
import { NoDataFound, PageNotFound } from "./miscellaneous";

import AOS from "aos";

import "aos/dist/aos.css";

interface LayoutProps {
  children: React.ReactNode;
  is404?: Boolean;
  is404Message?: string;
  noHome?: Boolean;
  isLoading?: Boolean;
  title?: string;
  className?: string;
}

function Layout({ children, ...props }: LayoutProps) {
  const { userTheme }: any = useCommonContext();
  const {
    is404 = false,
    is404Message = "",
    isLoading = false,
    noHome = true,
    title = "",
    className = ""
  } = props;

  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });

    document.body.classList.remove("light", "dark");
    document.body.classList.add(userTheme);

  }, [userTheme]);

  return (
    <div className={`${noHome ? "site-landing-page another-pages-header" : "site-homepage-page"} ${className}`}>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" data-theme={`${userTheme}`} />
        <title>{title ? `${title} | ` : ""}Enter The Queue</title>
      </Head>

      <Header />

      <div className="bg-[#fff] dark:bg-[#05092b]">
        {
          isLoading ? (
            <>
              <NoDataFound isLoading={isLoading} />
            </>
          ) : (
            is404 ? (
              is404Message ? (
                <>
                  <NoDataFound>{is404Message}</NoDataFound>
                </>
              ) : (
                <>
                  <PageNotFound />
                </>
              )
            ) : children
          )
        }
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
