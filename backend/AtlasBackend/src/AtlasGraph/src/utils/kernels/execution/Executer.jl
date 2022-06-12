module Executer
using ..AtlasGraph, ..Functions
using ResultTypes

function execute_node(node::ExpressionNode)
    try
        eval(Expr(:(=), node.name, Meta.parse(node.content)))
        node.result = eval(node.name)
    catch e
        node.result = e
    end
end

function execute_node(node::Union{FileNode,TextNode})
    try
        eval(Expr(:(=), node.name, node.content))
    catch e
        println(e)
    end
end


end
