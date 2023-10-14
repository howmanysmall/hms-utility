--!native
--!optimize 2
--!strict
local Memoize = require(script:FindFirstChild("Memoize"))
local Vector2 = setmetatable({}, {__index = Vector2})

Vector2.fromEqual = Memoize(function(Value: number)
	return Vector2.one * Value
end)

Vector2.fromX = Memoize(function(Value: number)
	return Vector2.xAxis * Value
end)

Vector2.fromY = Memoize(function(Value: number)
	return Vector2.yAxis * Value
end)

Vector2.fromVector3 = Memoize(function(Value: Vector3)
	return Vector2.new(Value.X, Value.Z)
end)

Vector2.fromVector3XY = Memoize(function(Value: Vector3)
	return Vector2.new(Value.X, Value.Y)
end)

function Vector2.fromVector3NoCache(Value: Vector3)
	return Vector2.new(Value.X, Value.Z)
end

function Vector2.fromVector3XYNoCache(Value: Vector3)
	return Vector2.new(Value.X, Value.Y)
end

Vector2.center = Vector2.fromEqual(0.5)
Vector2.infinity = Vector2.fromEqual(math.huge)

return Vector2
