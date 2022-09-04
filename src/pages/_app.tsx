import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@fontsource/catamaran";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultSEOConfig from "../../next-seo.config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
