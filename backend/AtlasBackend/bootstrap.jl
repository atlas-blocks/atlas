(pwd() != @__DIR__) && cd(@__DIR__) # allow starting app from bin/ dir

using AtlasBackend
push!(Base.modules_warned_for, Base.PkgId(AtlasBackend))
AtlasBackend.main()
