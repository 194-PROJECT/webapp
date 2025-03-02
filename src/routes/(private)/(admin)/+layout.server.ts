import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const rolesAllowed = ['admin'];

export const load: LayoutServerLoad = ({ cookies, locals, params, request, route, url }) => {
	const breadcrumbs = getBreadcrumbs(url.pathname);
  const user = locals.user;
  const session = locals.session;

  if(!user || !session) {
    redirect(307, '/login');
  }

	return {
		breadcrumbs: breadcrumbs,
    url: url.pathname,
    user: user
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
