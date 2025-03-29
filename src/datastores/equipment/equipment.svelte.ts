import { Datastore } from "$core/datastore/datastore.svelte";
import { EquipmentBackend } from "./equipment-backend";
import type { Equipment } from "./equipment.type";

export const EquipmentDatastore = new Datastore<Equipment>(new EquipmentBackend());
