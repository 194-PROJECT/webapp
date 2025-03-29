import { defaultRedirect } from "$core/auth/auth.type";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad, LayoutServerLoadEvent } from './$types';

export const load: LayoutServerLoad = async (event: LayoutServerLoadEvent) => {
  if (event.locals.user != null) {
    return redirect(302, defaultRedirect[event.locals.user.role]);
  }

  // Redirect to logout if session is null
  if (event.locals.session === null) {
    return redirect(302, '/logout');
  }

  // We're currently not checking anything yet
  return {};
};