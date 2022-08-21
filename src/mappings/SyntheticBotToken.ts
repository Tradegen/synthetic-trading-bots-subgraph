import {
    SyntheticBotTokenFactory,
    BotToken,
    Position,
    User
  } from "../types/schema";
  import {
    MintedTokens,
    ClaimedRewards
  } from "../types/templates/SyntheticBotToken/SyntheticBotToken";
  import {
    ZERO_BI,
    SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS,
    fetchPositionInfo,
    fetchTotalCostBasis,
  } from "./helpers";
  import {
    updateBotTokenDayData,
    updatePlatformDayData
  } from "./dayUpdates";

export function handleMintedTokens(event: MintedTokens): void {
    let newTotalCostBasis = fetchTotalCostBasis(event.address);
    let positionInfo = fetchPositionInfo(event.address, event.params.positionID);

    let factory = SyntheticBotTokenFactory.load(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
    if (factory === null) {
        factory = new SyntheticBotTokenFactory(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
        factory.numberOfRegisteredTokens = 0;
        factory.numberOfPositions = 0;
        factory.totalCostBasis = ZERO_BI;
        factory.totalRewardsClaimed = ZERO_BI;
    }
    factory.numberOfPositions = factory.numberOfPositions + 1;
    factory.totalCostBasis = factory.totalCostBasis.plus(newTotalCostBasis);
    factory.save();

    let botToken = BotToken.load(event.address.toHexString());
    let changeInCostBasis = newTotalCostBasis.minus(botToken.totalCostBasis);
    botToken.numberOfPositions = botToken.numberOfPositions + 1;
    botToken.totalCostBasis = newTotalCostBasis;
    botToken.save();

    let user = User.load(event.params.user.toHexString());
    if (user === null) {
        user = new User(event.params.user.toHexString());
        user.totalCostBasis = ZERO_BI;
        user.totalRewardsClaimed = ZERO_BI;
    }
    user.totalCostBasis = user.totalCostBasis.plus(changeInCostBasis);
    user.save();

    let positionID = event.address.toHexString() + "-" + event.params.user.toHexString();
    let position = new Position(positionID);
    position.botToken = event.address.toHexString();
    position.user = event.params.user.toHexString();
    position.numberOfTokens = event.params.numberOfTokens;
    position.numberOfWeeks = event.params.numberOfWeeks;
    position.costBasis = changeInCostBasis;
    position.createdOn = positionInfo[1];
    position.rewardsEndOn = positionInfo[2];
    position.lastUpdatedOn = positionInfo[3];
    position.rewardPerTokenStored = positionInfo[4];
    position.rewardRate = positionInfo[5];
    position.save();

    let platformDayData = updatePlatformDayData(event);
    platformDayData.dailyCostBasis = platformDayData.dailyCostBasis.plus(changeInCostBasis);
    platformDayData.save();

    let botTokenDayData = updateBotTokenDayData(event, event.address);
    botTokenDayData.dailyCostBasis = botTokenDayData.dailyCostBasis.plus(changeInCostBasis);
    botTokenDayData.save();
}

export function handleClaimedRewards(event: ClaimedRewards): void {
    let positionInfo = fetchPositionInfo(event.address, event.params.positionID);

    let factory = SyntheticBotTokenFactory.load(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
    if (factory === null) {
        factory = new SyntheticBotTokenFactory(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS);
        factory.numberOfRegisteredTokens = 0;
        factory.numberOfPositions = 0;
        factory.totalCostBasis = ZERO_BI;
        factory.totalRewardsClaimed = ZERO_BI;
    }
    factory.numberOfPositions = factory.numberOfPositions + 1;
    factory.totalRewardsClaimed = factory.totalRewardsClaimed.plus(event.params.amountClaimed);
    factory.save();

    let botToken = BotToken.load(event.address.toHexString());
    botToken.totalRewardsClaimed = botToken.totalRewardsClaimed.plus(event.params.amountClaimed);
    botToken.save();

    let user = User.load(event.params.user.toHexString());
    if (user === null) {
        user = new User(event.params.user.toHexString());
        user.totalCostBasis = ZERO_BI;
        user.totalRewardsClaimed = ZERO_BI;
    }
    user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amountClaimed);
    user.save();

    let positionID = event.address.toHexString() + "-" + event.params.user.toHexString();
    let position = new Position(positionID);
    position.botToken = event.address.toHexString();
    position.user = event.params.user.toHexString();
    position.createdOn = positionInfo[1];
    position.rewardsEndOn = positionInfo[2];
    position.lastUpdatedOn = positionInfo[3];
    position.rewardPerTokenStored = positionInfo[4];
    position.rewardRate = positionInfo[5];
    position.save();

    let platformDayData = updatePlatformDayData(event);
    platformDayData.dailyRewardsClaimed = platformDayData.dailyRewardsClaimed.plus(event.params.amountClaimed);
    platformDayData.save();

    let botTokenDayData = updateBotTokenDayData(event, event.address);
    botTokenDayData.dailyRewardsClaimed = botTokenDayData.dailyRewardsClaimed.plus(event.params.amountClaimed);
    botTokenDayData.save();
}