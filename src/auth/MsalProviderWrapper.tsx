import type { ReactNode } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig";

const pca = new PublicClientApplication(msalConfig);

export function MsalProviderWrapper({ children }: { children: ReactNode }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>;
}


