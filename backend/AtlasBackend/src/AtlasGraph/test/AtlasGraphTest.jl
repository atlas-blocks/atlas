using AtlasGraph
using Test, .TestUtils, ResultTypes
import .TestUtils as tu


@testset "AtlasGraph" begin
    @test begin
        graph = Graph([])
        expected = Graph([])
        tu.equals(unwrap(AtlasGraph.updategraph!(graph)), expected)
    end
    @test begin
        graph = Graph([
            tu.genexpression("ex1", "5"),
            tu.genexpression("ex2", "\"str\"", "st"),
            tu.genexpression("ex3", ""),
        ])
        expected = Graph([
            tu.genexpression("ex1", "5", 5),
            tu.genexpression("ex2", "\"str\"", "str"),
            tu.genexpression("ex3", ""),
        ])
        tu.equals(unwrap(AtlasGraph.updategraph!(graph)), expected)
    end
    @test begin
        graph = Graph([
            tu.genexpression("ex1", "5"),
            tu.genexpression("ex2", "\"str\"", "st"),
            tu.genexpression("ex3", ""),
            tu.genexpression("ex4", "sin(ex1)"),
        ])
        expected = Graph([
            tu.genexpression("ex1", "5", 5),
            tu.genexpression("ex2", "\"str\"", "str"),
            tu.genexpression("ex3", ""),
            tu.genexpression("ex4", "sin(ex1)", sin(5)),
        ])
        tu.equals(unwrap(AtlasGraph.updategraph!(graph)), expected)
    end
    @test begin
        graph = Graph([
            tu.genexpression("ex1", "sin(5)", "-0.9589"),
            tu.genexpression("ex2", "ifthenelse(2 == 3, asin(ex1), ex1 * 2)", "1.9178"),
            tu.genexpression("ex3", "[-1, -2, -3]", "[-1, -2, -3, ]"),
            tu.genexpression("ex4", "ex3[1]", "-1"),
            tu.genexpression("ex5", "ex3[2:3]", "[-2, -3, ]"),
        ])
        tu.equals(unwrap(AtlasGraph.updategraph!(graph)), graph)
    end

    @test begin
        graph = Graph([tu.genexpression("ex1", "5", "5")])
        AtlasGraph.getedges(graph) == []
    end

    @test begin
        graph =
            Graph([tu.genexpression("ex1", "5", "5"), tu.genexpression("ex2", "ex1", "5")])
        AtlasGraph.getedges(graph) == [ProviderEdge("ex1", "ex2")]
    end

    @test begin
        graph = Graph([
            tu.genexpression("ex1", "5", "5"),
            tu.genexpression("ex2", "ex1 ex1", "5"),
        ])
        AtlasGraph.getedges(graph) == [ProviderEdge("ex1", "ex2")]
    end
    @test begin
        graph = Graph([
            tu.genexpression("ex1", "5", "5"),
            tu.genexpression("ex2", "ex1 ", "5"),
            tu.genexpression("ex3", "ex1 ex2 5 \"str\"", "5"),
        ])
        AtlasGraph.getedges(graph) ==
        [ProviderEdge("ex1", "ex2"), ProviderEdge("ex1", "ex3"), ProviderEdge("ex2", "ex3")]
    end
end
