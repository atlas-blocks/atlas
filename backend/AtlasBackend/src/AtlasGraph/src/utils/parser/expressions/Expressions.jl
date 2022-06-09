module Expressions
using ..AtlasGraph, ..Functions
import ..AtlasParser: EvaluatingException
using ResultTypes
export AbstractExpr, ValueExpr, VectorExpr, NameExpr, CallExpr, evaluate


abstract type AbstractExpr end

struct ValueExpr{T} <: AbstractExpr
    content::T
end

function evaluate(expr::ValueExpr{T}, graph::AbstractGraph)::Result{T,Exception} where {T}
    return expr.content
end


struct NameExpr <: AbstractExpr
    name::Symbol
end

function evaluate(expr::NameExpr, graph::AbstractGraph)::Result{Any,Exception}
    nodes = AtlasGraph.filternodes(graph.nodes, string(expr.name))
    @assert length(nodes) <= 1
    if length(nodes) == 1 && typeof(nodes[1]) == ExpressionNode
        return nodes[1].result
    elseif length(nodes) == 1 && typeof(nodes[1]) == TextNode
        return nodes[1].content
    elseif length(nodes) == 1 && typeof(nodes[1]) == FileNode
        return nodes[1].content
    elseif isdefined(Functions, expr.name)
        return getproperty(Functions, expr.name)
    elseif isdefined(Functions.Math, expr.name)
        return getproperty(Functions.Math, expr.name)
    elseif isdefined(Functions.Example, expr.name)
        return getproperty(Functions.Example, expr.name)
    end
    return EvaluatingException("No such name: " * string(expr.name))
end


struct VectorExpr <: AbstractExpr
    elems::Vector{AbstractExpr}
end

function evaluate(expr::VectorExpr, graph::AbstractGraph)::Result{Vector,Exception}
    elems = evaluate_vector(expr.elems, graph)
    if ResultTypes.iserror(elems)
        return unwrap_error(elems)
    end
    return unwrap(elems)
end

struct CallExpr <: AbstractExpr
    func::AbstractExpr
    args::Vector{AbstractExpr}
end

function evaluate(expr::CallExpr, graph::AbstractGraph)::Result{Any,Exception}
    args = evaluate_vector(expr.args, graph)
    if ResultTypes.iserror(args)
        return unwrap_error(args)
    end
    args = unwrap(args)

    arg_types = map(arg -> typeof(arg), args)

    func = evaluate(expr.func, graph)
    if ResultTypes.iserror(func)
        return unwrap_error(func)
    end
    func = unwrap(func)

    possible_methods = methods(func, arg_types)
    if length(possible_methods) == 0
        return EvaluatingException(
            "No functions with this signature: ($( string(arg_types)))",
        )
    end
    return func(args...)
end


function evaluate_vector(
    elems::Vector{AbstractExpr},
    graph::AbstractGraph,
)::Result{Vector,Exception}
    elems = map(elem -> evaluate(elem, graph), elems)
    for elem in elems
        if ResultTypes.iserror(elem)
            return unwrap_error(elem)
        end
    end
    return map(elem -> unwrap(elem), elems)
end

end
