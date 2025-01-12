# app.py
import json
from General_QA.GeneralQA import generalQA
from correct_QA.model import QA_flow
from Feynman.Feynman_flow import Feynman_flow
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app, supports_credentials=True)


# 该路由接收用户输入，根据property控制三种模式
@app.route('/chat/setuser', methods=['POST'])
def setuser():
    # 接收前端传递的json格式数据，并输出
    data = json.loads(request.get_data())
    property = data.get('property')
    userinfo = data.get('userinfo')

    input = '1'
    user_answer = '1'
    user_id = uuid.uuid4()
    conversation_id = uuid.uuid4()
    user_id = str(user_id)[:18]
    conversation_id = str(conversation_id)[18:]
    stage = 1
    step = 1

    print(f"Property: {property}")
    print(f"User Info: {userinfo}")
    # 根据property值来生成不同的响应
    if property == "normal":
        botanswer, step = generalQA(user_id,conversation_id,input,step)
    elif property == "learn":
        theme = ''
        botanswer, stage, step = Feynman_flow(user_id,conversation_id,theme,input,stage,step)
    elif property == "correction":
        #botanswer = "这是批改订正的回答。"
        botanswer, stage, step = QA_flow(input, user_answer, stage, step, user_id, conversation_id)
    else:
        botanswer = "未知模式。"

    return jsonify({"message": "true", "botanswer": botanswer,'stage':stage,'step':step})



if __name__ == '__main__':
    app.run(debug=True)