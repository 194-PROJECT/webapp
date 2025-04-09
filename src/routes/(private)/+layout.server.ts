import { redirect } from '@sveltejs/kit';
import type { LayoutRouteId, LayoutServerLoad } from './$types';
import { UserRole } from '$core/auth/auth.type';

const privateRoute = '(private)'

const routeRoleAccess = {
  [`/${privateRoute}/(admin)`]: [UserRole.ADMIN],
  [`/${privateRoute}/(app)`]: [UserRole.ADMIN, UserRole.USER, UserRole.GUEST]
}

export const load: LayoutServerLoad = ({ locals, url, route }) => {
  const breadcrumbs = getBreadcrumbs(url.pathname);
  const user = locals.user;
  const session = locals.session;
  const UserRole = getRouteRoleAccess(route);

  if(!user || !session) {
    redirect(307, '/login');
  }

  if (!UserRole.includes(user.role)) {
    redirect(307, '/');
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

const getRouteRoleAccess = (currentRoute: {id: LayoutRouteId}): UserRole[] => {
  for (const route of Object.keys(routeRoleAccess) as Array<keyof typeof routeRoleAccess>) {
    if (currentRoute.id.startsWith(route)) {
      return routeRoleAccess[route];
    }
  }

  return [];
}
