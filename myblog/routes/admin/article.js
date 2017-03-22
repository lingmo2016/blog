var express = require('express');
var router = express.Router();
var locals = new Object();
//连接数据库
var mysql=require("mysql");
var conn=mysql.createConnection({
	host: "localhost",
	password:'123456',
	user:'root',
	database:'mydb',
	port:3306
});
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
//访问后台首页 views文件夹下
router.get('/', function(req, res, next) {
	conn.query("select *from myarticle" , function(err,result){
		res.render('admin/article/index',{list:result,adminuser:locals.adminuser});  //加载模板
	});
  
});
//添加模板
router.get('/add', function(req, res, next) {
  res.render('admin/article/add',{adminuser:locals.adminuser});  //加载模板
});
//执行添加
router.post('/doAdd', function(req, res, next) {
	var sql="insert into myarticle(title,author,source,intro,content,addtime) values(?,?,?,?,?,?) ";
	var params=[req.body.title,req.body.author,req.body.source,
	      req.body.intro,req.body.content,req.body.addtime];
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

//添加编辑模板
router.get('/edit', function(req, res, next) {
	var sql="select *from myarticle where a_id="+req.query.a_id;
    conn.query(sql,function(err,result){
	  res.render('admin/article/edit',{vo:result[0],adminuser:locals.adminuser});  //加载模板
    });
  
});
//执行编辑
router.post("/doEdit",function(req,res,next){
	var sql="update myarticle set title=?,author=?,source=?,intro=?,content=?,img=? where a_id=?";
	var params=[req.body.title,req.body.author,req.body.source,
	    req.body.intro,req.body.content,req.body.img,req.body.a_id];
		console.log(params);
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
//删除文章
router.get('/delete', function(req, res, next) {
	var sql="delete from myarticle where a_id=?";
	var params=[req.query.a_id];
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

//浏览评论
router.get('/comment', function(req, res, next) {
	conn.query("select *from mycomment",function(err,result){
		res.render('admin/article/comment',{list:result,adminuser:locals.adminuser});  //加载模板
	});
  
});
//删除评论
router.get('/dele', function(req, res, next) {
	var sql="delete from mycomment where c_id=?";
	var params=[req.query.c_id];
	console.log(params);
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[del error:]"+err.message);
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

//添加评论模板
router.get("/addcomm",function(req,res,next){
	res.render("admin/article/addcomm",{adminuser:locals.adminuser});
});
//执行添加评论
router.post("/doAddComm",function(req,res,next){
	var sql="insert into mycomment (a_id,c_name,c_content,img) values (?,?,?,?)";
	var params=[req.body.a_id,req.body.c_name,req.body.c_content,req.body.img];
	console.log(params);
	conn.query(sql,params,function(err,result){
		if(err){
			console.log("[insert error]:"+err.message);
			return;
		}
		if(result.insertId>0){
			res.render("admin/public/infor",{infor:"添加评论成功！",adminuser:locals.adminuser});
		}else{
			res.render("admin/public/infor",{infor:"添加评论失败！",adminuser:locals.adminuser});
		}
	});
});

module.exports = router;
