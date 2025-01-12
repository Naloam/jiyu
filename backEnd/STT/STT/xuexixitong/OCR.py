from langchain_community.llms.tongyi import Tongyi
from http import HTTPStatus
import dashscope


def OCR_by_llm(image_url: str, model: str = 'qwen-vl-plus'):
    
    messages = [
        {
            "role": "user",
            "content": [
                {"image": image_url},
                {"text": "请只识别图片的文字，并将文字作为回答"}
            ]
        }
    ]
    response = dashscope.MultiModalConversation.call(model = model,
                                                     api_key='', 
                                                     messages=messages)
    
    if response.status_code == HTTPStatus.OK:
        #print(response)
        dic = response.output.choices[0].message.content[0]
        key = list(dic.keys())[0]
        return dic[key]
    else:
        #print(response.code)
        print(response.message) 


if __name__ == '__main__':

    text = OCR_by_llm(image_url='1.jpg')
    print(text)
