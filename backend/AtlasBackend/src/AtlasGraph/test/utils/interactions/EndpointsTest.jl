using AtlasGraph, AtlasGraph.JsonUtils, AtlasGraph.Interactions.Endpoints
import AtlasGraph.Interactions.Endpoints as ep
import AtlasGraph.JsonUtils as ju
using Test, .TestUtils, ResultTypes
import .TestUtils as tu


@testset "Endpoints" begin
    graph = Graph([
        tu.genexpression("ex1", "5", 5),
        tu.genexpression("ex2", "\"str\"", "str"),
        tu.genexpression("ex3", ""),
    ])
    @test unwrap(ep.updategraph(ju.json(graph))) == ju.json(unwrap(AtlasGraph.updategraph!(graph)))
end
