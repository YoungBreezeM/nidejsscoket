let connUser ={user:"yqf",conn:1};
let usrMap = new Map([]);
usrMap.set(connUser.user,connUser.conn);
usrMap.set('cxf',{conn:connUser.conn,ip:'123'});
// usrMap.keys((key)=>{
//     console.log(key)
// })
usrMap.forEach((value, key, map)=>{
    console.log(key)
})