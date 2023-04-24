import { type AppType } from "next/app";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Inter } from "next/font/google";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
