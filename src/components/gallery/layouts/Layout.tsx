import Head from 'next/head';
import React, { FC, ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className='gallery-wrap'>
            <Head>
                <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>3D Gallery | Enter The Queue</title>

                <link rel="manifest" href="/manifest.json" />
                <link href="/icons/favicon-72x72.png" rel="icon" type="image/png" sizes="72x72" />
                <link href="/icons/favicon-96x96.png" rel="icon" type="image/png" sizes="96x96" />
                <link href="/icons/favicon-128x128.png" rel="icon" type="image/png" sizes="128x128" />
                <link href="/icons/favicon-144x144.png" rel="icon" type="image/png" sizes="144x144" />
                <link href="/icons/favicon-152x152.png" rel="icon" type="image/png" sizes="152x152" />
                <link href="/icons/favicon-192x192.png" rel="icon" type="image/png" sizes="192x192" />
                <link href="/icons/favicon-384x384.png" rel="icon" type="image/png" sizes="384x384" />
                <link href="/icons/favicon-512x512.png" rel="icon" type="image/png" sizes="512x512" />
                <meta name="theme-color" content="#1729a7" />
            </Head>
            <Header />
            <div className="gallery-content">
                {children}
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default Layout