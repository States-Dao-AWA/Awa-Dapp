import { BigInt, BigDecimal } from '@graphprotocol/graph-ts'

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const BI_8 = BigInt.fromI32(8);
export const STEPN_WALLET_ADDRESS = "0x6238872a0bd9f0e19073695532a7ed77ce93c69e";

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1')
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString('10'))
    }
    return bd
}

export function convertTimestampToDate(timestamp: BigInt): string {
    const date = new Date(timestamp.toU64() * 1000);
    return date.toISOString().split('T')[0];
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal()
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}