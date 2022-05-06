module Types
using ..AtlasGraph
using JSON3

# Any   === Any
# Nothing === Nothing
# Bool  === Boolean
# Int   === Int64
# Float === Float64
# Map   === Dict


function getjson(elem::Union{Int64,Float64,Bool,AbstractString})::AbstractString
    return JSON3.write(elem)
end

function getjson(elems::Array)::AbstractString
    ans = "["
    for el in elems
        ans *= getjson(el) * ", "
    end
    return replace(ans, r", \Z" => "") * "]"
end

function getjson(elems::Dict)::AbstractString
    ans = "Dict("
    for (key, value) in elems
        ans *= getjson(key) * " => " * getjson(value) * ", "
    end
    return replace(ans, r", \Z" => "") * ")"
end

function getjson(elem::Nothing)::AbstractString
    return string(elem)
end

function getjson(elem::UnitRange)::AbstractString
    return getjson(elem.start) * ":" * getjson(elem.stop)
end

end
