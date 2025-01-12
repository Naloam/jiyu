import re

def convert_to_markdown(text:str) -> str:

    '''
    输出的gpt转为markdown格式
    '''

    # 替换 \[math\] 形式的公式为 $math$ 形式，去掉开头和结尾的空格
    text = re.sub(r'\\\[(.*?)\\\]', lambda m: '$' + re.sub(r'^\s+|\s+$', '', m.group(1)) + '$', text,
                    flags=re.DOTALL)
    # 替换 \(math\) 形式的公式为 $math$ 形式，去掉开头和结尾的空格
    text = re.sub(r'\\\((.*?)\\\)', lambda m: '$' + re.sub(r'^\s+|\s+$', '', m.group(1)) + '$', text)
    return text
