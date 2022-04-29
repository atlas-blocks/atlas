using AtlasGraph, AtlasGraph.JsonUtils, AtlasGraph.Types
using Test, .TestUtils
import AtlasGraph.FormulaUtils as fu
import .TestUtils as tu
using JSON3, ResultTypes


@testset "Types" begin
    @test Types.getjson(convert(Int64, 5)) == "5"
    @test unwrap(fu.evalcontent(Types.getjson(convert(Int64, 5)))) == 5
end
