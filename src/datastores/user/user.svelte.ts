import { Datastore } from "$core/datastore/datastore.svelte";
import type { User } from "./user.type";

export class UserCollection extends Datastore<User> {
}