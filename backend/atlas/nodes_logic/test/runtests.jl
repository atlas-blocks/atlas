using AtlasGraph
using Test

@testset "Graph" begin
    @test (
        node = AtlasGraph.Node("name", "pkg", (5, -7), true);
        node_json = """{"name":"name","visibility":true,"package":"pkg","position":[5,-7],"type":"AtlasGraph.Node"}""";
        AtlasGraph.json(node) == node_json
    )
    @test (
        node = AtlasGraph.ExpressionNode(
            AtlasGraph.Node("name", "pkg", (5, -7), true),
            "1 + 2",
            "3",
        );
        node_json =
            """{"name":"name","visibility":true,"content":"1 + 2","package":"pkg",""" *
            """"position":[5,-7],"type":"AtlasGraph.ExpressionNode","result":"3"}""";
        AtlasGraph.json(node) == node_json
    )
    @test (
        node1 = AtlasGraph.Node("name1", "pkg", (5, -7), true);
        node2 = AtlasGraph.ExpressionNode(
            AtlasGraph.Node("name2", "pkg", (5, -7), true),
            "1 + 2",
            "3",
        );
        graph = AtlasGraph.Graph([node1, node2]);
        graph_json =
            """{"nodes":[{"name":"name1","visibility":true,"package":"pkg","position":[5,-7],"type":"AtlasGraph.Node"},""" *
            """{"name":"name2","visibility":true,"content":"1 + 2","package":"pkg","position":[5,-7],"type":"AtlasGraph.ExpressionNode","result":"3"}],"edges":[]}""";
        println(AtlasGraph.json(graph));
        AtlasGraph.json(graph) == graph_json
    )
end
