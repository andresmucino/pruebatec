"use client";

import { Button, Header, LoadingPage } from "@/components";
import { auth } from "@/config";
import { useToastsContext } from "@/hooks";
import {
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiHorizontalRule,
  EuiPageHeaderContent,
  EuiPanel,
  EuiSpacer,
} from "@elastic/eui";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function About() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [registerUser, setRegisterUser] = useState({
    email: "",
    password: "",
  });
  const [confirmRegister, setConfirmRegister] = useState({
    email: false,
  });
  const [showModal, setShowModal] = useState(false);
  const { globalToasts, pushToast } = useToastsContext();

  const signIn = async (email: any, password: any) => {
    let result = null,
      error = null;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      error = e;
    }

    return { result, error };
  };

  const onSaveData = async (e: any) => {
    e.preventDefault();

    const { result, error } = await signIn(email, password);

    if (error) {
      return console.log(error);
    }
  };

  const validateFields = () => {
    let valid = true;
    if (registerUser.email === "" || registerUser.password === "") {
      valid = false;
    }

    return !valid;
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingPage isLoading={true} />;

  return (
    <EuiPageHeaderContent>
      <EuiPanel style={{ margin: "2vh" }}>
        <Header title={"Registrate"}>{""}</Header>
        <EuiHorizontalRule />
        <EuiPanel paddingSize="l">
          <EuiForm component="form" onSubmit={onSaveData}>
            <EuiFlexGroup>
              <EuiFlexItem></EuiFlexItem>
              <EuiFlexItem grow={1} style={{ justifyContent: "center" }}>
                {/* <GeneralForm
                  generalFormData={registerUser}
                  setGeneralFormData={setRegisterUser}
                  validateGeneralFormData={confirmRegister}
                  setValidateGeneralFormData={setConfirmRegister}
                /> */}
                <EuiFieldText name="" />
                <EuiFieldText />
                <div style={{ width: "150px" }}>
                  <EuiSpacer />
                  <Button
                    type="submit"
                    isLoading={status === "loading"}
                    isDisabled={validateFields()}
                  >
                    Registrarse
                  </Button>
                  <EuiSpacer />
                </div>
              </EuiFlexItem>
              <EuiFlexItem></EuiFlexItem>
            </EuiFlexGroup>
          </EuiForm>
        </EuiPanel>
      </EuiPanel>
      {/* {showModal && (
        <Modal
          onCloseModal={() => setShowModal(!showModal)}
          titleModal={"Para ingresar"}
        >
          <Link target="_blank" href={url} onClick={() => {router.push("/login");}}>
            <h4 style={{ fontSize: "larger" }}>Establece una contraseña</h4>
          </Link>
          <EuiSpacer />
        </Modal>
      )} */}
      {globalToasts}
    </EuiPageHeaderContent>
  );
}
