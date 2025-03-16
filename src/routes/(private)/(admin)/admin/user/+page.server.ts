import { z as validation } from 'zod';
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { UserDatastore } from '$datastores/user/user.svelte';

const userSearchSchema = validation.object({
  field: validation.string(),
  operator: validation.string(),
  value: validation.string().min(8),
});

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const userSearchForm = await superValidate(event, zod(userSearchSchema));
  const userCollection = await UserDatastore.get({page: 1, page_size: 20}) || { value: [] };

  return {
    form: userSearchForm,
    users: userCollection?.value,
  };
};