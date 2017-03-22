var express = require('express');
var router = express.Router();
var mysql=require("mysql");
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

/* GET users listing. */
router.get('/', function(req, res, next) {
	 conn.query("select *from myarticle  where a_id="+req.query.a_id,function(err,result){
		conn.query("select *from mycomment where a_id="+req.query.a_id,function(err,result1){
			   var length=result1.length;
			   res.render('content',{vo1:result[0],vo:result1,length:length});
		});
	});
});

router.post('/add', function(req, res, next) {
	 var sql="insert into mycomment (a_id,c_name,c_content,img) values (?,?,?,?)";
	var params=[req.body.a_id,req.body.c_name,req.body.c_content,req.body.img];
	console.log(params);
	conn.query(sql,params,function(err,result){
		//
		if(err){
			console.log("[insert error]:"+err.message);
			return;
		}
		if(result.insertId>0){
			
			res.render("infor",{infor:"评论成功！",a_id:req.body.a_id});
		}else{
			//res.render("admin/public/infor",{infor:"添加评论失败！",adminuser:locals.adminuser});
		}
		//res.render("/",{vo:result});
		
	});
});

module.exports = router;
