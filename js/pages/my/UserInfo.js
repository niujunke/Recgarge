import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
import ViewUtils from '../../util/ViewUtils'
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
import Storage from '../../expand/ado/Storage'

export default class UserInfo extends Component{
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.Storage=new Storage('user')
    this.state={
      items:{}
    }
  }
  componentDidMount()
  {
     this.backPress.componentDidMount();
     this.isLogin();
  }
  componentWillUnmount()
  {
    this.backPress.componentWillUnmount();
  }
   isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           this.token=result.key
            let formData = new FormData(); 
            let url=URL+'index.php?c=user&a=my'; 
            formData.append('token',this.token);
            HttpUtils.post(url,formData)
             .then(result=>{
                 this.setState({
                    items:result.datas
                 })
                  console.log(result)
             })
              .catch(error=>{
                 console.log(error)
            })    
        })
        .catch(error=>{ 
          console.log(error)
        })

  }
  onBackPress(e)
  {
    this.goBack();
    return true;
  }
	goBack()
	{
	   this.props.navigator.pop()
	}
  
 // getLocalTime(nS) {     
   // return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)
  //}    
   getLocalTime(nows) 
   { 
      if(nows)
      {
        console.log(nows+'tim')
        var now=new Date(nows*1000); 
        var year=now.getFullYear(); 
        var month=now.getMonth()+1; 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var second=now.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
      }
   
    }    
	render(){
		return(
               <View style={styles.container}>
                    <NavigationBar 
                      leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                      title='个人信息'
                      style={{backgroundColor:'#fff'}}
                    />
                    <View style={styles.item}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text>手机</Text>
                          <Text style={styles.text}>{this.state.items.member_mobile}</Text>
                     </View>
                    <View style={styles.line}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text>姓名</Text>
                          <Text style={styles.text}>{this.state.items.member_truename}</Text>
                     </View>
                    <View style={styles.line}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text>状态</Text>
                          <Text style={styles.text}>{this.state.items.member_state==1?'正常':'停用'}</Text>
                     </View>
                    <View style={styles.line}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text>注册时间</Text>
                          <Text style={styles.text}>{this.getLocalTime(this.state.items.member_time)}</Text>
                     </View>
               </View>
			)
	}
}
const styles=StyleSheet.create({
	 container:{
        flex:1,
        backgroundColor:'#eee'
    },
     item:{
      height:12,
      backgroundColor:'#eee'
    },
    row:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#fff',
      padding:10,
      paddingLeft:15,
      paddingRight:15,
      height:45
    },
     flex_sb:{
      justifyContent:'space-between'
    },
     text:{
    color:'#333'
  },
  line:{
    height:1,
    backgroundColor:'#eee'
  }
})