@enum Precendence begin
    EQUALITY = 1
    UNIT_RANGE
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

infix_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :(==)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(<=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(<)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(>=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(>)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(!=)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :(=>)) => InfixTokenInfo(EQUALITY, true),
    Token(Tokens.NAME, :+) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :-) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :*) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :/) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :^) => InfixTokenInfo(EXPONENT, false),
    Token(Tokens.NAME, :(:)) => InfixTokenInfo(UNIT_RANGE, true),
    Token(Tokens.LEFT_PAREN, "") => InfixTokenInfo(CALL, true),
    Token(Tokens.LEFT_BRACKET, "") => InfixTokenInfo(CALL, true),
)

prefix_precedence = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :-) => InfixTokenInfo(PREFIX, true),
    Token(Tokens.NAME, :+) => InfixTokenInfo(PREFIX, true),
    Token(Tokens.NAME, :!) => InfixTokenInfo(PREFIX, true),
)
