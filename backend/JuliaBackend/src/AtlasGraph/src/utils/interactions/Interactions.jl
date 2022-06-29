module Interactions
using ..AtlasGraph, ..JsonUtils


module Endpoints
using ..AtlasGraph, JSON3
import ..JsonUtils as ju


function updategraph(graph_json::JSON3.Object)::JSON3.Object
    result = AtlasGraph.updategraph!(ju.graph(graph_json))
    return ju.json(result)
end

end

end
