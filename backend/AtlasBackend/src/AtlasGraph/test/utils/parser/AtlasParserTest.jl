using AtlasGraph, AtlasGraph.AtlasParser
using AtlasGraph.AtlasParser.Tokens,
    AtlasGraph.AtlasParser.Expressions, AtlasGraph.AtlasParser.TokenParser
using Test, .TestUtils, ResultTypes
import .TestUtils as tu


@testset "AtlasParser" begin
    empty_graph = Graph([])
    graph_no_results = Graph([
        tu.genexpression("ex1", "5"),
        tu.genexpression("ex2", "\"str\"", "st"),
        tu.genexpression("ex3", ""),
        tu.genexpression("ex4", "sin(ex1)"),
        tu.gentext("ex5", "1,2,3\n5,6,7"),
        tu.genfile("ex6", "abc", "foo.txt"),
    ])
    graph_with_results = Graph([
        tu.genexpression("ex1", "5", 5),
        tu.genexpression("ex2", "\"str\"", "str"),
        tu.genexpression("ex3", ""),
        tu.genexpression("ex4", "sin(ex1)", sin(5)),
        tu.gentext("ex5", "1,2,3\n5,6,7"),
        tu.genfile("ex6", "abc", "foo.txt"),
    ])

    @testset "Tokens" begin
        @test unwrap(Tokens.gettokens("42")) == [Token(Tokens.VALUE, Int64(42))]
        @test unwrap(Tokens.gettokens("42.02")) == [Token(Tokens.VALUE, Float64(42.02))]
        @test unwrap(Tokens.gettokens("42.02e-5")) ==
              [Token(Tokens.VALUE, Float64(42.02e-5))]
        @test unwrap(Tokens.gettokens("42.02e+5")) ==
              [Token(Tokens.VALUE, Float64(42.02e5))]
        @test unwrap(Tokens.gettokens("42e5")) == [Token(Tokens.VALUE, Float64(42e5))]
        @test unwrap(Tokens.gettokens("42.02e5")) == [Token(Tokens.VALUE, Float64(42.02e5))]
        @test unwrap(Tokens.gettokens("\"\"")) == [Token(Tokens.VALUE, "")]
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
        @test unwrap(Tokens.gettokens("foo(bar, 42)")) == [
            Token(Tokens.NAME, :foo),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.NAME, :bar),
            Token(Tokens.COMMA, ""),
            Token(Tokens.VALUE, 42),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
        @test unwrap(Tokens.gettokens("foo(bar, foobar(42))")) == [
            Token(Tokens.NAME, :foo),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.NAME, :bar),
            Token(Tokens.COMMA, ""),
            Token(Tokens.NAME, :foobar),
            Token(Tokens.LEFT_PAREN, ""),
            Token(Tokens.VALUE, 42),
            Token(Tokens.RIGHT_PAREN, ""),
            Token(Tokens.RIGHT_PAREN, ""),
        ]
    end

    @testset "evaluate" begin
        @test unwrap(evaluate_content("42", empty_graph)) == 42
        # @test unwrap(evaluate_content("\"ab\\n\"", empty_graph)) == "ab\n"
        @test unwrap(evaluate_content("42.02", empty_graph)) == 42.02
        @test unwrap(evaluate_content("\"foo\"", empty_graph)) == "foo"
        @test unwrap(evaluate_content("(42)", empty_graph)) == 42
        @test unwrap(evaluate_content("4 + 2", empty_graph)) == 6
        @test unwrap(evaluate_content("4 + 2 + 3", empty_graph)) == 9
        @test unwrap(evaluate_content("4 + (2 + 3)", empty_graph)) == 9
        @test unwrap(evaluate_content("8 / 4 / 2", empty_graph)) == 1
        @test unwrap(evaluate_content("2 ^ 3 ^ 2", empty_graph)) == 2^3^2

        @testset "Calls" begin
            @test unwrap(evaluate_content("sind(30)", empty_graph)) == sind(30)
            @test unwrap(evaluate_content("sind(30)", empty_graph)) == sind(30)
            @test unwrap(evaluate_content("4.2 + ex1", graph_with_results)) == 9.2
            @test unwrap(
                evaluate_content("ifthenelse(2 == 3, 2, ex1)", graph_with_results),
            ) == 5
            @test unwrap(
                evaluate_content("ifthenelse(3 == 3, 2, ex1)", graph_with_results),
            ) == 2
            @test unwrap(
                evaluate_content(
                    "ifthenelse(2 == 3, sin(ex1), 2 * ex1)",
                    graph_with_results,
                ),
            ) == 10
            @test unwrap(evaluate_content("map(sqrt, [1, 2])", empty_graph)) ==
                  [sqrt(1), sqrt(2)]
            @test unwrap(evaluate_content("csv2vector(ex5)", graph_with_results)) ==
                  [[1, 5], [2, 6], [3, 7]]
        end

        @testset "Dot property accessing" begin
            @test unwrap(evaluate_content("Base.sind(30)", empty_graph)) == sind(30)
            @test unwrap(evaluate_content("1 + Base.sind(30)^3", empty_graph)) ==
                  1 + sind(30)^3
        end

        @testset "Vectors" begin
            @test unwrap(evaluate_content("[]", empty_graph)) == []
            @test unwrap(evaluate_content("[1]", empty_graph)) == [1]
            @test unwrap(evaluate_content("[1, \"foo\"]", empty_graph)) == [1, "foo"]
            @test unwrap(evaluate_content("[1, \"foo\"][2]", empty_graph)) == "foo"
            @test unwrap(evaluate_content("4..5", empty_graph)) == 4:5
            # @test unwrap(evaluate_content("[1, 2, 3, 4, 5] .< 3", empty_graph)) ==
            #       BitVector([1, 1, 0, 0, 0])
            @test unwrap(evaluate_content("[1, \"foo\", 5][1..2]", empty_graph)) ==
                  [1, "foo"]
        end

        @testset "Python libs" begin
            @test unwrap(evaluate_content("math.sin(1)", empty_graph)) == sin(1)
        end

        @testset "FileNode" begin
            @test unwrap(evaluate_content("ex6", graph_with_results)) == "abc"
        end
    end

    @testset "matching" begin
        @test Tokens.match_int("123abba").match == "123"
        @test Tokens.match_int("123").match == "123"
        @test Tokens.match_int("123.45").match == "123"
        @test Tokens.match_int("sd123.45") === nothing

        @test Tokens.match_float("123.34abba").match == "123.34"
        @test Tokens.match_float("123.abba") === nothing
        @test Tokens.match_float("123abba") === nothing
        @test Tokens.match_float("123.43").match == "123.43"
        @test Tokens.match_float("sd123.45") === nothing

        @test Tokens.match_string("\"ak\\\"shd\"f\"").match == "\"ak\\\"shd\""
        @test Tokens.match_string("\"abba\"").match == "\"abba\""
        @test Tokens.match_string("\"\"").match == "\"\""
        @test Tokens.match_string("\"abba") === nothing
        @test Tokens.match_string("abba\"") === nothing


        @test Tokens.match_name("foo").match == "foo"
        @test Tokens.match_name("fo_o34").match == "fo_o34"
        @test Tokens.match_name("1foo") === nothing
        @test Tokens.match_operator("+ asdhf").match == "+"
        @test Tokens.match_operator("<=").match == "<="
    end
end
