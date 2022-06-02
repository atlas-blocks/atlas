module TokenParser
using ..Tokens, ..Expressions
import ..AtlasParser: ParsingException
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

function consume(parser::Parser)::Result{Token,Exception}
    if !hasnext(parser)
        return ParsingException("Expected token, but found nothing.")
    end
    parser.index += 1
    return peek(parser, -1)
end

function consume(parser::Parser, expected::TokenType)::Result{Token,Exception}
    if !hasnext(parser)
        return ParsingException("Expected token, but found nothing.")
    end
    parser.index += 1
    token = peek(parser, -1)
    if (token.type != expected)
        return ParsingException(
            "Expected token type: $(expected) but received: $(token.type)",
        )
    end
    return token
end

function match(parser::Parser, expected::TokenType)::Bool
    return peek(parser, 0).type == expected
end

function isinfix(token::Token)
    return haskey(Precedences.infix_precedence, token)
end

function getinfixprecedence(token::Token)
    if !isinfix(token)
        return 0
    end
    return Precedences.infix_precedence[token].precedence
end

function parse_expression(
    parser::Parser,
    precedence::Union{Int32,Int64},
)::Result{AbstractExpr,Exception}
    if !hasnext(parser)
        return ValueExpr(nothing)
    end
    token::Token = updateprefixtype(unwrap(consume(parser)))

    if !haskey(prefix_parselets, token.type)
        println(parser.tokens)
        return ParsingException("Couldn't parse \"$(string(token.content))\".")
    end
    left = prefix_parselets[token.type](parser, token)
    if ResultTypes.iserror(left)
        return unwrap_error(left)
    end
    left = unwrap(left)

    while hasnext(parser) && precedence < getinfixprecedence(updateinfixtype(peek(parser)))
        token = updateinfixtype(unwrap(consume(parser)))
        left = infix_parselets[token.type](parser, left, token)
        if ResultTypes.iserror(left)
            return unwrap_error(left)
        end
        left = unwrap(left)
    end

    return left
end

function parse_expression(parser::Parser)::Result{AbstractExpr,Exception}
    return parse_expression(parser, 0)
end

function parse_prefix_expression(
    parser::Parser,
    token::Token,
)::Result{AbstractExpr,Exception}
    return parse_expression(parser, Precedences.prefix_precedence[token].precedence)
end

function parse_infix_expression(
    parser::Parser,
    token::Token,
)::Result{AbstractExpr,Exception}
    info = Precedences.infix_precedence[token]
    return parse_expression(parser, info.precedence - (info.left_associative ? 0 : 1))
end


function updateinfixtype(token::Token)::Token
    if token.type != Tokens.NAME || !(token.content in Tokens.infix_bin_operators)
        return token
    end
    return Token(Tokens.INFIX_BIN_OPERATOR, token.content)
end

function updateprefixtype(token::Token)::Token
    if token.type != Tokens.NAME || !(token.content in Tokens.prefix_unary_operators)
        return token
    end
    return Token(Tokens.PREFIX_UNARY_OPERATOR, token.content)
end

include("./parselets/Parselets.jl")


end
