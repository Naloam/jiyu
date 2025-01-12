import jwt
from dao import userService

def verify(jwt_token):
    token_dict = None
    try:
        token_dict = jwt.decode(jwt_token, "zhananbudanchou1234678", algorithms=['HS256'])
        userName = token_dict['userName']
        if userName == "":
            return "", False
        user, ok = userService.findByName(userName)
        if ok and userName == user[1]:
            return user[2], True
        else:
            return "", False
    except Exception as e:
        print(e)
        return "", False
