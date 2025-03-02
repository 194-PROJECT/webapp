import { redirect } from '@sveltejs/kit';
import type { PageServerLoadEvent } from './$types';

import AuthService from '$core/auth/auth.service';

const baseRedirect = '/login';

/**
 * Load function to handle the initial page load.
 * Logs out the user if they are already logged in.
 *
 * @param event - The page server load event.
 * @returns An object containing the form data.
 */
export const load = async (event: PageServerLoadEvent) => {
  if (event.locals.session != null && event.locals.user != null) {
    await AuthService.logout(event);
  }

  redirect(302, baseRedirect);
};
