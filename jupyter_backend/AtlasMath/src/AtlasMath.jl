module AtlasMath
using CSV, JSON3

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

function csv2matrix(csv_string::AbstractString)::Matrix
    return reduce(hcat, csv2vector(csv_string))
end

end
