--!native
--!optimize 2
--!strict
local Memoize = require(script:FindFirstChild("Memoize"))

local UDim2 = setmetatable({}, {__index = UDim2})

UDim2.offset = Memoize(function(value: number)
	return UDim2.fromOffset(value, value)
end)

function UDim2.offsetFromVector2(value: Vector2)
	return UDim2.fromOffset(value.X, value.Y)
end

UDim2.offsetFromVector2Cached = Memoize(function(value: Vector2)
	return UDim2.fromOffset(value.X, value.Y)
end)

UDim2.scale = Memoize(function(value: number)
	return UDim2.fromScale(value, value)
end)

function UDim2.scaleFromVector2(value: Vector2)
	return UDim2.fromScale(value.X, value.Y)
end

UDim2.scaleFromVector2Cached = Memoize(function(value: Vector2)
	return UDim2.fromScale(value.X, value.Y)
end)

UDim2.zero = UDim2.new()

UDim2.centerScale = UDim2.scale(0.5)
UDim2.oneScale = UDim2.scale(1)
UDim2.xScale = UDim2.fromScale(1, 0)
UDim2.yScale = UDim2.fromScale(0, 1)

UDim2.oneOffset = UDim2.offset(1)
UDim2.xOffset = UDim2.fromOffset(1, 0)
UDim2.yOffset = UDim2.fromOffset(0, 1)

return UDim2
