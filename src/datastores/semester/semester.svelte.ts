import { Datastore } from "$core/datastore/datastore.svelte";
import { SemesterBackend } from "./semester-backend";
import type { Semester } from "./semester.type";

export const SemesterDatastore = new Datastore<Semester>(new SemesterBackend());
