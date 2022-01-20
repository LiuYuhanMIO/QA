# -*- coding: utf-8 -*-
import jieba
import jieba.analyse
import math
from functools import reduce

def sentence_resemble(str1,str2):
    '''
    计算两个句子的相似度：
        1，将输入的两个句子分词
        2，求分词后两句子的并集（去重）
        3，计算两句子各自词频
        4，求词频向量
        5，套用余弦定理公式求出相似度
    余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似，这就叫"余弦相似性"
    :return:
    '''


    # 结巴分词，得到去掉逗号的数组
    str1 = jieba.cut(str1)
    str1 = ",".join(str1)
    str1_array = str1.split(",")
    str2 = jieba.cut(str2)
    str2 = ",".join(str2)
    str2_array = str2.split(",")
    try:
        str1_array.remove(u"，")
        str2_array.remove(u"，")
    except:
        pass

    # 求分词后两句子的并集（去重）
    all_array = list(set(str1_array+str2_array))
    all = sorted(all_array)

    # 计算两句子各自词频
    str1_num_dic = num_count(str1_array)
    str2_num_dic = num_count(str2_array)
    # 套用余弦定理公式求出相似度
    cos = resemble_cal(all,str1_num_dic,str2_num_dic)
    return cos

def num_count(a):
    d = {k: a.count(k) for k in set(a)}
    return d


def resemble_cal(all_key,article1_dic,article2_dic):
    str1_vector=[]
    str2_vector=[]
    # 计算词频向量
    for i in all_key:
        str1_count = article1_dic.get(i,0)
        str1_vector.append(str1_count)
        str2_count = article2_dic.get(i,0)
        str2_vector.append(str2_count)

    # 计算各自平方和
    str1_map = map(lambda x: x*x,str1_vector)
    str2_map = map(lambda x: x*x,str2_vector)

    str1_mod = reduce(lambda x, y: x+y, str1_map)
    str2_mod = reduce(lambda x, y: x+y, str2_map)

    # 计算平方根
    str1_mod = math.sqrt(str1_mod)
    str2_mod = math.sqrt(str2_mod)

    # 计算向量积
    vector_multi = reduce(lambda x, y: x + y, map(lambda x, y: x * y, str1_vector, str2_vector))

    # 计算余弦值
    cos = float(vector_multi)/(str1_mod*str2_mod)
    return cos



if __name__=="__main__":
    str1 = "我喜欢看电视，不喜欢看电影"
    str2 = "我不喜欢看电视，也不喜欢看电影"
    # 比较两句子相似度
    sentence_resemble(str1,str2)
