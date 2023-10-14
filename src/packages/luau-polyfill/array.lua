--!native
--!optimize 2
--- @typecheck mode: nocheck
local ERRORS_ARE_THROWN = true

type Array<T> = {T}

type callbackFn<T> = (element: T, index: number, array: Array<T>) -> boolean
type callbackFnWithThisArg<T, U> = (self: U, element: T, index: number, array: Array<T>) -> boolean
type Object = {[string]: any}

local function every<T, U>(t: Array<T>, callback: callbackFn<T> | callbackFnWithThisArg<T, U>, thisArg: U?): boolean
	if type(t) ~= "table" then
		error(string.format("Array.every called on %s", typeof(t)))
	end

	if type(callback) ~= "function" then
		error("callback is not a function")
	end

	local len = #t
	local k = 1

	while k <= len do
		local kValue = t[k]
		local testResult

		if kValue ~= nil then
			if thisArg ~= nil then
				testResult = (callback :: callbackFnWithThisArg<T, U>)(thisArg, kValue, k, t)
			else
				testResult = (callback :: callbackFn<T>)(kValue, k, t)
			end

			if not testResult then
				return false
			end
		end

		k += 1
	end

	return true
end

local function filter<T, U>(t: Array<T>, callback: callbackFn<T> | callbackFnWithThisArg<T, U>, thisArg: U?): Array<T>
	if type(t) ~= "table" then
		error(string.format("Array.filter called on %s", typeof(t)))
	end

	if type(callback) ~= "function" then
		error("callback is not a function")
	end

	local len = #t
	local res = {}
	local index = 1

	if thisArg == nil then
		for i = 1, len do
			local kValue = t[i]
			if kValue ~= nil then
				if (callback :: callbackFn<T>)(kValue, i, t) then
					res[index] = kValue
					index += 1
				end
			end
		end
	else
		for i = 1, len do
			local kValue = t[i]
			if kValue ~= nil then
				if (callback :: callbackFnWithThisArg<T, U>)(thisArg, kValue, i, t) then
					res[index] = kValue
					index += 1
				end
			end
		end
	end

	return res
end

type PredicateFunction<T> = (value: T, index: number, array: Array<T>) -> boolean
local function find<T>(array: Array<T>, predicate: PredicateFunction<T>): T | nil
	for i = 1, #array do
		local element = array[i]
		if predicate(element, i, array) then
			return element
		end
	end

	return nil
end

local function isArray(value: any)
	if type(value) ~= "table" then
		return false
	end

	if next(value) == nil then
		return true
	end

	local length = #value
	if length == 0 then
		return false
	end

	local count = 0
	local sum = 0

	for key in pairs(value) do
		if type(key) ~= "number" or key % 1 ~= 0 or key < 1 then
			return false
		end

		count += 1
		sum += key
	end

	return sum == count * (count + 1) / 2
end

local CONCAT_BAD_OBJECT = "Array.concat(...) only works with array-like tables but "
	.. "it received an object-like table.\nYou can avoid this error by wrapping the "
	.. "object-like table into an array. Example: `concat({1, 2}, {a = true})` should "
	.. "be `concat({1, 2}, { {a = true} }`"

local function concat<T, S>(source: {T} | T, ...: {S} | S): {T} & {S}
	local array
	local elementCount = 0

	if isArray(source) then
		array = table.clone(source :: {T})
		elementCount = #array
	else
		elementCount += 1
		array = {}
		array[elementCount] = source :: T
	end

	for index = 1, select("#", ...) do
		local value = select(index, ...)
		if value == nil then
			-- do nothing
			continue --?
		elseif type(value) == "table" then
			if ERRORS_ARE_THROWN and not isArray(value) then
				error(CONCAT_BAD_OBJECT)
			end

			for jndex = 1, #value do
				elementCount += 1
				array[elementCount] = value[jndex]
			end
		else
			elementCount += 1
			array[elementCount] = value
		end
	end

	return (array :: any) :: {T} & {S}
end

local function reverse<T>(array: {T}): {T}
	local length = #array
	local index = 1

	while index < length do
		array[index], array[length] = array[length], array[index]
		index += 1
		length -= 1
	end

	return array
end

local function slice<T>(array: {T}, startIndex: number?, finishIndex: number?): {T}
	if type(array) ~= "table" then
		error(string.format("Array.slice called on %s", typeof(array)))
	end

	local length = #array
	local start = startIndex or 1
	if start > length + 1 then
		return {}
	end

	local finish

	if finishIndex == nil or finishIndex > length + 1 then
		finish = length + 1
	else
		finish = finishIndex
	end

	local localSlice = {}
	if start < 1 then
		start = math.max(length - math.abs(start), 1)
	end

	if finish < 1 then
		finish = math.max(length - math.abs(finish), 1)
	end

	local index = start
	local currentIndex = 1

	while index < finish do
		localSlice[currentIndex] = array[index]
		index += 1
		currentIndex += 1
	end

	return localSlice
end

local function splice<T>(array: {T}, start: number, deleteCount: number?, ...: T): {T}
	local length = #array
	if start > length then
		for index = 1, select("#", ...) do
			table.insert(array, (select(index, ...)))
		end

		return {}
	else
		if start < 1 then
			start = math.max(length - math.abs(start), 1)
		end

		local deletedItems: {T} = {}
		local trueDeleteCount = if deleteCount then deleteCount else length

		if trueDeleteCount > 0 then
			local lastIndex = math.min(length, start + math.max(0, trueDeleteCount - 1))

			for _ = start, lastIndex do
				local deleted = table.remove(array, start) :: T
				table.insert(deletedItems, deleted)
			end
		end

		for index = select("#", ...), 1, -1 do
			local value = select(index, ...)
			table.insert(array, start, value)
		end

		return deletedItems
	end
end

local function DEFAULT_SORT(a, b)
	return type(a) .. tostring(a) < type(b) .. tostring(b)
end

local function sort<T>(array: {T}, compare: nil | (a: any, b: any) -> number)
	local wrappedCompare = DEFAULT_SORT
	if compare then
		if type(compare) ~= "function" then
			error("invalid argument to Array.sort: compareFunction must be a function")
		end

		function wrappedCompare(a, b)
			local result = compare(a, b)
			if type(result) ~= "number" then
				error(string.format("invalid result from compare function, expected number but got %*", typeof(result)))
			end

			return result < 0
		end
	end

	table.sort(array, wrappedCompare)
	return array
end

local function some<T, U>(t: Array<T>, callback: callbackFn<T> | callbackFnWithThisArg<T, U>, thisArg: U?)
	if type(t) ~= "table" then
		error(string.format("Array.some called on %*", typeof(t)))
	end

	if type(callback) ~= "function" then
		error("callback is not a function")
	end

	for index, value in t do
		if thisArg ~= nil then
			if value ~= nil and (callback :: callbackFnWithThisArg<T, U>)(thisArg, value, index, t) then
				return true
			end
		else
			if value ~= nil and (callback :: callbackFn<T>)(value, index, t) then
				return true
			end
		end
	end

	return false
end

return table.freeze({
	concat = concat;
	every = every;
	filter = filter;
	find = find;
	isArray = isArray;
	reverse = reverse;
	slice = slice;
	some = some;
	sort = sort;
	splice = splice;
})
