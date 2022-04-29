module Math

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

end
