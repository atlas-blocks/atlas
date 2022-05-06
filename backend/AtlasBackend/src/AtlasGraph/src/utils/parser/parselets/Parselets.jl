include("./Precedence.jl")


function group_with_commas_helper(
    parser::Parser,
    closing::TokenType,
)::Result{Vector{AbstractExpr},Exception}
    elems = Vector{AbstractExpr}()

    while !match(parser, closing)
        expr = parse_expression(parser)
        if ResultTypes.iserror(expr)
            return unwrap_error(expr)
        end
        push!(elems, unwrap(expr))
        match(parser, Tokens.COMMA) || break
        res = consume(parser, Tokens.COMMA)
        if ResultTypes.iserror(res)
            return unwrap_error(res)
        end
    end
    res = consume(parser, closing)
    if ResultTypes.iserror(res)
        return unwrap_error(res)
    end

    return elems
end

function group_helper(parser::Parser, closing::TokenType)::Result{AbstractExpr,Exception}
    expr = parse_expression(parser)
    if ResultTypes.iserror(expr)
        return unwrap_error(expr)
    end
    res = consume(parser, closing)
    if ResultTypes.iserror(res)
        return unwrap_error(res)
    end
    return unwrap(expr)
end


function name_parselet(parser::Parser, token::Token{Symbol})::Result{NameExpr,Exception}
    return NameExpr(token.content)
end

function value_parselet(parser::Parser, token::Token)::Result{ValueExpr,Exception}
    return ValueExpr(token.content)
end

function group_parselet(parser::Parser, token::Token)::Result{AbstractExpr,Exception}
    expr = group_helper(parser, Tokens.RIGHT_PAREN)
    if ResultTypes.iserror(expr)
        return unwrap_error(expr)
    end
    return unwrap(expr)
end

function array_parselet(parser::Parser, token::Token)::Result{VectorExpr,Exception}
    elems = group_with_commas_helper(parser, Tokens.RIGHT_BRACKET)
    if ResultTypes.iserror(elems)
        return unwrap_error(elems)
    end

    return VectorExpr(unwrap(elems))
end

function prefix_unary_operator_parselet(
    parser::Parser,
    token::Token,
)::Result{CallExpr,Exception}
    right = parse_expression(parser, prefix_precedence[token].precedence)
    if ResultTypes.iserror(right)
        return unwrap_error(right)
    end
    return CallExpr(NameExpr(token.content), [unwrap(right)])
end

prefix_parselets = Dict{TokenType,Function}(
    Tokens.NAME => name_parselet,
    Tokens.VALUE => value_parselet,
    Tokens.LEFT_PAREN => group_parselet,
    Tokens.LEFT_BRACKET => array_parselet,
    Tokens.PREFIX_UNARY_OPERATOR => prefix_unary_operator_parselet,
)


function call_parselet(
    parser::Parser,
    left::AbstractExpr,
    token::Token,
)::Result{CallExpr,Exception}
    args = group_with_commas_helper(parser, Tokens.RIGHT_PAREN)
    if ResultTypes.iserror(args)
        return unwrap_error(args)
    end

    return CallExpr(left, unwrap(args))
end

function infix_bin_operator_parselet(
    parser::Parser,
    left::AbstractExpr,
    token::Token{Symbol},
)::Result{CallExpr,Exception}
    info = infix_precedence[token]
    right = parse_expression(parser, info.precedence - (info.left_associative ? 0 : 1))
    if ResultTypes.iserror(right)
        return unwrap_error(right)
    end
    return CallExpr(NameExpr(token.content), [left, unwrap(right)])
end

function getindex_parselet(
    parser::Parser,
    left::AbstractExpr,
    token::Token,
)::Result{CallExpr,Exception}
    expr = group_helper(parser, Tokens.RIGHT_BRACKET)
    if ResultTypes.iserror(expr)
        return unwrap_error(expr)
    end

    return CallExpr(NameExpr(:getindex), [left, unwrap(expr)])
end

infix_parselets = Dict{TokenType,Function}(
    Tokens.LEFT_PAREN => call_parselet,
    Tokens.LEFT_BRACKET => getindex_parselet,
    Tokens.INFIX_BIN_OPERATOR => infix_bin_operator_parselet,
)
