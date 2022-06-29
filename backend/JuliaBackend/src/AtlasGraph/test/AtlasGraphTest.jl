using AtlasGraph
using Test, .TestUtils
import .TestUtils as tu


@testset "AtlasGraph" begin
    begin
        graph = Graph(:name, AbstractNode[])
        expected = Graph(:name, AbstractNode[])
        @test tu.equals(AtlasGraph.updategraph!(graph), expected)
    end
    begin
        graph = Graph([
            tu.genexpression(:ex1, "5"),
            tu.genexpression(:ex2, "\"str\"", "st"),
            tu.genexpression(:ex3, ""),
            tu.gentext(:ex4, "abc"),
            tu.genexpression(:ex5, "ex4 * \"123\""),
        ])
        expected = Graph([
            tu.genexpression(:ex1, "5", 5),
            tu.genexpression(:ex2, "\"str\"", "str"),
            tu.genexpression(:ex3, ""),
            tu.gentext(:ex4, "abc"),
            tu.genexpression(:ex5, "ex4 * \"123\"", "abc123"),
        ])
        @test tu.equals(AtlasGraph.updategraph!(graph), expected)
    end
    begin
        graph = Graph([
            tu.genexpression(:ex1, "5"),
            tu.genexpression(:ex2, "\"str\"", "st"),
            tu.genexpression(:ex3, ""),
            tu.genexpression(:ex4, "sin(ex1)"),
        ])
        expected = Graph([
            tu.genexpression(:ex1, "5", 5),
            tu.genexpression(:ex2, "\"str\"", "str"),
            tu.genexpression(:ex3, ""),
            tu.genexpression(:ex4, "sin(ex1)", sin(5)),
        ])
        @test tu.equals(AtlasGraph.updategraph!(graph), expected)
    end
    begin
        graph = Graph([
            tu.genexpression(:ex1, "sin(5)", "-0.9589"),
            tu.genexpression(:ex2, "ifthenelse(2 == 3, asin(ex1), ex1 * 2)", "1.9178"),
            tu.genexpression(:ex3, "[-1, -2, -3]", "[-1, -2, -3]"),
            tu.genexpression(:ex4, "ex3[1]", "-1"),
            tu.genexpression(:ex5, "ex3[2..3]", "[-2, -3]"),
        ])
        @test tu.equals(AtlasGraph.updategraph!(graph), graph)
    end

    begin
        graph = Graph([tu.genexpression(:ex1, "5", "5")])
        @test AtlasGraph.getedges(graph) == []
    end

    begin
        graph =
            Graph([tu.genexpression(:ex1, "5", "5"), tu.genexpression(:ex2, "ex1", "5")])
        @test AtlasGraph.getedges(graph) == [ProviderEdge(:ex1, :ex2)]
    end

    begin
        graph = Graph([
            tu.genexpression(:ex1, "5", "5"),
            tu.genexpression(:ex2, "ex1 - ex1", "5"),
        ])
        @test AtlasGraph.getedges(graph) ==
              [ProviderEdge(:-, :ex2), ProviderEdge(:ex1, :ex2)]
    end
    begin
        graph = Graph([
            tu.genexpression(:ex1, "5", "5"),
            tu.genexpression(:ex2, "ex1 ", "5"),
            tu.genexpression(:ex3, "ex1 - ex2 - 5 - \"str\"", "5"),
        ])
        @test AtlasGraph.getedges(graph) == [
            ProviderEdge(:ex1, :ex2),
            ProviderEdge(:ex2, :ex3),
            ProviderEdge(:-, :ex3),
            ProviderEdge(:ex1, :ex3),
        ]
    end
end