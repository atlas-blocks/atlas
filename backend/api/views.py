from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource

api = Blueprint('api', __name__, url_prefix='/api')
api_wrap = Api(api)

class Graph(Resource):
    def get(self):
        return jsonify({'hello!': "world"})

api_wrap.add_resource(Graph, '/graphg/')
