module AtlasGraph
export AbstractGraph, Graph
export AbstractEdge, ProviderEdge
export AbstractNode, Node
export AbstractTextNode, TextNode
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

abstract type AbstractTextNode <: AbstractNode end
mutable struct TextNode <: AbstractTextNode
    node::Node
    content::String
end

function Base.getproperty(obj::TextNode, sym::Symbol)
    if sym === :name
        return obj.node.name
    else
        return getfield(obj, sym)
    end
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

abstract type AbstractEdge end
struct ProviderEdge <: AbstractEdge
    from::String
    to::String
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
StructTypes.StructType(::Type{ProviderEdge}) = StructTypes.Struct()

function updategraph!(graph::AbstractGraph)::Result{AbstractGraph,Exception}
    expressions = filternodes(graph.nodes, AbstractExpressionNode)
    ordered_nodes = FormulaUtils.topological_order(
        convert(Vector{AbstractExpressionNode}, expressions),
        graph,
    )

    for node in ordered_nodes
        result = AtlasParser.evaluate_content(node.content, graph)
        if ResultTypes.iserror(result)
            return unwrap_error(result)
        end
        node.result = unwrap(result)
    end

    return graph
end

function getedges(graph::Graph)::Vector{AbstractEdge}
    expressions = filternodes(graph.nodes, ExpressionNode)

    rawedges = map(
        node -> (
            node.name,
            map(
                token -> string(token.content),
                unique(
                    filter!(
                        token -> token.type == AtlasParser.Tokens.NAME,
                        unwrap(AtlasParser.Tokens.gettokens(node.content)),
                    ),
                ),
            ),
        ),
        expressions,
    )
    edges = Vector{AbstractEdge}()
    for i = 1:length(rawedges)
        for j = 1:length(rawedges[i][2])
            push!(edges, ProviderEdge(rawedges[i][2][j], rawedges[i][1]))
        end
    end
    return edges
end

include("./functions/Functions.jl")
include("./utils/algorithms/FormulaUtils.jl")
include("./utils/parser/AtlasParser.jl")
include("./utils/interactions/Types.jl")
include("./utils/interactions/JsonUtils.jl")
include("./utils/interactions/Interactions.jl")

end
