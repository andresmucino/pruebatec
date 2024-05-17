"use client";

import {
  EuiHorizontalRule,
  EuiPageHeader,
  EuiPageHeaderContent,
  EuiPageSection,
  EuiPanel,
} from "@elastic/eui";

export default function Home() {

  return (
    <>
        <EuiPageHeaderContent>
            <EuiPanel style={{ margin: "2vh" }} paddingSize="l">
              <EuiPageSection>
                <EuiPageHeader pageTitle="Bienvenido!" />
              </EuiPageSection>
              <EuiHorizontalRule />
              <EuiPanel paddingSize="l"></EuiPanel>
            </EuiPanel>
        </EuiPageHeaderContent>
    </>
  );
}
