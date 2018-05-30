import React, {Component,PropTypes} from 'react';
import {
  AsyncStorage
} from 'react-native';
const FAVORITE_KEY_PREFIX='favorite_'
export default class FavoriteDao{
	 constructor(flag) {
    this.flag=flag;
	  this.favoiteKey=FAVORITE_KEY_PREFIX+flag;
	 }
   /*收藏项目，保存收藏的项目
    @param key项目id或者名称
    @param value 收藏的项目
   */
   saveFavoriteItem(key,value,callback)
   {
     AsyncStorage.setItem(key,value,(error)=>{
        if(!error)
        { 
           this.updateFavoriteKeys(key,true)
        }
     })
   }
   /*更新 Favorite key 集合
   @param isAdd true 添加，false 删除
   */
   updateFavoriteKeys(key,isAdd)
   {
      AsyncStorage.getItem(this.favoiteKey,(error,result)=>{
          if(!error)
          {
             var favoiteKeys=[];
             if(result)
             {
                favoiteKeys=JSON.parse(result);
             }
             var index=favoiteKeys.indexOf(key)
             if(isAdd)
             {
                if(index===-1)favoiteKeys.push(key)
             }
            else
             {
                if(index!==-1)favoiteKeys.splice(index,1)
             }
             AsyncStorage.setItem(this.favoiteKey,JSON.stringify(favoiteKey))
            
          }
      })
   }
   /*获取收藏的项目对应的key  
   */
   getFavoritekeys()
   {
     return new Promise((resolve,reject)=>{
        AsyncStorage.getItem(this.favoiteKey,(error,result)=>{
           if(!error)
           {
              try{
                 resolve(JSON.parse(result))
              }catch(e)
              {
                reject(e);
              }  
           }
           else
           {
              reject(error)
           }
        })
     })
   }
	/*取消收藏，移除已经收藏的项目
  */
  removeFavoriteItem(key)
  {
     AsyncStorage.setItem(key,(error)=>{
         if(!error)
         {
            this.updateFavoriteKeys(key,false)
         }
     })
  }
}