using AtlasGraph, AtlasGraph.JsonUtils
using Test
using JSON3

"Lenient comparison operator for `struct`, both mutable and immutable (type with \\eqsim)."
@generated function ≂(x, y)
    if !isempty(fieldnames(x)) && x == y
        mapreduce(n -> :(x.$n ≂ y.$n), (a, b) -> :($a && $b), fieldnames(x))
    else
        :(x == y)
    end
end

@testset "Graph" begin
    @test begin
        node = Node("name", "pkg", (5, -7), true)
        node_json = """{"name":"name","visibility":true,"package":"pkg","position":[5,-7],"type":"Node"}"""
        JsonUtils.json(node) == JSON3.read(node_json)
    end
    @test begin
        node = ExpressionNode(Node("name", "pkg", (5, -7), true), "1 + 2", "3")
        node_json =
            """{"name":"name","visibility":true,"content":"1 + 2","package":"pkg",""" *
            """"position":[5,-7],"type":"ExpressionNode","result":"3"}"""
        JsonUtils.json(node) == JSON3.read(node_json)
    end
    @test begin
        node1 = Node("name1", "pkg", (5, -7), true)
        node2 = ExpressionNode(Node("name2", "pkg", (5, -7), true), "1 + 2", "3")
        graph = Graph([node1, node2])
        graph_json =
            """{"nodes":[{"name":"name1","visibility":true,"package":"pkg","position":[5,-7],"type":"Node"},""" *
            """{"name":"name2","visibility":true,"content":"1 + 2","package":"pkg","position":[5,-7],"type":"ExpressionNode","result":"3"}],"edges":[]}"""
        JsonUtils.json(graph) == JSON3.read(graph_json)
    end


    @test begin
        node = Node("name", "pkg", (5, -7), true)
        JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    @test begin
        node = ExpressionNode(Node("name", "pkg", (5, -7), true), "1 + 2", "3")
        JsonUtils.node(JsonUtils.json(node)) ≂ node
    end
    @test begin
        node1 = Node("name1", "pkg", (5, -7), true)
        node2 = ExpressionNode(Node("name2", "pkg", (5, -7), true), "1 + 2", "3")
        graph = Graph([node1, node2])
        actual = JsonUtils.graph(JsonUtils.json(graph))
        check = (length(graph.nodes) == length(actual.nodes))
        for i in eachindex(graph.nodes)
            if (!(graph.nodes[i] ≂ actual.nodes[i]))
                check = false
            end
        end
        check
    end
end
