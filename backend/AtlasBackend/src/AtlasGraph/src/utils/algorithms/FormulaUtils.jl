module FormulaUtils
using ..AtlasGraph, ..Functions
using DataStructures, ResultTypes
export getrpn, evaluaterpn, gettokens, topological_order, getproviders

struct Keyword
    name::String
end

struct ParsingException <: Exception
    message::String
end
struct EvaluatingException <: Exception
    message::String
end

function getrpn(content::AbstractString, graph::AbstractGraph)::Result{Queue{Any},Exception}
    output_queue = Queue{Any}()
    operation_stack = Stack{Union{Symbol,Keyword}}()
    tokens = gettokens(content)
    if (ResultTypes.iserror(tokens))
        return unwrap_error(tokens)
    end
    tokens = unwrap(tokens)

    for i = 1:length(tokens)
        token = tokens[i]
        if isa(token, Symbol)
            if AtlasGraph.isexpression(graph, string(token))
                enqueue!(output_queue, AtlasGraph.getexpression(graph, string(token)))
            elseif AtlasGraph.isfunction(graph, string(token)) ||
                   isdefined(Functions.Math, token)
                push!(operation_stack, token)
            else
                return ParsingException("Variable " * string(token) * "not defined.")
            end
        elseif isa(token, Real) || isa(token, AbstractString)
            enqueue!(output_queue, token)
        elseif token == Keyword("(")
            enqueue!(output_queue, token)
            push!(operation_stack, token)
        elseif token == Keyword(")")
            enqueue!(output_queue, token)
            while !isempty(operation_stack) && first(operation_stack) != Keyword("(")
                enqueue!(output_queue, pop!(operation_stack))
            end
            if isempty(operation_stack) || first(operation_stack) != Keyword("(")
                return ParsingException("Amount of open and closing bracket not matching.")
            end
            pop!(operation_stack)
            if !isempty(operation_stack) && isa(first(operation_stack), Symbol)
                enqueue!(output_queue, pop!(operation_stack))
            end
        else
            throw(ParsingException("Unexpected token while parsing: " * string(token)))
        end
    end

    while !isempty(operation_stack)
        enqueue!(output_queue, pop!(operation_stack))
    end

    return output_queue
end

function gettokens(content::AbstractString)::Result{Vector{Any},Exception}
    ans = Vector{Any}()

    i = 1
    while i <= length(content)
        substr = content[i:end]
        token_str = ""
        token_val = ""
        if match_prefix_node(substr) !== nothing
            token_str = match_prefix_node(substr).match
            token_val = Symbol(extract_node_name(token_str))
        elseif match_prefix_float(substr) !== nothing
            token_str = match_prefix_float(substr).match
            token_val = parse(Float64, token_str)
        elseif match_prefix_int(substr) !== nothing
            token_str = match_prefix_int(substr).match
            token_val = parse(Int64, token_str)
        elseif match_prefix_string(substr) !== nothing
            token_str = match_prefix_string(substr).match
            token_val = token_str[2:end-1]
        elseif substr[1] == '(' || substr[1] == ')'
            token_str = substr[1:1]
            token_val = Keyword(token_str)
        elseif substr[1] == ',' || substr[1] == ' '
            i += 1
            continue
        else
            return ParsingException(
                "Invalid syntax starting at position: " *
                string(i) *
                "\n substring: " *
                substr,
            )
        end

        push!(ans, token_val)
        i += length(token_str)
    end

    return ans
end

function getproviders(content::AbstractString, graph::AbstractGraph)::Vector{AbstractString}
    tokens = gettokens(content)
    filter!(token -> isa(token, Symbol), tokens)

    ans = Vector{AbstractString}()
    for token in tokens
        if AtlasGraph.isexpression(graph, string(token))
            push!(ans, string(token))
        end
    end
    return ans
end

function topological_order(graph::AbstractString)::Vector{AbstractNode}
    expressions = AtlasGraph.expressions(graph, ExpressionNode)

    return expressions
end

function match_prefix_int(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^[+-]?[0-9]+", str)
end

function match_prefix_float(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^[+-]?[0-9]+\.[0-9]+", str)
end

function match_prefix_string(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^\"([^\"\\]*(\\\\\")*(\\\\\\\\)*)*\"", str)
end

function match_prefix_node(str::AbstractString)::Union{RegexMatch,Nothing}
    return match(r"^__\$[^(\$__)]*\$__", str)
end

function extract_node_name(str::AbstractString)::AbstractString
    @assert match_prefix_node(str) !== nothing
    return replace(str, r"((__\$)|(\$__))" => "")
end


function evaluaterpn(rpn::Queue{Any}, graph::AbstractGraph)::Result{Any,Exception}
    if (isempty(rpn))
        return nothing
    end

    arguments = Stack{Any}()
    while isempty(rpn)
        next = dequeue!(rpn)
        if isa(next, Real) || isa(next, AbstractString)
            push!(arguments, f)
        elseif isa(next, Keyword)
            push!(arguments, next)
        elseif isa(next, AbstractExpressionNode)
            if next.result === nothing
                return nothing
            end
            push!(arguments, next.result)
        elseif isa(next, Symbol)
            if isempty(rpn) || first(rpn) != Keyword(")")
                return EvaluatingException("No opening bracket after function call")
            end
            dequeue!(rpn)
            current_arguments = []
            while !isempty(rpn) && !first(rpn) != Keyword("(")
                push!(current_arguments, dequeue!(rpn))
            end
            if isempty(rpn) || first(rpn) != Keyword("(")
                return EvaluatingException("Brackets number not matching.")
            end
            dequeue!(rpn)
            reverse!(current_arguments)
            arguments_types = map(arg -> typeof(arg), current_arguments)
            if !isdefined(Functions.Math, next)
                return EvaluatingException("No functions with the name: " * string(next))
            end
            func = getproperty(Functions.Math, next)
            possible_methods = methods(func, arguments_types, Functions.Math)
            if length(possible_methods) == 0
                return EvaluatingException(
                    "No functions matches for this call: " *
                    string(next) *
                    "(" *
                    string(arguments_types) *
                    ")",
                )
            end
            push!(arguments, func(current_arguments...))
        else
            return EvaluatingException("Unexpected token: " + string(next))
        end
    end
    if (length(arguments) !== 1)
        return EvaluatingException("Invalid syntax, there should be one final result.")
    end
    return pop!(arguments)
end

end
