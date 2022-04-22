module Interactions
using ..AtlasGraph, ..JsonUtils


module Endpoints
using ..AtlasGraph
using JSON3, ResultTypes

function updategraph(graph_json::JSON3.Object)::Result{JSON3.Object,Exception}
    result = AtlasGraph.updategraph!(JsonUtils.graph(graph_json))
    if ResultTypes.iserror(result)
        return unwrap_error(result)
    end
    return JsonUtils.json()
end

end

end
