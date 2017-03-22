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

/* GET home page. */
router.get('/', function(req, res, next) {
	conn.query("select max(a_id) from myarticle ",function(err,max){
		if(max>=5){
	        conn.query("select *from myarticle  where a_id <= max and a_id >= max-5 order by addtime desc",function(err,result){
		    res.render('index',{list:result});
		    });
		}else{
			  conn.query("select *from myarticle  order by addtime desc",function(err,result){
		       res.render('index',{list:result});
			  });
	    }
	});
});

module.exports = router;
