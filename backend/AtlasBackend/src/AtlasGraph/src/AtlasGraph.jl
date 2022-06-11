module AtlasGraph
export AbstractGraph, Graph
export AbstractEdge, ProviderEdge
export AbstractNode, Node
export AbstractContentNode
export AbstractTextNode, TextNode
export AbstractFileNode, FileNode
export AbstractFunctionNode, FunctionNode
export AbstractExpressionNode, ExpressionNode

using JSON3, StructTypes, ResultTypes

abstract type AbstractNode end
mutable struct Node <: AbstractNode
    name::Symbol
    uidata::String
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

abstract type AbstractTextNode <: AbstractNode end
mutable struct TextNode <: AbstractTextNode
    node::Node
    content::String
end

abstract type AbstractContentNode <: AbstractNode end

abstract type AbstractFileNode <: AbstractContentNode end
mutable struct FileNode <: AbstractFileNode
    node::Node
    content::String
    filename::String
end


abstract type AbstractExpressionNode <: AbstractContentNode end
mutable struct ExpressionNode <: AbstractExpressionNode
    node::Node
    content::String
    result::Any
end

abstract type AbstractFunctionNode <: AbstractContentNode end
mutable struct FunctionNode <: AbstractFunctionNode
    node::Node
    args::String
    content::String
end

function Base.getproperty(obj::AbstractContentNode, sym::Symbol)
    if sym === :name
        return obj.node.name
    else
        return getfield(obj, sym)
    end
end

abstract type AbstractEdge end
struct ProviderEdge <: AbstractEdge
    from::Symbol
    to::Symbol
end

StructTypes.StructType(::Type{ProviderEdge}) = StructTypes.Struct()

abstract type AbstractGraph end
struct Graph <: AbstractGraph
    name::Symbol
    nodes::Vector{AbstractNode}

    Graph(name::Symbol, nodes::Vector{<:AbstractNode}) = new(name, nodes)
    Graph(nodes::Vector{<:AbstractNode}) = new(:graph, nodes)
end

function filternodes(nodes::Vector{AbstractNode}, name::Symbol)::Vector{AbstractNode}
    return filter(node -> node.name == name, nodes)
end

function filternodes(nodes::Vector{AbstractNode}, type::DataType)::Vector{AbstractNode}
    return filter(node -> isa(node, type), nodes)
end

function filternodes(
    nodes::Vector{AbstractNode},
    name::Symbol,
    type::DataType,
)::Vector{AbstractNode}
    return filternodes(filternodes(nodes, name), type)
end

function updategraph!(graph::AbstractGraph)::AbstractGraph
    expressions = filternodes(graph.nodes, AbstractExpressionNode)
    ordered_nodes = FormulaUtils.topological_order(
        convert(Vector{AbstractExpressionNode}, expressions),
        graph,
    )

    for node in ordered_nodes
        Executer.execute_node(node)
    end

    return graph
end

function getedges(graph::Graph)::Vector{AbstractEdge}
    expressions = filternodes(graph.nodes, ExpressionNode)

    rawedges = map(
        node -> Dict("to" => node.name, "from" => Tokens.getnames(node.content)),
        expressions,
    )
    edges = Vector{AbstractEdge}()
    for raw_edge in rawedges
        for from in raw_edge["from"]
            push!(edges, ProviderEdge(from, raw_edge["to"]))
        end
    end
    return edges
end

include("./functions/Functions.jl")
include("./utils/algorithms/FormulaUtils.jl")
include("./utils/parser/Tokens.jl")
include("./utils/kernels/execution/Executer.jl")
include("./utils/interactions/JsonUtils.jl")
include("./utils/interactions/Interactions.jl")

end
