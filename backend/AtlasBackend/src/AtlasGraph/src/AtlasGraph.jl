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

function node(json_string::AbstractString)::AbstractNode
    json_dict = JSON3.read(json_string)
    node = JSON3.read(json_string, Node)
    if json_dict["type"] == string(Node)
        return node
    elseif json_dict["type"] == string(ExpressionNode)
        return ExpressionNode(node, json_dict["content"], json_dict["result"])
    end
end

function graph(json_string::AbstractString)::AbstractGraph
    nodes_json_arr = JSON3.read(json_string)["nodes"]
    nodes = Vector{AbstractNode}()
    for node_json in nodes_json_arr
        push!(nodes, node(JSON3.write(node_json)))
    end
    return Graph(nodes)
end

StructTypes.StructType(::Type{Node}) = StructTypes.Struct()

function updateGraph(graph_json_string::AbstractString)::AbstractString
    return graph_json_string
end

end
