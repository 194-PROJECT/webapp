import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import AuthService from '$core/auth/auth.service';

export const load: LayoutServerLoad = ({ locals, url, route }) => {
  const breadcrumbs = getBreadcrumbs(url.pathname);
  const user = locals.user;
  const session = locals.session;

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!AuthService.hasAccess(route, user)) {
    redirect(307, '/dashboard');
  }

  return {
    breadcrumbs: breadcrumbs,
    url: url.pathname,
    authUser: user
  };
};

const getBreadcrumbs = (pathname: string) => {
  return pathname
    .split('/')
    .slice(1)
    .filter(part => isNaN(Number(part)))
    .map((part, i, parts) => ({
      name: part,
      href: '/' + parts.slice(0, i + 1).join('/')
    }));
}
