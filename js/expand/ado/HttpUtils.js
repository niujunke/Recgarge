
export const URL='http://192.168.1.107/recharge/mobile/'
export const imgURL='http://192.168.1.107/recharge/dat/up/mall/avatar/'
export const imgsURL='http://192.168.1.107/recharge/dat/up/mall/article/'
export const localURL='http://192.168.1.107'
export default class HttpUtils{
  static get(url)
  {
     return new Promise((resolve,reject)=>{
        fetch(url)
        .then(response=>response.json())
        .then(result=>{
            resolve(result)
        })
        .catch(error=>{
           reject(error);
        })
     })
  }
  static post(url,data)
  {
      return new Promise((resolve,reject)=>{
         fetch(url,{
             method:'POST',
             header:{},
             body:data
         })
            .then(response=>response.json())
            .then(result=>{
                resolve(result)
            })
            .catch(error=>{
               reject(error);
            })
      })
  }
}