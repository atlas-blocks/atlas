module FormulaUtils
using ..AtlasGraph, ..Functions
using DataStructures
export topological_order

function topological_order(
    nodes::Vector{AbstractExpressionNode},
    graph::AbstractGraph,
)::Vector{AbstractExpressionNode}
    return nodes
end

end
