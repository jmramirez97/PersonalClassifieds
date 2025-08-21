import type { Configuration } from "@azure/msal-browser";
import { LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AAD_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID as string}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI as string,
    postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_URI as string,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    // SharePoint List permissions for classifieds functionality
    "Sites.ReadWrite.All",
    "Sites.Manage.All",
    "User.ReadWrite.All",
    // Additional permissions for Teams integration and notifications
    "Chat.ReadWrite",
    "ChatMessage.Send",
  ],
};


