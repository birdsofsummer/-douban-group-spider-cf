const cors_headers={
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
    'access-control-allow-headers': 'accept,accept-encoding,cf-connecting-ip,cf-ipcountry,cf-ray,cf-visitor,connection,content-length,content-type,host,user-agent,x-forwarded-proto,x-real-ip,accept-charset,accept-language,accept-datetime,authorization,cache-control,date,if-match,if-modified-since,if-none-match,if-range,if-unmodified-since,max-forwards,pragma,range,te,upgrade,upgrade-insecure-requests,x-requested-with,chrome-proxy,purpose,accept,accept-language,content-language,content-type,dpr,downlink,save-data,viewport-width,width',
    'access-control-max-age': '1728000',
}


const {isArray } = Array
let is_json=(a=null)=>a ? a.constructor==Object || a.constructor ==Array :false

const moment=require("moment")
const today=()=>moment()
const weekday=()=>today().weekday()
const saturday=()=>today().add(weekday()-5,'days').format('YYYYMMDD')

let http=(method="GET")=>(u,d=null)=>fetch(u,{method,body:is_json(d)?JSON.stringify(d):d})

const get=http('GET')
const post =(u,d)=>fetch(u,{method:"POST",body:d})
const proxy=async (u,r)=>post(u,await clone_body(r))
const gets1=(us=[])=>Promise.all(us.map(u=>get(u)))

const gets=async us=>{
    let ok=false
    let data=[]
    try{
        let r=await Promise.all(us.map(u=>get(u)))
        ok=r.every(x=>x.ok==true)
        data=await Promise.all(r.map(x=>x.json()))
        return {ok,data}
    }catch(e){
        return {ok,data}
    }
}

const add_cors=r=>new Response(r.body,{...r,headers:{...cors_headers,...r.headers}})
let is_form=r=>/form/.test(r.headers.get('content-type'))
let clone_body=async (r)=>is_form(r) ? await r.clone().formData() :await r.clone().text()

const echo=async r=>new Response(await r.clone().formData(),{headers:r.headers})
const echo_headers=r=>new Response(JSON.stringify(Object.fromEntries([...r.headers])))
const json_res=(d)=>new Response(JSON.stringify(d))

const parse_url=u=>x=>new URL(u).searchParams.get(x)

const is_weixin=request=>/MicroMessenger/i.test(request.headers.get('user-agent'))

// ----------------------------------------------------------------

const api={
  "douban":"https://service-9rx17sto-1252957949.ap-hongkong.apigateway.myqcloud.com/release/douban",
  "douban_cos":"https://ttt-1252957949.cos.ap-hongkong.myqcloud.com/douban/douban.json",
  "hack_news":"https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/hack_news",
  "sputni":"https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/sputni",
  "news":"https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/news",
  "cos_tk":"https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/upload_tk",
   "doc":"https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/doc",
}



const DATA = require("./data.js").DATA
const douban_cached =req=>json_res(DATA)

const douban=req=>http("GET")(api.douban)
const douban_cos=async req=>{
        let d=await http("GET")(api.douban_cos)
        let d0=await d.json()
        let d1={
                "errorCode": 0,
                "errorMessage": "",
                "ok": true,
                "data": d0
        }
        return json_res(d1)
}

const v2ex_url=x=>"https://www.v2ex.com/api/topics/"+x+".json"
const v2ex_api=()=>["hot","latest"].map(v2ex_url)
const v2ex=()=>gets(v2ex_api())
const v2ex1= async req=>json_res(await v2ex())

const hack_news=(req)=>get(api.hack_news)
const sputni=(req)=>get(api.sputni)
const news=(req)=>get(api.news)
const cos_tk=(req)=>get(api.cos_tk)

export {
    douban,
    douban_cos,
    douban_cached,
    v2ex1,
    hack_news,
    sputni,
    news,
    add_cors,
    cos_tk,
    api,
    json_res,
}
