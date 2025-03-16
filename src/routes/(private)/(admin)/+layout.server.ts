import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { Roles } from '$core/auth/auth.type';

const adminRolesAllowed = [Roles.ADMIN];

export const load: LayoutServerLoad = ({ locals, url }) => {
	const breadcrumbs = getBreadcrumbs(url.pathname);
  const user = locals.user;
  const session = locals.session;

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!adminRolesAllowed.includes(user.role)) {
    redirect(307, '/');
  }

	return {
		breadcrumbs: breadcrumbs,
    url: url.pathname,
    user: user,
	};
};

const getBreadcrumbs = (pathname: string) => {
  return pathname
    .split('/')
    .slice(1)
    .map((part, i, parts) => ({
      name: part,
      href: '/' + parts.slice(0, i + 1).join('/')
    }));
}