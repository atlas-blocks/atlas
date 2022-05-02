module Expressions
using ..AtlasGraph, ..Functions
using ResultTypes
export AbstractExpr, ValueExpr, NameExpr, CallExpr, eval


abstract type AbstractExpr end

struct ValueExpr <: AbstractExpr where {T}
    content::T
end

function eval(expr{T}::ValueExpr, graph::AbstractGraph)::Result{T,Exception} where {T}
    return expr.content
end


struct NameExpr <: AbstractExpr
    name::Symbol
end

function eval(expr::NameExpr, graph::AbstractGraph)::Result{Symbol,Exception}
    name = string(expr.name)
    if AtlasGraph.isexpression(graph, name)
        return AtlasGraph.getexpression(graph, name).result
    end
    return expr.name
end


struct CallExpr <: AbstractExpr
    func::AbstractExpr
    args::Vector{AbstractExpr}
end

function eval(expr::CallExpr, graph::AbstractGraph)::Result{Any,Exception}
    args = map(arg -> eval(arg, graph), expr.args)
    arg_types = map(arg -> typeof(arg), args)
    func = eval(expr.func, graph)
    if typeof(func) == Symbol
        if !isdefined(Functions.Math, token)
            return EvaluatingException("No functions with the name: " * string(next))
        end
        func = getproperty(Functions.Math, func)
    elseif typeof(func) != Function
        return EvaluatingException("Unexpected token: " + string(func))
    end

    possible_methods = methods(func, arg_types)
    if length(possible_methods) == 0
        return EvaluatingException(
            "No functions matches for this call: " *
            string(next) *
            "(" *
            string(arguments_types) *
            ")",
        )
    end
    return func(current_arguments...)
end


end
