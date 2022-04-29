using AtlasGraph, AtlasGraph.JsonUtils, AtlasGraph.Types
using Test, .TestUtils
import .TestUtils as tu
using JSON3

@testset "JsonUtils" begin
    @test begin
        node = Node("name", "pkg", (5, -7), true)
        node_json = """{"name":"name","visibility":true,"package":"pkg","position":[5,-7],"type":"Node"}"""
        JsonUtils.json(node) == JSON3.read(node_json)
    end
    @test begin
        node = ExpressionNode(Node("name", "pkg", (5, -7), true), "1 + 2", 3)
        node_json =
            """{"name":"name","visibility":true,"content":"1 + 2","package":"pkg",""" *
            """"position":[5,-7],"type":"ExpressionNode","result":{"type":"Int64","content":3}}}"""
        JsonUtils.json(node) == JSON3.read(node_json)
    end
    @test begin
        node1 = Node("name1", "pkg", (5, -7), true)
        node2 = ExpressionNode(Node("name2", "pkg", (5, -7), true), "1 + 2", 3)
        graph = Graph([node1, node2])
        graph_json =
            """{"nodes":[{"name":"name1","visibility":true,"package":"pkg","position":[5,-7],"type":"Node"},""" *
            """{"name":"name2","visibility":true,"content":"1 + 2","package":"pkg","position":[5,-7],"type":"ExpressionNode","result":{"type":"Int64","content":3}}],"edges":[]}"""
        JsonUtils.json(graph) == JSON3.read(graph_json)
    end


    @test begin
        node = Node("name", "pkg", (5, -7), true)
        JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    @test begin
        node = ExpressionNode(Node("name", "pkg", (5, -7), true), "1 + 2", 3)
        JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    @test begin
        node1 = Node("name1", "pkg", (5, -7), true)
        node2 = ExpressionNode(Node("name2", "pkg", (5, -7), true), "1 + 2", 3)
        graph = Graph([node1, node2])
        actual = JsonUtils.graph(JsonUtils.json(graph))

        tu.equals(graph, actual)
    end
end
