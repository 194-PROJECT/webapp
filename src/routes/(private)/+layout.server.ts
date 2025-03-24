import { redirect } from '@sveltejs/kit';
import type { LayoutRouteId, LayoutServerLoad } from './$types';
import { Roles } from '$core/auth/auth.type';

const privateRoute = '(private)'

const routeRoleAccess = {
  [`/${privateRoute}/(admin)`]: [Roles.ADMIN],
  [`/${privateRoute}/(app)`]: [Roles.ADMIN, Roles.USER, Roles.GUEST]
}

export const load: LayoutServerLoad = ({ locals, url, route }) => {
  const breadcrumbs = getBreadcrumbs(url.pathname);
  const user = locals.user;
  const session = locals.session;
  const roles = getRouteRoleAccess(route);

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!roles.includes(user.role)) {
    redirect(307, '/');
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

const getRouteRoleAccess = (currentRoute: {id: LayoutRouteId}): Roles[] => {
  for (const route of Object.keys(routeRoleAccess) as Array<keyof typeof routeRoleAccess>) {
    if (currentRoute.id.startsWith(route)) {
      return routeRoleAccess[route];
    }
  }

  return [];
}