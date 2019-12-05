//代码请求的数据是forecast，不是实时（返回当天），返回近三天天气数据，选择第二天数据作为预报，具体可参考和风api技术文档
const request = require('request');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = 21; rule.minute = 0; rule.second = 0; // 设置定时发送的时间
var data= '';
var j = schedule.scheduleJob(rule, function(){
	console.log('发送天气预报...');
  	sendWeather();
});
function sendWeather(){
	const url= 'https://free-api.heweather.net/s6/weather/forecast?key=YOUR_KEY0&location=CITY_CODE'; 
	request(url,(error,response,body)=>{
		if(error){
			console.log(error);
		}
		data=JSON.parse(body);
		data=data.HeWeather6[0]

		let transporter=nodemailer.createTransport({
		host: "smtp.qq.com", // 邮箱的smtp服务器地址
		port: 465,//邮箱里面会写
		secureConnection: true,
		auth: {
			user:'xxx', // 邮箱地址
			pass:'xxx' // smtp授权码，不是邮箱的登录密码，是授权码，需要开启smtp后设置
			}
		});
		let mailOptions={
			from: "<xxx>", // 与发件地址一致，否则报错
			to: "xxx", // 要发送的邮箱地址
			subject: data.daily_forecast[1].date + '的天气预报哦',
			text:'城市 :'+data.basic.parent_city+data.basic.location+' 时间：'+ data.daily_forecast[1].date,
			html: '<div style="background-image:url('faceu_1562839197321.JPG')"><div><h1>给xxx的天气预报</h1></div><div><h3 style="margin:20px auto 10px auto">' + data.daily_forecast[1].date + ' ' + data.basic.location + '区</h3><div><p><span>日出时间: </span><span>'+data.daily_forecast[1].sr+'</span><span style="width:40%;margin-left: 30px">日落时间: </span><span>'+data.daily_forecast[1].ss+'</span></p><p><span>白天: </span><span>'+data.daily_forecast[1].cond_txt_d+'</span><span style="width:40%;margin-left: 30px">晚间: </span><span>'+data.daily_forecast[1].cond_txt_n+'</span></p><p><span>最高温度: </span><span><b>'+data.daily_forecast[1].tmp_max+'</b>℃</span><span style="width:40%;margin-left: 30px">最低温度: </span><span><b>'+data.daily_forecast[1].tmp_min+'</b>℃</span></p><p><span>紫外线强度指数: </span><span><b>'+data.daily_forecast[1].uv_index+'</b></span></p><p><span>降水概率: </span><span>'+data.daily_forecast[1].pop+' %</span></p><p><span>风力: </span><span>'+data.daily_forecast[1].wind_sc+'</span></p><p><span>穿衣建议: ' + '</span>小可爱穿啥都好看啦 ε==(づ′▽`)づ</p><br><p><small>注 紫外线强度: 0-2 无危险 | 3-5 较轻伤害 | 6-7 很大伤害 | 8-10 极高伤害 | 11+ 及其危险</small></p></div></div></div>'
		};
		transporter.sendMail(mailOptions,(err,info)=>{
			if(err){
				return console.log(err);
			}else{
				console.log('Message %s sent %s',info.messageId,info.response);
			}
			transporter.close();
		});
	});
}


