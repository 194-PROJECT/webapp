import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { UserRole } from '$core/auth/auth.type';

const adminUserRoleAllowed = [UserRole.ADMIN];

export const load: LayoutServerLoad = ({ locals, url }) => {
  const user = locals.user;
  const session = locals.session;

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!adminUserRoleAllowed.includes(user.role)) {
    redirect(307, '/');
  }

  return {};
};
