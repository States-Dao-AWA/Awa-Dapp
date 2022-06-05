import {Transfer} from "../../generated/GstBnb/GstBnb";
import {BI_8, convertTimestampToDate, convertTokenToDecimal, STEPN_WALLET_ADDRESS} from "./helper";
import {TokenAmount, Transfer as GstTransfer} from "../../generated/schema";

export function handleTransfer(event: Transfer): void {
    const hash = event.block.hash.toHexString();
    const timestamp = event.block.timestamp;
    const from = event.params.from;
    const to = event.params.to;
    const dateString = convertTimestampToDate(timestamp);
    const amount = convertTokenToDecimal(event.params.value, BI_8);

    if (GstTransfer.load(hash) == null) {
        const transfer = new GstTransfer(hash);
        transfer.from = from;
        transfer.to = to;
        transfer.amount = amount;
        transfer.date = dateString;
        transfer.save();
    }

    if (from.toHexString() != STEPN_WALLET_ADDRESS) return;

    const entity = TokenAmount.load(dateString);
    if (entity) {
        entity.amount = entity.amount.plus(amount);
        entity.save();
    } else {
        const entity = new TokenAmount(dateString);
        entity.amount = amount;
        entity.save();
    }
}