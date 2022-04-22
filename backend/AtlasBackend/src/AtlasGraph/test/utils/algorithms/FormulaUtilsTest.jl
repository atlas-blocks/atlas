using AtlasGraph, AtlasGraph.FormulaUtils
using Test
import AtlasGraph.FormulaUtils as fu
using DataStructures, ResultTypes

function genenode(name::AbstractString)::Node
    return Node(name, "pkg", (0, 0), false)
end

function genexpression(
    name::AbstractString,
    content::AbstractString,
    result::Any,
)::ExpressionNode
    return ExpressionNode(genenode(name), content, result)
end
function genexpression(name::AbstractString, content::AbstractString)::ExpressionNode
    return genexpression(name, content, nothing)
end

function vec(queue)
    v = Vector{Any}()
    while !isempty(queue)
        push!(v, dequeue!(queue))
    end
    return v
end

@testset "FormulaUtils" begin

    @testset "rpn" begin
        @testset "getrpn" begin
            graph = Graph([genexpression("ex1", "5", 5), genexpression("ex2", "0")])

            @test vec(unwrap(getrpn("1", graph))) == [1]
            @test vec(unwrap(getrpn("\"str\"", graph))) == ["str"]
            @test vec(unwrap(getrpn("1.24", graph))) == [1.24]
            @test vec(unwrap(getrpn("__\$sin\$__()", graph))) ==
                  [fu.Keyword("("), fu.Keyword(")"), :sin]
            @test vec(unwrap(getrpn("__\$sin\$__(__\$ex1\$__, \"ex2\")", graph))) ==
                  [fu.Keyword("("), graph.nodes[1], "ex2", fu.Keyword(")"), :sin]
        end
        @testset "evalcontent" begin
            graph = Graph([
                genexpression("ex1", "5", 5),
                genexpression("ex2", "\"str\"", "str"),
                genexpression("ex3", ""),
            ])

            @test unwrap(evalcontent("1", graph)) == 1
            @test unwrap(evalcontent("\"str\"", graph)) == "str"
            @test unwrap(evalcontent("__\$ex1\$__", graph)) == 5
            @test unwrap(evalcontent("__\$sin\$__(__\$ex1\$__)", graph)) == sin(5)
            @test unwrap(evalcontent("__\$+\$__(__\$ex1\$__, 2.4)", graph)) == 7.4
            @test unwrap(evalcontent("__\$*\$__(\"concat\", __\$ex2\$__)", graph)) ==
                  "concatstr"
            @test unwrap(evalcontent("__\$*\$__(\"concat\", __\$ex3\$__)", graph)) ===
                  nothing
        end

        @testset "gettokens" begin
            @test unwrap(gettokens("__\$foo\$__")) == [:foo]
            @test unwrap(gettokens("\"\"")) == [""]
            @test unwrap(gettokens("\"aba\"")) == ["aba"]
            @test unwrap(gettokens("\"ab\\\"a\"")) == ["ab\\\"a"]
            @test unwrap(gettokens("1")) == [1]
            @test unwrap(gettokens("194")) == [194]
            @test unwrap(gettokens("194.43")) == [194.43]
            @test unwrap(gettokens("__\$foo\$__()")) ==
                  [:foo, fu.Keyword("("), fu.Keyword(")")]
            @test unwrap(gettokens("__\$foo\$__(__\$a\$__, __\$b\$__)")) ==
                  [:foo, fu.Keyword("("), :a, :b, fu.Keyword(")")]
            @test unwrap(gettokens("__\$foo\$__(__\$a\$__, \"abba\")")) ==
                  [:foo, fu.Keyword("("), :a, "abba", fu.Keyword(")")]
            @test unwrap(gettokens("__\$foo\$__(__\$a\$__, __\$bar\$__(5, __\$b\$__))")) ==
                  [
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

        @test fu.match_prefix_node("__\$foo\$__").match == "__\$foo\$__"
        @test fu.match_prefix_node("__\$foo\$__(__\$a\$__, __\$b\$__)").match ==
              "__\$foo\$__"
    end
end
