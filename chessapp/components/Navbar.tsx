import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Navbar = () => {
  // Get the address of user
//   const address = useAddress();

  return (
    <div className={styles.navbarContainer}>
      {/* Conditionally render based on if wallet is connected */}
        <>
          <h1>Chess App</h1>
          <div className={styles.navbarOptions}>
            <Link href="/">
              <p>Dashboard</p>
            </Link>
            <Link href="/shop">
              <p>Puzzles Shop</p>
            </Link>
          </div>
          <div className={styles.navbarOptions}>
            <ConnectWallet />{" "}
            {/* UI component from 3rd web that gives functioning connect capabilities*/}
          </div>
        </>
    </div>
  );
};

export default Navbar;
