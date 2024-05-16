"use client";

import { API_URL, PackagesInterface } from "@/common";
import {
  Button,
  GenerateShipmentInput,
  Header,
  LoadingPage,
  Modal,
  TableBody,
} from "@/components";
import {
  AddPackagesToShipments,
  GenerateShipment,
  GetPackages,
  clientGeneric,
} from "@/graphql";
import { useGeneratedGQLQuery } from "@/hooks";
import { UseAuthContext } from "@/hooks/login";
import { useToastsContext } from "@/hooks/useToastAlertProvider/useToastContext";
import {
  EuiBasicTableColumn,
  EuiFieldSearch,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiModalFooter,
  EuiPageHeaderContent,
  EuiPanel,
  EuiSpacer,
  EuiTableSelectionType,
} from "@elastic/eui";
import { Toast } from "@elastic/eui/src/components/toast/global_toast_list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Packages() {
  const router = useRouter();
  const { user } = UseAuthContext();
  const apiUrl = `${API_URL}/graphql`;

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
  const [showModal, setShowModal] = useState(false);
  const [clientId, setClientId] = useState("");
  const [selectItems, setSelectItems] = useState<PackagesInterface[]>([]);
  const [dataPackages, setDataPackages] = useState<Array<PackagesInterface>>(
    []
  );
  const queryCache: any = useQueryClient();
  const [generateShipmentData, setGenerateShipmentData] = useState({
    comments: "",
    clientId: "",
    warehouseShipmentId: "",
  });
  const [validateGenerateShipmentData, setValidateGenerateShipmentData] =
    useState({
      comments: false,
      clientId: false,
      warehouseShipmentId: false,
    });

  const { globalToasts, pushToast } = useToastsContext();

  const queryVars = {
    filter: {
      ...(clientId != "" && {
        clientId: {
          eq: Number(clientId),
        },
      }),
    },
    paging: actionsPaging,
    sorting: [],
  };

  const onSelectionChange = (selectedItems: PackagesInterface[]) => {
    setSelectItems(selectedItems);
  };

  const selection: EuiTableSelectionType<PackagesInterface> = {
    selectable: (pkg: PackagesInterface) => pkg?.status?.id === 1,
    selectableMessage: (selectable) => (!selectable ? "packages main" : ""),
    onSelectionChange: onSelectionChange,
  };

  const { data, status, isFetching } = useGeneratedGQLQuery<
    unknown | any,
    unknown,
    unknown,
    unknown
  >(apiUrl, "getPackages", GetPackages, queryVars);

  const {
    mutate: mutateGenerateShipment,
    status: statusGenerateShipment,
    error: ErrorGenerateShipment,
  } = useMutation({
    mutationKey: ["generateShioment"],
    mutationFn: (shipment: any) => {
      return clientGeneric(apiUrl, user).request(GenerateShipment, shipment);
    },
  });

  const {
    mutate: mutateAddPackagesShipment,
    status: statusAddPackagesShipment,
    error: errorAddPackagesShipment,
  } = useMutation({
    mutationKey: ["addPackagesToShipment"],
    mutationFn: (addPackagesShiment: any) => {
      return clientGeneric(apiUrl, user).request(
        AddPackagesToShipments,
        addPackagesShiment
      );
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();

    mutateGenerateShipment(
      {
        input: {
          comments: generateShipmentData.comments,
          clientId: Number(generateShipmentData.clientId),
          warehouseShipmentId: Number(generateShipmentData.warehouseShipmentId),
        },
      },
      {
        onSuccess: (data: any) => {
          const newToast: Toast[] = [];
          newToast.push({
            id: "1",
            title: "Envio",
            text: <p>Envio creado</p>,
            color: "success",
          });
          pushToast(newToast);

          const selectPackages = selectItems.map((item: any) => item.guide);
          mutateAddPackagesShipment(
            {
              input: {
                shipmentId: data.generateShipment.id,
                guides: selectPackages,
              },
            },
            {
              onSuccess: () => {
                const newToast: Toast[] = [];
                newToast.push({
                  id: "2",
                  title: "Paquetes",
                  text: (
                    <p>
                      Se agregaron correctamente los paquetes, orden:
                      {data.generateShipment.id}
                    </p>
                  ),
                  color: "success",
                });
                pushToast(newToast);

                setGenerateShipmentData({
                  clientId: "",
                  comments: "",
                  warehouseShipmentId: "",
                });

                setShowModal(!showModal);
                if (isFetching === false) {
                  queryCache.removeQueries("getPackages", { stale: false });
                }
              },
              onError: () => {
                const newToast: Toast[] = [];
                newToast.push({
                  id: "3",
                  title: "Paquetes",
                  text: <p>No se pudieron agregar paquetes a la orden</p>,
                  color: "danger",
                });
                pushToast(newToast);
              },
            }
          );
        },
        onError: () => {
          const newToast: Toast[] = [];
          newToast.push({
            id: "4",
            title: "Envio",
            text: <p>No se generó correctamente la orden</p>,
            color: "danger",
          });
          pushToast(newToast);
        },
      }
    );
  };

  const validateFields = () => {
    let valid = true;

    if (
      generateShipmentData.clientId === "" ||
      validateGenerateShipmentData.clientId ||
      generateShipmentData.comments === "" ||
      validateGenerateShipmentData.comments ||
      generateShipmentData.warehouseShipmentId === "" ||
      validateGenerateShipmentData.warehouseShipmentId
    ) {
      valid = false;
    }

    return !valid;
  };

  useEffect(() => {
    const newPaging = {
      limit: pageSize,
      offset: pageSize * pageIndex,
    };
    setActionsPaging(newPaging);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    if (status === "success") {
      setDataPackages(
        data?.packages?.nodes.map((pkg: any) => ({
          id: pkg.id,
          guide: pkg.guide,
          updatedAt: moment
            .utc(pkg.updatedAt)
            .local()
            .format("DD-MM-YYYY HH:mm"),
          client: {
            id: pkg.client.id,
          },
          shipment: {
            id: pkg?.shipment === null ? "Sin N. envio" : pkg.shipment.id,
          },
          status: {
            id: pkg.status.id,
            status: pkg.status.status,
            description: pkg.status.description,
          },
        }))
      );
      setTotalCount(data?.packages?.totalCount);
    }
  }, [data, status]);

  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      width: "50px",
    },
    {
      field: "guide",
      name: "Guía",
    },
    {
      field: "status.description",
      name: "Estatus",
    },
    {
      field: "shipment.id",
      name: "Número de envio",
    },
    {
      field: "client.id",
      name: "Cliente",
    },
    {
      field: "updatedAt",
      name: "Actualizado",
    },
  ];

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]);

  if (status === "loading") {
    return <LoadingPage isLoading={status === "loading"} />;
  }

  return (
    <EuiPageHeaderContent>
      {user !== null && (
        <>
          <EuiPanel style={{ margin: "2vh" }}>
            <Header title={`Paquetes (${totalCount})`}>
              <Button
                isDisabled={selectItems.length <= 0}
                onClick={() => setShowModal(!showModal)}
                fill
              >
                Crear orden
              </Button>
            </Header>
            <EuiHorizontalRule />
            <EuiPanel>
              <EuiFormRow label="ID de cliente">
                <EuiFieldSearch
                  style={{ minWidth: 160 }}
                  onChange={(e) => {
                    setClientId(e.target.value);
                  }}
                  placeholder="id"
                  value={clientId}
                />
              </EuiFormRow>
              <EuiSpacer />
              <TableBody
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                columns={columns}
                items={dataPackages}
                totalItemCount={totalCount}
                pageSizeOptions={pageSizeOptions}
                noItemsMessage={"No se encontraron paquetes"}
                itemId={"id"}
                selection={selection}
                isSelectable={true}
              />
            </EuiPanel>
          </EuiPanel>
          {showModal && (
            <>
              <Modal
                onCloseModal={() => setShowModal(!showModal)}
                titleModal={"Crear orden"}
              >
                <EuiForm component="form" onSubmit={onSubmit}>
                  <GenerateShipmentInput
                    generateShipmentData={generateShipmentData}
                    setGenerateShipmentData={setGenerateShipmentData}
                    validateGenerateShipmentData={validateGenerateShipmentData}
                    setValidateGenerateShipmentData={
                      setValidateGenerateShipmentData
                    }
                  />
                  <EuiSpacer />
                  <EuiModalFooter>
                    <Button onClick={() => setShowModal(!showModal)}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      fill
                      isLoading={statusGenerateShipment === "loading"}
                      isDisabled={validateFields()}
                    >
                      Crear
                    </Button>
                  </EuiModalFooter>
                </EuiForm>
              </Modal>
            </>
          )}
          {globalToasts}
        </>
      )}
    </EuiPageHeaderContent>
  );
}
