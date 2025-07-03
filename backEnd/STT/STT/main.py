from flask import Flask
from web import userHandler, chatHandler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(chatHandler.chatBlueprint)
app.register_blueprint(userHandler.userBlueprint)


if __name__ == '__main__':
    app.run()


