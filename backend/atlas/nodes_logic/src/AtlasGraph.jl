module AtlasGraph

abstract type AbstractNode end
mutable struct Node <: AbstractNode
    id::UInt32
    name::String
    description::String
    position::Tuple{Int32, Int32}
    visibility::Bool
end

abstract type AbstractFormulaNode <: AbstractNode end
mutable struct FormulaNode <: AbstractFormulaNode
    node::Node
    content::String
end

abstract type AbstractExpressionNode <: AbstractFormulaNode end
mutable struct ExpressionNode <: AbstractExpressionNode
    node::FormulaNode
    result::Any
end

abstract type AbstractFunctionNode <: AbstractFormulaNode end
mutable struct FunctionNode <: AbstractFunctionNode
    node::FormulaNode
end

abstract type AbstractGraph end
struct Graph <: AbstractGraph
    nodes::Vector{AbstractNode}
end

import JSON3
import StructTypes


function toJSON(node::AbstractNode)::AbstractString
    return "node json"
end

function toJSON(graph::AbstractGraph)::AbstractString 
    for node in graph.nodes

    end
    # println(JS)
    return "graph json"
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

#  updateGraph(graph::String, )

end
