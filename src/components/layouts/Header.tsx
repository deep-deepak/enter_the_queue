import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineWallet } from 'react-icons/ai';

import { Common, Metamask } from "../../context";
import Menus from "../../data/menus.json";
import CustomNavLink from "./CustomNavLink";

import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// import {FaUserAlt} from "react-icons/fa";
import { trimString } from "../../helpers";
import { FaUserAlt } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import { RiLogoutCircleRFill } from "react-icons/ri";
import Avatar from "boring-avatars";
import BodyClass from '../BodyClass';
import { useRouter } from "next/router";
import { useWindowSize } from '../miscellaneous/hooks'
import { getTemplateById } from "services/templates";

interface MenuProps {
  name: string;
  slug: string;
  href: string;
  url: string[];
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));


function Header() {
  const [menus, setMenus] = useState<MenuProps[]>([]);
  const { userTheme, setUserTheme }: any = Common.useContext();
  const { login, logout, user, isAdminLoggedIn, isAuthenticated, setUserData }: any = Metamask.useContext();
  const [active, setActive] = useState(false);
  const [keyword, setKeyword] = React.useState("")
  const router = useRouter();
  const windowSize = useWindowSize();

  const avatarProps: any = {
    size: 33,
    name: user.name,
    variant: "beam"
  }
  if (user.colors?.length) {
    avatarProps.colors = user.colors;
  }

  useEffect(() => {
    (async () => {
      const result = await getTemplateById("header", {
        column: "slug"
      });
      let data = [];
      if (result) {
        data = result?.menus?.map(menu => ({
          name: menu.name,
          href: menu.url
        }))
      }
      setMenus(data);
    })();
  }, []);


  const menuItems = menus.sort((a: any, b: any) => {
    return a.position - b.position;
  });

  async function authWalletConnect() {
    await login();
  }

  const connectToWallet = (event: any) => {
    event.preventDefault();
    setActive(false);
    authWalletConnect();
  };

  const disconnectToWallet = (event: any) => {
    event.preventDefault();
    logout();
  };

  const handleMode = async () => {
    const theme = userTheme == "dark" ? "light" : "dark";
    if (isAuthenticated) {
      await setUserData({
        theme: theme
      })
    }
    setUserTheme(theme)
  }

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${keyword}`)
    }
  }

  const switchParams = {
    checked: userTheme == "light" ? false : true
  }

  return (
    <div>
      <BodyClass />
      <div className="z-10 bg-transparent  w-full absolute mainheader">
        <div className="container-flex mx-auto header px-6">
          <div className="lg:flex md:flex block flex-row ">

            <div className="basis-5/12 flex left_header items-center">
              <Link
                href="/"
                passHref
                className="cursor-pointer text-sm font-bold leading-relaxed inline-block mr-4 whitespace-nowrap uppercase text-white"
                legacyBehavior>
                <Image
                  src="/img/logo.png"
                  alt="my image"
                  height={100}
                  width={226}
                  className="cursor-pointer"
                />
              </Link>
              <div className="search site-search-bar top__search">
                <form className="header_main_search" onSubmit={handleSearchSubmit}>
                  <input type="text" name="search" onChange={(e) => setKeyword(e.target.value)} placeholder="collections, items and artists.."></input>
                </form>
              </div>

            </div>

            <div className="basis-7/12 right_header main_right_header flex items-center justify-end">


              <div className="menus ">
                <nav className="flex">
                  <div className="flex flex-wrap items-center justify-between navbar_header" style={{ marginRight: "25px"}}>
                    <div className="w-full flex justify-between  lg:w-auto md:w-auto    px-4 lg:static lg:block md:static md:block  lg:justify-start">
                      <button
                        className="  inline-flex p-3 menu__toggle  rounded lg:hidden text-white ml-auto hover:text-white outline-none "
                        onClick={() => setActive(!active)}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                    {
                      windowSize.width > 1250 || active ? (
                        <nav className="flex items-center flex-wrap">
                          <div
                            className={`${active ? "menu_active " : "test"
                              }w-full lg:inline-flex lg:flex-grow lg:w-auto`}
                          >
                            <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
                              <div className="mobile_header_menus">
                                <ul className="flex flex-col md:flex-row lg:flex-row list-none ml-auto">
                                  {menuItems.map((menu, index) => {
                                    if(isAdminLoggedIn && menu.href == "/admin/login") {
                                      menu.name = "Dashboard";
                                      menu.href = "/admin/dashboard"
                                    }
                                    return (
                                      <CustomNavLink key={index} {...menu}>{menu.name}</CustomNavLink>
                                    )
                                  })}
                                  <div className="mobile_rightheader ">
                                    <div className="basis-6/12 right_header flex items-center justify-end">
                                      <div className="search site-search-bar bottom__search">
                                        <form className="header_main_search" onSubmit={handleSearchSubmit}>
                                          <input type="text" name="search" onChange={(e) => setKeyword(e.target.value)} placeholder="Search.."></input>
                                        </form>
                                      </div>
                                      <ul
                                        className={`flex items-center justify-end  header_usrprofile`}
                                        style={{
                                          marginRight: isAuthenticated ? "20px" : "0px"
                                        }}
                                      >
                                        {isAuthenticated ? (
                                          <li className=" inline pl-1 pr-3 cursor-pointer font-bold text-base uppercase tracking-wide float-right headerprofile_list">
                                            <div className="rounded-full cursor-pointer font-bold text-base uppercase tracking-wide flex items-center">
                                              <div>
                                                {
                                                  user.image ? (
                                                    <Image
                                                      src={user.image}
                                                      alt="my image"
                                                      height={32}
                                                      width={35}
                                                      className="rounded-full"
                                                    />
                                                  ) : (
                                                    <Avatar {...avatarProps} />
                                                  )
                                                }
                                              </div>
                                              <div>
                                                <p className="text-[#fff] text-sm font-normal normal-case px-3"> {trimString(user.address, 4)}</p>
                                              </div>
                                            </div>
                                            <div className="dropdown-menu   h-auto  ">
                                              <ul className="block w-full bg-white shadow px-12 py-8">
                                                <li>
                                                  <Link passHref className="py-1" href="/profile">
                                                    <FaUserAlt />My Profile
                                                  </Link>
                                                </li>
                                                {
                                                  user.role === "ADMIN" || (user.isApproved && user.role === "ARTIST") ? (
                                                    <>
                                                      <li>
                                                        <Link passHref className="py-1" href="/collections">
                                                          <MdCollectionsBookmark />My Collections
                                                        </Link>
                                                      </li>
                                                      <li>
                                                        <Link passHref className="py-1" href="/nft/create">
                                                          <MdCollectionsBookmark />Create New Item
                                                        </Link>
                                                      </li>
                                                    </>
                                                  ) : ""
                                                }

                                                <li onClick={disconnectToWallet}>
                                                  <a href="#" className="py-1">
                                                    <RiLogoutCircleRFill /> Disconnect
                                                  </a>
                                                </li>
                                              </ul>
                                            </div>
                                          </li>
                                        ) : (
                                          <li className=" connectwallet_button inline px-4 cursor-pointer text-base tracking-wide float-right	">
                                            {/* <div className=" rounded-full dropdown inline text-purple-500 hover:text-purple-700 cursor-pointer font-bold text-base uppercase tracking-wide]"> */}
                                            <button
                                              className="  connectwallet_btn text-center mx-auto text-[#fff] py-1 px-2 border-[#fff] rounded-full bg-transparent	 text-sm"
                                              onClick={connectToWallet}
                                            >
                                              {" "}
                                              Connect Wallet
                                            </button>
                                            {/* </div> */}
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </ul>
                              </div>
                            </div>
                            <div className="day-night-mobile">
                              <FormControlLabel
                                control={<MaterialUISwitch sx={{}} {...switchParams} />}
                                label=""
                                className="m-0"
                                onChange={handleMode}
                              />
                            </div>
                          </div>
                        </nav>
                      ) : ""
                    }
                  </div>
                </nav>
              </div>

              <ul
                className={`flex items-center justify-end  header_usrprofile manage-width`}
                style={{
                  marginRight: isAuthenticated ? "20px" : "0px"
                }}
              >
                {isAuthenticated ? (
                  <li className=" inline pl-1 pr-3 cursor-pointer font-bold text-base uppercase tracking-wide float-right headerprofile_list">
                    {
                      windowSize.width > 1250 ? (
                        <div
                          className="rounded-full cursor-pointer font-bold text-base uppercase tracking-wide flex items-center"
                          style={{
                            width: "30px"
                          }}
                        >
                          <div>
                            {
                              user.image ? (
                                <Image
                                  src={user.image}
                                  alt="my image"
                                  height={32}
                                  width={35}
                                  className="rounded-full"
                                />
                              ) : (
                                <Avatar {...avatarProps} />
                              )
                            }
                          </div>
                        </div>
                      ) : ""
                    }
                    <div className="dropdown-menu   h-auto  ">
                      <ul className="block w-full bg-white shadow px-12 py-8">
                        <li>
                          <Link passHref className="py-1" href="/profile">
                            <AiOutlineWallet />   {trimString(user.address, 4)}
                          </Link>
                        </li>
                        <li>
                          <Link passHref className="py-1" href="/profile">
                            <FaUserAlt />My Profile
                          </Link>
                        </li>
                        {
                          user.role === "ADMIN" || (user.isApproved && user.role === "ARTIST") ? (
                            <>
                              <li>
                                <Link passHref className="py-1" href="/collections">
                                  <MdCollectionsBookmark />My Collections
                                </Link>
                              </li>
                              <li>
                                <Link passHref className="py-1" href="/nft/create">
                                  <MdCollectionsBookmark />Create New Item
                                </Link>
                              </li>
                            </>
                          ) : ""
                        }
                        <li onClick={disconnectToWallet}>
                          <a href="#" className="py-1">
                            <RiLogoutCircleRFill /> Disconnect
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  windowSize.width > 1250 ? (
                    <li className=" connectwallet_button inline px-4 cursor-pointer font-bold text-base uppercase tracking-wide float-right	">
                      {/* <div className=" rounded-full dropdown inline text-purple-500 hover:text-purple-700 font-bold text-base uppercase tracking-wide  cursor-pointer ]"> */}
                      <button
                        className="connectwallet_btn text-center mx-auto text-[#fff] font-bold py-1 px-2 border-[#fff] rounded-full bg-transparent	 text-sm"
                        onClick={connectToWallet}
                      >
                        {" "}
                        <Image
                          src="/wallet.gif"
                          alt="my image"
                          height={50}
                          width={150}
                          className="cursor-pointer wallet_log"

                        />
                        {/* <AiOutlineWallet /> */}
                      </button>
                      {/* </div> */}
                    </li>
                  ) : ""
                )}
              </ul>
              {
                windowSize.width > 1250 || active ? (
                  <div className="day-night-desktop">
                    <FormControlLabel
                      control={<MaterialUISwitch sx={{}} {...switchParams} />}
                      label=""
                      className="m-0"
                      onChange={handleMode}
                    />
                  </div>
                ) : ""
              }


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
