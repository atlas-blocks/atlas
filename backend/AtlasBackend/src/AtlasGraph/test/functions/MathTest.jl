using AtlasGraph, AtlasGraph.Functions.Math
using Test
import .TestUtils as tu


@testset "Math" begin
    @test Math.csv2vector("") == []
    @test Math.csv2vector("1") == [[1]]
    @test Math.csv2vector("1,2,3") == [[1], [2], [3]]
    @test Math.csv2vector("1,2,3\n4,5,6") == [[1, 4], [2, 5], [3, 6]]
end
