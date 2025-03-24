import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { Roles } from '$core/auth/auth.type';

const adminRolesAllowed = [Roles.ADMIN];

export const load: LayoutServerLoad = ({ locals, url }) => {
  const user = locals.user;
  const session = locals.session;

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!adminRolesAllowed.includes(user.role)) {
    redirect(307, '/');
  }
};