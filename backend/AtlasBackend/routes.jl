using Genie.Router, AtlasGraph.Interactions.Endpoints, JSON3
using Genie.Renderer.Json, Genie.Requests, ResultTypes

route("/") do
    serve_static_file("welcome.html")
    html("hello worldd")
end

route("/graph", method = Router.POST) do
    println("server < client: " * string(Requests.jsonpayload()))

    if (Requests.jsonpayload() === nothing)
        return json(Dict("success" => false, "message" => "error during parsing json: \n" * Requests.rawpayload() ))
    end

    @show typeof(Requests.jsonpayload())
    result = Endpoints.updategraph(Requests.jsonpayload()["graph"])
    if ResultTypes.iserror(result)
        return json(Dict("success" => false, "message" => string(unwrap_error(result))))
    end
    json(Dict("success" => true, "graph" => unwrap(result)))
end
