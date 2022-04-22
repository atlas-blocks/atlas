using AtlasGraph, AtlasGraph.FormulaUtils
using Test

@testset "FormulaUtils" begin

    @testset "rpn" begin end

    @testset "matching" begin
        @test (  # usual case
            FormulaUtils.match_prefix_int("123abba").match == "123"
        )
        @test (  # usual case, end of the string
            FormulaUtils.match_prefix_int("123").match == "123"
        )
        @test (  # float
            FormulaUtils.match_prefix_int("123.45").match == "123"
        )
        @test (  # not an int
            FormulaUtils.match_prefix_int("sd123.45") === nothing
        )

        @test (  # usual case
            FormulaUtils.match_prefix_float("123.34abba").match == "123.34"
        )
        @test (  # edge case
            FormulaUtils.match_prefix_float("123.abba") === nothing
        )
        @test (  # int case
            FormulaUtils.match_prefix_float("123abba") === nothing
        )
        @test (  # usual case, end of the string
            FormulaUtils.match_prefix_float("123.43").match == "123.43"
        )
        @test (  # not a float
            FormulaUtils.match_prefix_float("sd123.45") === nothing
        )

        @test (  # full fledged example
            FormulaUtils.match_prefix_string("\"ak\\\"shd\"f\"").match == "\"ak\\\"shd\""
        )
        @test (  # usual case
            FormulaUtils.match_prefix_string("\"abba\"").match == "\"abba\""
        )
        @test (  # empty string
            FormulaUtils.match_prefix_string("\"\"").match == "\"\""
        )
        @test (  # no bracket at the end
            FormulaUtils.match_prefix_string("\"abba") === nothing
        )
        @test (  # no bracket at the beggining
            FormulaUtils.match_prefix_string("abba\"") === nothing
        )
    end
end
