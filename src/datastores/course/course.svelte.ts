import type { Course } from './course.type';
import { CourseBackend } from './course-backend';
import { Datastore } from '$core/datastore/datastore.svelte';

export const CourseDatastore = new Datastore<Course>(new CourseBackend());
