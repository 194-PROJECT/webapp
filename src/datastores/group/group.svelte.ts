import { Datastore } from '$core/datastore/datastore.svelte';
import { GroupBackend } from './group-backend';
import type { Group } from './group.type';

export const GroupDatastore = new Datastore<Group>(new GroupBackend());
