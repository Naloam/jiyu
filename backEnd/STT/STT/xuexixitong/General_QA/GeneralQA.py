import xuexixitong.General_QA.model as model
import xuexixitong.Conversion as cv
import xuexixitong.General_QA.theme as theme
import xuexixitong.General_QA.ID_generation as ID_generation
from xuexixitong.Database.theme_store import insert_theme


def generalQA(user_id:str,
              conversation_id:str,
              input:str,
              step:int):
    response = cv.convert_to_markdown(model.generalchat(input, user_id, conversation_id))
    if step == 0:

        title = theme.get_response(input + response)
        insert_theme(user_id, conversation_id, title, 0)

    step += 1
    return response,step

# if __name__ == '__main__':
#     user_id = ID_generation.CreateuserID()
#     conversation_id = ID_generation.CreateConversation(1)
#     step = 0
#     while step < 3:
#         message = input('user:')
#         response,step =generalQA(user_id,conversation_id,message,step)
#         print(response)


