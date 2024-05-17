"use client";

import { Header, TableBody } from "@/components";
import { useToastsContext } from "@/hooks";
import {
  EuiBasicTableColumn,
  EuiHorizontalRule,
  EuiPageHeaderContent,
  EuiPanel,
} from "@elastic/eui";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
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
  const { globalToasts, pushToast } = useToastsContext();



  const [dataCustom, setDataCustom] = useState([]);

  useEffect(() => {
    const newPaging = {
      limit: pageSize,
      offset: pageSize * pageIndex,
    };
    setActionsPaging(newPaging);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    const customdata = () => {
      try {
        const data = axios.get(
          "https://sandbox.belvo.com/api/institutions/?page=1",
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization:
                `Basic ${process.env.AUTHORIZATION}`,
            },
          }
        );
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    const data = customdata();
    data
      .then((data) => {
        setDataCustom(data.data.results);
        setTotalCount(data.data.results.length)
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
      field: "display_name",
      name: "Recurso",
    },
    {
      field: "name",
      name: "Nombre",
    },
    {
      field: "status",
      name: "Estatus",
    },
    {
      field: "type",
      name: "Tipo",
    },
  ];

  return (
    <EuiPageHeaderContent>
      <>
        <EuiPanel style={{ margin: "2vh" }}>
          <Header title={`Tansacciones`} children={undefined}></Header>
          <EuiHorizontalRule />
          <EuiPanel>
            <TableBody
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageSize={pageSize}
              setPageSize={setPageSize}
              columns={columns}
              items={dataCustom}
              totalItemCount={totalCount}
              pageSizeOptions={pageSizeOptions}
              noItemsMessage={"No se encontraron transacciones"}
              itemId={"id"}
            />
          </EuiPanel>
        </EuiPanel>

        {globalToasts}
      </>
    </EuiPageHeaderContent>
  );
}
