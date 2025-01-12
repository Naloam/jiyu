from xuexixitong.Feynman.model.core import generalchat
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from xuexixitong.Feynman.prompt import context as Context

def concept_QA_flow(user_id: str,
               conversation_id: str,
               stage: int,
               step: int,
               input: str,
               theme: str):
    
    # 定义prompt
    if step == 0:
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}"),
            ]
        )
    else:
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}"),
            ]
        )
    # 定义context
    if step == 0:
        context = Context.step1.format(input=input, point=theme, idx=step + 1)
        step += 1
    elif step == 1 or step == 2:
        context = Context.step2and3.format(input=input, point=theme, idx=step + 1)
        step += 1
    else:
        stage += 1
        step = 0
        context = Context.finish.format(input=input)

    response = generalchat(user_id, conversation_id, prompt, context, input)
    
    return stage, step, response


# if __name__ == '__main__':
#     session_id = 'f8aab2ff-143f-4aff-9b3c-6be39a154f20'
#     # user_id = uuid.uuid4()
#     # conversation_id = uuid.uuid4()
#     user_id = str(session_id)[:18]
#     conversation_id = str(session_id)[18:]
#     stage = 2
#     step = 0
#
#     for i in range(4):
#         print('-'*50)
#         query = input('Student:')
#         stage, step, response = conQA_flow(user_id=user_id, conversation_id=conversation_id, stage=stage, step=step, theme='正方形的面积', input=query)
#         print(f'res: {response}')
#         print(f'stage: {stage}')
#         print(f'step: {step}')
#         print('-'*50)


