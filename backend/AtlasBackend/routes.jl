using Genie.Router, AtlasGraph, JSON3
using Genie.Renderer, Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests

route("/") do
    serve_static_file("welcome.html")
    html("hello worldd")
end

route("/graph", method = Router.POST) do
    println("server < client: " * string(Requests.jsonpayload()))

    if (Requests.jsonpayload() === nothing)
        return json(Dict("success" => false, "message" => "error during parsing json: \n" * Requests.rawpayload() ))
    end

    json(Dict("success" => true, "graph" => AtlasGraph.updateGraph(Requests.jsonpayload()["graph"])))
end
