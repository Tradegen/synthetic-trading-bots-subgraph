# Synthetic Trading Bots Subgraph

This subgraph dynamically tracks any synthetic trading bot token created by the SyntheticTradingBotFactory contract. It tracks the current state of SyntheticBotToken contracts, and contains derived stats for reward distribution and user cost basis.

- aggregated data across synthetic bot tokens and user positions,
- data on individual synthetic bot tokens,
- data on individual user positions,
- data on each user's positions, total cost basis, and total rewards claimed
- historical data on reward distribution and cost basis

## Running Locally

Make sure to update package.json settings to point to your own graph account.

## Queries

Below are a few ways to show how to query the [synthetic-trading-bots subgraph](https://thegraph.com/hosted-service/subgraph/tradegen/synthetic-trading-bots) for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Key Entity Overviews

#### SyntheticBotTokenFactory

Contains aggregated data across all synthetic bot tokens and user positions. This entity tracks total cost basis (in USD), total rewards distributed (in USD), the number of positions, and the number of registered tokens.

#### BotToken

Contains data on a specific token. In addition to token-specific data, this entity also tracks external data relating to the token such as the token's data feed address and the token's trading bot address.

#### Position

Contains data on a specific position (user + token). Each position is linked to a BotToken and User entity.

## Example Queries

### Querying Aggregated Data

This query fetches aggredated data from all synthetic bot tokens, to give a view into how much activity is happening within the protocol.

```graphql
{
  syntheticBotTokenFactories(first: 1) {
    numberOfRegisteredTokens
    numberOfPositions
    totalCostBasis
    totalRewardsClaimed
  }
}
```
