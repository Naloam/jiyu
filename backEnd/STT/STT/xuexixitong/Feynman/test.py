import feimanxuexifa.conceptQA_flow as cf

if __name__ == '__main__':

    user_id = '66073323-5867-4884'
    conversation_id = '-9ad7-e23ede5a7a03'
    stage = 2
    step = 1
    theme = '圆的面积'
    while(stage == 2):
        message = input('user:')
        stage, step, response = cf.conQA_flow(user_id,conversation_id,theme,stage,step,message)
        print(response)