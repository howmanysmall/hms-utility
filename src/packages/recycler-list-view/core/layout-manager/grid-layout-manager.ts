//!native
//!optimize 2

import { Error } from "packages/luau-polyfill";
import type { Dimension, LayoutProvider } from "../dependencies/layout-provider";
import { WrapGridLayoutManager, type Layout } from "./layout-manager";

export default class GridLayoutManager extends WrapGridLayoutManager {
	public constructor(
		layoutProvider: LayoutProvider,
		private renderWindowSize: Dimension,
		private getSpan: (index: number) => number,
		maxSpan: number,
		acceptableRelayoutDelta: number,
		isHorizontal = false,
		cachedLayouts: Array<Layout> = [],
	) {
		super(layoutProvider, renderWindowSize, isHorizontal, cachedLayouts);
		this.isGridHorizontal = isHorizontal;

		if (acceptableRelayoutDelta < 0) throw new Error("acceptableRelayoutDelta cannot be less than 0");
		this.acceptableRelayoutDelta = acceptableRelayoutDelta;

		if (maxSpan <= 0) throw new Error("Max Column Span cannot be less than or equal to 0");
		this.maxSpan = maxSpan;
	}

	public overrideLayout(index: number, dim: Dimension) {
		const layout = this.getLayouts()[index];
		const heightDiff = math.abs(dim.height - layout.height);
		const widthDiff = math.abs(dim.width - layout.width);

		if (layout) {
			if (this.isGridHorizontal) {
				if (heightDiff < this.acceptableRelayoutDelta) {
					if (widthDiff === 0) return false;
					dim.height = layout.height;
				}
			} else {
				if (widthDiff < this.acceptableRelayoutDelta) {
					if (heightDiff === 0) return false;
					dim.width = layout.width;
				}
			}
		}

		return super.overrideLayout(index, dim);
	}

	public getStyleOverridesForIndex(index: number): Array<unknown> | object | undefined {
		const columnSpanForIndex = this.getSpan(index);
		return this.isGridHorizontal
			? { height: (this.renderWindowSize.height / this.maxSpan) * columnSpanForIndex }
			: { width: (this.renderWindowSize.width / this.maxSpan) * columnSpanForIndex };
	}

	private acceptableRelayoutDelta: number;
	private isGridHorizontal: boolean;
	private maxSpan: number;
}
