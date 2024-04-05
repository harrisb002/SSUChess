# SSU Chess

## Description

- SSU Chess is a web3 chess app built to enable users to bet on games, either played personally or scheduled in tournaments.
- Utilizes Squares (SQZ) tokens to bet and can be earned through games or by staking chess puzzles (NFT's)
- Utilizes smart wallets/embedded wallets to offer email login and gasless transactions.

## Contracts

- [ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
  - Sqaures (SQZ) will act as the tokens for this game
  - Will allow users to play against one another and bet using their earned ERC20 tokens (SQZ)
  - Token Supply initialized as 15,625,000 SQZ (1 Million boards/64 squares = 15,625,000 squares) 
- [ERC721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)
  - Deploying OpenEditionERC721 allows the ability to set the individual metadata for the NFT's so that all the NFT's in this collection will be the same as it will be used to identify the "Worker NFT" to allow any amount of players to play the game.
  - Used to validate whether or not the account signing in is a new account or not
  - Set to only the owner can mint the NFT
- [ERC1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/Í)
  - Edition Drop tokens are semi-fungible and will be used to support the creation of chess puzzles and allow users to "claim" them.
  - Allows for one NFT (chess puzzle) to have multiple owners of the tokens within that NFT
- [StakeERC1155](https://blog.thirdweb.com/guides/build-an-erc20-staking-smart-contract-web-application/)
  - Allows users to earn tokens (SQZ) for staked NFTs (chess puzzles).
  - Each puzzle has unique earnings based upon difficulty (Base amount is 1 Ether ~ 1e+18 wei)

### Hopefull Features

- **Play Chess of course!**: Using web3, log in with your Ethereum wallet, select "Play Game" from the menu, and start a match.
- **Earn Tokens through puzzles**: Through staking contracts allow the ability to earn tokens used to play through chess puzzles.
- **Bet on Matches**: Choose a game or a tournament match you're interested in (including your own!) and select the "Bet" option, and follow the instructions to place your bet.
- **View Transactions**: All transactions will be available via etherscan (It's on a blockchain afterall!)

### Tools

- [thirdweb React Docs](https://docs.thirdweb.com/react) - learn about our React SDK.
- [thirdweb TypeScript Docs](https://docs.thirdweb.com/typescript) - learn about JavaScript/TypeScript SDK using thirdweb
- [thirdweb Portal](https://docs.thirdweb.com) - check out guides and development resources for thirdweb
- [Typescript Docs](https://www.typescriptlang.org/docs/)
- [Next.js Docs](https://nextjs.org/docs) - learn about Next.js features and API.
- [Solidity Docs](https://docs.soliditylang.org/en/v0.8.25/)

### Other repos to be utilized

- [Chessboard](https://github.com/harrisb002/BetChess)
