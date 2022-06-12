module Tokens
import MacroTools: postwalk
export getnames

function getnames(content::String)::Set{Symbol}
    list = []
    postwalk(x -> x isa Symbol ? (push!(list, x); x) : x, Meta.parse(content))
    return Set{Symbol}(list)
end


end
