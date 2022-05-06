from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
# from julia import Pkg
# Pkg.activate("./atlas/nodes_logic/")
# from julia.AtlasGraph import updateGraph
# print(updateGraph("str"))


api = Blueprint('api', __name__, url_prefix='/api')
api_wrap = Api(api)

class Graph(Resource):
    def get(self):
        print(request.args)
        graph = request.args["graph"]
        return jsonify({'graph': graph})

api_wrap.add_resource(Graph, '/graph')
