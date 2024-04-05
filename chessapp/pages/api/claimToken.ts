import { NextApiRequest, NextApiResponse } from 'next';
import { Engine } from '@thirdweb-dev/engine';
import { SQUARES_CONTRACT_ADDRESS, CHESSPLAYER_CONTRACT_ADDRESS } from '../../constants/contracts';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Only allow POST requests
    if(req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    };

    const {
        THIRDWEB_ENGINE_URL,
        THIRDWEB_ENGINE_ACCESS_TOKEN,
        THIRDWEB_ENGINE_WALLET,
    } = process.env;

    try {
        // Check if environment variables are set
        // If not, throw an error
        if(!THIRDWEB_ENGINE_URL || !THIRDWEB_ENGINE_ACCESS_TOKEN || !THIRDWEB_ENGINE_WALLET) {
            throw new Error("THIRDWEB_ENGINE_URL, THIRDWEB_ENGINE_ACCESS_TOKEN, and THIRDWEB_ENGINE_WALLET must be set in the environment");
        }
        const { address } = req.body;

        // If address is undefined then throw an error
        if(!address) {
            throw new Error("Address must be provided in the request body");
        }

        // Create a new Engine instance
        const engine = new Engine({
            url: THIRDWEB_ENGINE_URL,
            accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN,
        });
        
        // Claim tokens
        // Backend wallet will mint 100 new tokens to the provided address to start
        const claimTokens = await engine.erc20.mintTo( // Minting tokens because it is not a drop contract
            "sepolia",
            SQUARES_CONTRACT_ADDRESS,
            THIRDWEB_ENGINE_WALLET,
            {
                toAddress: address,
                amount: "10", // Minimal amount to buy first puzzle
            }
        );

        // Claim worker
        // Backend wallet will mint a new worker to the provided address to start
        const claimWorker = await engine.erc721.claimTo(
            "sepolia",
            CHESSPLAYER_CONTRACT_ADDRESS,
            THIRDWEB_ENGINE_WALLET,
            {
                receiver: address,
                quantity: "1",
            }
        );

        // Wait for the transactions to be mined before letting user to start
        const waitForMinedStatus = async (queueId: string) => {
            let status = "";
            while (status !== "mined") {
                // Get the status of the transaction
                const response = await engine.transaction.status(queueId);
                status = response.result.status as string;

                // If the transaction is mined, break the loop
                if (status === "mined") {
                    break;
                }

                // Wait for 3 seconds before checking the status again
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        }

        // Wait for both transactions to be mined before starting for user
        await waitForMinedStatus(claimTokens.result.queueId);
        await waitForMinedStatus(claimWorker.result.queueId);

        // Return a successful response
        return res.status(200).json({ message: "Worker and tokens claimed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error claiming tokens" });
    }
};

export default handler;