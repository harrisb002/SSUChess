import { ThirdwebAuth } from '@thirdweb-dev/auth/next';
import { PrivateKeyWallet } from '@thirdweb-dev/auth/evm';

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
    wallet: new PrivateKeyWallet(process.env.NEXT_PUBLIC_PRIVATE_KEY || ""),
    domain: process.env.NEXT_PUBLIC_DOMAIN || ""
});

export default ThirdwebAuthHandler();