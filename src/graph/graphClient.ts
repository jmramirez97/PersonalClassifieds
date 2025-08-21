import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { InteractionType } from "@azure/msal-browser";
import type { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../auth/msalConfig";

export function createGraphClient(pca: PublicClientApplication, account: AccountInfo) {
  const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(pca, {
    account,
    scopes: loginRequest.scopes,
    interactionType: InteractionType.Popup,
  });
  return Client.initWithMiddleware({ authProvider });
}


