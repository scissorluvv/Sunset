import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostAuthTokenResponse, TokenRequest } from "@/lib/types/api";

type TokenRequestWithTurnstile = TokenRequest & {
  cf_turnstile_response?: string;
};

export function useAuthorize() {
  return useSWRMutation("api/v2/me/", authorize);
}

async function authorize(_key: string, { arg }: { arg: TokenRequestWithTurnstile | undefined }) {
  if (!arg)
    throw new Error("Missing token request body");

  const body = new URLSearchParams();

  for (const [k, v] of Object.entries(arg)) {
    if (v == null)
      continue;

    body.set(k, String(v));
  }

  // force your web client creds (optional, if not already in arg)
  body.set("client_id", "6");
  body.set("client_secret", process.env.NEXT_PUBLIC_OSU_WEB_CLIENT_SECRET ?? "");
  body.set("grant_type", "password");
  body.set("scope", "*");

  return poster<PostAuthTokenResponse>("oauth/token", {
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
