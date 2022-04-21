module AtlasGraph
export AbstractGraph, Graph
export AbstractNode, Node
export AbstractFunctionNode, FunctionNode
export AbstractExpressionNode, ExpressionNode

import JSON3
import StructTypes

abstract type AbstractNode end
mutable struct Node <: AbstractNode
    name::String
    package::String
    position::Tuple{Int32,Int32}
    visibility::Bool
end

abstract type AbstractFormulaNode <: AbstractNode end

abstract type AbstractExpressionNode <: AbstractFormulaNode end
mutable struct ExpressionNode <: AbstractExpressionNode
    node::Node
    content::String
    result::Any
end

abstract type AbstractFunctionNode <: AbstractFormulaNode end
mutable struct FunctionNode <: AbstractFunctionNode
    node::Node
    content::String

    priority::Int8
    leftright_order::Bool
end

abstract type AbstractGraph end
struct Graph <: AbstractGraph
    nodes::Vector{AbstractNode}
end

function getnodes(graph::AbstractGraph, name::AbstractString)::Vector{AbstractNode}
    return flter(node -> node.name == name, graph.nodes)
end

function getnodes(graph::AbstractGraph, type::DataType)::Vector{AbstractNode}
    return filter(node -> isa(node, type), graph.nodes)
end

function getnodes(
    graph::AbstractGraph,
    name::AbstractString,
    type::DataType,
)::Vector{AbstractNode}
    return getnodes(node -> isa(node, type), get_nodes_by_name(graph, name))
end

function isexpression(graph::AbstractGraph, name::AbstractString)
    return getnodes(graph, name, ExpressionNode) > 0
end

function getexpression(graph::AbstractGraph, name::AbstractString)
    return getnodes(graph, name, ExpressionNode)[1]
end

function isfunction(graph::AbstractGraph, name::AbstractString)
    nodes = filter(node -> isa(node, AbstractFunctionNode), get_nodes_by_name(graph, name))
    return getnodes(graph, nodes) > 0
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

function updateGraph!(graph::AbstractGraph)::AbstractGraph
    ordered_nodes = FormulaUtils.topological_order(graph)

    for node in ordered_nodes
        node.result = FormulaUtils.evaluaterpn(node, graph)
    end

    return graph
end



include("./Types.jl")
include("./functions/Functions.jl")
include("./utils/interactions/JsonUtils.jl")
include("./utils/interactions/Interactions.jl")
include("./utils/algorithms/FormulaUtils.jl")

end
