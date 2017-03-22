var express = require('express');
var router = express.Router();
var mysql=require("mysql");
//用于保存信息
var locals=new Object();

var conn=mysql.createConnection({
	host:"localhost",
	password:"123456",
	user:"root",
	datebase:"mydb",
	port:3306
	
});
conn.connect();

/* GET users listing. */
//访问后台首页 views文件夹下
router.get('/', function(req, res, next) {
	//判断是否登录
	if(!req.cookies.adminuser ){
		res.redirect("/admin/login");
	}
	//保存当前用户的信息
	locals.adminuser=req.cookies.adminuser;
    res.render('admin/index/index',locals);  //加载模板
});

//加载登录表单
router.get("/login",function(req,res,next){
	res.render("admin/index/login");
});
//执行登录验证
router.post("/doLogin",function(req,res,next){
	//获取登录界面的信息
	var admin=req.body.admin;
	var password=req.body.password
	console.log("---->"+admin+"--->"+password);
	//判断登录信息
	//获取数据库中的数据
	conn.query(" use mydb");
	conn.query("select * from myself",function selectCb(err, results, fields) { 
        if (err) { 
           throw err; 
        } 
       
          for(var i = 0; i < results.length; i++)
          {
              console.log(results[i].u_pass, results[i].u_admin);
			 
			  if( admin ==results[i].u_admin && password ==results[i].u_pass){
				    //写cookie信息
	                 res.cookie("adminuser",admin,{maxAge:3600000,httpOnly:true});
					 //跳转页面
	                 res.redirect("/admin");
					 return;	
			  }
          }
           res.render("admin/public/err",{infor:"账号或密码错误，请重新输入！"});
	});
	
	
});
//退出登录
router.get("/logout",function(req,res,next){
	//清除指定的cookie信息
	res.clearCookie("adminuser",{path:"/"});
	//回到登录页面
	res.render("admin/index/login");
});


module.exports = router;
