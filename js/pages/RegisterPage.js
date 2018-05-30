import React, {
  Component
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import BackPressComponent from '../common/BackPressComponent'
import ViewUtils from '../util/ViewUtils'
import HttpUtils, {URL} from '../expand/ado/HttpUtils'
export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.member_mobile='';
    this.member_passwd='';
    this.member_paypwd='';
    this.repassword='';
    this.member_truename='';
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.state = {
        isLoading:true,
        isValidate:false
    };
  }
   componentDidMount()
  {
     this.backPress.componentDidMount();
  }
  componentWillUnmount()
  {
    this.backPress.componentWillUnmount();
  }
  onBackPress(e)
  {
    this.goBack();
    return true;
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
    if(this.member_paypwd.length<6)
    {
      this.toast.show('请输入6到16位支付密码',1500);
      return false
    }
    if(this.repassword!==this.member_paypwd)
    {
      this.toast.show('两次支付密码不一致',1500);
      return false
    }
    if(this.member_truename.length<2)
    {
       this.toast.show('请输入姓名',1500);
       return false
    }
    let formData = new FormData(); 
    let url=URL+'index.php?c=login&a=register'; 
    formData.append('member_mobile',this.member_mobile);  
    formData.append('member_passwd',this.member_passwd);
    formData.append('member_paypwd',this.member_paypwd);  
    formData.append('member_truename',this.member_truename); 
      HttpUtils.post(url,formData)
       .then(result=>{
           console.log(result) 
           if(result.status==0)
           {
              this.toast.show(result.datas.error,1500);
              return
           }
            Alert.alert(
              '提示',
              '恭喜注册成功！',
              [
                {text:'确认',onPress:()=>{this.goBack()}}
              ]
            )
       })
        .catch(error=>{
          console.log(JSON.stringify(error+'错误')) 
      })
  }
  goBack()
  {
     this.props.navigator.pop()
  }
  render() {

    return (
      <View style={styles.conainer}>
                <NavigationBar
                  leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                  title='注册'
                  style={{backgroundColor:'#fff',borderBottomWidth:0.5,borderColor:'#eee'}}
                 />
                  <ScrollView
                   keyboardShouldPersistTaps={true}
                  >
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_mobile=text} 
                         keyboardType='numeric'
                         placeholder ='请输入手机号'
                         clearButtonMode="while-editing"
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
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_paypwd=text} 
                         placeholder ='请输入支付密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         secureTextEntry={true}
                         />
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.repassword=text} 
                         placeholder ='请再次输入支付密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         secureTextEntry={true}
                         />
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_truename=text} 
                         placeholder ='请输入真实姓名'
                         maxLength={4}
                         placeholderTextColor='#ccc'
                         />
                         <TouchableNativeFeedback 
                          onPress={()=>this.onSubmit()}
                         ><View style={styles.submit}><Text style={styles.footTxt}>注册</Text></View></TouchableNativeFeedback >
                  </View>
                   </ScrollView>
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