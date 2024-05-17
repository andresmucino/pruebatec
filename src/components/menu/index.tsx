import {
  EuiHorizontalRule,
  EuiListGroup,
  EuiListGroupItem,
} from "@elastic/eui";

export const Menu = () => {
  return (
    <EuiListGroup>
      <EuiHorizontalRule margin="xs" />
      <EuiListGroupItem
        iconType="users"
        onClick={() => "/transactions"}
        label="Transaciones"
        href="/transactions"
      />
      <EuiHorizontalRule margin="xs" />
      <EuiListGroupItem
        iconType="kubernetesNode"
        label="Lista de transacciones"
        onClick={() => "/listtransactions"}
        href="/listtransactions"
      />
      <EuiHorizontalRule margin="xs" />
      {/* <EuiListGroupItem
        iconType="importAction"
        iconProps={{ color: "default" }}
        onClick={() => "/generatePackages"}
        label="Generar paquetes"
        href="/generatePackages"
      /> */}
      <EuiHorizontalRule margin="xs" />
    </EuiListGroup>
  );
};
