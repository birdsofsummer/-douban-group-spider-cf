import index_html_file from './index.html'
import group_html_file from './group.html'
import topic_html_file from './topic.html'

const {
    v2ex1,
    hack_news,
    sputni,
    douban,
    douban_cos,
    douban_cached,
    news,
    add_cors,
    cos_tk,
    api,
    json_res,
}=require("./api")

const Router = require('./router')

const is_weixin=request=>/MicroMessenger/i.test(request.headers.get('user-agent'))


const add_qs=(u,o={})=>{
      Object.entries(o).map(x=>u.searchParams.append(...x))
      return u
}
const add_qs1=(u,o={})=>{
    let u1=new URL(u)
    add_qs(u1,o)
    return u1
}
const to_qs=(u="",o={})=>{
      let u1=new URL(u)
      return add_qs(u1,o)
}
const to_query=(o={})=>new URLSearchParams(o)


// "https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/doc"

const is_form=r=>/form/.test(r.headers.get('content-type'))
const is_get=({method})=>/get/i.test(method)
const cp_qs=(u0,u1)=>[...u0.searchParams].forEach(([k,v])=>u1.searchParams.append(k,v))
const clone_body=async (r)=>is_form(r) ? await r.clone().formData() :await r.clone().text()



const proxy1=async (req)=>{
     let {url,method}=req
     let u0=new URL(url)
     let {origin,pathname,host}=u0
     const proxy_list=new Map([
             ["/doc",api.doc],
     ])
    let p=proxy_list.has(pathname)
    if (p){
         let u1=new URL(proxy_list.get(pathname))
         cp_qs(u0,u1)
         let req1=new Request(u1,{method,body: is_get(req) ? null : await clone_body(req)})
         let r=await fetch(req1)
    //     let r= json_res({u1})
         return [1,r]
     }else{
         return [0,""]
     }
}


const html=(request)=> {
     const url = new URL(request.url)
     let {origin,pathname,host}=url
     const html_list=new Map([
             ["/",index_html_file],
             ["/group.html",group_html_file],
             ["/topic.html",topic_html_file],
     ])
    let p=html_list.has(pathname)
    if (p){
         let r = html_list.get(pathname) || index_html_file
         const headers ={ 'Content-Type': 'text/html' }
         let r1=new Response(r, { headers })
         return [1,r1]
    }else{
         return [0,""]
    }
}


async function handleRequest(request) {

      let [p1,p2]=await proxy1(request)
      if (p1) return p2

      let [h1,h2]=html(request)
      if (h1) return h2

      const r = new Router()
 //     let w=is_weixin(request)
      r.get('/',html)
      r.get('/list',douban_cached)
      r.get('/list2',douban)
      r.get('/list3',douban_cos)
      r.get('/hack_news',hack_news)
      r.get("/sputni",sputni)
      r.get("/news",news)
      r.get('/vv',v2ex1)
      r.get('/cos',cos_tk)
      const resp =await r.route(request)
      //return add_cors(resp)
      return resp
}

addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request))
})



