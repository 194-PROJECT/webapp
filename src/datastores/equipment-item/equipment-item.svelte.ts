import { Datastore } from '$core/datastore/datastore.svelte';
import { EquipmentItemBackend } from './equipment-item-backend';
import type { EquipmentItem } from './equipment-item.type';

export const EquipmentItemDatastore = new Datastore<EquipmentItem>(new EquipmentItemBackend());
