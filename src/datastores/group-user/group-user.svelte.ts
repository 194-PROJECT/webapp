import { Datastore } from '$core/datastore/datastore.svelte';
import { GroupUserBackend } from './group-user-backend';
import type { GroupUser } from './group-user.type';

export const GroupUserDatastore = new Datastore<GroupUser>(
  new GroupUserBackend()
);
