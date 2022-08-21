import {
    SyntheticBotTokenFactory,
    BotToken
  } from "../types/schema";
  import {
    CreatedContract
  } from "../types/SyntheticBotTokenFactory/SyntheticBotTokenFactory";
  import {
    ZERO_BI,
    SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS,
    fetchDataFeedAddress,
    fetchTradingBotAddress
  } from "./helpers";
  import { SyntheticBotToken as SyntheticBotTokenTemplate } from "../types/templates";

export function handleCreatedContract(event: CreatedContract): void {
    let dataFeedAddress = fetchDataFeedAddress(event.params.syntheticBotToken);
    let tradingBotAddress = fetchTradingBotAddress(event.params.syntheticBotToken);

    let factory = SyntheticBotTokenFactory.load(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
    if (factory === null) {
        factory = new SyntheticBotTokenFactory(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
        factory.numberOfRegisteredTokens = 0;
        factory.numberOfPositions = 0;
        factory.totalCostBasis = ZERO_BI;
        factory.totalRewardsClaimed = ZERO_BI;
    }
    factory.numberOfRegisteredTokens = factory.numberOfRegisteredTokens + 1;
    factory.save();

    let botToken = new BotToken(event.params.syntheticBotToken.toHexString());
    botToken.numberOfPositions = 0;
    botToken.totalCostBasis = ZERO_BI;
    botToken.totalRewardsClaimed = ZERO_BI;
    botToken.dataFeedAddress = dataFeedAddress.toHexString();
    botToken.tradingBotAddress = tradingBotAddress.toHexString();
    botToken.save();

    // Create the tracked contract based on the template.
    SyntheticBotTokenTemplate.create(event.params.syntheticBotToken);
}