from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
CORS(app)

# 简单的内存存储（生产环境应使用数据库）
users = {}
JWT_SECRET = "jiyu_secret_key"

def generate_jwt_token(username):
    """生成JWT token"""
    payload = {
        'userName': username,
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_jwt_token(token):
    """验证JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['userName'], True
    except jwt.ExpiredSignatureError:
        return None, False
    except jwt.InvalidTokenError:
        return None, False

@app.route('/users/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get("userName")
    password = data.get("password")
    email = data.get("email", f"{username}@example.com")
    
    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"})
    
    if username in users:
        return jsonify({"message": "duplicate userName"})
    
    # 生成userId
    user_id = str(uuid.uuid4())[:18]
    # 密码加密
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))
    
    # 存储用户信息
    users[username] = {
        'id': user_id,
        'username': username,
        'email': email,
        'password': hashed_password.decode('utf-8'),
        'level': 1,
        'experience': 0,
        'avatar': '',
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    
    return jsonify({"message": "signup success"})

@app.route('/users/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("userName")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"message": "用户名和密码不能为空"})
    
    if username not in users:
        return jsonify({"message": "username not found or invalid password"})
    
    user = users[username]
    
    # 验证密码
    if bcrypt.checkpw(password.encode(), user['password'].encode()):
        token = generate_jwt_token(username)
        return jsonify({"message": "login success", "token": token})
    else:
        return jsonify({"message": "username not found or invalid password"})

@app.route('/users/profile', methods=['GET'])
def get_user_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"message": "missing authorization header"}), 401
    
    try:
        token = auth_header.replace('Bearer ', '')
        username, valid = verify_jwt_token(token)
        if not valid:
            return jsonify({"message": "invalid token"}), 401
        
        if username not in users:
            return jsonify({"message": "user not found"}), 404
        
        user = users[username]
        return jsonify({
            "message": "success",
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "level": user['level'],
                "experience": user['experience'],
                "avatar": user['avatar'],
                "createdAt": user['created_at'],
                "updatedAt": user['updated_at']
            }
        })
    except Exception as e:
        return jsonify({"message": "invalid token"}), 401

@app.route('/chat/setuserN', methods=['POST'])
def chat_normal():
    data = request.get_json()
    token = data.get("userId")
    
    # 验证token
    username, valid = verify_jwt_token(token)
    if not valid:
        return jsonify({"message": "invalid token"})
    
    user_input = data.get("userinfo", "")
    conversation_id = data.get("conId", "")
    step = data.get("step", 0)
    
    # 简单的回复逻辑（实际应该调用AI模型）
    bot_answer = f"你好 {username}！我收到了你的问题：{user_input}。这是一个测试回复。"
    
    return jsonify({
        "message": "true",
        "botanswer": bot_answer,
        "step": step + 1
    })

@app.route('/chat/setuserL', methods=['POST'])
def chat_feynman():
    data = request.get_json()
    token = data.get("userId")
    
    # 验证token
    username, valid = verify_jwt_token(token)
    if not valid:
        return jsonify({"message": "invalid token"})
    
    user_input = data.get("userinfo", "")
    knowledge = data.get("knowledge", "")
    conversation_id = data.get("conId", "")
    stage = data.get("stage", 1)
    step = data.get("step", 0)
    
    # 费曼学习法回复逻辑
    bot_answer = f"费曼学习法模式：关于'{knowledge}'的学习，{user_input}。让我们继续深入理解。"
    
    return jsonify({
        "message": "true",
        "botanswer": bot_answer,
        "step": step + 1,
        "stage": stage
    })

@app.route('/chat/correction', methods=['POST'])
def chat_correction():
    data = request.get_json()
    token = data.get("userId")
    
    # 验证token
    username, valid = verify_jwt_token(token)
    if not valid:
        return jsonify({"message": "invalid token"})
    
    user_input = data.get("userinfo", "")
    
    # 批改订正回复逻辑
    bot_answer = f"批改订正：{user_input}。这里是订正建议和解析。"
    
    return jsonify({
        "message": "true",
        "botanswer": bot_answer
    })

@app.route('/chat/history', methods=['POST'])
def chat_history():
    data = request.get_json()
    token = data.get("userId")
    
    # 验证token
    username, valid = verify_jwt_token(token)
    if not valid:
        return jsonify({"message": "invalid token"})
    
    # 返回历史记录
    return jsonify({
        "message": "true",
        "theme": ["数学", "英语", "物理"],
        "conversationID": ["conv1", "conv2", "conv3"],
        "history": [
            {"role": "user", "content": "测试问题1"},
            {"role": "bot", "content": "测试回复1"}
        ]
    })

if __name__ == '__main__':
    print("=== 积语伴学后端服务启动 ===")
    print("服务地址: http://localhost:5000")
    print("已注册的API端点:")
    print("- POST /users/signup - 用户注册")
    print("- POST /users/login - 用户登录")
    print("- GET /users/profile - 获取用户信息")
    print("- POST /chat/setuserN - 智能问答")
    print("- POST /chat/setuserL - 费曼学习法")
    print("- POST /chat/correction - 批改订正")
    print("- POST /chat/history - 聊天历史")
    print("========================")
    app.run(debug=True, host='0.0.0.0', port=5000)
