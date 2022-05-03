@enum Precendence begin
    UNIT_RANGE = 1
    SUM
    PRODUCT
    EXPONENT
    PREFIX
    POSTFIX
    CALL
end

struct InfixTokenInfo
    precedence::Int32
    left_associative::Bool
    InfixTokenInfo(prec::Precendence, left_associative::Bool) =
        new(Int32(prec), left_associative)
end

bin_operator_symbols = Set{Symbol}([:+, :-, :*, :/, :^, :(:)])

infix_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :+) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :-) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :*) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :/) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :^) => InfixTokenInfo(EXPONENT, false),
    Token(Tokens.NAME, :(:)) => InfixTokenInfo(UNIT_RANGE, true),
    Token(Tokens.LEFT_PAREN, "") => InfixTokenInfo(CALL, true),
    Token(Tokens.LEFT_BRACKET, "") => InfixTokenInfo(CALL, true),
)
