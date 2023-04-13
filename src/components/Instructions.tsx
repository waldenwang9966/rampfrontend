import { Fragment, useEffect } from "react";
import storageUtils from "../utils/storage";

export function Instructions() {
  useEffect(() => {
    console.log(
      "--------All console mesaages during development are preserved to help you better understand code--------"
    );
    console.log("to fix bug 7, I made edits to localstorage");
    console.log(
      "!!!!!IMPORTANT!!!!!  I made localstorage  cleaned when page reloaded, This is an INTENDED feature as the original pages SHOULD be identical "
    );
    console.log(
      "!!!!!IMPORTANT!!!!!  If you want checkboxs to be persist FOREVER, comment out codes in Instructions.tsx 11:16"
    );

    window.addEventListener("beforeunload", storageUtils.clear);
    return () => {
      console.log("clear unrigied");
      window.removeEventListener("beforeunload", storageUtils.clear);
    };
  }, [12]);
  return (
    <Fragment>
      <h1 className="RampTextHeading--l">Approve transactions</h1>
      <div className="RampBreak--l" />
      <p className="RampText">
        Your company uses Ramp as their main financial instrument. You are a
        manager and you need to approve the transactions made by your employees.
        <span className="RampBreak--s" />
        Select the checkbox on the right to approve or decline the transactions.
        You can filter transactions by employee.
      </p>
    </Fragment>
  );
}
