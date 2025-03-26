export class STATUS_CODE {
    static pending = 1
    static on_payment_process = 2
    static picking_up = 3
    static delivering = 4
    static canceled = 5
    static complete = 6
}

export const ORDER_STATUS = {
    [STATUS_CODE.pending]: "pending",
    [STATUS_CODE.on_payment_process]: "on_payment_process",
    [STATUS_CODE.picking_up]: "picking_up",
    [STATUS_CODE.delivering]: "delivering",
    [STATUS_CODE.canceled]: "canceled",
    [STATUS_CODE.complete]: "complete"
}