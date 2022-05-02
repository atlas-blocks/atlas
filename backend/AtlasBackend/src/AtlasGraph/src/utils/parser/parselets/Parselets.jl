include("./Precendance.jl")

function name_parselet(parser::Parser, token::Token{Symbol})::NameExpr
    return NameExpr(token.content)
end

function value_parselet(parser::Parser, token::Token)::ValueExpr
    return ValueExpr(token.content)
end

function group_parselet(parser::Parser, token::Token)::AbstractExpr
    expr = parse_expression(parser)
    consume(parser, Tokens.RIGHT_PAREN)
    return expr
end

function prefix_operator_parselet(parser::Parser, token::Token)::CallExpr
    right = parse_expression(parser, infix_precendance[token].precedence)
    return CallExpr(NameExpr(token.content), [right])
end

prefix_parselets = Dict{TokenType,Function}(
    Tokens.NAME => name_parselet,
    Tokens.VALUE => value_parselet,
    Tokens.LEFT_PAREN => group_parselet,
)


function call_parselet(parser::Parser, left::AbstractExpr, token::Token)::CallExpr
    args = Vector{AbstractExpr}()

    if !match(parser, Tokens.RIGHT_PAREN)
        push!(args, parse_expression(parser))
        while match(parser, Tokens.COMMA)
            push!(args, parse_expression(parser))
        end
    end
    consume(parser, Tokens.RIGHT_PAREN)

    return CallExpr(left, args)
end

function bin_operator_parselet(parser::Parser, left::AbstractExpr, token::Token)::CallExpr
    info = infix_precendance[token]
    right::AbstractExpr =
        parse_expression(parser, info.precendance - (info.left_associative ? 0 : 1))
    return CallExpr(NameExpr(token.content), [left, right])
end

infix_parselets = Dict{TokenType,Function}(
    Tokens.LEFT_PAREN => call_parselet,
    Tokens.BIN_OPERATOR => bin_operator_parselet,
)
