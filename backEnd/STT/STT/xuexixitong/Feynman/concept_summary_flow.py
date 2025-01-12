from xuexixitong.Feynman.model.core import generalchat
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from xuexixitong.Feynman.prompt import context as Context

def concept_summary_flow(user_id: str,
                        conversation_id: str,
                        stage: int,
                        step: int,
                        input: str,
                        theme: str) ->tuple[int, int, str]:
    if step == 0:
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}```{input}```"),
            ]
        )

        context = Context.summary_context.format(
            example = Context.summary_example,
            theme = theme
        )
    
    elif step == 1:
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{context}```{input}```"),
            ]
        )
        
        context = Context.homework_context.format(
            example = Context.homework_example,
            theme = theme
        )
    else:
        
        prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ]
        )
        
        context = None
    
    response = generalchat(user_id, conversation_id, prompt, context, input)
    step += 1
    
    return stage, step, response




if __name__ == '__main__':
    session_id = 'f8aab2ff-143f-4aff-9b3c-6be39a154f20'
    # user_id = uuid.uuid4()
    # conversation_id = uuid.uuid4()
    user_id = str(session_id)[:18]
    conversation_id = str(session_id)[18:]
    stage = 3
    step = 0
    
    for _ in range(6):
        print('-'*40)
        
        query = input("Student:")
        satge, step, response = concept_summary_flow(user_id=user_id, conversation_id=conversation_id, stage=stage, step=step, input=query, theme='正方形的面积')
        
        print(f'res:{response}')
        print(f'stage:{stage}')
        print(f'step:{step}')
        print(f'user_id:{user_id}')
        print(f'conversation_id:{conversation_id}')
        print('-'*40)