//!native
//!optimize 2

import CustomError from "classes/custom-error";
import { ArrayUtils } from "packages/luau-polyfill";
import type { Dimension, LayoutProvider } from "../dependencies/layout-provider";

/***
 * Computes the positions and dimensions of items that will be rendered by the list. The output from this is utilized by viewability tracker to compute the
 * lists of visible/hidden item.
 */
export abstract class LayoutManager {
	public getOffsetForIndex(index: number): Point {
		const layouts = this.getLayouts();
		if (layouts.size() > index) return { x: layouts[index].x, y: layouts[index].y };

		throw new CustomError({
			message: `No layout available for index: ${index}`,
			type: "LayoutUnavailableException",
		});
	}

	//You can ovveride this incase you want to override style in some cases e.g, say you want to enfore width but not height
	public getStyleOverridesForIndex(index: number): object | undefined {
		return undefined;
	}

	//Return the dimension of entire content inside the list
	public abstract getContentDimension(): Dimension;

	//Return all computed layouts as an array, frequently called, you are expected to return a cached array. Don't compute here.
	public abstract getLayouts(): Array<Layout>;

	//RLV will call this method in case of mismatch with actual rendered dimensions in case of non deterministic rendering
	//You are expected to cache this value and prefer it over estimates provided
	//No need to relayout which RLV will trigger. You should only relayout when relayoutFromIndex is called.
	//Layout managers can choose to ignore the override requests like in case of grid layout where width changes
	//can be ignored for a vertical layout given it gets computed via the given column span.
	public abstract overrideLayout(index: number, dim: Dimension): boolean;

	//Recompute layouts from given index, compute heavy stuff should be here
	public abstract relayoutFromIndex(startIndex: number, itemCount: number): void;
}

export class WrapGridLayoutManager extends LayoutManager {
	private _layoutProvider: LayoutProvider;
	private _window: Dimension;
	private _totalHeight: number;
	private _totalWidth: number;
	private _isHorizontal: boolean;
	private _layouts: Array<Layout>;

	public constructor(
		layoutProvider: LayoutProvider,
		renderWindowSize: Dimension,
		isHorizontal = false,
		cachedLayouts?: Array<Layout>,
	) {
		super();
		this._layoutProvider = layoutProvider;
		this._window = renderWindowSize;
		this._totalHeight = 0;
		this._totalWidth = 0;
		this._isHorizontal = !!isHorizontal;
		this._layouts = cachedLayouts ?? [];
	}

	public getContentDimension(): Dimension {
		return { height: this._totalHeight, width: this._totalWidth };
	}

	public getLayouts(): Array<Layout> {
		return this._layouts;
	}

	public getOffsetForIndex(index: number): Point {
		if (this._layouts.size() > index) return { x: this._layouts[index].x, y: this._layouts[index].y };

		throw new CustomError({
			message: `No layout available for index: ${index}`,
			type: "LayoutUnavailableException",
		});
	}

	public overrideLayout(index: number, dim: Dimension): boolean {
		const layout = this._layouts[index];
		if (layout) {
			layout.isOverridden = true;
			layout.width = dim.width;
			layout.height = dim.height;
		}

		return true;
	}

	public setMaxBounds(itemDim: Dimension): void {
		if (this._isHorizontal) itemDim.height = math.min(this._window.height, itemDim.height);
		else itemDim.width = math.min(this._window.width, itemDim.width);
	}

	//TODO:Talha laziliy calculate in future revisions
	public relayoutFromIndex(startIndex: number, itemCount: number): void {
		startIndex = this._locateFirstNeighbourIndex(startIndex);
		let startX = 0;
		let startY = 0;
		let maxBound = 0;

		const startValue = this._layouts[startIndex];

		if (startValue) {
			startX = startValue.x;
			startY = startValue.y;
			this._pointDimensionsToRect(startValue);
		}

		const oldItemCount = this._layouts.size();
		const itemDim = { height: 0, width: 0 };
		let itemRect = undefined;

		let oldLayout = undefined;

		for (let index = startIndex; index < itemCount; index++) {
			oldLayout = this._layouts[index];
			const layoutType = this._layoutProvider.getLayoutTypeForIndex(index);
			if (oldLayout?.isOverridden && oldLayout.type === layoutType) {
				itemDim.height = oldLayout.height;
				itemDim.width = oldLayout.width;
			} else this._layoutProvider.setComputedLayout(layoutType, itemDim, index);

			this.setMaxBounds(itemDim);
			while (!this._checkBounds(startX, startY, itemDim, this._isHorizontal)) {
				if (this._isHorizontal) {
					startX += maxBound;
					startY = 0;
					this._totalWidth += maxBound;
				} else {
					startX = 0;
					startY += maxBound;
					this._totalHeight += maxBound;
				}

				maxBound = 0;
			}

			maxBound = this._isHorizontal ? math.max(maxBound, itemDim.width) : math.max(maxBound, itemDim.height);

			//TODO: Talha creating array upfront will speed this up
			if (index > oldItemCount - 1)
				this._layouts.push({
					height: itemDim.height,
					type: layoutType,
					width: itemDim.width,
					x: startX,
					y: startY,
				});
			else {
				itemRect = this._layouts[index];
				itemRect.x = startX;
				itemRect.y = startY;
				itemRect.type = layoutType;
				itemRect.width = itemDim.width;
				itemRect.height = itemDim.height;
			}

			if (this._isHorizontal) startY += itemDim.height;
			else startX += itemDim.width;
		}

		if (oldItemCount > itemCount) ArrayUtils.splice(this._layouts, itemCount + 1, oldItemCount - itemCount);

		this._setFinalDimensions(maxBound);
	}

	private _pointDimensionsToRect(itemRect: Layout): void {
		if (this._isHorizontal) this._totalWidth = itemRect.x;
		else this._totalHeight = itemRect.y;
	}

	private _setFinalDimensions(maxBound: number): void {
		if (this._isHorizontal) {
			this._totalHeight = this._window.height;
			this._totalWidth += maxBound;
		} else {
			this._totalWidth = this._window.width;
			this._totalHeight += maxBound;
		}
	}

	private _locateFirstNeighbourIndex(startIndex: number): number {
		if (startIndex === 0) return 0;

		let index = startIndex - 1;
		for (; index >= 0; index -= 1)
			if (this._isHorizontal) {
				if (this._layouts[index].y === 0) break;
			} else if (this._layouts[index].x === 0) break;

		return index;
	}

	private _checkBounds(itemX: number, itemY: number, itemDim: Dimension, isHorizontal: boolean): boolean {
		return isHorizontal
			? itemY + itemDim.height <= this._window.height
			: itemX + itemDim.width <= this._window.width;
	}
}

export interface Layout extends Dimension, Point {
	isOverridden?: boolean;
	type: number | string;
}
export interface Point {
	x: number;
	y: number;
}
