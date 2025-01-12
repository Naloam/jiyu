import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from xuexixitong.Feynman.model.CRAGWorkflow import Workflow_CRAG
from xuexixitong.Feynman.model.core import generalchat
from xuexixitong.Feynman.prompt import context as Context


def concept_learning_flow(user_id: str,
                            conversation_id: str,
                            stage: int,
                            step: int,
                            input: str):
    
    query = f"{input}?\n请用中文回答"
    
    material = Workflow_CRAG(query)#传给前端CRAG初步生成的答案
    
    prompt = ChatPromptTemplate.from_messages(
        [
            MessagesPlaceholder(variable_name="history"),
            ("human", "{context}```{input}```"),
        ]
    )
    
    context = Context.learning_context.format(
        material = material
    )
    
    response = generalchat(user_id=user_id, conversation_id=conversation_id, prompt=prompt, context=context, input=input)
    
    response = f"{response}\n以上便是关于这个问题的解答了。\n如果还有什么疑惑的地方，可以向我继续提问，我会耐心的生成更多更详细的解答；\n如果已经明白了没有疑问，记得告诉我“嗯嗯！明白了！”，我就可以陪你继续学习新的知识啦！"
    
    step += 1
    
    return stage, step, response

"""
test:
stage,step,output=get_reply(1,0,"What are the types of agent memory?")
pprint(output)
pprint("\n---\n")
print(step)

"""

#input接：
# “请用中文回答”

#output接：
# “以上便是关于这个问题的解答了。
# 如果还有什么疑惑的地方，可以向我继续提问，我会耐心的生成更多更详细的解答；
# 如果已经明白了没有疑问，记得告诉我“嗯嗯！明白了！”，我就可以陪你继续学习新的知识啦！”

if __name__ == "__main__":
    session_id = 'f8aab2ff-143f-4aff-9b3c-6be39a154f20'
    # user_id = uuid.uuid4()
    # conversation_id = uuid.uuid4()
    user_id = str(session_id)[:18]
    conversation_id = str(session_id)[18:]
    
    print(os.environ.get("USER_AGENT"))
    query = input()
    stage = 1
    step = 0
    stage, step, res = concept_learning_flow(user_id=user_id, conversation_id=conversation_id, stage=stage, step=step, input=query)
    print(res)