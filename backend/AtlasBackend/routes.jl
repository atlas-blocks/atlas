using Genie.Router, AtlasGraph, JSON3
using Genie.Renderer, Genie.Renderer.Html, Genie.Renderer.Json, Genie.Requests

route("/") do
    serve_static_file("welcome.html")
    html("hello worldd")
end

route("/api/graph") do
    graph = getpayload(:graph, JSON3.write(Dict("nodes" => [], "edges" => [])))
    json(JSON3.read(AtlasGraph.updateGraph(graph)))
end
