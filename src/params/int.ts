import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param:string) => {
  return /^\d+$/.test(param) && Number(param) > 0;
}) satisfies ParamMatcher;
