
const to_promise=fn=>(...args)=>new Promise((resolve,reject)=>fn(...args,(err,data)=>err? reject(err) : resolve(data)))
const forEach=f=>o=> Object.entries(o).map(f)
const cb2promise=(cos)=>{
    const p=cos.constructor.prototype
    const pc=cos.__proto__
  //promiseify=([x,y])=>p["_"+x]=to_promise(y.bind(cos))
    const promiseify=([x,y])=>pc["_"+x]=to_promise(y.bind(cos))
    forEach(promiseify)(p)
    return cos
}

const cb2promise1=(c)=>{
    const promiseify=([x,y])=>c["_"+x]=to_promise(y.bind(c))
    forEach(promiseify)(c)
    return c
}

const say=x=>(...y)=>console.log(x,...y)
const get_json=u=>fetch(u).then(x=>x.json())

const cos_url="https://service-75ph8ybo-1252957949.ap-hongkong.apigateway.myqcloud.com/release/weibo/upload_tk"
const sign=()=>get_json(cos_url)

const key_formator=({ credentials: { sessionToken, tmpSecretId, tmpSecretKey}, expiredTime, startTime,})=>({
        TmpSecretId: tmpSecretId,
        TmpSecretKey: tmpSecretKey,
        XCosSecurityToken: sessionToken,
        ExpiredTime: expiredTime,
})

var getAuthorization = (k)=>(options, f)=>f(k)
var get_auth=(a)=>cb2promise(new COS({ getAuthorization: getAuthorization(key_formator(a)) }))

const init=async ()=>{
        var Bucket = 'zzz-1252957949';
        var Region = 'ap-hongkong';
        var buk={Bucket ,Region }
        let {ok:ok0,data:{ok,data}}=await sign()
        if (!ok0 || !ok) {
            return
        }
        var cos=get_auth(data)

        const list=()=>cos._getBucket(buk)
        const upload=(file)=> cos._sliceUploadFile({
                    Body: file,
                    Key: "/test/"+file.name,
                    Bucket: Bucket,
                    Region: Region,
                    onHashProgress: say('...'),
                    onProgress: say('p'),
                }).then(say('done'))
        const get=(Key)=>cos._getObject({...buk,Key:"/test/"+file.name})

        const input = document.getElementById('file');
        const onSelectFile =() =>upload(input.files[0])
        input.addEventListener('change', onSelectFile, false);
    }

init()

