import requests
import json

def kb_chat(
    query: str, 
    kb_name: str, 
    top_k: int = 1, 
    score_threshold: float = 0.5, 
    prompt_name: str = 'default', 
    return_direct: str = False) -> str :
    
    url = 'http://127.0.0.1:7861/chat/kb_chat'  #TODO 可能最终部署需要更改url
    body = {
        "query": query,
        "mode": "local_kb",
        "kb_name": kb_name,
        "top_k": top_k,
        "score_threshold": score_threshold,
        "stream": False,
        "model": "qwen-turbo",
        "temperature": 0.0,
        "prompt_name": prompt_name,
        "return_direct": return_direct
    }

    headers = {
        'Content-Type': 'application/json'
    }

    resp = requests.post(url, headers=headers, json=body)
    print(resp)
    resp_str = resp.json()
    print(resp_str)
    resp_json = json.loads(resp_str)

    
    return resp_json['choices'][0]['message']['content']


#TODO 增加添加/删除文件的接口


if __name__ == '__main__':
    query = '幸福小学举行小小朗读者比赛，华华准备了一篇1200个字的演讲稿，规定每名同学的演讲时间不超过5分钟。如果她每分钟读 235个字，在规定时间内能读完吗？'
    print(kb_chat(query=query, kb_name='xiaoxue3'))

