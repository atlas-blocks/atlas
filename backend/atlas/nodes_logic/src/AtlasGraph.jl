module AtlasGraph
import JSON3
import StructTypes

abstract type AbstractNode end
mutable struct Node <: AbstractNode
    name::String
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
    return JSON3.write(dictionary(node))
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
    for node in graph.nodes

    end
    # println(JS)
    return "graph json"
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

#  updateGraph(graph::String, )

end
