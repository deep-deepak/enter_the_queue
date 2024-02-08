import React from 'react'
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title = ""
}) => {
    const theme = useTheme()

    return (
        <div className='admin-panel-content'>
            <Head>
                <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" data-theme={`${theme}`} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>{title ? `${title} | ` : ""}Enter The Queue</title>
            </Head>
            {children}
        </div>
    )
}

export default Layout
