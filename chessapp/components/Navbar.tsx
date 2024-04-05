import {
  ConnectWallet,
  useAddress,
  useContract,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { SQUARES_CONTRACT_ADDRESS } from "../constants/contracts";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Navbar = () => {
  // Get the user's address
  const address = useAddress();

  // Get instance of the squares contract as well as the user's SQZ balance
  const { contract: squaresContract } = useContract(SQUARES_CONTRACT_ADDRESS);
  const { data: squaresBalance } = useTokenBalance(squaresContract, address);

  // Update the number to 6 decimal places
  const truncateNumber = (num: string) => {
    return num.slice(0, 6);
  };

  return (
    <div className={styles.navbarContainer}>
      {/* Conditionally render based on if wallet is connected */}
      <>
        <h1>SSU Chess</h1>
        <div className={styles.navbarOptions}>
          <Link href="/">
            <p>Dashboard</p>
          </Link>
          <Link href="/shop">
            <p>Puzzles Shop</p>
          </Link>
        </div>
        <div className={styles.navbarOptions}>
                        {squaresBalance && (
                            <p>{truncateNumber(squaresBalance?.displayValue as string)} {squaresBalance?.symbol}</p>
                        )}
          <ConnectWallet />{" "}
          {/* UI component from 3rd web that gives functioning connect capabilities*/}
        </div>
      </>
    </div>
  );
};

export default Navbar;
