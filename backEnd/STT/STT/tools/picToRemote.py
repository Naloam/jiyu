import time
from qiniu import Auth, put_file


def saveImageToRemote(localPath):
    q = Auth('cM6U33jhHN7AUD8rRvDD5_Zlwz-f6D3bjNkA3XbS', 'opTDfX8pX20YLEz1GM0_j8GJB50PE5VitRTmKC-Z')
    bucket_name = 'stpicpic'
    # 唯一命名图片
    key = time.time().__str__() + '.png'
    token = q.upload_token(bucket_name, key, 3600)
    ret, info = put_file(token, key, localPath,  version='v2')
    # 获取图片url
    image_url = 'http://siwom8dog.hn-bkt.clouddn.com/' + ret.get('key')
    return image_url
