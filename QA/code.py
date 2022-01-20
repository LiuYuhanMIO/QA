#-*- coding: UTF-8 -*-
import sys
import web
import QA

render = web.template.render('templates/')

urls = ('/', 'login',
        '/add','add',
        '/hello','hello',
        '/login','login',
        '/register','register',
        '/administrator','administrator',
        '/reset','reset'
        )
app = web.application(urls, globals())


# 主页（登录）
class index:
    def GET(self):
        return render.login()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')

# 主页
class hello:
    def GET(self):
        return render.hello()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')

# 登录
class login:
    def GET(self):
        return render.login()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')

# 注册
class register:
    def GET(self):
        return render.register()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')

# 修改密码
class reset:
    def GET(self):
        return render.reset()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')


# 问答系统
class add:
    # get方式处理问题
    def GET(self):
        return render.QA()

    # post方式处理问题
    def POST(self):
        def enablePrint():
            sys.stdout = sys.__stdout__
        enablePrint()

        text=web.input()
        # 简单的过滤掉无效post请求
        if text['id']=="bei":
            question=text['q']
            print("received question:",question)
            print("now get answer!")
            answer=QA.question_wenda(question)
            answer='、'.join(answer)
            print("得到的答案是：",answer)
            if len(str(answer).strip())==0:
                answer="找不到答案呢！"
            print("return answer!")
            return answer
        else:
            pass

# 管理员界面
class administrator:
    def GET(self):
        return render.administrator()

    def POST(self):
        text=web.input()
        print(text)
        raise web.seeother('/')


if __name__=="__main__":
    web.internalerror = web.debugerror

    app.run()