import type { EquipmentImage } from "./equipment-image.type";
import { Datastore } from "$core/datastore/datastore.svelte";
import { EquipmentImageBackend } from "./equipment-image-backend";

export const EquipmentImageDatastore = new Datastore<EquipmentImage>(new EquipmentImageBackend());
