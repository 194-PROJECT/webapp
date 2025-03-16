import { Datastore } from "$core/datastore/datastore.svelte";
import { UserBackend } from "./user-backend";
import type { User } from "./user.type";

export const UserDatastore = new Datastore<User>(new UserBackend());