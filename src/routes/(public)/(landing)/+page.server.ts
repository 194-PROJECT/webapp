import { defaultRedirect } from '$core/auth/auth.type';
import { redirect } from '@sveltejs/kit';

export const load = (event) => {
  if (event.locals.user) {
    return redirect(302, defaultRedirect[event.locals.user.role]);
  }

  if (!event.locals.session || !event.locals.user) {
    return redirect(302, '/login');
  }

  return {};
};
