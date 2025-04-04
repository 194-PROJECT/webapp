import { Datastore } from '$core/datastore/datastore.svelte';
import { DepartmentBackend } from './department-backend';
import type { Department } from './department.type';

export const DepartmentDatastore = new Datastore<Department>(new DepartmentBackend());
