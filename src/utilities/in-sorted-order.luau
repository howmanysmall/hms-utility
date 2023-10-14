--!native
--!optimize 2

local function alphabetically(a, b)
	local typeA = typeof(a)
	local typeB = typeof(b)

	if typeA == typeB then
		if typeA == "number" then
			return (a :: number) < b :: number
		else
			return string.lower(tostring(a)) < string.lower(tostring(b))
		end
	else
		return typeA < typeB
	end
end

local function inSortedOrder<V>(dictionary: {[string]: V}, sortBy: nil | (a: V, b: V) -> boolean)
	local order = {}
	local length = 0

	for key in dictionary do
		length += 1
		order[length] = key
	end

	table.sort(order, sortBy or alphabetically)
	local index = 0

	-- stylua: ignore
	return function(object)
		index += 1
		local key = order[index]
		return key, object[key], index
	end, dictionary, nil
end

return inSortedOrder
