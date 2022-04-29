using AtlasGraph, AtlasGraph.FormulaUtils
using Test
import .TestUtils as tu
import AtlasGraph.FormulaUtils as fu
using DataStructures, ResultTypes


@testset "FormulaUtils" begin
    @testset "rpn" begin
        @testset "getrpn" begin
            graph = Graph([tu.genexpression("ex1", "5", 5), tu.genexpression("ex2", "0")])

            @test tu.vec(unwrap(getrpn("1", graph))) == [1]
            @test tu.vec(unwrap(getrpn("\"str\"", graph))) == ["str"]
            @test tu.vec(unwrap(getrpn("1.24", graph))) == [1.24]
            @test tu.vec(unwrap(getrpn("sin()", graph))) ==
                  [fu.Keyword("("), fu.Keyword(")"), :sin]
            @test tu.vec(unwrap(getrpn("sin(ex1, \"ex2\")", graph))) ==
                  [fu.Keyword("("), graph.nodes[1], "ex2", fu.Keyword(")"), :sin]
        end
        @testset "evalcontent" begin
            graph = Graph([
                tu.genexpression("ex1", "5", 5),
                tu.genexpression("ex2", "\"str\"", "str"),
                tu.genexpression("ex3", ""),
            ])

            @test unwrap(evalcontent("1", graph)) == 1
            @test unwrap(evalcontent("\"str\"", graph)) == "str"
            @test unwrap(evalcontent("ex1", graph)) == 5
            @test unwrap(evalcontent("sin(ex1)", graph)) == sin(5)
            @test unwrap(evalcontent("+(ex1, 2.4)", graph)) == 7.4
            @test unwrap(evalcontent("*(\"concat\", ex2)", graph)) == "concatstr"
            @test unwrap(evalcontent("*(\"concat\", ex3)", graph)) === nothing
            @test unwrap(evalcontent("nothing", graph)) === nothing
        end

        @testset "gettokens" begin
            @test unwrap(gettokens("foo")) == [:foo]
            @test unwrap(gettokens("\"\"")) == [""]
            @test unwrap(gettokens("\"aba\"")) == ["aba"]
            @test unwrap(gettokens("\"ab\\\"a\"")) == ["ab\\\"a"]
            @test unwrap(gettokens("1")) == [1]
            @test unwrap(gettokens("194")) == [194]
            @test unwrap(gettokens("194.43")) == [194.43]
            @test unwrap(gettokens("foo()")) == [:foo, fu.Keyword("("), fu.Keyword(")")]
            @test unwrap(gettokens("foo(a, b)")) ==
                  [:foo, fu.Keyword("("), :a, :b, fu.Keyword(")")]
            @test unwrap(gettokens("foo(a, \"abba\")")) ==
                  [:foo, fu.Keyword("("), :a, "abba", fu.Keyword(")")]
            @test unwrap(gettokens("foo(a, bar(5, b))")) == [
                :foo,
                fu.Keyword("("),
                :a,
                :bar,
                fu.Keyword("("),
                5,
                :b,
                fu.Keyword(")"),
                fu.Keyword(")"),
            ]
        end
    end

    @testset "matching" begin
        @test (  # usual case
            fu.match_prefix_int("123abba").match == "123"
        )
        @test (  # usual case, end of the string
            fu.match_prefix_int("123").match == "123"
        )
        @test (  # float
            fu.match_prefix_int("123.45").match == "123"
        )
        @test (  # not an int
            fu.match_prefix_int("sd123.45") === nothing
        )

        @test (  # usual case
            fu.match_prefix_float("123.34abba").match == "123.34"
        )
        @test (  # edge case
            fu.match_prefix_float("123.abba") === nothing
        )
        @test (  # int case
            fu.match_prefix_float("123abba") === nothing
        )
        @test (  # usual case, end of the string
            fu.match_prefix_float("123.43").match == "123.43"
        )
        @test (  # not a float
            fu.match_prefix_float("sd123.45") === nothing
        )

        @test (  # full fledged example
            fu.match_prefix_string("\"ak\\\"shd\"f\"").match == "\"ak\\\"shd\""
        )
        @test (  # usual case
            fu.match_prefix_string("\"abba\"").match == "\"abba\""
        )
        @test (  # empty string
            fu.match_prefix_string("\"\"").match == "\"\""
        )
        @test (  # no bracket at the end
            fu.match_prefix_string("\"abba") === nothing
        )
        @test (  # no bracket at the beggining
            fu.match_prefix_string("abba\"") === nothing
        )

        @test fu.match_prefix_symbol("foo").match == "foo"
        @test fu.match_prefix_symbol("fo_o34").match == "fo_o34"
        @test fu.match_prefix_symbol("1foo") === nothing
        @test fu.match_prefix_operator("+ asdhf").match == "+"
        @test fu.match_prefix_operator("<=").match == "<="
    end
end
