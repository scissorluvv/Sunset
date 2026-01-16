import type { Options } from "ky";

import { getUserToken } from "@/lib/actions/getUserToken";
import { kyInstance } from "@/lib/services/fetcher";

async function poster<T>(url: string, options?: Options) {
  const isOAuth = url.startsWith("oauth/");
  const token = isOAuth ? null : await getUserToken();

  const result = await kyInstance
    .post<T>(url, {
      ...options,
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    .then(async (res) => {
      const contentType = res?.headers?.get("content-type");

      if (!(contentType != null && contentType.includes("application/json")))
        return res;

      try {
        return await res.json();
      }
      catch {
        return null;
      }
    });

  if (!result)
    throw new Error("Unknown error");

  return result as T;
}

export default poster;
