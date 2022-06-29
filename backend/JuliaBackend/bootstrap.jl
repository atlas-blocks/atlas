(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using JuliaBackend
push!(Base.modules_warned_for, Base.PkgId(JuliaBackend))
JuliaBackend.main()
