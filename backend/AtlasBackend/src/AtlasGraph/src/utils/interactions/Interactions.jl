module Interactions
using ..AtlasGraph
using ..AtlasGraph: JsonUtils
using JSON3


function updateGraph(graph_json::JSON3.Object)::JSON3.Object
    return JsonUtils.json(AtlasGraph.updateGraph!(JsonUtils.graph(graph_json)))
end

end
