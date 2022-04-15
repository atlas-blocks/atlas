module Nodes

abstract type AbstractNode end
mutable struct Node <: AbstractNode
    id::UInt32
    name::String
end

abstract type AbstractFormulaNode <: AbstractNode end
mutable struct FormulaNode <: AbstractFormulaNode
    node::Node
end

abstract type AbstractExpressionNode <: AbstractFormulaNode end
mutable struct ExpressionNode <: AbstractExpressionNode
    node::FormulaNode
    content::String
end

abstract type AbstractFunctionNode <: AbstractFormulaNode end
mutable struct FunctionNode <: AbstractFunctionNode
    node::FormulaNode
end

abstract type AbstractGraph end
struct Graph <: AbstractGraph
    nodes::Vector{AbstractNode}
end

end