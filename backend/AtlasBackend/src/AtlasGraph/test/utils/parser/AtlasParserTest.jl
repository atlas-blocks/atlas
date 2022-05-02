using AtlasGraph, AtlasGraph.AtlasParser
using AtlasGraph.AtlasParser.Tokens,
    AtlasGraph.AtlasParser.Expressions, AtlasGraph.AtlasParser.TokenParser
using Test, .TestUtils, ResultTypes
import .TestUtils as tu


@testset "AtlasParser" begin
    empty_graph = Graph([])
    middle_graph_no_results = Graph([
        tu.genexpression("ex1", "5"),
        tu.genexpression("ex2", "\"str\"", "st"),
        tu.genexpression("ex3", ""),
        tu.genexpression("ex4", "sin(ex1)"),
    ])
    middle_graph_with_results = Graph([
        tu.genexpression("ex1", "5", 5),
        tu.genexpression("ex2", "\"str\"", "str"),
        tu.genexpression("ex3", ""),
        tu.genexpression("ex4", "sin(ex1)", sin(5)),
    ])

    @testset "Tokens" begin
        @test unwrap(Tokens.gettokens("42")) == [Token(Tokens.VALUE, Int64(42))]
        @test unwrap(Tokens.gettokens("42.02")) == [Token(Tokens.VALUE, Float64(42.02))]
        @test unwrap(Tokens.gettokens("\"42\"")) == [Token(Tokens.VALUE, "42")]
        @test unwrap(Tokens.gettokens("nothing")) == [Token(Tokens.VALUE, nothing)]
        @test unwrap(Tokens.gettokens("foo")) == [Token(Tokens.NAME, :foo)]
        @test unwrap(Tokens.gettokens("foo42bar")) == [Token(Tokens.NAME, :foo42bar)]
        @test unwrap(Tokens.gettokens("foo + bar")) ==
              [Token(Tokens.NAME, :foo), Token(Tokens.NAME, :+), Token(Tokens.NAME, :bar)]
        @test unwrap(Tokens.gettokens("foo()")) == [
            Token(Tokens.NAME, :foo),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
        @test unwrap(Tokens.gettokens("foo(bar)")) == [
            Token(Tokens.NAME, :foo),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.NAME, :bar),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
        @test unwrap(Tokens.gettokens("sind(30)")) == [
            Token(Tokens.NAME, :sind),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.VALUE, 30),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
        @test unwrap(Tokens.gettokens("foo(bar, 42)")) == [
            Token(Tokens.NAME, :foo),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.NAME, :bar),
            Token(Tokens.COMMA, ""),
            Token(Tokens.VALUE, 42),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
    end

    @testset "Precendence" begin
        @test TokenParser.is_infix_operator(Token(Tokens.NAME, :+))
    end

    @testset "evaluate" begin
        @test unwrap(evaluate_content("42", empty_graph)) == 42
        @test unwrap(evaluate_content("42.02", empty_graph)) == 42.02
        @test unwrap(evaluate_content("\"foo\"", empty_graph)) == "foo"
        @test unwrap(evaluate_content("(42)", empty_graph)) == 42
        @test unwrap(evaluate_content("4 + 2", empty_graph)) == 6
        @test unwrap(evaluate_content("4 + 2 + 3", empty_graph)) == 9
        @test unwrap(evaluate_content("4 + (2 + 3)", empty_graph)) == 9
        @test unwrap(evaluate_content("8 / 4 / 2", empty_graph)) == 1
        @test unwrap(evaluate_content("2 ^ 3 ^ 2", empty_graph)) == 2^3^2
        @test unwrap(evaluate_content("sind(30)", empty_graph)) == sind(30)
        @test unwrap(evaluate_content("[]", empty_graph)) == []
        @test unwrap(evaluate_content("[1]", empty_graph)) == [1]
        @test unwrap(evaluate_content("[1, \"foo\"]", empty_graph)) == [1, "foo"]
    end
end
