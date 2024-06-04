//!native
//!optimize 2

interface PseudoSet {
	[key: string]: string;
}
interface NullablePseudoSet {
	[key: string]: string | undefined;
}

export default class RecycleItemPool {
	public putRecycledObject(objectType: number | string, object: string) {
		objectType = tostring(objectType);
		const objectSet = this.getRelevantSet(objectType);
		if (!this.availabilitySet[object]) {
			delete objectSet[object];
			this.availabilitySet[object] = objectType;
		}
	}

	public getRecycledObject(objectType: number | string): string | undefined {
		objectType = tostring(objectType);

		const objectSet = this.getRelevantSet(objectType);
		let recycledObject: string | undefined;
		for (const [property] of objectSet as never as Map<string, unknown>) {
			if (property in objectSet) {
				recycledObject = property;
				break;
			}
		}

		if (recycledObject) {
			delete objectSet[recycledObject];
			delete this.availabilitySet[recycledObject];
		}

		return recycledObject;
	}

	public removeFromPool(object: string) {
		if (this.availabilitySet[object]) {
			delete this.getRelevantSet(this.availabilitySet[object])[object];
			delete this.availabilitySet[object];
			return true;
		}
		return false;
	}

	public clearAll() {
		this.recyclableObjectMap = {};
		this.availabilitySet = {};
	}

	private availabilitySet: PseudoSet = {};
	private recyclableObjectMap: { [key: string]: NullablePseudoSet } = {};

	private getRelevantSet(objectType: string): NullablePseudoSet {
		let objectSet = this.recyclableObjectMap[objectType];
		if (!objectSet) this.recyclableObjectMap[objectType] = objectSet = {};
		return objectSet;
	}
}
