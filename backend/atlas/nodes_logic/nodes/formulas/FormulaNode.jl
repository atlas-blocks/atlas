import Atlas.Nodes

module Atlas
module Nodes
abstract type AbstractFormulaNode <: Atlas.Node.AbstractNode end

struct FormulaNode <: AbstractFormulaNode
    node::AbstractNode
end

println(myFunc(1, "str"))

end
end