using AtlasGraph
using Test

@testset "Graph" begin
    @test (
        node = AtlasGraph.Node("name", "pkg", (5, -7), true);
        node_json = """{"name":"name","visibility":true,"package":"pkg","position":[5,-7],"type":"AtlasGraph.Node"}""";
        println(AtlasGraph.json(node));
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
        println(AtlasGraph.json(node));
        AtlasGraph.json(node) == node_json
    )
end
