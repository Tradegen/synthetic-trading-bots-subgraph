import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import {
  PlatformDayData,
  BotTokenDayData,
} from "../types/schema";
import {
  ZERO_BI } from "./helpers";

export function updatePlatformDayData(event: ethereum.Event): PlatformDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let platformDayData = PlatformDayData.load(dayID.toString());
  if (platformDayData === null)
  {
    platformDayData = new PlatformDayData(dayID.toString());
    platformDayData.date = dayStartTimestamp;
    platformDayData.dailyCostBasis = ZERO_BI;
    platformDayData.dailyRewardsClaimed = ZERO_BI;
  }

  platformDayData.save();

  return platformDayData as PlatformDayData;
}

export function updateBotTokenDayData(event: ethereum.Event, botTokenAddress: Address): BotTokenDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let dayBotTokenID = botTokenAddress
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());
  let botTokenDayData = BotTokenDayData.load(dayBotTokenID);
  if (botTokenDayData === null) {
    botTokenDayData = new BotTokenDayData(dayBotTokenID);
    botTokenDayData.date = dayStartTimestamp;
    botTokenDayData.dailyCostBasis = ZERO_BI;
    botTokenDayData.dailyRewardsClaimed = ZERO_BI;
  }

  botTokenDayData.save();

  return botTokenDayData as BotTokenDayData;
}