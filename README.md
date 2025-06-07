# ETH-Belgrade-Hackathon

![DeFi Cross-Chain Gaming Platform](https://example.com/logo.png)

A cross-chain DeFi gaming platform with mobile verification capabilities, built during the ETH Belgrade Hackathon. This project combines DeFi yield farming, blockchain gaming, and cross-chain functionality with a focus on security and user experience.

## About

This project introduces a novel approach to DeFi and gaming by creating a seamless experience across multiple blockchains. It allows users to engage with DeFi protocols (primarily Aave), play blockchain-based games with provably fair outcomes, and verify transactions across chains. The project uses a mobile verification system to enhance security and user experience.

## Problem

Current DeFi and blockchain gaming platforms face several challenges:

1. **Limited Cross-Chain Functionality**: Most DeFi applications are restricted to a single blockchain, limiting liquidity and functionality.
2. **Poor User Experience**: Complex interfaces and technical knowledge requirements create significant barriers to entry.
3. **Security Concerns**: Centralized verification systems and lack of transparency in random outcomes create trust issues.
4. **Limited Gaming Integration**: Few platforms effectively combine DeFi yield opportunities with engaging gaming experiences.
5. **Mobile Access Limitations**: Most blockchain applications lack proper mobile support and verification capabilities.

## Solution

Our platform addresses these challenges through:

1. **Cross-Chain Architecture**: Seamless interaction between multiple blockchains (ETH, Flare, Polkadot) using state connectors.
2. **DeFi Integration**: Direct integration with Aave for yield farming and liquidity provision.
3. **Provably Fair Gaming**: Implementation of Chainlink VRF for verifiable random outcomes in games.
4. **Mobile Verification**: A dedicated mobile verification system to enhance security and usability.
5. **NFT Rewards System**: Rank-based NFTs that track player achievements and provide additional benefits.

## Architecture

The project is structured into three main components:

### 1. Smart Contracts (mobile-verifier-dapp)
- **Core Contracts**: Entry points, managers, and transaction handlers
- **DeFi Integration**: Aave connectors and yield farming mechanisms
- **Gaming Contracts**: Card games with Chainlink VRF integration
- **NFT System**: Rank-based NFTs for gaming achievements
- **Cross-Chain Connectors**: State connector implementations for Flare and Polkadot

### 2. Frontend Application
- Next.js-based user interface
- Responsive design with Radix UI components
- Web3 integration for blockchain interactions
- Comprehensive DeFi dashboard and gaming interfaces

### 3. Mobile Verification System
- Transaction verification logic
- User profile management
- Vendor registry for merchant integrations
- Secure random number generation

## Features

### DeFi Capabilities
- **Aave Integration**: Deposit and withdraw from Aave markets
- **Yield Farming**: Earn yields on deposited assets
- **Token Management**: Custom token implementation with minting and burning capabilities
- **Swap Functionality**: Token swapping between supported assets

### Gaming Platform
- **Blackjack Implementation**: Fully functional blackjack game with provably fair outcomes
- **Chainlink VRF Integration**: Verifiable random card draws
- **Timeout Management**: Chainlink Automation for handling timed-out games
- **Betting System**: Flexible betting with configurable limits

### NFT and Rewards
- **Rank NFTs**: NFTs that represent player achievements and rankings
- **Dynamic Minting**: NFT issuance based on game performance
- **Cross-Chain Recognition**: NFT recognition across supported chains

### Security Features
- **Mobile Verification**: Secure transaction verification through mobile application
- **Permission System**: Granular permission controls for different operations
- **Error Handling**: Comprehensive error libraries and handling mechanisms
- **Chainlink Integration**: Secure external data and randomness

## Technologies Used

### Blockchain Technologies
- **Ethereum**: Primary blockchain for smart contracts
- **Flare Network**: Cross-chain state connector integration
- **Polkadot**: Cross-chain functionality and interoperability

### DeFi Protocols
- **Aave V3**: Liquidity and yield farming capabilities
- **Uniswap**: Token swapping functionality

### Development Tools and Libraries
- **Foundry/Forge**: Smart contract development and testing
- **Next.js**: Frontend framework
- **Radix UI**: Component library for the frontend
- **Ethers.js**: Ethereum JavaScript API
- **Chainlink VRF & Automation**: Verifiable randomness and automation
- **OpenZeppelin**: Security-focused smart contract libraries

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm
- Foundry/Forge for smart contract development
- MetaMask or another Ethereum wallet
- Testnet ETH (for testing on Sepolia or other testnets)
- Chainlink VRF subscription (for randomness features)

### Smart Contracts Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ETH-Belgrade-Hackathon.git
cd ETH-Belgrade-Hackathon
```

2. Install dependencies:
```bash
cd mobile-verifier-dapp
forge install
```

3. Configure environment variables:
- Create a `.env.local` file in the root directory
- Add necessary environment variables:
```
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
CHAINLINK_VRF_COORDINATOR=coordinator_address
CHAINLINK_SUBSCRIPTION_ID=subscription_id
AAVE_LENDING_POOL=aave_pool_address
```

4. Compile smart contracts:
```bash
forge build
```

5. Run tests:
```bash
forge test
```

6. Deploy contracts:
```bash
forge script script/deployFlare.s.sol:DeployScript --rpc-url $RPC_URL --broadcast --verify
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment:
- Create a `.env.local` file in the frontend directory
- Add necessary environment variables:
```
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=chain_id
```

4. Run development server:
```bash
npm run dev
# or
yarn dev
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

## Usage

### DeFi Features

1. **Deposit to Aave**:
   - Connect your wallet
   - Navigate to the "DeFi" section
   - Select the asset and amount to deposit
   - Confirm the transaction
   - Receive equivalent tokens representing your deposit

2. **Withdraw from Aave**:
   - Navigate to the "DeFi" section
   - Select the amount to withdraw
   - Confirm the transaction
   - Receive your assets plus earned yield

### Gaming Features

1. **Playing Blackjack**:
   - Navigate to the "Games" section
   - Select your bet amount
   - Start the game
   - Choose to "Hit" or "Stand" based on your cards
   - If you win, receive double your bet amount
   - Earn rank NFTs based on your performance

2. **NFT Rewards**:
   - View your earned NFTs in the "Profile" section
   - NFTs represent your gaming achievements
   - Higher ranks provide additional benefits in the ecosystem

### Mobile Verification

1. **Transaction Verification**:
   - Download the mobile app
   - Connect to your account
   - Verify transactions through secure push notifications
   - Manage permissions for different operations

## Roadmap

- **Q3 2025**: Launch on additional chains (Arbitrum, Optimism)
- **Q4 2025**: Implement additional games (Poker, Slots)
- **Q1 2026**: Launch governance token and DAO
- **Q2 2026**: Develop mobile-first experience with native apps
- **Q3 2026**: Integration with additional DeFi protocols


## Sponsors

- Ethereum Foundation
- Chainlink
- Aave
- Flare Network
- Polkadot

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Special thanks to the ETH Belgrade Hackathon organizers, mentors, and all participants who provided valuable feedback during the development process.
