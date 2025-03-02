import { Datastore } from "$core/datastore/datastore.svelte";
import type { User } from "./user.model";

export class UserCollection extends Datastore<User> {
}