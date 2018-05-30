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
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import BackPressComponent from '../../common/BackPressComponent'
import Storage from '../../expand/ado/Storage'
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
export default class SetPayPassword extends Component {
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.Storage=new Storage('user')
    this.password='';
    this.token='';
    this.newpassword='';
    this.renewpassword='';
    this.state = {
        isLoading:true
    };
  }
  componentDidMount()
  {
     this.backPress.componentDidMount();
     this.isLogin()
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
      if(this.password.length<6)
      {
         this.toast.show('请输入6到16位支付密码',1500)
         return false
      }
       if(this.newpassword.length<6)
      {
         this.toast.show('请输入6到16位新支付密码',1500)
         return false
      }
       if(this.renewpassword!=this.newpassword)
      {
          this.toast.show('两次支付密码不一致',1500);
         return false
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=user&a=modPaypwd'; 
      formData.append('password',this.password);
      formData.append('token',this.token);  
      formData.append('newpassword',this.newpassword);
      formData.append('renewpassword',this.renewpassword);
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          if(result.status==1)
           {
               Alert.alert(
              '提示',
               result.datas,
              [
                {text:'确认',onPress:()=>{this.goBack()}}
              ]
             )
           }
           else
           {
              this.toast.show(result.datas.error,1500);
           }
          console.log(result)
       })
        .catch(error=>{
          console.log(error+'1123')
      })
  }
   isLogin()
  {
     this.Storage.fetch()
        .then(result=>{
            this.token=result.key  
        })
        .catch(error=>{ 
          console.log(error)
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
                  title='修改支付密码'
                  style={{backgroundColor:'#fff'}}
                 />
                  <View style={styles.item}></View>
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.password=text} 
                         secureTextEntry={true}
                         placeholder ='请输入原支付密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         />
                         <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.newpassword=text} 
                         secureTextEntry={true}
                         placeholder ='请输入新支付密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         />
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.renewpassword=text} 
                         secureTextEntry={true}
                         placeholder ='请再次输入新支付密码'
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         />
                  </View>
                   <TouchableNativeFeedback
                    onPress={()=>this.onSubmit()}
                   ><View style={styles.submit}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                   <Toast ref={toast=>this.toast=toast}/>
            </View>
    )
  }
}

const styles = StyleSheet.create({
  conainer: {
    flex: 1,
    backgroundColor:'#eee'
  },
  cont:{
    backgroundColor:'#fff'
  },
  input:{
    height:45,
    borderBottomWidth:1,
    borderColor:'#eee',
    padding:10
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
    marginLeft:10,
    marginRight:10,
    borderRadius:3
  },
  footTxt:{
     color:'#fff'
  },
   item:{
      height:12,
      backgroundColor:'#eee'
    }
})