import classNames from "classnames";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputSelect } from "./components/InputSelect";
import { Instructions } from "./components/Instructions";
import { Transactions } from "./components/Transactions";
import { useEmployees } from "./hooks/useEmployees";
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions";
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee";
import { EMPTY_EMPLOYEE } from "./utils/constants";
import { Employee } from "./utils/types";
import storageUtils from "./utils/storage";

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees();
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } =
    usePaginatedTransactions();
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } =
    useTransactionsByEmployee();
  const [isLoading, setIsLoading] = useState(false);
  const [employIsLoading, setEmployIsLoading] = useState(false);
  const [viewButtonInvisible, setViewButtonINvisible] = useState(false);

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  );

  const loadEmployees = useCallback(async () => {
    setEmployIsLoading(true);
    await employeeUtils.fetchAll();
    setEmployIsLoading(false);
  }, [employeeUtils]);

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true);
    transactionsByEmployeeUtils.invalidateData();
    await paginatedTransactionsUtils.fetchAll();
    setIsLoading(false);
  }, [paginatedTransactionsUtils, transactionsByEmployeeUtils]);

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData();
      transactionsByEmployeeUtils.invalidateData();
      await transactionsByEmployeeUtils.fetchById(employeeId);
      setViewButtonINvisible(true);
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  );

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadEmployees();
      loadAllTransactions();
    }
  }, [employeeUtils.loading, employees, loadAllTransactions, loadEmployees]);

  useEffect(() => {
    console.log("printing paginated transactions: ", paginatedTransactions);
    if (paginatedTransactions != null) {
      storageUtils.batchSave(paginatedTransactions.data);
      console.log("[paginated]storage loaded, check window.localStorage");
    }
  }, [paginatedTransactions]);

  useEffect(() => {
    console.log("printing byEmployee transactions: ", transactionsByEmployee);
    if (transactionsByEmployee != null) {
      storageUtils.batchSave(transactionsByEmployee);
      console.log("[byEmployee]storage loaded, check window.localStorage");
    }
  }, [transactionsByEmployee]);

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={employIsLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return;
            } else if (
              newValue.id === "" &&
              newValue.firstName === "All" &&
              newValue.lastName === "Employees"
            ) {
              loadAllTransactions();
              setViewButtonINvisible(false);
            } else {
              await loadTransactionsByEmployee(newValue.id);
            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && (
            <button
              className={classNames("RampButton", {
                "RampButton-invisible":
                  viewButtonInvisible || !paginatedTransactions?.nextPage,
              })}
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions();
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  );
}
