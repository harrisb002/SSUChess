import {
  ConnectEmbed,
  SmartWallet,
  useAddress,
  useSDK,
  useShowConnectEmbed,
  useUser,
  useWallet,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { getUser } from "./api/auth/[...thirdweb]";

// Set loginOptional to false so user has to login
const loginOptional = false;

const Login = () => {
  // ConnectEmbed component used to see if the user is not logged in
  const showConnectEmbed = useShowConnectEmbed();

  // Check if the user is logged in and redirect to the home page if so
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  // Run the checkNewPlayer function when the user is logged in and not loading
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
        router.push("/"); // Push to home page
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className={styles.container}>
      <h1>SSU Chess Login</h1>
      {showConnectEmbed && (
        <ConnectEmbed
          auth={{
            loginOptional,
          }}
        />
      )}
    </div>
  );
};

export default Login;

// Server-side function that checks if the user is logged in and redirects to the home page if not each time page loads
export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  console.log("Checking user" + user?.address);
  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
