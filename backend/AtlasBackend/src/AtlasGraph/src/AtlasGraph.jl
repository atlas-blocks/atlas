module AtlasGraph
export AbstractGraph, Graph
export AbstractNode, Node
export AbstractFunctionNode, FunctionNode
export AbstractExpressionNode, ExpressionNode

using JSON3, StructTypes, ResultTypes

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

function Base.getproperty(obj::ExpressionNode, sym::Symbol)
    if sym === :name
        return obj.node.name
    else
        return getfield(obj, sym)
    end
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

function filternodes(
    nodes::Vector{AbstractNode},
    name::AbstractString,
)::Vector{AbstractNode}
    return filter(node -> node.name == name, nodes)
end

function filternodes(nodes::Vector{AbstractNode}, type::DataType)::Vector{AbstractNode}
    return filter(node -> isa(node, type), nodes)
end

function filternodes(
    nodes::Vector{AbstractNode},
    name::AbstractString,
    type::DataType,
)::Vector{AbstractNode}
    return filternodes(filternodes(nodes, name), type)
end

function isexpression(graph::AbstractGraph, name::AbstractString)
    return length(filternodes(graph.nodes, name, ExpressionNode)) > 0
end

function getexpression(graph::AbstractGraph, name::AbstractString)
    return filternodes(graph.nodes, name, ExpressionNode)[1]
end

function isfunction(graph::AbstractGraph, name::AbstractString)
    return length(filternodes(graph.nodes, name, AbstractFunctionNode)) > 0
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

function updategraph!(graph::AbstractGraph)::Result{AbstractGraph,Exception}
    expressions = filternodes(graph.nodes, AbstractExpressionNode)
    ordered_nodes = FormulaUtils.topological_order(
        convert(Vector{AbstractExpressionNode}, expressions),
        graph,
    )

    for node in ordered_nodes
        result = FormulaUtils.evalcontent(node.content, graph)
        if ResultTypes.iserror(result)
            return unwrap_error(result)
        end
        node.result = unwrap(result)
    end

    return graph
end


include("./functions/Functions.jl")
include("./utils/algorithms/FormulaUtils.jl")
include("./utils/parser/AtlasParser.jl")
include("./utils/interactions/Types.jl")
include("./utils/interactions/JsonUtils.jl")
include("./utils/interactions/Interactions.jl")

end
