from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder


#TODO 完善prompt
QA_template = """
阶段1：题目的题意和要求是什么？
阶段2：这个题目涉及到哪些知识点？
阶段3：如何运用这些知识点解答问题？
阶段4：按照这样的思路，这道题的答案是？
阶段5：表扬学生
""" 




# 定义prompt模板
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You're an assistant who speaks in {language}. Respond in 20 words or fewer",
        ),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)
