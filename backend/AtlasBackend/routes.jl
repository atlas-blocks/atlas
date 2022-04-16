using Genie.Router, AtlasGraph
using Genie.Renderer, Genie.Renderer.Html, Genie.Renderer.Json

route("/") do
    serve_static_file("welcome.html")
    html("hello worldd")
end

route("/api/graph") do
    json(AtlasGraph.updateGraph("hello worldddd"))
end
