import { Transaction, SetTransactionApprovalParams } from "./types";
function read(transactionId: string): boolean | undefined {
  const value = window.localStorage.getItem(transactionId);
  if (!value) {
    return undefined;
  }
  return value === "true" ? true : false;
}

function clickSave(clickedTransaction: SetTransactionApprovalParams): void {
  window.localStorage.setItem(
    clickedTransaction.transactionId,
    clickedTransaction.value + ""
  );
}

function batchSave(transactions: Transaction[]): void {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id && read(transactions[i].id) == null) {
      window.localStorage.setItem(
        transactions[i].id,
        transactions[i].approved + ""
      );
    }
  }
}

function clear(): void {
  window.localStorage.clear();
}

export default { read, clickSave, batchSave, clear };
