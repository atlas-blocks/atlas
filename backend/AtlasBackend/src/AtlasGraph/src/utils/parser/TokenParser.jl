module TokenParser
using ..Tokens, ..Expressions
using ResultTypes
export Parser, parse_expression


mutable struct Parser
    tokens::Vector{Token}
    index::Int64
    Parser(tokens::Vector{Token}) = new(tokens, 1)
end

function hasnext(parser::Parser, shift::Int64)::Bool
    return parser.index + shift <= length(parser.tokens)
end

function hasnext(parser::Parser)::Bool
    return hasnext(parser, 0)
end

function peek(parser::Parser, shift::Int64)::Any
    # if !hasnext(parser, shift)
    #     return nothing
    # end
    return parser.tokens[parser.index+shift]
end

function peek(parser::Parser)::Any
    return peek(parser, 0)
end

function consume(parser::Parser)::Any
    parser.index += 1
    return peek(parser, -1)
end

function consume(parser::Parser, expected::TokenType)::Token
    parser.index += 1
    token = peek(parser, -1)
    @assert token.type == expected
    return next
end

function match(parser::Parser, expected::TokenType)::Bool
    return peek(parser, 0).type == expected
end

function is_infix_operator(token::Token)
    return haskey(infix_precendance, token)
end

function getprecedence(token::Token)
    if !is_infix_operator(token)
        return 0
    end
    return infix_precedence[token]
end

function parse_expression(parser::Parser, precedence::Int64)::Result{AbstractExpr,Exception}
    token = consume(parser)

    if !haskey(prefix_parselets, token.type)
        return ParsingException("Couldn't parse " * token.content * ".")
    end
    left::AbstractExpr = prefix_parselets[token.type](parser, token)

    while hasnext(parser) && precedence < getprecedence(peek(parser))
        token = consume(parser)
        if (is_infix_operator(token))
            token = Token(Tokens.BIN_OPERATOR, token.content)
        end
        left = infix_parselets[token.type](parser, left, token)
    end

    return left
end

function parse_expression(parser::Parser)::Result{AbstractExpr,Exception}
    return parse_expression(parser, 0)
end


include("./parselets/Parselets.jl")


end
