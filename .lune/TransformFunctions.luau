--!native
--!optimize 2
--!strict

local FileInstance = require("./FileInstance")
local process = require("@lune/process")
local task = require("@lune/task")

local TransformFunctions = {}
type FileInstance = FileInstance.FileInstance

-- this function is stupid 💔
function TransformFunctions.TransformDirectory(Directory: FileInstance)
	local ToTransform: {string} = {}
	local TotalTransformed = 0

	for _, LuauFile in Directory:GetDescendants() do
		if string.sub(LuauFile.FilePath, -4) ~= ".lua" then
			continue
		end

		local FileSource = LuauFile:Read()
		if FileSource then
			local WasChanged = false
			local Lines = string.split(FileSource, "\n")
			for Index, Line in Lines do
				local InsideTable = false
				if Index ~= 1 then
					for NewIndex = Index - 1, 1, -1 do
						local PreviousLine = Lines[NewIndex]
						if string.match(PreviousLine, "{") then
							InsideTable = true
							break
						end
					end
				end

				if InsideTable then
					continue
				end

				InsideTable = string.match(Line, "}") ~= nil

				local TableDefinition, FunctionName = string.match(Line, "([%w_]+)%.([%w_]+)%s*=%s*function%(")
				if TableDefinition and FunctionName then
					if not WasChanged then
						local New, Replacements = string.gsub(Line, "([%w_]+)%.([%w_]+)%s*=%s*function%(", "function %1.%2(")
						Lines[Index] = New
						WasChanged = Replacements > 0
					else
						Lines[Index] = string.gsub(Line, "([%w_]+)%.([%w_]+)%s*=%s*function%(", "function %1.%2(")
					end
				elseif string.match(Line, "([%w_]+)%s*=%s*function%(") then
					if not WasChanged then
						local New, Replacements = string.gsub(Line, "([%w_]+)%s*=%s*function%(", "function %1(")
						Lines[Index] = New
						WasChanged = Replacements > 0
					else
						Lines[Index] = string.gsub(Line, "([%w_]+)%s*=%s*function%(", "function %1(")
					end
				end
			end

			if WasChanged then
				LuauFile:Write(table.concat(Lines, "\n"))
				TotalTransformed += 1
				ToTransform[TotalTransformed] = LuauFile:GetFullName()
			end
		end
	end

	task.spawn(function()
		local SpawnResult = process.spawn("stylua2Roact", ToTransform)
		if not SpawnResult.ok then
			warn(SpawnResult.code, "-", SpawnResult.stderr)
		end
	end)

	return TotalTransformed
end

function TransformFunctions.TransformPath(Path: string)
	return TransformFunctions.TransformDirectory(FileInstance.Mark(Path))
end

local START_TIME = os.clock()
local total = TransformFunctions.TransformPath("./out")
local FINISH_TIME = os.clock() - START_TIME
print(string.format("Took %d ms to transform %* files", FINISH_TIME * 1000, total))

return table.freeze(TransformFunctions)
