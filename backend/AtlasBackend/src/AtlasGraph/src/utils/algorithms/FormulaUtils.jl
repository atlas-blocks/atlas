module FormulaUtils
using ..AtlasGraph

function get_rpn(
    content::AbstractString,
    graph::AtlasGraph.AbstractGraph,
)::AbstractQueue{AbstractString}
    output_queue = Queue{Any}()
    operation_stack = Stack{FunctionNode}()
    tokens = get_tockens(content)
    if (tokens === nothing)
        return nothing
    end
    return output_queue
end

function get_tockens(content::AbstractString)::Vector{AbstractString}
    ans = Vector{AbstractString}()

    i = 1
    while i <= length(content)
        substr = content[i:end]
        tocken_len = 1
        if substr[1, min(3, end)] == "__\$"
            tocken_len = findfirst(substr, "\$__")[2]
        elseif match_prefix_int(substr) !== nothing
            tocken_len = length(match_prefix_float(substr).match)
        elseif match_prefix_int(substr) !== nothing
            tocken_len = length(match_prefix_int(substr).match)
        elseif match_prefix_string(substr) !== nothing
            token_len = length(match_prefix_string(substr).match)
        elseif substr[1] == '(' || substr[1] == ')'
            token_len = 1
        elseif substr[1] == ','
            i += 1
            continue
        else
            return nothing
        end

        push!(ans, substr[1:tocken_len])
        i += tocken_len
    end

    return ans
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

end
