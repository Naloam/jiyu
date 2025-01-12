from xuexixitong.Feynman.concept_learning_flow import concept_learning_flow
from xuexixitong.Feynman.concept_QA_flow import concept_QA_flow
from xuexixitong.Feynman.concept_summary_flow import concept_summary_flow
from xuexixitong.Feynman.model.selector import confused_selector
from typing import Optional
import xuexixitong.Conversion as cv
from xuexixitong.Database.theme_store import insert_theme


# stage  step  means
#  1     0/k   concept_learning
#  2      -   concept_QA
#  3      -   concept_summary
#  4      -   general


def Feynman_flow(user_id: str,
               conversation_id: str,
               theme: str,
               input: Optional[str] = None, 
               stage: int = 1,
               step: int = 0):
    
    # 阶段一
    if stage == 1:
        # 如果是第一轮对话，初始化对话
        if step == 0:
            insert_theme(user_id, conversation_id, theme, 1)
            stage, step, response = concept_learning_flow(user_id=user_id,
                                                          conversation_id=conversation_id,
                                                          stage=stage,
                                                          step=step,
                                                          input=theme)
        elif confused_selector(input):
            stage, step, response = concept_learning_flow(user_id=user_id,
                                                          conversation_id=conversation_id,
                                                          stage=stage,
                                                          step=step,
                                                          input=input)            
        
        else:
            step = 0
            stage = 2 
            
    #第二阶段
    if stage == 2:
        stage, step, response = concept_QA_flow(user_id=user_id,
                                                conversation_id=conversation_id,
                                                stage=stage,
                                                step=step,
                                                input=input,
                                                theme=theme) 

    #第三阶段
    elif stage == 3:
        stage, step, response = concept_summary_flow(user_id=user_id,
                                                    conversation_id=conversation_id,
                                                    stage=stage,
                                                    step=step,
                                                    input=input,
                                                    theme=theme)


    return cv.convert_to_markdown(response), stage, step



if __name__ == "__main__":
    session_id = 'f8aab2ff-143f-4aff-9b3c-6be39a154f20'
    user_id = str(session_id)[:18]
    conversation_id = str(session_id)[18:] 
    theme = '正方形的面积'
    
    stage = 1
    step = 0
    
    for i in range(8):
        if i == 0:

            response, stage, step = Feynman_flow(user_id=user_id,
                                                                                conversation_id=conversation_id,
                                                                                theme=theme,
                                                                                stage=stage, 
                                                                                step=step)
            #insert_theme(user_id,conversation_id,theme,stage)
        else:
            query = input('Student:')
            response, stage, step = Feynman_flow(user_id=user_id,
                                                                            conversation_id=conversation_id,
                                                                            theme=theme,
                                                                            input=query,
                                                                            stage=stage, 
                                                                            step=step)
            
        print('-'*20)
        if i == 0: print(f'theme:{theme}')
        print(f'res:{response}')
        print(f'stage:{stage}')
        print(f'step:{step}')
        print(f'user_id:{user_id}')
        print(f'conversation_id:{conversation_id}')
        print('-'*20)
