import type { Equipment } from "./equipment.type";
import { Datastore } from "$core/datastore/datastore.svelte";
import { EquipmentBackend } from "./equipment-backend";

export const EquipmentDatastore = new Datastore<Equipment>(new EquipmentBackend());