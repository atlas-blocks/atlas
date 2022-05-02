module AtlasParser
using ..AtlasGraph, ..Functions

struct ParsingException <: Exception
    message::String
end
struct EvaluatingException <: Exception
    message::String
end

include("Tokens.jl")
include("./expressions/Expressions.jl")
include("./parselets/TokenParser.jl")

end
