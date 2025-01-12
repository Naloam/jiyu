import re

import bcrypt
from flask import Blueprint, json, request, jsonify
from dao import userService
import uuid
from web.jwtHandler import verify
from web.jwtHandler import generate
from dao import knowledgeService

userBlueprint = Blueprint('user', __name__, url_prefix='/users')


@userBlueprint.route('/signup', methods=['POST'])
def signup():
    # 获取前端json数据
    data = json.loads(request.get_data())
    # 获取数据
    name = data["userName"]
    password = data["password"]

    # 生成所谓的userId
    userId = str(uuid.uuid4())[:18]
    # 密码加密
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))+

    password = password.decode('utf-8')
    # 插入数据库
    # res = userService.insert(name, password, userId) and knowledgeService.insert(userId)
    if res:
        return jsonify({"message": "signup success"})
    else:
        return jsonify({"message": "duplicate userName"})


@userBlueprint.route('/login', methods=['POST'])
def login():
    data = json.loads(request.get_data())
    userName = data["userName"]
    password = data["password"]
    # 校验密码
    u, ok = userService.findByName(userName)
    if not ok:
        return jsonify({"message": "username not found or invalid password"})
    res = False
    # 校验密码
    # id, userName, userId, password
    print(u[3])
    if bcrypt.checkpw(password.encode(), u[3].encode()):
        res = True

    if res:
        jwt_token = generate.generate_jwt_token(u[1])
        print(jwt_token)
        return jsonify({"message": "login success", "token": jwt_token})
    else:
        return jsonify({"message": "username not found or invalid password"})


# @userBlueprint.route('/knowledgeRoadMap', methods=['POST'])
# def knowledgeRoadMap():
#     data = json.loads(request.get_data())
#     userId, ok = verify.verify(data["userId"])
#     if not ok:
#         return jsonify({"message": "invalid token"})
#     print(userId)
#     res, ok = knowledgeService.findByUserId(userId)
#     if not ok:
#         return jsonify({"message": "system error"})
#     return jsonify({"message": "true", "data": res[1:]})
#
#
# @userBlueprint.route('/updateKnowledgeRoadMap', methods=['POST'])
# def updateKnowledgeRoadMap():
#     data = json.loads(request.get_data())
#     userId, ok = verify.verify(data["userId"])
#     if not ok:
#         return jsonify({"message": "invalid token"})
#     print(userId)
#     ok = knowledgeService.update(userId, data["progressData"])
#     if not ok:
#         return jsonify({"message": "system error"})
#     return jsonify({"message": "true"})
