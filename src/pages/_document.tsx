import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head>
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
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;