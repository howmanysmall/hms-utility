//!native
//!optimize 2

import { WrapGridLayoutManager, type Layout, type LayoutManager } from "../layout-manager/layout-manager";

export abstract class BaseLayoutProvider {
	//Unset if your new layout provider doesn't require firstVisibleIndex preservation on application
	public shouldRefreshWithAnchoring = true;

	//Return your layout manager, you get all required dependencies here. Also, make sure to use cachedLayouts. RLV might cache layouts and give back to
	//in cases of conxtext preservation. Make sure you use them if provided.
	public abstract newLayoutManager(
		renderWindowSize: Dimension,
		isHorizontal?: boolean,
		cachedLayouts?: Array<Layout>,
	): LayoutManager;

	//Given an index a provider is expected to return a view type which used to recycling choices
	public abstract getLayoutTypeForIndex(index: number): number | string;

	//Check if given dimension contradicts with your layout provider, return true for mismatches. Returning true will
	//cause a relayout to fix the discrepancy
	public abstract checkDimensionDiscrepancy(
		dimension: Dimension,
		layoutType: number | string,
		index: number,
	): boolean;
}

export class LayoutProvider extends BaseLayoutProvider {
	private tempDim: Dimension;
	private lastLayoutManager?: WrapGridLayoutManager;

	constructor(
		private _getLayoutTypeForIndex: (index: number) => number | string,
		private _setLayoutForType: (layoutType: number | string, dim: Dimension, index: number) => void,
	) {
		super();
		this.tempDim = { height: 0, width: 0 };
	}

	public newLayoutManager(
		renderWindowSize: Dimension,
		isHorizontal?: boolean,
		cachedLayouts?: Array<Layout>,
	): LayoutManager {
		this.lastLayoutManager = new WrapGridLayoutManager(this, renderWindowSize, isHorizontal, cachedLayouts);
		return this.lastLayoutManager;
	}

	//Provide a type for index, something which identifies the template of view about to load
	public getLayoutTypeForIndex(index: number): number | string {
		return this._getLayoutTypeForIndex(index);
	}

	//Given a type and dimension set the dimension values on given dimension object
	//You can also get index here if you add an extra argument but we don't recommend using it.
	public setComputedLayout(layoutType: number | string, dimension: Dimension, index: number): void {
		// biome-ignore lint/correctness/noVoidTypeReturn: shut up
		return this._setLayoutForType(layoutType, dimension, index);
	}

	public checkDimensionDiscrepancy(dimension: Dimension, layoutType: number | string, index: number): boolean {
		const dimension1 = dimension;
		this.setComputedLayout(layoutType, this.tempDim, index);
		const dimension2 = this.tempDim;
		if (this.lastLayoutManager) this.lastLayoutManager.setMaxBounds(dimension2);

		return dimension1.height !== dimension2.height || dimension1.width !== dimension2.width;
	}
}

export interface Dimension {
	height: number;
	width: number;
}
