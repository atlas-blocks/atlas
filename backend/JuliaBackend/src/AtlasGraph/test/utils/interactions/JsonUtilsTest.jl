using AtlasGraph, AtlasGraph.JsonUtils
using Test, .TestUtils
import .TestUtils as tu
using JSON3

@testset "JsonUtils" begin
    begin
        node = tu.gennode(:name)
        @test JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    begin
        node = tu.genexpression(:name, "1 + 2")
        @test JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    begin
        node = tu.gentext(:name, "foo")
        @test JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    begin
        node1 = tu.gennode(:name1)
        node2 = tu.genexpression(:name2, "1 + 2")
        graph = Graph([node1, node2])
        actual = JsonUtils.graph(JsonUtils.json(graph))

        @test tu.equals(graph, actual)
    end
end
