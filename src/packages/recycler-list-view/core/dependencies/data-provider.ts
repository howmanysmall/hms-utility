//!native
//!optimize 2

/***
 * You can create a new instance or inherit and override default methods
 * Allows access to data and size. Clone with rows creates a new data provider and let listview know where to calculate row layout from.
 */
export abstract class BaseDataProvider {
	public rowHasChanged: (r1: unknown, r2: unknown) => boolean;

	// In JS context make sure stable id is a string
	public getStableId: (index: number) => string;

	private _firstIndexToProcess = 0;
	private _size = 0;
	private _data = new Array<unknown>();
	private _hasStableIds = false;
	private _requiresDataChangeHandling = false;

	constructor(rowHasChanged: (r1: unknown, r2: unknown) => boolean, getStableId?: (index: number) => string) {
		this.rowHasChanged = rowHasChanged;
		if (getStableId) {
			this.getStableId = getStableId;
			this._hasStableIds = true;
		} else this.getStableId = tostring;
	}

	public abstract newInstance(
		rowHasChanged: (r1: unknown, r2: unknown) => boolean,
		getStableId?: (index: number) => string,
	): BaseDataProvider;

	public getDataForIndex(index: number): unknown {
		return this._data[index];
	}

	public getAllData(): Array<unknown> {
		return this._data;
	}

	public getSize(): number {
		return this._size;
	}

	public hasStableIds(): boolean {
		return this._hasStableIds;
	}

	public requiresDataChangeHandling(): boolean {
		return this._requiresDataChangeHandling;
	}

	public getFirstIndexToProcessInternal(): number {
		return this._firstIndexToProcess;
	}

	//No need to override this one
	//If you already know the first row where rowHasChanged will be false pass it upfront to avoid loop
	public cloneWithRows(newData: Array<unknown>, firstModifiedIndex?: number): DataProvider {
		const dp = this.newInstance(this.rowHasChanged, this.getStableId);
		const newSize = newData.size();
		const iterCount = math.min(this._size, newSize);
		if (firstModifiedIndex === undefined) {
			let index = 0;
			for (index = 0; index < iterCount; index += 1)
				if (this.rowHasChanged(this._data[index], newData[index])) break;

			dp._firstIndexToProcess = index;
		} else dp._firstIndexToProcess = math.clamp(firstModifiedIndex, 0, this._data.size());

		if (dp._firstIndexToProcess !== this._data.size()) dp._requiresDataChangeHandling = true;

		dp._data = newData;
		dp._size = newSize;
		return dp;
	}
}

export default class DataProvider extends BaseDataProvider {
	public newInstance(
		rowHasChanged: (r1: unknown, r2: unknown) => boolean,
		getStableId?: ((index: number) => string) | undefined,
	): BaseDataProvider {
		return new DataProvider(rowHasChanged, getStableId);
	}
}
