module AtlasParser
using ..AtlasGraph, ..Functions
using ResultTypes
export evaluate_content

struct ParsingException <: Exception
    message::String
end

struct EvaluatingException <: Exception
    message::String
end

include("Tokens.jl")
include("./expressions/Expressions.jl")
include("./TokenParser.jl")

using .Tokens, .Expressions, .TokenParser

function evaluate_content(content::String, graph::AbstractGraph)::Result{Any,Exception}
    tokens = gettokens(content)
    if ResultTypes.iserror(tokens)
        return unwrap_error(tokens)
    end
    tokens = unwrap(tokens)

    parser = Parser(tokens)
    expr = parse_expression(parser)
    if ResultTypes.iserror(expr)
        return unwrap_error(expr)
    end
    if TokenParser.hasnext(parser)
        return EvaluatingException("There is more then one expressions.")
    end
    expr = unwrap(expr)

    return evaluate(expr, graph)
end

function evaluate_content(content::String)::Result{Any,Exception}
    return evaluate_content(content, Graph([]))
end

end
