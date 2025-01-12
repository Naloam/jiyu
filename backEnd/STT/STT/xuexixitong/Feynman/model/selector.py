from langchain_community.llms.tongyi import Tongyi


def confused_selector(query: str):
    model = Tongyi(
        model_name= 'qwen-turbo',
        api_key='',
        temprature = 0.0
    ) 
    prompt = f"""【角色】你是一个句子疑惑与否的判断器，只需要输出0或1。
    如果【查询】表达了疑惑或疑问或不解，请输出1，如果【查询】没有表达疑惑，请输出0，不允许其它形式的输出。
    【查询】{query}
    """
    
    # res = model.invoke(prompt)
    # print(res)
    is_confused = True if model.invoke(prompt) == '1' else False
    
    return is_confused


if __name__ == '__main__':
    print(confused_selector('什么是正方形'))