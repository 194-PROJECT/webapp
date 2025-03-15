import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

const protectedGroups = ['(private)'];

const handleAuthentication: Handle = async ({ event, resolve }) => {
  console.log('ROUTE:', event.route.id);
  const sessionCookie = event.cookies.get('session');
  const userCookie = event.cookies.get('user');

  if (sessionCookie) event.locals.session = JSON.parse(sessionCookie);
  if (userCookie) event.locals.user = JSON.parse(userCookie);

	const isProtectedGroup = protectedGroups.some((group) => {
		return event.route.id?.slice(1).startsWith(group);
	});

	if (isProtectedGroup && event.locals.session == null) {
		redirect(307, '/login');
	}

	const response = await resolve(event);
	return response;
};

const handleParaglide: Handle = i18n.handle();

export const handle: Handle = sequence(
  handleParaglide,
  handleAuthentication,
);
