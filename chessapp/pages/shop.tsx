import styles from "../styles/Home.module.css";
import { useUser } from "@thirdweb-dev/react";
import { getUser } from "./api/auth/[...thirdweb]";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  // Check if the user is logged in and redirect to login if not
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  // Run when component mounts
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className={styles.main}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "row",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default Home;

// Server-side function to check if the user is logged in and redirects to the login page if not.
export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  // Redirect to login if not logged in
  if (!user) {
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
