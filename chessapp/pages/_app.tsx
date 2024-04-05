import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
require('dotenv').config();


// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "sepolia";

// Make sure that account factory address is not undefined
if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_CONTRACT_ADDRESS) {
  throw new Error('ACCOUNT_FACTORY_CONTRACT_ADDRESS is not set.');
}
const accountFactoryAddress = process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_CONTRACT_ADDRESS;

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
        domain: process.env.DOMAIN || "",
        authUrl: "/api/auth"
      }}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
