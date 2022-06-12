using AtlasGraph, AtlasGraph.FormulaUtils
using Test
import .TestUtils as tu
import AtlasGraph.FormulaUtils as fu
using DataStructures, ResultTypes


@testset "topological_order" begin
    empty_graph = Graph(AbstractNode[])
    graph_no_results = Graph([
        tu.genexpression(:ex1, "5"),
        tu.genexpression(:ex2, "\"str\"", "st"),
        tu.genexpression(:ex3, ""),
        tu.genexpression(:ex4, "sin(ex1)"),
    ])
    @testset "rpn" begin
        @test fu.topological_order(AbstractExpressionNode[], empty_graph) == []
    end
end
