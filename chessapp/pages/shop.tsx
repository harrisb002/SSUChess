import styles from "../styles/Home.module.css";
import { useContract, useNFTs, useUser } from "@thirdweb-dev/react";
import { getUser } from "./api/auth/[...thirdweb]";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Shop() {
    // Use the state of whether user is logged in
    const { isLoggedIn, isLoading } = useUser();
    const router = useRouter();

    // Checks if the user is logged in and redirects to the login page if not.
    useEffect(() => {
      if (!isLoggedIn && !isLoading) {
        router.push("/login");
      }
    }, [isLoggedIn, isLoading, router]);

    return (
        <div className={styles.main}>
            <h2>Buy a Puzzle:</h2>
            <div className={styles.grid}>
            </div>
        </div>
    )
};

// This is a server-side function that checks if the user is logged in and redirects to the login page if not.
export async function getServerSideProps(context: any) {
    const user = await getUser(context.req);
  
    console.log("Checking user" + user?.address);
    if(!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }