module Expressions
using ..AtlasGraph, ..Functions
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

function evaluate(expr::NameExpr, graph::AbstractGraph)::Result{Symbol,Exception}
    name = string(expr.name)
    if AtlasGraph.isexpression(graph, name)
        return AtlasGraph.getexpression(graph, name).result
    end
    return expr.name
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

    if typeof(func) == Symbol
        if !isdefined(Functions.Math, func)
            return EvaluatingException("No functions with the name: " * string(next))
        end
        func = getproperty(Functions.Math, func)
    elseif typeof(func) != Function
        return EvaluatingException("Unexpected token: " + string(func))
    end

    possible_methods = methods(func, arg_types)
    if length(possible_methods) == 0
        return EvaluatingException(
            "No functions matches this call: $(string(next))($( string(arguments_types)))",
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
