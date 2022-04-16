using AtlasGraph
using Test

@testset "Graph" begin
    @test AtlasGraph.toJSON(AtlasGraph.Node(1, "name", "description", (5, -7), true)) == "node json"
end