"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import { fetchTransactions } from "@/app/utils/transactions";
import { humanQueryToSQL } from "@/app/utils/humanQueryToSQL";
import { fetchLicenses } from "@/app/utils/licenses";
import TransactionsWidget from "@/app/components/transactions-widget";
import LicensesWidget from "@/app/components/licenses-widget";
import { fetchCargos } from "@/app/utils/cargos";
import { fetchCompanies } from "@/app/utils/companies";

const FunctionCalling = () => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [licensesData, setLicensesData] = useState([]);
  const showColumn = transactionsData.length > 0 || licensesData.length > 0;

  const clearStates = () => {
    setTransactionsData([]);
    setLicensesData([]);
  };

  const functionCallHandler = async (call) => {
    if (!call?.function?.name)
      return JSON.stringify({ error: "No function name provided" });
    clearStates();
    const args = JSON.parse(call.function.arguments);

    if (call.function.name === "database_query_builder") {
      try {
        const sqlQuery = await humanQueryToSQL({
          humanQuery: args.humanQuery as string,
        });

        return sqlQuery;
      } catch (error) {
        console.error("Error querying database:", error);
        return JSON.stringify({
          error: "No se pudo obtener la query SQL",
        });
      }
    }

    if (call.function.name === "query_transacciones") {
      try {
        const data = await fetchTransactions({ ...args });

        if (!data) {
          throw new Error("No se encontraron transacciones");
        }
        setTransactionsData(data);
        return JSON.stringify({
          num_total_registros: data.length,
          registros: data.slice(0, 235),
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return JSON.stringify({
          error: "No se pudieron obtener transacciones",
        });
      }
    }

    if (call.function.name === "query_licencias") {
      try {
        const data = await fetchLicenses({ ...args });

        if (!data) {
          throw new Error("No se encontraron licencias");
        }
        setLicensesData(data);
        return JSON.stringify({
          num_total_registros: data.length,
          registros: data.slice(0, 180),
        });
      } catch (error) {
        console.error("Error fetching licenses:", error);
        return JSON.stringify({
          error: "No se pudieron obtener licencias",
        });
      }
    }

    if (call.function.name === "query_cargos") {
      try {
        const data = await fetchCargos({ ...args });

        if (!data) {
          throw new Error("No se encontró información sobre cargos");
        }
        return JSON.stringify({
          num_total_registros: data.length,
          registros: data.slice(0, 100),
        });
      } catch (error) {
        console.error("Error fetching cargos:", error);
        return JSON.stringify({
          error: "Error al obtener información de personas y cargos",
        });
      }
    }

    if (call.function.name === "query_empresas") {
      try {
        const data = await fetchCompanies({ ...args });

        if (!data) {
          throw new Error("No se encontraron companies");
        }
        return JSON.stringify({
          num_total_registros: data.length,
          registros: data.slice(0, 100),
        });
      } catch (error) {
        console.error("Error fetching companies:", error);
        return JSON.stringify({
          error: "Error al obtener información de empresas",
        });
      }
    }

    console.error(`Función "${call.function.name}" no encontrada`);
    return JSON.stringify({ error: "Función no reconocida" });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {showColumn && (
          <div className={styles.column}>
            {transactionsData.length > 0 && (
              <TransactionsWidget transactions={transactionsData} />
            )}
            {licensesData.length > 0 && (
              <LicensesWidget licenses={licensesData} />
            )}
          </div>
        )}

        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
