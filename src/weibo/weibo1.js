//https://open.weibo.com/apps/4043688639/info/advanced
const config={
  client_id: "4043688639",
  client_secret:`8c0c57ade73a5d17d7eccd020fa143be`,
  "login": "https://weread.qing.workers.dev/login",
  "logout": "https://weread.qing.workers.dev/logout",
  "redirect_uri":"",
}



api={
    //https://open.weibo.com/wiki/OAuth2/access_token
    "token":{
        method:"post",
        url:"https://api.weibo.com/oauth2/access_token",
        data:{
            "client_id":"4043688639",
            "client_secret":"8c0c57ade73a5d17d7eccd020fa143be",
            "grant_type":"authorization_code",
            "code":"8ba9dc6671310486941b5569b4b98e64",
            "redirect_uri":"https://weread.qing.workers.dev/login",
        },
    }
}
superagent=require("superagent")
const {post}=superagent
let {url,data}=api.token
superagent.post(url).type('form').send(data).then(x=>d=x).catch(console.log)


d='{"access_token":"2.00llxaXCVIue6E1aa75fb2d70_gHjk","remind_in":"157679999","expires_in":157679999,"uid":"2328694317","isRealName":"true"}'



https://api.weibo.com/oauth2/authorize?client_id=4043688639&redirect_uri=https://weread.qing.workers.dev/login&response_type=code




https://weread.qing.workers.dev/login?code=8ba9dc6671310486941b5569b4b98e64


/*
 {
       "access_token": "ACCESS_TOKEN",
       "expires_in": 1234,
       "remind_in":"798114",
       "uid":"12341234"
 }
*/
//https://open.weibo.com/wiki/OAuth2/access_token
