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

/* GET users listing. 分路由配置 */
//访问后台首页
router.get('/', function(req, res, next) {
	conn.query("select *from mylable",function(err,result){
		res.render("admin/tag/index",{list:result,adminuser:locals.adminuser});
	});
});

//加载添加表单
router.get('/add', function(req, res, next) {
  res.render('admin/tag/add',{adminuser:locals.adminuser});
});
//执行添加标签
router.post('/doAdd', function(req, res, next) {
	var sql="insert into mylable (b_name) values (?)";
	var params=[req.body.b_name];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[insert error:]"+err.messsage);
			return;
		}
		if(result.insertId>0){
			res.render("admin/public/infor",{infor:"添加标签成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"添加标签失败！",adminuser:locals.adminuser});
		}
	});
});

//添加编辑表单
router.get("/edit",function(req,res,next){
	conn.query("select *from mylable where b_id="+req.query.b_id,function(err,result){
		res.render("admin/tag/edit",{vo:result[0],adminuser:locals.adminuser});
	});
});
//执行修改标签
router.post("/doEdit",function(req,res,next){
	var sql="update mylable set b_name=? ";
	var params=[req.body.b_name];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[update error :]"+err.message);
			return;
		}
		if(result.affectedRows>0){
			res.render("admin/public/infor",{infor:"修改成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"修改失败！",adminuser:locals.adminuser});
		}
	});
});
//删除标签
router.get('/delete', function(req, res, next) {
	var sql="delete from mylable where b_id=?";
	var params=[req.query.b_id];
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[delete error:]"+err.message);
			return;
		}
		if(result.affectedRows>0){
			res.render("admin/public/infor",{infor:"删除成功",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"删除失败！",adminuser:locals.adminuser});
		}
	});
});

module.exports = router;
