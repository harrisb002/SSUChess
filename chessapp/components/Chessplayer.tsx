import styles from "../styles/Home.module.css";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useOwnedNFTs,
  useTokenBalance,
} from "@thirdweb-dev/react";
import {
  SQUARES_CONTRACT_ADDRESS,
  CHESSPLAYER_CONTRACT_ADDRESS,
} from "../constants/contracts";

const Chessplayer = () => {
  const address = useAddress();

  // Get the chessplayer contract instance and the user's owned chessplayer NFTs
  const { contract: chessplayerContract } = useContract(
    CHESSPLAYER_CONTRACT_ADDRESS
  );
  const { data: ownedChessplayers, isLoading: loadingChessplayer } =
    useOwnedNFTs(chessplayerContract, address);

  // Get the token contract instance and the user's token balance with address
  const { contract: tokenContract } = useContract(SQUARES_CONTRACT_ADDRESS);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  // Truncate the number to 6 decimal places
  const truncateNumber = (num: string) => {
    return num.slice(0, 6);
  };

  return (
    <div style={{ width: "50%" }}>
      {!loadingChessplayer ? (
        ownedChessplayers &&
        ownedChessplayers.length > 0 &&
        ownedChessplayers.map((chessplayer) => (
          <div
            className={styles.chessplayerContainer}
            key={chessplayer.metadata.id}
          >
            <div>
              <h2>Chessplayer Stats:</h2>
              <MediaRenderer
                key={chessplayer.metadata.id}
                src={chessplayer.metadata.image}
                style={{ borderRadius: "10px", margin: "10px 0px" }}
              />
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>
                {chessplayer.metadata.name} - ID: #{chessplayer.metadata.id}
              </p>
              {tokenBalance && (
                <p>
                  Balance:{" "}
                  {truncateNumber(tokenBalance?.displayValue as string)}{" "}
                  {tokenBalance?.symbol}
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Loading chessplayer...</p>
      )}
    </div>
  );
};

export default Chessplayer;
