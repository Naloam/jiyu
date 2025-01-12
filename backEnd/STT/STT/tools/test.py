from generatePic import img_to_base64, base64_to_img
from picToRemote import saveImageToRemote
from xuexixitong.correct_QA.utils.llm_tools import OCR_by_llm

if __name__ == '__main__':
    tmp = img_to_base64("../img/hello.png")
    print(tmp)
    # 保存的路径 base64数据
    base64_to_img("../img/ll.png", tmp)
    url = saveImageToRemote("../img/ll.png")
    print(url)
    OCR_by_llm(url)
