export default function smoothNoOutlines(basePart: BasePart) {
	basePart.TopSurface = Enum.SurfaceType.SmoothNoOutlines;
	basePart.BottomSurface = Enum.SurfaceType.SmoothNoOutlines;
	basePart.FrontSurface = Enum.SurfaceType.SmoothNoOutlines;
	basePart.BackSurface = Enum.SurfaceType.SmoothNoOutlines;
	basePart.LeftSurface = Enum.SurfaceType.SmoothNoOutlines;
	basePart.RightSurface = Enum.SurfaceType.SmoothNoOutlines;
}
