import React, {
  Component
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableNativeFeedback,
  TouchableOpacity
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import Loading from '../common/Loading'
import RegisterPage from './RegisterPage'
import HttpUtils, {URL} from '../expand/ado/HttpUtils'
import Storage from '../expand/ado/Storage'
import HomePage from './HomePage'
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.member_mobile='';
    this.member_passwd='';
    this.Storage=new Storage('user')
    this.state = {
        isLoading:false
    };
  }
 onSubmit()
  {
     if(this.member_mobile.length<11)
    {
    this.toast.show('手机号格式不正确',1500);
     return false
    }
    if(this.member_passwd.length<6)
    {
      this.toast.show('请输入6到16位密码',1500);
       return false
    }
    let formData = new FormData(); 
    let url=URL+'index.php?c=login&a=index'; 
    formData.append('member_mobile',this.member_mobile);  
    formData.append('member_passwd',this.member_passwd);
    this.setState({
      isLoading:true
    })
      HttpUtils.post(url,formData)
       .then(result=>{
           console.log(result)
            this.setState({isLoading:false}) 
           if(result.status==0)
           {
              this.toast.show(result.datas.error,1500);
              return
           }  
           this.Storage.save(result.datas) 
           this.props.navigator.push({
                        component:HomePage
                      })   
       })
        .catch(error=>{
          this.setState({isLoading:false})
          DeviceEventEmitter.emit('showToast','登录异常,重试或检查网络')
          console.log(error+'错误') 
      })
  }
  
  render() {
    let rightButton=<Text style={styles.rightBtn}
                    onPress={()=>{
                      this.props.navigator.push({
                        component:RegisterPage
                      })
                    }} 
                    >注册</Text>
     let loading=this.state.isLoading? <Loading/>:null
    return (
      <View style={styles.conainer}>
                <NavigationBar
                  title='登录'
                  style={{backgroundColor:'#fff',borderBottomWidth:0.5,borderColor:'#eee'}}
                  rightButton={rightButton}
                 />
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_mobile=text} 
                         keyboardType='numeric'
                         placeholder ='请输入手机号'
                          maxLength={11}
                         placeholderTextColor='#ccc'
                         />
                         <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_passwd=text} 
                         placeholder ='请输入密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         secureTextEntry={true}
                         />
                         <TouchableNativeFeedback
                           onPress={()=>this.onSubmit()} 
                         ><View style={styles.submit}><Text style={styles.footTxt}>登录</Text></View></TouchableNativeFeedback>
                  </View>
                  {loading}
                  <Toast ref={toast=>this.toast=toast}/>
            </View>
    )
  }
}

const styles = StyleSheet.create({
  conainer: {
    flex: 1,
    backgroundColor:'#fefefe'
   
  },
  cont:{
    padding:10,
    marginTop:30,
    paddingLeft:30,
    paddingRight:30
  },
  input:{
    height:40,
    borderBottomWidth:0.5 ,
    borderColor:'#eee',
    marginBottom:10
  },
  tit:{
    color:'#999',
    fontSize:12,
    marginBottom:15,
     marginTop:10
  },
  flex:{
   flexDirection:'row',
   flexWrap:'wrap'
  },
  gray:{
    color:"#999"
  },
  submit:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    borderRadius:3
  },
  footTxt:{
     color:'#fff'
  },
  rightBtn:{
    position:'absolute',
    right:20
  }
})