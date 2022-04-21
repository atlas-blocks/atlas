module FormulaUtils
using ..AtlasGraph
using ..AtlasGraph: Functions
using DataStructures

struct Keyword
    name::String
end

function getrpn(
    content::AbstractString,
    graph::AbstractGraph,
)::Queue{Union{Real,AbstractString,Symbol,Keyword,AbstractExpressionNode}}
    output_queue = Queue{Any}()
    operation_stack = Stack{Symbol}()
    tokens = get_tockens(content)
    if (tokens === nothing)
        return nothing
    end

    for i = 1:length(tokens)
        token = tokens[i]
        if isa(token, Symbol)
            if AtlasGraph.isexpression(graph, string(token))
                enqueue!(output_queue, AtlasGraph.getexpression(graph, string(token)))
            elseif AtlasGraph.isfunction(graph, string(token)) ||
                   isdefined(Functios.Math, token)
                push!(operation_stack, token)
            else
                return nothing
            end
        elseif isa(token, Real) || isa(token, AbstractString)
            enqueue!(output_queue, token)
        elseif token == Keyword("(")
            enqueue!(output_queue, token)
            push!(operation_stack, token)
        elseif token == Keyword(")")
            enqueue!(output_queue, Keyword(token))
            while !isempty(operation_stack) && first(operation_stack) != Keyword("(")
                enqueue!(output_queue, pop!(operation_stack))
            end
            if isempty(operation_stack) || first(s) != Keyword("(")
                return nothing
            end
            enqueue!(output_queue, pop!(operation_stack))
            if !isempty(operation_stack)
                enqueue!(output_queue, pop!(operation_stack))
            end
        else
            return nothing
        end
    end

    while !isempty(operation_stack)
        enqueue!(output_queue, pop!(operation_stack))
    end

    return output_queue
end

function gettockens(
    content::AbstractString,
)::Vector{Union{Real,AbstractString,Symbol,Keyword}}
    ans = Vector{Union{Real,AbstractString,Symbol,Keyword}}()

    i = 1
    while i <= length(content)
        substr = content[i:end]
        tocken_str = ""
        tocken_val = ""
        if match_prefix_node(substr) !== nothing
            tocken_str = match_prefix_node(substr).match
            tocken_val = Symbol(extract_node_name(tocken_str))
        elseif match_prefix_float(substr) !== nothing
            tocken_str = match_prefix_float(substr).match
            tocken_val = parse(Float64, tocken_str)
        elseif match_prefix_int(substr) !== nothing
            tocken_str = match_prefix_int(substr).match
            tocken_val = parse(Int64, tocken_str)
        elseif match_prefix_string(substr) !== nothing
            tocken_str = match_prefix_string(substr).match
            tocken_val = tocken_str[1:end-1]
        elseif substr[1] == '(' || substr[1] == ')'
            tocken_str = substr[1:1]
            tocken_val = Keyword(tocken_str)
        elseif substr[1] == ',' || substr[1] == ' '
            i += 1
            continue
        else
            return nothing
        end

        push!(ans, tocken_val)
        i += length(tocken_str)
    end

    return ans
end

function getproviders(content::AbstractString, graph::AbstractGraph)::Vector{AbstractString}
    tockens = gettockens(content)
    filter!(token -> isa(token, Symbol), tockens)

    ans = Vector{AbstractString}()
    for tocken in tockens
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
    return match(r"^__\$.*\$__", str)
end

function extract_node_name(str::AbstractString)::AbstractString
    @assert match_prefix_node(str) !== nothing
    return replace(str, r"((__\$)|(\$__))" => "")
end


function evaluaterpn(rpn::Queue, graph::AbstractGraph)
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
                return nothing
            end
            dequeue!(rpn)
            current_arguments = []
            while !isempty(rpn) && !first(rpn) != Keyword("(")
                push!(current_arguments, dequeue!(rpn))
            end
            if isempty(rpn) || first(rpn) != Keyword("(")
                return nothing
            end
            dequeue!(rpn)
            reverse!(current_arguments)
            arguments_types = map(arg -> typeof(arg), current_arguments)
            if !isdefined(Functions.Math, arguments_types)
                return nothing
            end
            func = getproperty(Functions.Math, next)
            possible_methods = methods(func, arguments_types, Functions.Math)
            if length(possible_methods) == 0
                return nothing
            end
            push!(arguments, func(current_arguments...))
        else
            return nothing
        end
    end
    if (length(arguments) !== 1)
        return nothing
    end
    return pop!(arguments)
end

end
