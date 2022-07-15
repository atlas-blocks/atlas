using AtlasGraph.Tokens
using Test, .TestUtils
import .TestUtils as tu

@testset "Tokens" begin
    @test Tokens.getnames("") == Set{Symbol}([])
    @test Tokens.getnames("ex1") == Set{Symbol}([:ex1])
    @test Tokens.getnames("ex1 + a - 5") == Set{Symbol}([:ex1, :+, :-, :a])
end
