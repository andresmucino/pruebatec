"use client";

import { Button, LoadingPage } from "@/components";
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiLink,
  EuiPageHeader,
  EuiPageHeaderContent,
  EuiPageSection,
  EuiPanel,
  EuiSpacer,
} from "@elastic/eui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false);

  const handelChange = (e: any) => {
    const { name, value } = e.target;

    setLogin({ ...login, [name]: value });
  };

  const onClick = () => {
    router.push("/");
  };


  return (
    <EuiPageHeaderContent>
      <EuiPanel style={{ margin: "2vh" }} paddingSize="l">
        <EuiPageSection>
          <EuiPageHeader pageTitle="Iniciar sesión" />
        </EuiPageSection>
        <EuiHorizontalRule />
        <EuiPanel paddingSize="l">
          <EuiFlexGroup>
            <EuiFlexItem></EuiFlexItem>
            <EuiFlexItem grow={1} style={{ justifyContent: "center" }}>
              <EuiFormRow id="1">
                <EuiFieldText
                  fullWidth
                  onChange={handelChange}
                  name="email"
                  placeholder="Correo"
                />
              </EuiFormRow>
              <EuiFormRow id="2">
                <EuiFieldText
                  placeholder="Contraseña"
                  type={showModal === true ? "password" : "text"}
                  name="password"
                  onChange={handelChange}
                  append={
                    <EuiButtonIcon
                      style={{ backgroundColor: "white" }}
                      onClick={() => {
                        setShowModal(!showModal);
                      }}
                      iconType={showModal === true ? "eye" : "eyeClosed"}
                      aria-label="eye"
                    />
                  }
                />
              </EuiFormRow>
              <div style={{ display: "inline-grid", width: "150px" }}>
                <EuiSpacer />
                <Button onClick={onClick} isLoading={false} fill>
                  Login
                </Button>
                <EuiSpacer />
                <EuiLink href="/register">Registrarse</EuiLink>
              </div>
            </EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPanel>
    </EuiPageHeaderContent>
  );
}
