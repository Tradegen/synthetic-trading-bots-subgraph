import {
    Address,
    BigDecimal,
    BigInt
  } from "@graphprotocol/graph-ts";
  import { SyntheticBotTokenFactory } from "../types/SyntheticBotTokenFactory/SyntheticBotTokenFactory";
  import { SyntheticBotToken } from "../types/templates/SyntheticBotToken/SyntheticBotToken";
  
  export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  export const SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS = "0x27b2C7A46b63A060fd6e6d6Cc6712Cca3BdA2B9A";
    
  export let ZERO_BI = BigInt.fromI32(0);
  export let ONE_BI = BigInt.fromI32(1);
  export let ZERO_BD = BigDecimal.fromString("0");
  export let ONE_BD = BigDecimal.fromString("1");
  export let BI_18 = BigInt.fromI32(18);

  interface PositionInfo {
    numberOfTokens: BigInt;
    createdOn: BigInt;
    rewardsEndOn: BigInt;
    lastUpdateTime: BigInt;
    rewardPerTokenStored: BigInt;
    rewardRate: BigInt;
  }
  
  export let botTokenFactoryContract = SyntheticBotTokenFactory.bind(
    Address.fromString(SYNTHETIC_BOT_TOKEN_FACTORY_ADDRESS)
  );
  
  export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1");
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString("10"));
    }
    return bd;
  }
  
  export function bigDecimalExp18(): BigDecimal {
    return BigDecimal.fromString("1000000000000000000");
  }
  
  export function convertEthToDecimal(eth: BigInt): BigDecimal {
    return eth.toBigDecimal().div(exponentToBigDecimal(new BigInt(18)));
  }
  
  export function convertTokenToDecimal(
    tokenAmount: BigInt,
    exchangeDecimals: BigInt
  ): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
      return tokenAmount.toBigDecimal();
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
  }
  
  export function equalToZero(value: BigDecimal): boolean {
    const formattedVal = parseFloat(value.toString());
    const zero = parseFloat(ZERO_BD.toString());
    if (zero == formattedVal) {
      return true;
    }
    return false;
  }
  
  export function isNullEthValue(value: string): boolean {
    return (
      value ==
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
  }
  
  export function fetchDataFeedAddress(botTokenAddress: Address): Address {
    let contract = SyntheticBotToken.bind(botTokenAddress);
  
    let dataFeedResult = contract.try_dataFeed();
  
    return dataFeedResult.value ? dataFeedResult.value : Address.fromString(ADDRESS_ZERO);
  }

  export function fetchTradingBotAddress(botTokenAddress: Address): Address {
    let contract = SyntheticBotToken.bind(botTokenAddress);
  
    let tradingBotResult = contract.try_tradingBot();
  
    return tradingBotResult.value ? tradingBotResult.value : Address.fromString(ADDRESS_ZERO);
  }

  export function fetchPositionInfo(botTokenAddress: Address, ID: BigInt): PositionInfo {
    let contract = SyntheticBotToken.bind(botTokenAddress);
  
    let positionInfoResult = contract.try_positions(ID);
    let numberOfTokens:BigInt = positionInfoResult.value.toMap().get("value0")?.toBigInt() ?? ZERO_BI;
    let createdOn:BigInt = positionInfoResult.value.toMap().get("value1")?.toBigInt() ?? ZERO_BI;
    let rewardsEndOn:BigInt = positionInfoResult.value.toMap().get("value2")?.toBigInt() ?? ZERO_BI;
    let lastUpdateTime:BigInt = positionInfoResult.value.toMap().get("value3")?.toBigInt() ?? ZERO_BI;
    let rewardPerTokenStored:BigInt = positionInfoResult.value.toMap().get("value4")?.toBigInt() ?? ZERO_BI;
    let rewardRate:BigInt = positionInfoResult.value.toMap().get("value5")?.toBigInt() ?? ZERO_BI;
  
    return {
      numberOfTokens: numberOfTokens,
      createdOn: createdOn,
      rewardsEndOn: rewardsEndOn,
      lastUpdateTime: lastUpdateTime,
      rewardPerTokenStored: rewardPerTokenStored,
      rewardRate: rewardRate
    } as PositionInfo
  }