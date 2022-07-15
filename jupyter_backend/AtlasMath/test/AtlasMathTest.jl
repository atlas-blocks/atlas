using AtlasMath
using Test

@testset "AtlasMath" begin
    @test Math.csv2vector("") == []
    @test Math.csv2vector("1") == [[1]]
    @test Math.csv2vector("1,2,3") == [[1], [2], [3]]
    @test Math.csv2vector("1,2,3\n4,5,6") == [[1, 4], [2, 5], [3, 6]]
    @test Math.csv2matrix("1,2,3\n4,5,6") == [









    14; 









    25;; 









    36]
end
