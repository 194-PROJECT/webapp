import type { Class } from './class.type';
import { Datastore } from '$core/datastore/datastore.svelte';
import { ClassBackend } from './class-backend';

export const ClassDatastore = new Datastore<Class>(new ClassBackend());
