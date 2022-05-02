@enum Precendence begin
    SUM
    PRODUCT
    EXPONENT
    PREFIX
    POSTFIX
    CALL
end

struct InfixTokenInfo
    precendance::Int32
    left_associative::Bool
end

infix_precendance = Dict{Symbol,Operator}(
    Token(Token.NAME, :+) => InfixTokenInfo(SUM, true),
    Token(Token.NAME, :-) => InfixTokenInfo(SUM, true),
    Token(Token.NAME, :*) => InfixTokenInfo(PRODUCT, true),
    Token(Token.NAME, :/) => InfixTokenInfo(PRODUCT, true),
    Token(Token.NAME, :^) => InfixTokenInfo(EXPONENT, false),
    Token(Token.LEFT_PAREN, "") => InfixTokenInfo(CALL, true),
)
