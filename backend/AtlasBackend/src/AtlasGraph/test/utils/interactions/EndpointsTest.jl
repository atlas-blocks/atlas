using AtlasGraph, AtlasGraph.Interactions.Endpoints
import AtlasGraph.Interactions.Endpoints as ep
import AtlasGraph.JsonUtils as ju
using Test, .TestUtils, JSON3


@testset "Endpoints" begin
    graph = Graph([
        genexpression("ex1", "5", 5),
        genexpression("ex2", "\"str\"", "str"),
        genexpression("ex3", ""),
    ])
    @test ep.updategraph(ju.json(graph)) ≂ ju.json(AtlasGraph.updategraph(graph))
end
