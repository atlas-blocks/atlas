using AtlasGraph, AtlasGraph.JsonUtils
using Test, .TestUtils
import .TestUtils as tu
using JSON3

@testset "JsonUtils" begin
    @testset "to JSON" begin
        begin
            node = Node(:name, "data")
            node_json = """{"name":"name","uidata":"data","type":"Node"}"""
            @test JsonUtils.json(node) == JSON3.read(node_json)
        end
        begin
            node = TextNode(Node(:name, "data"), "foo")
            node_json = """{"name":"name","content":"foo","uidata":"data","type":"TextNode"}"""
            @test JsonUtils.json(node) == JSON3.read(node_json)
        end
        begin
            node = ExpressionNode(Node(:name, "data"), "1 + 2", 3)
            node_json = """{"name":"name","content":"1 + 2","uidata":"data","type":"ExpressionNode","result":"3"}"""
            @test JsonUtils.json(node) == JSON3.read(node_json)
        end
        begin
            node1 = Node(:name1, "data")
            node2 = ExpressionNode(Node(:name2, "data"), "name1", 3)
            graph = Graph([node1, node2])
            graph_json =
                """{"nodes":[{"name":"name1","uidata":"data","type":"Node"},""" *
                """{"name":"name2","uidata":"data","content":"name1","type":"ExpressionNode","result":"3"}],""" *
                """"edges":[{"from":"name1","to":"name2"}]}"""
            @test JsonUtils.json(graph) == JSON3.read(graph_json)
        end

        begin
            edge = ProviderEdge(:ex1, :ex2)
            edge_json = """{"from":"ex1","to":"ex2"}"""
            @test JsonUtils.json(edge) == JSON3.read(edge_json)
        end
    end


    @testset "from JSON" begin
        begin
            node = tu.gennode(:name)
            @test JsonUtils.node(JsonUtils.json(node)) ≂ node
        end
        begin
            node = tu.genexpression(:name, "1 + 2")
            @test JsonUtils.node(JsonUtils.json(node)) ≂ node
        end
        begin
            node = tu.genfile(:name, "foo", "bar.txt")
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
end
