import re
from NeoModle import neo_con
import cosin

db = neo_con
# 查找所有属于某类型的实体
def findEntitiesByType(type):
    entitydb = db.findEntitiesByType(type)
    selected_index = [i for i in range(len(entitydb))]
    entitylist = []
    for i in selected_index:
        entitylist.append(entitydb[i]['m']['title'])
    return entitylist


# 查找实体,关系,返回第一个实体列表
def findEntities2(entity2, relation):
    entitydb = db.findOtherEntities2(entity2, relation)
    selected_index = [i for i in range(len(entitydb))]
    entitylist = []
    for i in selected_index:
        entitylist.append(entitydb[i]['n1']['title'])
    return entitylist


# 查找实体,关系,返回第二个实体列表
def findEntities(entity1, relation):
    entitydb = db.findOtherEntities(entity1, relation)
    selected_index = [i for i in range(len(entitydb))]
    entitylist = []
    for i in selected_index:
        entitylist.append(entitydb[i]['n2']['title'])
    return entitylist


def huida(q_type, zhuyu):
    daanlist = []

    # 某故障原因 会引起哪些现象
    if q_type == 0:
        relationyuanyins = []
        for yuanyindb in findEntitiesByType('Yuanyin'):
            similar = cosin.sentence_resemble(zhuyu, yuanyindb)
            if similar > 0.8:
                relationyuanyins.append(yuanyindb)
        print('图数据库中对应实体是:', relationyuanyins)
        for relationyuanyin in relationyuanyins:
            daanlist += findEntities2(relationyuanyin, '间接原因')
        templist = []
        for temp in daanlist:
            if temp.isalnum():
                templist.append(temp+'报警')
        daanlist = templist
    # 做什么操作 会遇到什么错误
    if q_type == 1:
        relationcaozuos = []
        for caozuodb in findEntitiesByType('Caozuo'):
            similar = cosin.sentence_resemble(zhuyu, caozuodb)
            if similar > 0.8:
                relationcaozuos.append(caozuodb)
        print('图数据库中对应的操作是:', relationcaozuos)
        for caozuo in relationcaozuos:
            daanlist += findEntities(caozuo, '引起')

    # 某部位 常出现哪些故障
    if q_type == 2:
        daanlist = findEntities2(zhuyu, '故障部位')
    # 报警的含义是什么  直接原因
    if q_type == 3:
        daanlist = findEntities2(zhuyu, '报警信息')
    # 故障现象的相关现象有哪些
    if q_type == 4:
        daanlist = findEntities2(zhuyu, '相关')
    temp = {}
    temp = temp.fromkeys(daanlist)
    daanlist = list(temp.keys())
    return daanlist
pattern = [[r"会导致哪些现象",r"会导致什么现象",r"导致的现象",r"会导致的现象",r"导致的现象有哪些"],      #现象√-间接原因-原因   某故障原因导致的故障现象
           [r"会遇到什么错误",r"会遇到的错误",r"会遇到哪些错误",r"会导致什么现象"],                       #操作-引起-现象√      故障前执行的操作间接导致的故障现象
           [r"常出现哪些故障",r"部位常遇到的故障",r"部位常见的故障",r"常出现的错误"],                      # 现象√-故障部位-部位  故障部位常见的故障现象
           [r"报警的含义是什么",r"报警的含义",r"报警的原因",r"报警的原因是什么",r"伴随的现象是什么"],     #现象√-报警信息-报警   报警信息伴随的故障现象
           [r"故障的相关现象有哪些",r"的相关现象有哪些",r"故障的相关现象有什么"]]                         #现象√-相关-现象    故障现象和故障现象之间存在并发症

questions = ['外部24V短路的故障会导致哪些现象？',
             '手动移动X轴时会遇到什么错误？',
             '电源常出现哪些故障？',
             'ALM950报警的含义是什么？',
             '系统显示ALM401故障的相关现象有哪些']


def question_wenda(question):
    ret_dict = {}
    ret_dict['answer'] = []
    if (True):
        if question !='':
            pos = -1
            q_type = -1
            for i in range(len(pattern)):
                for x in pattern[i]:
                    index = re.search(x, question)
                    if (index):
                        pos = index.start()
                        q_type = i
                        break
                if (pos != -1):
                    break
            entity = question[0:pos]
            print('实体是:',entity)
            ret_dict['answer'] += huida(q_type, entity)
            print("答案是：",ret_dict['answer'])
    return ret_dict['answer']