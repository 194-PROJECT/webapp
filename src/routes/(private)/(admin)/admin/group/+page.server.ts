import type { Actions, PageServerLoad, PageServerLoadEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ReservationDatastore } from '$datastores/reservation/reservation.svelte';
import type { RequestEvent } from './$types';
import { getModelSchema } from '$core/helpers/request';
import { error, fail } from '@sveltejs/kit';
import { UserDatastore } from '$datastores/user/user.svelte';
import { Operator } from '$core/backend/request.type';
import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';
import { z as validation } from 'zod';
import { ClassDatastore } from '$datastores/class/class.svelte';
import { GroupDatastore } from '$datastores/group/group.svelte';
import { GroupTransformer } from '$datastores/group/group.transformer';
import { SemesterDatastore } from '$datastores/semester/semester.svelte';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	const groupGetPageForm = await superValidate(event.url.searchParams, zod(getModelSchema));

  if (!groupGetPageForm.valid) {
    return {
      form: groupGetPageForm,
      error: 'Invalid form data'
    };
  }

	const groupCollection = await GroupDatastore.get({
    field: groupGetPageForm.data.field,
    operator: groupGetPageForm.data.operator,
    value: groupGetPageForm.data.value,
		page: Number(groupGetPageForm.data.pageIndex),
		page_size: Number(groupGetPageForm.data.pageSize)
	});

  const classCollection = await ClassDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: groupCollection.value?.map((group) => group.classId).filter(
      (value) => value !== undefined
    ),
  });

  const semesterCollection = await SemesterDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: classCollection.value?.map((class_) => class_.semesterId).filter(
      (value) => value !== undefined
    ),
  });

  const instructorCollection = await UserDatastore.get({
    field: 'id',
    operator: Operator.IN,
    value: classCollection.value?.map((class_) => class_.instructorId).filter(
      (value) => value !== undefined
    ),
  });

  const data = groupCollection.value?.map((group) => {
    const class_ = classCollection.value?.find((class_) => class_.id === group.classId);
    const semester = semesterCollection.value?.find((semester) => semester.id === class_?.semesterId);
    const instructor = instructorCollection.value?.find((instructor) => instructor.id === class_?.instructorId);
    return {
      group: group,
      class: class_,
      semester,
      instructor,
    };
  });

	return {
    form: groupGetPageForm,
    groupData: data,
    rowCount: groupCollection.totalRows ?? 0,
	};
};

/**
 * Actions for handling form submissions related to groups.
 */
export const actions: Actions = {
  getPageData,
};

/**
 * Fetches the data for the group page.
 * @param event The request event.
 * @returns The group page data.
 */
async function getPageData(event: RequestEvent) {
  const request = await event.request.json();
  const groupGetPageForm = await superValidate(request, zod(getModelSchema));

  if (!groupGetPageForm.valid) {
    return fail(401, {
      form: groupGetPageForm,
      error: 'Invalid form data',
    });
  }

  const url = `${event.url.pathname}?${new URLSearchParams(groupGetPageForm.data).toString()}`;

  return {
    success: true,
    redirect: url,
    ...message(groupGetPageForm, 'Group page data fetch successful'),
  };
}
