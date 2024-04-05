import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { ACCOUNT_FACTORY_CONTRACT_ADDRESS } from "../constants/contracts";
require("dotenv").config();

const activeChain = "sepolia";

// // Make sure that account factory address is not undefined
// if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_CONTRACT_ADDRESS) {
//   throw new Error("ACCOUNT_FACTORY_CONTRACT_ADDRESS is not set.");
// }
const accountFactoryAddress = ACCOUNT_FACTORY_CONTRACT_ADDRESS

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), {
          factoryAddress: accountFactoryAddress,
          gasless: true,
        }),
      ]}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_DOMAIN || "",
        authUrl: "/api/auth",
      }}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
