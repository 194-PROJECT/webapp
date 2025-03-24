import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { UserDatastore } from '$datastores/user/user.svelte';
import type { RequestEvent } from './$types';
import { getModelSchema } from '$core/helpers/request';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const userGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!userGetPageForm.valid) {
    return {
      form: userGetPageForm,
      error: 'Invalid form data'
    };
  }

	const userCollection = await UserDatastore.get({
    field: userGetPageForm.data.field,
    operator: userGetPageForm.data.operator,
    value: userGetPageForm.data.value,
		page: Number(userGetPageForm.data.pageIndex),
		page_size: Number(userGetPageForm.data.pageSize)
	});

	return {
		form: userGetPageForm,
		users: userCollection.value ?? [],
    rowCount: userCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions.
 */
export const actions: Actions = { getPageData };

async function getPageData(event: RequestEvent) {
	const userGetPageForm = await superValidate(event, zod(getModelSchema));

	if (!userGetPageForm.valid) {
		return message(userGetPageForm, 'user page data fetch failed');
	}

  const url = `${event.url.pathname}?${new URLSearchParams(userGetPageForm.data).toString()}`;

  return {
    success: true,
    form: userGetPageForm,
    redirect: url,
    ...message(userGetPageForm, 'user page data fetch successful')
  };
}
