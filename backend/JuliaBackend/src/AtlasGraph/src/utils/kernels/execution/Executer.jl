module Executer
using ..AtlasGraph, ..Functions

function execute_node(node::ExpressionNode)
    node.result = nothing
    node.error = nothing
    node.helper_results = Vector{Any}(nothing, length(node.helper_contents))

    try
        eval(Expr(:(=), node.name, Meta.parse(node.content)))
        node.result = eval(node.name)
    catch e
        node.error = e
    end

    try
        for i = 1:length(node.helper_contents)
            node.helper_results[i] = eval(Meta.parse(node.helper_contents[i]))
        end
    catch e
    end
end

function execute_node(node::Union{TextNode})
    try
        eval(Expr(:(=), node.name, node.content))
    catch e
        println(e)
    end
end


end
