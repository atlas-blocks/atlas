__precompile__() # this module is safe to precompile
module Example
using PyCall
const math = PyNULL()

function __init__()
    copy!(math, pyimport("math"))
end

end
