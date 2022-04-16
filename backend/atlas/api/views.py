from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource

api = Blueprint('api', __name__, url_prefix='/api')
api_wrap = Api(api)

class Graph(Resource):
    def get(self):
        print(request.args)
        graph = request.args["graph"]
        updated_node_id = request.args["updated_node_id"]
        return jsonify({'graph': graph, 'updated_node_id': updated_node_id})

api_wrap.add_resource(Graph, '/graph')
