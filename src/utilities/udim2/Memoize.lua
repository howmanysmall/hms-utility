--!optimize 2
--!strict
export type MemoizeFunction<T, U> = (Index: T) -> U

local function Memoize<T, U>(Function: MemoizeFunction<T, U>)
	local Metatable = {}
	function Metatable:__call(Index: T): U
		return self[Index]
	end

	function Metatable:__index(Index: T): U
		local Value = Function(Index)
		self[Index] = Value
		return Value
	end

	return setmetatable({} :: {[T]: U}, Metatable)
end

return Memoize
