var question = '';
var answer = '';

// 将问题发送到后台，并接收相应
function sendtoserver(text)
{
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp=new XMLHttpRequest();
  }
  else
  {
    // IE6, IE5 浏览器执行代码
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      //  相应完成，则显示出来
      // document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
      var answer1=xmlhttp.responseText;
      show($.trim(answer1));
    }
  }
  xmlhttp.open("POST","/add",true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("id=bei&q="+$.trim(text));
}

//按钮样式，input输入后按钮变化
$('#info').keyup(function(e) {
    var key = e.which;
    if ($('#info').val() == '') {
        $('#send').css({
            'background-image': 'url(/static/img/btn3.png)'
        });
    } else {
        $('#send').css({
            'background-image': 'url(/static/img/btn4.png)'
        });
    }
    if (key == 13) {
        $('#send').trigger("click");
        $('#send').css({
            'background-image': 'url(/static/img/btn3.png)'
        });
    }
});
var pre_time;
$('#send').click(function() {
    // 获取当前日期，并添加到对话框中
    var d = new Date();
    if (!pre_time || (pre_time && diff_time(d))) {
        var p = "<div><span>" + d.getHours() + ':' + (d.getMinutes().toString().length == 1?'0'+d.getMinutes():d.getMinutes()) + '</span></div>';
        pre_time = d;
        $('#chat').append(p);
    }
    // 获取当前问题信息
    var text = $('#info').val();
    //question返回到答案评分系统
    question = text;

    // 判断问题是否为空
    if ($.trim(text)=="")
    {
        $('#send').css(setDisabled);
    }
    else {
        // 清空发送框
        $('#info').val('');
        $('#send').css({
            'background-image': 'url(/static/img/btn3.png)'
        });
        // 把发送内容添加到聊天框
        var p = "<div class='me'><div class='qipao'></div><div class='item'>" + text + '</div></div>';
        $('#chat').append(p);
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
        // 将问题信息发送到服务
        sendtoserver(text);
    }

})


//问答系统回答，将答案添加到聊天框；用户对答案评分
function show(data) {
    var p = "<div class='robot'><div class='qipao'></div><div class='item'>" + data + '</div></div>';
    //answer返回到答案评分系统
    answer = data;
    p += " <div class='robot'><div class='qipao'></div><div class='item'>" +  "<button  onclick='score()' style='background-color: Transparent; border-style :none;'>——点我评分哦——</button>" + '</div></div>'
    $('#chat').append(p);
    $('#chat').scrollTop($('#chat')[0].scrollHeight);
}

//评分alert窗口
function score(){
    alert("请输入评分，感谢您的支持","",2);
    console.log("问题： " + question + "  答案： " + answer + "  评分： " + document.getElementById("score_by_user").value)
}

// 处理时间的函数
function diff_time(time) {
    if (time.getHours() - pre_time.getHours() == 0) {
        if (time.getMinutes() - pre_time.getMinutes() <= 5)
            return false;
    } else
        return true;
}


//管理员界面显示用户数据
function showdata() {
            const query = Bmob.Query("_User");
            query.find().then(res => {
                console.log(res);
                var out = "";
                for(var i in res){
                    var b = res[i];
                    out +=  "用户 " + i + " 信息：" + JSON.stringify(b) + "\r\r" ;
                }
                $("#showall").val(out);
            });
}

//管理员界面显示用户评分数据
function showscore() {
            const query = Bmob.Query("score");
            query.find().then(res => {
                console.log(res);
                var out = "";
                for(var i in res){
                    var b = JSON.stringify(res[i]);

                    out +=  "第 " + i + " 条评分：" + b  + "\r\r" ;
                }
                $("#showall").val(out);
            });
}

//管理员界面显示用户评分平均分
function showscore_avg() {
            var out = "";

            const query = Bmob.Query("score");
            query.statTo("average", "scores");
            query.find().then(res => {
            var b = JSON.stringify(res[0]);
            out +=  "总计平均分为：" + b  + "\r\r" ;
            });

            const query2 = Bmob.Query("score");
            query2.statTo("average", "scores");
            query2.statTo("groupby", "question");
            query2.find().then(res => {
                for(var i in res){
                    var b = JSON.stringify(res[i]);
                    out +=  "第 " + i + " 类问题平均分为：" + b  + "\r\r" ;
                }
                $("#showall").val(out);
            });
}


//注册界面，点击注册按钮事件
function register() {
           var pwd = new String(document.getElementById("pwd").value);
           if(!document.getElementById("account").value){
                alert("用户名不能为空","",1)
           }
           else if(!document.getElementById("pwd").value || pwd.length > 20){
                alert("密码不符合规则：" + "<br>" + "密码长度超过20或为空","",1)
           }
           else if(document.getElementById("pwd").value != document.getElementById("pwd2").value){
                alert("两次密码不一致，请重新输入","",1)
           }
           else{
               let params = {
                    username: document.getElementById("account").value,
                    password: document.getElementById("pwd").value,

                }
                Bmob.User.register(params).then(res => {
                    console.log(res);
                    alert("注册成功，将跳转至登录界面","http://127.0.0.1:8080/login",1)
                }).catch(err => {
                    console.log(err.error,"");
                    alert("用户名已被注册","",1)
                });
            }
}


//登录界面，点击登录按钮事件
function login() {
            const query = Bmob.Query('user');
            if(document.getElementById("account").value=="A" && document.getElementById("pwd").value=="123"){
                alert("管理员 A 登录","http://127.0.0.1:8080/administrator",1);
            }
            else{
                Bmob.User.login(document.getElementById("account").value,document.getElementById("pwd").value).then(res => {
                    alert("登陆成功","http://127.0.0.1:8080/add",3)
                }).catch(err => {
                    alert("账号或密码错误，请重新输入","",1)
                });
            }
}


//修改密码
function reset() {
           var pwd = new String(document.getElementById("pwd_new").value);
           if(!document.getElementById("pwd_new").value || pwd.length > 20){
                alert("密码不符合规则：" + "<br>" + "密码长度超过20或为空","",1)
           }
           else if(document.getElementById("pwd_new").value != document.getElementById("pwd_new2").value){
                alert("两次密码不一致，请重新输入","",1)
           }
           else{
                    alert("修改成功，将跳转至登录界面","http://127.0.0.1:8080/login",1)
            }
}



//重写alert，a=1 关于样式，a=2 关于评分功能，a=3 关于用户修改密码
window.alert = alert;
	function alert(e,myurl,a) {
        if(a == 1){
            $("body").append('<div id="msg"><div id="msg_top">信息<span class="msg_close">×</span></div><div id="msg_cont">' + e + '</div><div class="msg_close" id="msg_clear" >确定</div></div>');
            $(".msg_close").click(function () {
                $("#msg").remove();
                window.location.href = myurl;
            });
        }
        else if(a == 2){
            $("body").append('<div id="msg"><div id="msg_top">信息<span class="msg_close">×</span></div><div id="msg_cont">' +  e + '<input type="text"   id="score_by_user" placeholder="评分（0-10）" class="msg_score"></div><div class="msg_close" id="msg_clear" >确定</div></div>');
            $(".msg_close").click(function () {
                const query = Bmob.Query('score');
                query.set("question",question)
                query.set("answer",answer)
                query.set("scores",parseInt(document.getElementById("score_by_user").value))
                query.save().then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
                $("#msg").remove();
            });
        }

        else if(a == 3){
            $("body").append('<div id="msg"><div id="msg_top">信息<span class="msg_close">×</span></div><div id="msg_cont">' +  e + '<br><a href="http://127.0.0.1:8080/reset"><input type="button"  class="msg_score" value="点我修改密码"></a></div><div class="msg_close" id="msg_clear" >确定</div></div>');
            $(".msg_close").click(function () {
                $("#msg").remove();
                window.location.href = myurl;
            });
        }

	}





