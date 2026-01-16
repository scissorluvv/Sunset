import type { PostAuthTokenData, PostAuthTokenResponse } from "@/lib/types/api";
import poster from "@/lib/services/poster";

import useSWRMutation from "swr/mutation";

export function useAuthorize() {
  return useSWRMutation("user/self", authorize);
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
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
}
