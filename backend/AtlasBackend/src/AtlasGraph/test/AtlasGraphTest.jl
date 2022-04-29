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
end
