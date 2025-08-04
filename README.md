# USDC Yield Optimiser Bot (Aave vs Compound)

This CLI bot monitors USDC lending yields across Aave and Compound and recommends the platform offering the best return. It also logs the current USDC price using CoinMarketCap.

## Features

- Fetches live APY data for USDC from:
  - Aave
  - Compound  
  *(via [LlamaFi](https://yields.llama.fi/) yield aggregator API)*
- Fetches current USDC market price via:
  - [CoinMarketCap](https://coinmarketcap.com/)
- Compares APYs and suggests whether to switch platforms
- Runs continuously at 30-second intervals

## Tech Stack

- Node.js
- Axios (HTTP client)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/sumitabh1710/usdc-yield-optimiser.git
   cd usdc-yield-optimiser
   npm install
2. run project:
  ```bash
  npm start
  