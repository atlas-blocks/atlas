module TestUtils
using AtlasGraph
using DataStructures

export ≂

"Lenient comparison operator for `struct`, both mutable and immutable (type with \\eqsim)."
@generated function ≂(x, y)
    if !isempty(fieldnames(x)) && x == y
        mapreduce(n -> :(x.$n ≂ y.$n), (a, b) -> :($a && $b), fieldnames(x))
    else
        :(x == y)
    end
end

function equals(graph1::AbstractGraph, graph2::AbstractGraph)::Bool
    check = (length(graph1.nodes) == length(graph2.nodes))
    for i in eachindex(graph1.nodes)
        if (!(graph1.nodes[i] ≂ graph2.nodes[i]))
            check = false
        end
    end
    return check
end

function gennode(name::Symbol)::Node
    return Node(name, "")
end

function gentext(name::Symbol, content::AbstractString)::TextNode
    return TextNode(gennode(name), content)
end

function genexpression(name::Symbol, content::AbstractString, result::Any)::ExpressionNode
    return ExpressionNode(gennode(name), content, result, nothing, [], [])
end

function genexpression(name::Symbol, content::AbstractString)::ExpressionNode
    return genexpression(name, content, nothing)
end

function vec(queue)
    v = Vector{Any}()
    while !isempty(queue)
        push!(v, dequeue!(queue))
    end
    return v
end


end
