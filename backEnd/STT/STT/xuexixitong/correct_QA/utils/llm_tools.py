from openai import OpenAI
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
        res = response['output']['choices'][0]['message']['content'][0]['text']
        print(response['output']['choices'][0]['message']['content'][0]['text'])
        return res
    else:
        print(response.code)
        print(response.message)
        return None



def get_theme(text):
    client = OpenAI(
        api_key='', # 如果您没有配置环境变量，请在此处用您的API Key进行替换
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",  # 填写DashScope服务的base_url
    )
    completion = client.chat.completions.create(
        model="qwen-turbo",
        messages=[
            {'role': 'user', 'content': '请从下面的对话中总结出主题,总字数不超过10个字\n'
                                        '例如：主题：日语问候语教学与交流'
                                        '     主题：圆的面积'
                                        '     主题：红楼梦\n'
                                        f'```{text}```'}],
        temperature=0.8,
        top_p=0.8
    )
    return completion.choices[0].message.content



if __name__ == '__main__':
    OCR_by_llm(image_url='图片url')