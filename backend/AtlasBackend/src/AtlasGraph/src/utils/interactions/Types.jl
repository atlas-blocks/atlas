module Types
using ..AtlasGraph
using JSON3

# Any   === Any
# Nothing === Nothing
# Bool  === Boolean
# Int   === Int64
# Float === Float64
# Map   === Dict

function getvalue(elem_dict::JSON3.Object)
    string_type = elem_dict["type"]
    content = elem_dict["content"]
    type = Any

    if string_type == string(Nothing)
        return nothing
    elseif string_type == string(Bool)
        type = Bool
    elseif string_type == string(Float64)
        type = Float64
    elseif string_type == string(Int64)
        type = Int64
    elseif string_type == string(String)
        type = String
    elseif string_type == string(Dict)
        type = Dict
    elseif string_type == string(Array)
        type = Array
    end

    return convert(type, content)
end

function getjson(elem::Any)::JSON3.Object
    return JSON3.read(JSON3.write(Dict(:type => string(typeof(elem)), :content => elem)))
end

end
