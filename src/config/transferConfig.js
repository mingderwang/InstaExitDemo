const CHECK_LIQUIDITY = "CL";
const DEPOSIT_ON_FROM_CHAIN = "DC";
const TRANSFER_ON_TO_CHAIN = "TC";

let transferStepsKeyArray = [CHECK_LIQUIDITY, DEPOSIT_ON_FROM_CHAIN, TRANSFER_ON_TO_CHAIN];

let transferStepsMap = {
    [CHECK_LIQUIDITY] : {
        label: "Checking Available Liquidity",
        content: ""
    },
    [DEPOSIT_ON_FROM_CHAIN] : {
        label: "Deposit Transaction",
        content: ""
    },
    [TRANSFER_ON_TO_CHAIN] : {
        label: "Transfer Transaction",
        content: ""
    }
}

let transferStepsLabelArray = [];
let transferStepsContentArray = [];
for(let index=0; index < transferStepsKeyArray.length; index++) {
    transferStepsLabelArray.push(transferStepsMap[transferStepsKeyArray[index]].label);
    transferStepsContentArray.push(transferStepsMap[transferStepsKeyArray[index]].content)
}

export {
    transferStepsLabelArray,
    transferStepsContentArray
}