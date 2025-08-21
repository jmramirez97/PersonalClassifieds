import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import type { PublicClientApplication } from "@azure/msal-browser";
import { createGraphClient } from "../graph/graphClient";

type DriveItem = {
  id: string;
  name: string;
  webUrl?: string;
  folder?: unknown;
  file?: unknown;
};

export function FileList() {
  const { instance, accounts } = useMsal();
  const [items, setItems] = useState<DriveItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (accounts.length === 0) return;
      try {
        const client = createGraphClient(
          instance as unknown as PublicClientApplication,
          accounts[0]
        );
        // Default: user's OneDrive root; for SharePoint Embedded, replace with appropriate container/drive endpoint.
        const response = await client.api("/me/drive/root/children").get();
        setItems(response.value ?? []);
      } catch (e: unknown) {
        setError((e as Error).message);
      }
    }
    load();
  }, [accounts, instance]);

  if (error) return <div>Failed to load files: {error}</div>;
  if (!items) return <div>Loading files…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Files</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.folder ? "📁" : "📄"} {item.webUrl ? (
              <a href={item.webUrl} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            ) : (
              item.name
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


