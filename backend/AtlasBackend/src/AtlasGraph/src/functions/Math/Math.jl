module Math
using CSV

struct Operator
    name::Symbol
    priority::Int32
    isleftright::Bool
end

operators = Dict{Symbol,Operator}(
    :+ => Operator(:+, 0, true),
    :/ => Operator(:/, 1, true),
    :* => Operator(:^, 1, true),
    :^ => Operator(:^, 2, true),
)

function pow(base::Float64, exp::Float64)
    return base^exp
end


function ifthenelse(cond::Bool, then_result::Any, else_result::Any)
    if (cond)
        return then_result
    else
        return else_result
    end
end

function csv2vector(csv_string::AbstractString)::Vector{Vector}
    ans = Vector{Vector}()
    csv = CSV.File(IOBuffer(csv_string), header = false)
    for i = 1:length(csv)
        push!(ans, collect(csv[i]))
    end
    return length(ans) == 0 ? ans : collect(eachrow(reduce(hcat, ans)))
end

end
