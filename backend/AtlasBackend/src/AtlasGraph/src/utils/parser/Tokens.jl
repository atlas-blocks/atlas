module Tokens
import ..AtlasParser: ParsingException
using ResultTypes
export Token, TokenType, gettokens

@enum TokenType begin
    VALUE
    NAME
    BIN_OPERATOR

    # punctuation and grouping
    LEFT_PAREN  # "("
    RIGHT_PAREN  # ")"
    LEFT_BRACKET  # "["
    RIGHT_BRACKET  # "]"
    LEFT_BRACE  # "{"
    RIGHT_BRACE  # "}"
    COMMA
end

keyword_type = Dict{String,TokenType}(
    "(" => LEFT_PAREN,
    ")" => RIGHT_PAREN,
    "[" => LEFT_BRACKET,
    "]" => RIGHT_BRACKET,
    "{" => LEFT_BRACE,
    "}" => RIGHT_BRACE,
    "," => COMMA,
)


mutable struct Lexer
    text::String
    index::Int64

    Lexer(text::String) = new(text, 1)
end

struct Token{T}
    type::TokenType
    content::T
end

isempty(lexer::Lexer) = lexer.index > length(lexer.text)
nextchar(lexer::Lexer) = lexer.text[lexer.index]

function next(lexer::Lexer)::Result{Union{Nothing,Token},Exception}
    while (!isempty(lexer) && nextchar(lexer) == ' ')
        lexer.index += 1
    end

    if (isempty(lexer))
        return nothing
    end

    substr = lexer.text[lexer.index:end]
    token_str = ""
    token_val = ""
    token_type = nothing
    if match_name(substr) !== nothing
        token_str = match_name(substr).match
        if token_str == "nothing"
            token_val = nothing
            token_type = VALUE
        else
            token_val = Symbol(token_str)
            token_type = NAME
        end
    elseif match_operator(substr) !== nothing
        token_str = match_operator(substr).match
        token_val = Symbol(token_str)
        token_type = NAME
    elseif match_float(substr) !== nothing
        token_str = match_float(substr).match
        token_val = parse(Float64, token_str)
        token_type = VALUE
    elseif match_int(substr) !== nothing
        token_str = match_int(substr).match
        token_val = parse(Int64, token_str)
        token_type = VALUE
    elseif match_string(substr) !== nothing
        token_str = match_string(substr).match
        token_val = string(token_str[2:end-1])
        token_type = VALUE
    elseif match_keywords(substr) !== nothing
        token_str = match_keywords(substr).match
        token_val = ""
        token_type = keyword_type[token_str]
    else
        return ParsingException(
            "Invalid syntax starting at position: " *
            string(lexer.index) *
            "; substring: " *
            substr,
        )
    end

    lexer.index += length(token_str)
    return Token(token_type, token_val)
end

function gettokens(text::String)::Result{Vector{Token},Exception}
    ans = Vector{Token}()

    lexer = Lexer(text)
    while !isempty(lexer)
        next_result = next(lexer)

        if ResultTypes.iserror(next_result)
            return unwrap_error(next_result)
        end

        if unwrap(next_result) !== nothing
            push!(ans, unwrap(next_result))
        end
    end

    return ans
end


function match_keywords(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^[\(\)\[\]\,]", str)
end

function match_int(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^[+-]?[0-9]+", str)
end

function match_float(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^[+-]?[0-9]+\.[0-9]+", str)
end

function match_string(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^\"([^\"\\]*(\\\\\")*(\\\\\\\\)*)*\"", str)
end

function match_name(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^(_|[a-zA-Z])\w*", str)
end

function match_operator(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^(\+|\-|\*|\/|\^|\:|<=|<|>=|>|==|=|!=)", str)
end


end
