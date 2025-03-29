import { Datastore } from "$core/datastore/datastore.svelte";
import { StudentBackend } from "./student-backend";
import type { Student } from "./student.type";

export const StudentDatastore = new Datastore<Student>(new StudentBackend());
