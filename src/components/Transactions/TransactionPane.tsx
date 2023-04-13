import { useState } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";
import storageUtils from "../../utils/storage";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState<boolean | undefined>(
    storageUtils.read(transaction.id) ?? transaction.approved
  );
  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} -{" "}
          {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          storageUtils.clickSave({
            transactionId: transaction.id,
            value: newValue,
          });
          setApproved(newValue);
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          });
        }}
      />
    </div>
  );
};
