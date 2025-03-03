import { Datastore } from "$core/datastore/datastore.svelte";
import type { Asset } from "./asset.model";

export class AssetCollection extends Datastore<Asset> {
}