import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostAuthTokenData, PostAuthTokenResponse } from "@/lib/types/api";

export function useAuthorize() {
  return useSWRMutation("api/v2/me", authorize);
}

async function authorize(_key: string, { arg }: { arg: PostAuthTokenData["body"] }) {
  if (!arg)
    throw new Error("Missing token request body");

  const body = new URLSearchParams();

  for (const [k, v] of Object.entries(arg)) {
    if (v == null)
      continue;

    body.set(k, String(v));
  }

  return poster<PostAuthTokenResponse>("oauth/token", {
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "12",
      client_secret: "7f68dce8f028ddf71357cf8aaf6f31d87c78ac9788d4b7864a9ca7bf2a09ea18",
      scope: "public",
    }),
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}
