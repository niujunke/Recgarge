import React, {Component} from 'react';
import {
  AsyncStorage
} from 'react-native';

export let FLAG_LANGUAGE={flag_language:'flag_language_language',flag_key:"flag_language_key"}
export default class Storage{
	 constructor(flag) {
	   this.flag=flag;
	 }
	 fetch(){
	 	return new Promise((resolve,reject)=>{
             AsyncStorage.getItem(this.flag,(error,result)=>{
             	 if(error)
             	 {
                   reject(error)
                  return
             	 }
             	 else
             	 {
             	   	 try{
                          resolve(JSON.parse(result));
                      }catch(e){
                              reject(e);
                      } 
             	 }
             })
	 	})
	 }
	 save(data)
	 {
  	 	AsyncStorage.setItem(this.flag,JSON.stringify(data),(error)=>{	
  	 	})
	 }
   onRemove()
   {
     AsyncStorage.removeItem(this.flag,(error)=>{
    
     })
   }
}