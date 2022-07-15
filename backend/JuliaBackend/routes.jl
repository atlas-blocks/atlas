using Genie.Router, AtlasGraph.Interactions.Endpoints, JSON3
using Genie.Renderer.Json, Genie.Requests


route("/graph", method = Router.POST) do
    println("server < client: " * string(Requests.jsonpayload())[1:min(end, 1000)])

    if (Requests.jsonpayload() === nothing)
        return json(
            Dict(
                "success" => false,
                "message" => "error during parsing json: \n" * Requests.rawpayload(),
            ),
        )
    end

    result = Endpoints.updategraph(Requests.jsonpayload()["graph"])
    json(Dict("success" => true, "graph" => result))
end
