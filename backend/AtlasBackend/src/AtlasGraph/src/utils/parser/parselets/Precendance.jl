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
    InfixTokenInfo(prec::Precendence, left_associative::Bool) =
        new(Int32(prec), left_associative)
end

infix_precendance = Dict{Token,InfixTokenInfo}(
    Token(Tokens.NAME, :+) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :-) => InfixTokenInfo(SUM, true),
    Token(Tokens.NAME, :*) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :/) => InfixTokenInfo(PRODUCT, true),
    Token(Tokens.NAME, :^) => InfixTokenInfo(EXPONENT, false),
    Token(Tokens.LEFT_PAREN, "") => InfixTokenInfo(CALL, true),
)
