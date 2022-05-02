include("./Precedence.jl")

function name_parselet(parser::Parser, token::Token{Symbol})::Result{NameExpr,Exception}
    return NameExpr(token.content)
end

function value_parselet(parser::Parser, token::Token)::Result{ValueExpr,Exception}
    return ValueExpr(token.content)
end

function group_parselet(parser::Parser, token::Token)::Result{AbstractExpr,Exception}
    expr = parse_expression(parser)
    if ResultTypes.iserror(expr)
        return expr
    end
    consume(parser, Tokens.RIGHT_PAREN)
    return expr
end

function array_parselet(parser::Parser, token::Token)::Result{AbstractExpr,Exception}
    elems = Vector{AbstractExpr}()

    if !match(parser, Tokens.RIGHT_BRACKET)
        while true
            expr = parse_expression(parser)
            if ResultTypes.iserror(expr)
                return expr
            end
            push!(elems, unwrap(expr))
            match(parser, Tokens.COMMA) || break
            consume(parser, Tokens.COMMA)
        end
    end
    consume(parser, Tokens.RIGHT_BRACKET)

    return VectorExpr(elems)
end

function prefix_operator_parselet(parser::Parser, token::Token)::Result{CallExpr,Exception}
    right = parse_expression(parser, infix_precedence[token].precedence)
    if ResultTypes.iserror(right)
        return right
    end
    return CallExpr(NameExpr(token.content), [unwrap(right)])
end

prefix_parselets = Dict{TokenType,Function}(
    Tokens.NAME => name_parselet,
    Tokens.VALUE => value_parselet,
    Tokens.LEFT_PAREN => group_parselet,
    Tokens.LEFT_BRACKET => array_parselet,
)


function call_parselet(
    parser::Parser,
    left::AbstractExpr,
    token::Token,
)::Result{CallExpr,Exception}
    args = Vector{AbstractExpr}()

    if !match(parser, Tokens.RIGHT_PAREN)
        while true
            expr = parse_expression(parser)
            if ResultTypes.iserror(expr)
                return expr
            end
            push!(args, unwrap(expr))
            match(parser, Tokens.COMMA) || break
            consume(parser, Tokens.COMMA)
        end
    end
    consume(parser, Tokens.RIGHT_PAREN)

    return CallExpr(left, args)
end

function bin_operator_parselet(
    parser::Parser,
    left::AbstractExpr,
    token::Token,
)::Result{CallExpr,Exception}
    info = infix_precedence[token]
    right = parse_expression(parser, info.precedence - (info.left_associative ? 0 : 1))
    if ResultTypes.iserror(right)
        return unwrap_error(right)
    end
    right = unwrap(right)
    return CallExpr(NameExpr(token.content), [left, right])
end

infix_parselets = Dict{TokenType,Function}(
    Tokens.LEFT_PAREN => call_parselet,
    Tokens.BIN_OPERATOR => bin_operator_parselet,
)
