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

function genenode(name::AbstractString)::Node
    return Node(name, "", (0, 0), false)
end

function gentext(name::AbstractString, content::AbstractString)::TextNode
    return TextNode(genenode(name), content)
end

function genfile(
    name::AbstractString,
    content::AbstractString,
    filename::AbstractString,
)::FileNode
    return FileNode(genenode(name), content, filename)
end

function genexpression(
    name::AbstractString,
    content::AbstractString,
    result::Any,
)::ExpressionNode
    return ExpressionNode(genenode(name), content, result)
end
function genexpression(name::AbstractString, content::AbstractString)::ExpressionNode
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
