from flask import Flask, render_template, url_for, request, redirect, jsonify

from atlas.config import DefaultConfig
from atlas.utils import INSTANCE_FOLDER_PATH


def create_app(config=None, app_name=None):
    """Create a Flask app."""

    if app_name is None:
        app_name = DefaultConfig.PROJECT

    app = Flask(app_name, instance_path=INSTANCE_FOLDER_PATH, instance_relative_config=True)
    configure_blueprints(app)

    return app

def configure_blueprints(app):
    """Configure blueprints in views."""

    from atlas.api import views

    for bp in [views.api]:
        app.register_blueprint(bp)


app = create_app(app_name="atlas-backend")

@app.route('/api/update', methods=['POST', 'GET'])
def updateGraph():
    return jsonify({'hello!': "world"})
