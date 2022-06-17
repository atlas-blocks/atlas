module JsonUtils
using ..AtlasGraph
using JSON3, ResultTypes

function jsonwriteread(x)
    return JSON3.read(JSON3.write(x))
end

function dictionary(node::AbstractNode)::Dict{AbstractString,Any}
    dic = Dict{AbstractString,Any}()
    for field in fieldnames(typeof(node))
        value = getproperty(node, field)
        if (typeof(value) <: AbstractNode)
            merge!(dic, dictionary(value))
        elseif field == :result
            push!(dic, string(field) => sprint(show, "text/plain", value))
        elseif field == :helper_results
            push!(dic, string(field) => map(string, value))
        elseif field == :error
            push!(dic, string(field) => sprint(showerror, value))
        else
            push!(dic, string(field) => value)
        end
    end
    return dic
end

function json(node::AbstractNode)::JSON3.Object
    return jsonwriteread(push!(dictionary(node), "type" => typeof(node)))
end

function json(edge::AbstractEdge)::JSON3.Object
    return jsonwriteread(edge)
end

function json(graph::AbstractGraph)::JSON3.Object
    nodes::Vector{JSON3.Object} = map(node -> json(node), graph.nodes)
    edges::Vector{JSON3.Object} = map(edge -> json(edge), AtlasGraph.getedges(graph))

    return jsonwriteread(Dict("name" => graph.name, "nodes" => nodes, "edges" => edges))
end

function node(json_dict::JSON3.Object)::AbstractNode
    node = Node(Symbol(json_dict["name"]), json_dict["uidata"])
    if json_dict["type"] == string(Node)
        return node
    elseif json_dict["type"] == string(ExpressionNode)
        return ExpressionNode(
            node,
            json_dict["content"],
            nothing,
            nothing,
            json_dict["helper_contents"],
            [],
        )
    elseif json_dict["type"] == string(TextNode)
        return TextNode(node, json_dict["content"])
    end
end

function graph(json_dict::JSON3.Object)::AbstractGraph
    nodes_json_arr = json_dict["nodes"]
    nodes = Vector{AbstractNode}()
    for node_json in nodes_json_arr
        push!(nodes, node(node_json))
    end
    return Graph(Symbol(json_dict["name"]), nodes)
end

end
