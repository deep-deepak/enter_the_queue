import App from 'next/app'
import Router from 'next/router';
import nprogress from 'nprogress/nprogress.js';
import { SECRET } from '../utils';
import Common from '../context/Common';
import { getTokenData, getUserById } from '../services';
import type { AppProps } from 'next/app'
import { getCookie } from 'cookies-next';
// import { createEmotionCache } from 'components/admin/@core/utils/create-emotion-cache';
// import themeConfig from 'components/admin/configs/themeConfig';
import { EmotionCache } from '@emotion/react';
import { NextPage } from 'next';
import UserLayout from '../components/admin/layouts/UserLayout';
import { SettingsConsumer } from '../components/admin/@core/context/settingsContext';
import ThemeComponent from '../components/admin/@core/theme/ThemeComponent';
import { useRouter } from "next/router"

import '../styles/dark.css';
import '../styles/custom.css';
import '../styles/globals.css';
import '../styles/lightmode.css';
import '../styles/nprogress.css';
import '../styles/loader.css';
import 'tailwindcss/tailwind.css';
import 'material-react-toastify/dist/ReactToastify.css';
import '../components/admin/@core/styles/libs/global.css'

Router.events.on('routeChangeStart', nprogress.start);
Router.events.on('routeChangeError', nprogress.done);
Router.events.on('routeChangeComplete', nprogress.done);


type ExtendedAppProps = AppProps & {
  Component: NextPage & {
    getLayout: Function;
  };
  emotionCache: EmotionCache;
}

// const clientSideEmotionCache = createEmotionCache()

// // ** Pace Loader
// if (themeConfig.routingLoader) {


// }


export default function MyApp({ Component, pageProps }: ExtendedAppProps) {
  const router = useRouter()
  const getLayout: any = Component.getLayout ?? ((page: any) => <UserLayout>{page}</UserLayout>)
  const pathParams = router.pathname.split('/')
  return (
    <>
      <Common.provider pageProps={pageProps}>
        {
          pathParams[1] === 'admin' ? (
            <SettingsConsumer>
              {({ settings }) => {
                return <ThemeComponent settings={settings}>
                  {getLayout(<Component {...pageProps} />)}
                </ThemeComponent>
              }}
            </SettingsConsumer>
          ) : (
            <Component {...pageProps} />
          )
        }
      </Common.provider>
    </>
  )
}

MyApp.getStaticProps = async (appContext: any) => {
  const appProps: any = await App.getInitialProps(appContext);
  const context = appContext.ctx;
  const token = context?.req ? context.req?.cookies?.[SECRET] || "" : getCookie(SECRET);
  const data: any = getTokenData(token);
  if (data) {
    const loginUser = await getUserById(data.user.id);
    appProps.pageProps = {
      token: data.token,
      user: loginUser
    };
    appProps.pageProps.isAdminLoggedIn = data && loginUser.role == "ADMIN" ? true : false;
  }
  appProps.pageProps.isAuthenticated = data ? true : false;

  return { ...appProps }
}

