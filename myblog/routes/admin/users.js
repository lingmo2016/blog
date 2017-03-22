var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var locals = new Object();

//创建数据库连接
var conn=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database:"mydb",
	port: 3306
	
});
//连接数据库
conn.connect();

//中间件过滤（登录验证）
router.use(function(req, res, next) {
  //判断是否登录
  if(!req.cookies.adminuser){
      res.redirect("/admin/login");   
  }
  locals.adminuser = req.cookies.adminuser;
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  //执行查询
  conn.query("select *from myself", function(err,result){
	  res.render('admin/users/index',{list:result,adminuser:locals.adminuser});
  });
});

//添加表单
router.get('/add', function(req, res, next) {
	res.render('admin/users/add',{adminuser:locals.adminuser});
 
});
//执行添加用户
router.post('/doAdd', function(req, res, next) {
	var sql="insert into myself(u_admin,u_pass,u_name,u_email,u_phone,u_pic) values(?,?,?,?,?,?) ";
	var params=[req.body.u_admin,req.body.u_pass,req.body.u_name,
	      req.body.u_email,req.body.u_phone,req.body.pic];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[insert error:]"+err.message);
			return;
		}
		if(result.insertId>0){
			res.render("admin/public/infor",{infor:"添加成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"添加失败！",adminuser:locals.adminuser});
		}
	});  
  
});

//添加修改表单
router.get('/edit', function(req, res, next) {
	conn.query("select *from myself where u_id="+req.query.u_id,function(err,result){
		 res.render('admin/users/edit',{vo:result[0],adminuser:locals.adminuser}); //加载模板
	});
  
});
//执行修改用户
router.post('/doEdit', function(req, res, next) {
	var sql="update myself set u_admin=?,u_pass=?,u_name=?,u_email=?,u_phone=?,u_pic=? where u_id=?";
	var params=[req.body.u_admin,req.body.u_pass,req.body.u_name,
	      req.body.u_email,req.body.u_phone,req.body.pic,req.body.u_id];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[update error:]"+err.message);
			return;
		}
		if(result.affectedRows>0){
			res.render("admin/public/infor",{infor:"修改成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"修改失败！",adminuser:locals.adminuser});
		}
	});  
  
});

//删除用户
router.get('/delete', function(req, res, next) {
	var sql="delete from myself where u_id=?";
	var params=[req.query.u_id];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[delete error:]"+err.message);
			return;
		}
		//判断影响行数
		if(result.affectedRows>0){
			res.render("admin/public/infor",{infor:"删除成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"删除失败！",adminuser:locals.adminuser});
		}
	});  
  
});

module.exports = router;
