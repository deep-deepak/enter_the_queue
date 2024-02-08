import React, { useState } from 'react'


import { Metamask } from 'context'
import { Button } from '@mui/material';
import Image from 'next/image';
import { Assets } from '../assets'
import Link from 'next/link';

const Header = () => {

  const { isAuthenticated, login, logout } = Metamask.useContext();
  const [open, setOpen] = useState<boolean>(false);

  const handleConnect = async () => {
    await login();
  }

  const handleDisconnect = async () => {
    await logout();
  }

  return (
    <>
      <div className="header-gallary">
        <div className="items_btn">
          <Button onClick={() => setOpen(true)}>View Assets List</Button>
        </div>
        <div className="center__logo">
          <Link
            href="/"
            passHref
            legacyBehavior
          >
            <Image
              alt='Site Logo'
              src="/img/banner_logo.png"
              height={275}
              width={275}
            />
          </Link>
        </div>

        <div className="right__box">
          {
            isAuthenticated ? (
              <a className="connect_wallet" onClick={handleDisconnect}>DISCONNECT WALLET</a>
            ) : (
              <a className="connect_wallet" onClick={handleConnect}>CONNECT WALLET</a>
            )
          }
        </div>
      </div>

      <Assets useOpen={() => [open, setOpen]} />
    </>
  )
}

export default Header