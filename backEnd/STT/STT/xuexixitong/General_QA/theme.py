from openai import OpenAI
import os

def get_response(text:str = ''):
    '''
    功能为生成主题
    输入文本：普通模式应当从第一次对话user和AI的内容中将主题提取出来，
    并存在数据库中
    返回限定为15个字符的string
    '''
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
                                        '     主题：红楼梦'+text}],
        temperature=0.8,
        top_p=0.8
        )
    return completion.choices[0].message.content[:15]
