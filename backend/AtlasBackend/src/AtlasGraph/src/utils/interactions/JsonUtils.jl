module JsonUtils
using ..AtlasGraph
using JSON3

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

end
