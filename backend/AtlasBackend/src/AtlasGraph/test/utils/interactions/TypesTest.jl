using AtlasGraph, AtlasGraph.JsonUtils, AtlasGraph.Types
using Test, .TestUtils
import AtlasGraph.FormulaUtils as fu
import .TestUtils as tu
using JSON3, ResultTypes


@testset "Types" begin
    @test Types.getjson(convert(Int64, 5)) == "5"
    @test unwrap(evaluate_content(Types.getjson(convert(Int64, 5)))) == 5

    @test Types.getjson(4:5) == "4:5"
    @test unwrap(evaluate_content(Types.getjson(4:5))) == 4:5

    @test Types.getjson(convert(Int64, -5)) == "-5"
    @test unwrap(evaluate_content(Types.getjson(convert(Int64, -5)))) == -5

    @test Types.getjson([1, 2]) == "[1, 2]"
    @test unwrap(evaluate_content(Types.getjson([1, 2]))) == [1, 2]
    @test unwrap(evaluate_content(Types.getjson([]))) == []

    @test Types.getjson(Dict(1 => 2, "str" => [1, 2])) == "Dict(\"str\" => [1, 2], 1 => 2)"
    @test unwrap(evaluate_content(Types.getjson(Dict(1 => 2, "str" => [1, 2])))) ==
          Dict(1 => 2, "str" => [1, 2])
    @test unwrap(evaluate_content(Types.getjson(Dict(1 => 2)))) == Dict(1 => 2)
    @test unwrap(evaluate_content(Types.getjson(Dict()))) == Dict()
end
