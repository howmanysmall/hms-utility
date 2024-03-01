--!native
--!optimize 2

return function(object)
	return type(object) == "table" and object["$$typeof"] == 0xeac7
end
