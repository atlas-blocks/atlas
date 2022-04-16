using AtlasGraph
using Test

@testset "Graph" begin
    @test (node = AtlasGraph.Node("name", (5, -7), true);
    node_json = """{"name":"name","visibility":true,"position":[5,-7]}""";
    println(AtlasGraph.json(node));
    AtlasGraph.json(node) == node_json)
    @test (
        node =
            AtlasGraph.ExpressionNode(AtlasGraph.Node("name", (5, -7), true), "1 + 2", "3");
        node_json = """{"name":"name","visibility":true,"content":"1 + 2","position":[5,-7],"result":"3"}""";
        println(AtlasGraph.json(node));
        AtlasGraph.json(node) == node_json
    )
end
