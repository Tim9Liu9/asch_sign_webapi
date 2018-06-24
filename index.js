//index.js
var express = require('express');

var secret = 'nerve quit sniff cancel stock when motor inside border dad bicycle erode'  //在浏览器内存中保留
var AschJS = require('asch-js');  //asch-js具体安装方法见附录
var publicKey = AschJS.crypto.getKeys(secret).publicKey;  //根据密码生成公钥
var address = AschJS.crypto.getAddress(publicKey);   //根据公钥生成地址



var app = express();
app.get('/', function(req, res){
    res.send('Express');
});

// 中间件接收json的post
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

/**


 方法作用：资产转账签名
 参数接收方式：post
 访问链接： http://127.0.0.1:3000/sign_asset_transaction 

currency	string	Y	资产名称：IBM.ITOKEN
secret	string	Y	阿希链账户密码：12个助记单词,通过数据库读取解密
amount	string	Y	金额，最小值：1，最大值：10000000000000000，记得乘以10**8
recipientId	string	Y	用户地址，最小长度：1
secondSecret	string	Y	发送者二级密码，最小长度;1,最大长度：100

返回：签名的交易数据

*/
app.post('/sign_asset_transaction', function(req, res){
    // var currency = 'NEWSINGLIMITED.OZAI';
    var currency = req.body.currency;
// 本次转账数（10000）=真实数量（10）*10**精度（8），需 <= 当前资产发行总量
//     var amount = '1000000000000';
    var amount = req.body.amount;
// 接收地址，需满足前文定义好的acl规则
    var recipientId = req.body.recipientId;
    var secret = req.body.secret;
    var secondSecret = req.body.secondSecret;
    var missing_parameter = [];
    if(!currency)
    {
        missing_parameter.push('currency');
    }
    if(!amount)
    {
        missing_parameter.push('amount');
    }
    if(!recipientId)
    {
        missing_parameter.push('recipientId');
    }
    if(!secret)
    {
        missing_parameter.push('secret');
    }
    if(!secondSecret)
    {
        missing_parameter.push('secondSecret');
    }
    if(missing_parameter.length > 0){
        return res.send(JSON.stringify( {"success":false, "error": "缺少参数：" + missing_parameter.join()}) );
    }

    // console.log("currency=" + currency + " ;amount=" + amount + " ;recipientId=" + recipientId + " ;secret=" + secret + " ;secondSecret=" + secondSecret);
    var trs = AschJS.uia.createTransfer(currency, amount, recipientId,'', secret, secondSecret);
    // console.log(trs );
    return res.send(JSON.stringify(trs) ) ;
});

app.listen(3000);
