import { type AppType } from "next/app";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Inter } from "next/font/google";
import NiceModal from "@ebay/nice-modal-react";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NiceModal.Provider>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </NiceModal.Provider>
  );
};

export default api.withTRPC(MyApp);
