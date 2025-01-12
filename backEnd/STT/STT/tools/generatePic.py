import base64
import os
import sys


def base64_to_img(img_path, base64_data):
    """
    根据base64生成图片.
    :param img_path: 生成的图片路径
    :param base64_data: 图片的base64数据
    :returns: None
    """
    try:
        # 截取uri的data:image/png;base64后端的uri
        # with open(base64_path, mode="r") as f:
        #     content = ""
        #     for line in f:
        #         content = content + line
        # img_uri = content.split(",")[1]
        imgdata = base64.b64decode(base64_data)
        with open(img_path, mode="wb") as f:
            f.write(imgdata)
    except Exception as e:
        print(f"base64_to_img error:{e}")


def img_to_base64(img_path):
    """
    将图片转换成base64编码并写入到对应名称的txt文件
    :param img_path: 需要编码的图片
    :returns: 编码后的字节数据
    """
    try:
        with open(img_path, 'rb') as f:
            img_data = f.read()
            uri = base64.b64encode(img_data)
            # img_show = "data:image/jpeg;base64," + uri.decode('utf-8')
            # w_f.write(img_show.encode("utf-8"))
            # 如果需要在浏览器展示，需要在uri前面添加：data:image/jpeg;base64,
        return uri
    except Exception as e:
        print(f"img_to_base64 error:{e}")


if __name__ == "__main__":
    # img_path = sys.argv[1]
    # try:
    #     base64_path = sys.argv[2]
    #     base64_to_img(img_path, base64_path)
    # except IndexError:
    #     if os.path.exists(img_path):
    #         img_to_base64(img_path)
    #     else:
    #         print("image not exists")
    tmp = img_to_base64("../img/hello.png")
    print(tmp)
    # 保存的路径 base64数据
    base64_to_img("../img/hhhh.png", tmp)
