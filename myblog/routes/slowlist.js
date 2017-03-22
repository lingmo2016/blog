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
	 conn.query("select *from myarticle order by addtime desc",function(err,result){
		res.render('slowlist',{list:result});
		//console.log(result[0]);
	});
});



module.exports = router;
