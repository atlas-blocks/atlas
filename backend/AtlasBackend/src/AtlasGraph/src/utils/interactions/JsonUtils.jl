module JsonUtils
using ..AtlasGraph
using JSON3
using ..Types

function jsonwriteread(x)
    return JSON3.read(JSON3.write(x))
end

function dictionary(node::AbstractNode)::Dict{AbstractString,Any}
    dic = Dict{AbstractString,Any}()
    for field in propertynames(node)
        value = getproperty(node, field)
        if (typeof(value) <: AbstractNode)
            merge!(dic, dictionary(value))
        elseif field == :result
            push!(dic, string(field) => Types.getjson(value))
        else
            push!(dic, string(field) => value)
        end
    end
    return dic
end


function json(node::AbstractNode)::JSON3.Object
    return jsonwriteread(push!(dictionary(node), "type" => typeof(node)))
end

function json(graph::AbstractGraph)::JSON3.Object
    nodes = Vector{JSON3.Object}()
    for node in graph.nodes
        push!(nodes, json(node))
    end

    edges = Vector{JSON3.Object}()

    return jsonwriteread(Dict("nodes" => nodes, "edges" => edges))
end

function node(json_dict::JSON3.Object)::AbstractNode
    node = Node(
        json_dict["name"],
        json_dict["package"],
        (
            convert(Int32, json_dict["position"][1]),
            convert(Int32, json_dict["position"][2]),
        ),
        json_dict["visibility"],
    )
    if json_dict["type"] == string(Node)
        return node
    elseif json_dict["type"] == string(ExpressionNode)
        return ExpressionNode(
            node,
            json_dict["content"],
            Types.getvalue(json_dict["result"]),
        )
    end
end

function graph(json_dict::JSON3.Object)::AbstractGraph
    nodes_json_arr = json_dict["nodes"]
    nodes = Vector{AbstractNode}()
    for node_json in nodes_json_arr
        push!(nodes, node(node_json))
    end
    return Graph(nodes)
end

end
