module AtlasGraph
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
end

abstract type AbstractGraph end
struct Graph <: AbstractGraph
    nodes::Vector{AbstractNode}
end

function json(node::AbstractNode)::AbstractString
    return JSON3.write(push!(dictionary(node), "type" => typeof(node)))
end

function dictionary(node::AbstractNode)
    dic = Dict{AbstractString,Any}()
    for field in propertynames(node)
        value = getproperty(node, field)
        if (typeof(value) <: AbstractNode)
            merge!(dic, dictionary(value))
        else
            push!(dic, string(field) => value)
        end
    end
    return dic
end

function json(graph::AbstractGraph)::AbstractString
    nodes = Vector{JSON3.Object}()
    for node in graph.nodes
        push!(nodes, JSON3.read(json(node)))
    end

    edges = Vector{JSON3.Object}()

    return JSON3.write(Dict("nodes" => nodes, "edges" => edges))
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

#  updateGraph(graph::String, )

end
