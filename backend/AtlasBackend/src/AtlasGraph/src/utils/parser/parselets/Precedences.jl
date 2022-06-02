module Precedences
using ..Tokens
export infix_precedence, prefix_precedence

@enum Precedence begin
    COMMA = 1
    LOGICAL_OR
    LOGICAL_AND
    BIT_OR
    BIT_XOR
    BIT_AND
    EQUALITY
    UNIT_RANGE
    SUM
    PRODUCT
    EXPONENT
    PREFIX
    POSTFIX
    CALL
    DOT
end

struct InfixTokenInfo
    precedence::Int32
    left_associative::Bool
    InfixTokenInfo(prec::Precedence, left_associative::Bool) =
        new(Int32(prec), left_associative)
end

infix_bin_operators_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :+) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :-) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :*) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :/) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :^) => InfixTokenInfo(EXPONENT, false),
    Token(Tokens.NAME, :|) => InfixTokenInfo(BIT_OR, true),
    Token(Tokens.NAME, :||) => InfixTokenInfo(LOGICAL_OR, true),
    Token(Tokens.NAME, :&) => InfixTokenInfo(BIT_AND, true),
    Token(Tokens.NAME, :&&) => InfixTokenInfo(LOGICAL_AND, true),
    Token(Tokens.NAME, :(:)) => InfixTokenInfo(UNIT_RANGE, true),
    Token(Tokens.NAME, :(==)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(<=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(<)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(>=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(>)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(!=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(=>)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(..)) => InfixTokenInfo(UNIT_RANGE, true),
)

infix_keywords_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.DOT, "") => InfixTokenInfo(DOT, true),
    Token(Tokens.LEFT_PAREN, "") => InfixTokenInfo(CALL, true),
    Token(Tokens.LEFT_BRACKET, "") => InfixTokenInfo(CALL, true),
)

infix_precedence = merge(infix_keywords_precedence, infix_bin_operators_precedence)

prefix_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :-) => InfixTokenInfo(PREFIX, true),
    Token(Tokens.NAME, :+) => InfixTokenInfo(PREFIX, true),
    Token(Tokens.NAME, :!) => InfixTokenInfo(PREFIX, true),
)

end
