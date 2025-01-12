from openai import OpenAI

def get_theme(text):
    client = OpenAI(
        api_key='', # 如果您没有配置环境变量，请在此处用您的API Key进行替换
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",  # 填写DashScope服务的base_url
    )
    completion = client.chat.completions.create(
        model="qwen-turbo",
        messages=[
            {'role': 'user', 'content': '请从下面的对话中总结出主题,总字数不超过10个字\n'
                                        '例如：日语问候语教学与交流,'
                                        '     圆的面积,'
                                        '     红楼梦,\n'
                                        f'```{text}```'}],
        temperature=0.8,
        top_p=0.8
    )
    return completion.choices[0].message.content
