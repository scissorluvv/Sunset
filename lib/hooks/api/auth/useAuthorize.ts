import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostAuthTokenData, PostAuthTokenResponse } from "@/lib/types/api";

export function useAuthorize() {
  return useSWRMutation("api/v2/me/", authorize);
}

async function authorize(_key: string, { arg }: { arg: PostAuthTokenData["body"] }) {
  if (!arg)
    throw new Error("Missing token request body");

  const body = new URLSearchParams();

  // Copy whatever your TokenRequest provides (username/password/grant_type/etc.)
  for (const [k, v] of Object.entries(arg)) {
    if (v == null)
      continue;

    body.set(k, String(v));
  }

  // Force correct client creds + scope for your server
  body.set("client_id", "6");
  body.set("client_secret", "510664d5dee21a71701442b96d0a367a6969ea1cbda860bc770ffcb9b80660e9442ae4543004ee6c");
  body.set("grant_type", "password");
  body.set("scope", "*");

  return poster<PostAuthTokenResponse>("oauth/token", {
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
