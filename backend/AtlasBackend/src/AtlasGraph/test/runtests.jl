
using AtlasGraph
using Test

"Lenient comparison operator for `struct`, both mutable and immutable (type with \\eqsim)."
@generated function ≂(x, y)
    if !isempty(fieldnames(x)) && x == y
        mapreduce(n -> :(x.$n ≂ y.$n), (a, b) -> :($a && $b), fieldnames(x))
    else
        :(x == y)
    end
end

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
        AtlasGraph.json(graph) == graph_json
    )


    @test (node = AtlasGraph.Node("name", "pkg", (5, -7), true);
    AtlasGraph.node(AtlasGraph.json(node)) ≂ node)
    @test (
        node = AtlasGraph.ExpressionNode(
            AtlasGraph.Node("name", "pkg", (5, -7), true),
            "1 + 2",
            "3",
        );
        AtlasGraph.node(AtlasGraph.json(node)) ≂ node
    )
    @test (
        node1 = AtlasGraph.Node("name1", "pkg", (5, -7), true);
        node2 = AtlasGraph.ExpressionNode(
            AtlasGraph.Node("name2", "pkg", (5, -7), true),
            "1 + 2",
            "3",
        );
        graph = AtlasGraph.Graph([node1, node2]);
        actual = AtlasGraph.graph(AtlasGraph.json(graph));
        check = (length(graph.nodes) == length(actual.nodes));
        for i in eachindex(graph.nodes)
            if (!(graph.nodes[i] ≂ actual.nodes[i]))
                check = false
            end
        end;
        check
    )
end


include("./utils/algorithms/FormulaUtilsTest.jl")
