using AtlasGraph, AtlasGraph.JsonUtils, AtlasGraph.Types
using Test, .TestUtils
import .TestUtils as tu
using JSON3


@testset "Types" begin
    @test Types.getjson(5) == JSON3.read("""{"type": "Int64", "content": 5}""")
    @test Types.getvalue(Types.getjson(5)) == 5
end
