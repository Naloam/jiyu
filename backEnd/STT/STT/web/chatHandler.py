import re

import bcrypt
from flask import Blueprint, json, request, jsonify
from dao import userService
import uuid
from web.jwtHandler import verify
from web.jwtHandler import generate
from dao import knowledgeService
from xuexixitong.General_QA.GeneralQA import generalQA
from xuexixitong.Feynman.Feynman_flow import Feynman_flow
from tools.generatePic import base64_to_img
from tools.picToRemote import saveImageToRemote
from xuexixitong.correct_QA.utils.llm_tools import OCR_by_llm
from xuexixitong.correct_QA.model import QA_flow
from dao.chatService import output_theme, get_history

chatBlueprint = Blueprint('chat', __name__, url_prefix='/chat')


@chatBlueprint.route('/setuserN', methods=['POST'])
def setuserN():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    conversationId = data["conId"]
    inputt = data["userinfo"]
    step = int(data["step"])
    result = generalQA(userId, conversationId, inputt, step)
    print(result)
    return jsonify({"botanswer": result[0], "step": result[1], "message": "true"})


@chatBlueprint.route('/setuserL', methods=['POST'])
def setuserL():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    conversationId = data["conId"]
    theme = data["knowledge"]
    inputt = data["userinfo"]
    stage = int(data["stage"])
    step = int(data["step"])
    response, stage, step = Feynman_flow(userId, conversationId, theme, inputt, stage, step)
    return jsonify({"message": "true", "botanswer": response, "step": step, "stage": stage})


@chatBlueprint.route('/setuserC', methods=['POST'])
def setuserC():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    conversationId = data["conId"]
    question = str(data["question"])
    inputt = str(data["userinfo"])
    stage = int(data["stage"])
    step = int(data["step"])
    answer = data["answer"]
    if inputt == 'None':
        query = question
    else:
        query = inputt
    print(query)
    response, stage, step = QA_flow(str(query), str(answer), stage, step, userId, conversationId)
    return jsonify({"message": "true", "botanswer": response, "step": step, "stage": stage})


@chatBlueprint.route('/ocr', methods=['POST'])
def ocr():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    base64_to_img(r"E:\PyCharm\Projects\ST\img\ll.png", str(data["image"])[data["image"].find(',')+1:])
    url = saveImageToRemote(r"E:\PyCharm\Projects\ST\img\ll.png")
    res = OCR_by_llm(url)
    return jsonify({"output": res, "message": "true"})


@chatBlueprint.route('/historyListN', methods=['POST'])
def historyListN():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    res = output_theme(userId, 1)
    theme, conversationID = [], []
    for t in res:
        theme.append(t[0])
        conversationID.append(t[1])
    return jsonify({"theme": theme, "conversationID": conversationID, "message": "true"})

@chatBlueprint.route('/historyListL', methods=['POST'])
def historyListL():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    res = output_theme(userId, 2)
    theme, conversationID = [], []
    for t in res:
        theme.append(t[0])
        conversationID.append(t[1])
    return jsonify({"theme": theme, "conversationID": conversationID, "message": "true"})

@chatBlueprint.route('/historyListC', methods=['POST'])
def historyListC():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    res = output_theme(userId, 3)
    theme, conversationID = [], []
    for t in res:
        theme.append(t[0])
        conversationID.append(t[1])
    return jsonify({"theme": theme, "conversationID": conversationID, "message": "true"})


@chatBlueprint.route('/historyN', methods=['POST'])
def historyN():
    data = json.loads(request.get_data())
    userId, ok = verify.verify(data["userId"])
    if not ok:
        return jsonify({"message": "invalid token"})
    print(userId)
    conversationId = data["conId"]
    history = get_history(userId, conversationId, 'normal_chat_history')
    return jsonify({"message": "true", "history": history})
