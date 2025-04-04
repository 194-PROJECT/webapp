import { Datastore } from '$core/datastore/datastore.svelte';
import { ProgramBackend } from './program-backend';
import type { Program } from './program.type';

export const ProgramDatastore = new Datastore<Program>(new ProgramBackend());
