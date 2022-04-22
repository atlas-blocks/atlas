module Interactions
using ..AtlasGraph, ..JsonUtils


module Endpoints
using ..AtlasGraph
import ..JsonUtils as ju
using JSON3, ResultTypes

function updategraph(graph_json::JSON3.Object)::Result{JSON3.Object,Exception}
    result = AtlasGraph.updategraph!(ju.graph(graph_json))
    if ResultTypes.iserror(result)
        return unwrap_error(result)
    end
    return ju.json(unwrap(result))
end

end

end
