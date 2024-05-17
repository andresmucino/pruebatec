"use client";

import { Header, TableBody } from "@/components";
import { ListChart } from "@/components/Chart";

import { useToastsContext } from "@/hooks/useToastAlertProvider/useToastContext";
import {
  EuiBasicTableColumn,
  EuiFieldSearch,
  EuiHorizontalRule,
  EuiPageHeaderContent,
  EuiPanel,
  EuiSpacer,
} from "@elastic/eui";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ListTransactions() {
  const initialIndex = 0;
  const initialPageZize = 10;
  const pageSizeOptions = [
    initialPageZize,
    initialPageZize * 2,
    initialPageZize * 4,
  ];
  const [pageIndex, setPageIndex] = useState<number>(initialIndex);
  const [pageSize, setPageSize] = useState<number>(initialPageZize);
  const [actionsPaging, setActionsPaging] = useState<any>({
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [shipments, setShipments] = useState<any[]>([]);
  const { globalToasts, pushToast } = useToastsContext();

  useEffect(() => {
    const newPaging = {
      limit: pageSize,
      offset: pageSize * pageIndex,
    };
    setActionsPaging(newPaging);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    const listtransactions = () => {
      try {
        const data = axios.get(
          `https://sandbox.belvo.com/api/transactions/?page=1&link=45e98d2e-39ad-42be-97e7-c2fd21c346a3`,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization:
                "Basic YmU5Y2M0MmItMzExNi00NmM1LWI0M2EtNzllMjkxZGMxMTRiOlhtU1R2NFYtaXM1STEtMVdlcmZOd19qOTI4TzFrQWZVN2tWR0BQZlBvSkJ3clRsYjFTQGVDOHFueGdJT2pAcDQ=",
            },
          }
        );

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    const data = listtransactions();

    data
      .then((data) => {
        console.log(data.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
    },
    {
      field: "packages",
      name: "Paradas",
    },
    {
      field: "status",
      name: "Estatus",
    },
    {
      field: "messenger",
      name: "Mensajero",
    },
    {
      field: "updatedAt",
      name: "Actualizado",
    },
  ];

  return (
    <EuiPageHeaderContent>
      <>
        <EuiPanel style={{ margin: "2vh" }}>
          <Header title={`Lista transacciones`}>{""}</Header>
          <EuiHorizontalRule />
          <EuiFieldSearch />
          <EuiSpacer />
          <EuiPanel>
            <TableBody
              items={shipments}
              columns={columns}
              itemId={"id"}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalItemCount={totalCount}
              pageSizeOptions={pageSizeOptions}
              noItemsMessage={"No se encontraron envíos"}
            />
                <ListChart />
          </EuiPanel>
        </EuiPanel>
        {globalToasts}
    
      </>
    </EuiPageHeaderContent>
  );
}
