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

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

function updateGraph(graph_json_string::JSON3.Object)::JSON3.Object
    return graph_json_string
end

include("./utils/interactions/JsonUtils.jl")
include("./utils/algorithms/FormulaUtils.jl")

end
