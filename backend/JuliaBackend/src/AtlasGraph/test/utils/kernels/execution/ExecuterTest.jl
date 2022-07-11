using AtlasGraph, AtlasGraph.Executer
using Test, .TestUtils
import .TestUtils as tu

@testset "Executer" begin
    begin
        node = tu.genexpression(:name, "10")
        Executer.execute_node(node)
        @test node.error === nothing
        @test node.result === 10
        @test Executer.name === 10
    end
    begin
        node = tu.genexpression(:name, "\"")
        Executer.execute_node(node)
        @test node.result === nothing
        @test typeof(node.error) == ErrorException
    end
    begin
        node = tu.genexpression(:name, "print(\"{\"foo\":5}\")")
        Executer.execute_node(node)
        @test node.result === nothing
        @test typeof(node.error) == Base.Meta.ParseError
    end
    begin
        node = ExpressionNode(Node(:name, ""), "", nothing, nothing, ["5+5"], [nothing])
        Executer.execute_node(node)
        @test node.result === nothing
        @test node.error === nothing
        @test node.helper_results == [10]
    end
    begin
        node = ExpressionNode(
            Node(:name, ""),
            "",
            nothing,
            nothing,
            ["5+5", "sin(5)"],
            [nothing],
        )
        Executer.execute_node(node)
        @test node.result === nothing
        @test node.error === nothing
        @test node.helper_results == [10, sin(5)]
    end
end
