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
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import HttpUtils, {URL} from '../expand/ado/HttpUtils'
import Loading from '../common/Loading'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
var cols = 4;
var boxW = 76;
var w=width-20
var vMargin = (w-cols*boxW)/(cols+1);
var hMargin = 25;
export default class Recgarge extends Component {
  constructor(props) {
    super(props);
    this.member_mobile='';
    this.member_paypwd='';
    this.state = {
        isLoading:false,
        money:''
    };
  }
  
  onSubmit()
  {
     if(this.member_mobile.length<11)
      {
       DeviceEventEmitter.emit('showToast','手机号格式不正确')
      return false
      }
      if(this.member_paypwd.length<6)
      {
         DeviceEventEmitter.emit('showToast','请输入6到16位支付密码')
         return false
      }
       if(this.state.money=='')
      {
        DeviceEventEmitter.emit('showToast','请选择金额')
         return false
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=recharge&a=index'; 
      formData.append('member_mobile',this.member_mobile);  
      formData.append('member_paypwd',this.member_paypwd);
      formData.append('money',this.state.money);
      console.log(formData)
      this.setState({isLoading:true})
      HttpUtils.post(url,formData)
       .then(result=>{
           this.setState({isLoading:false})
           if(result.status==0)
           {
               DeviceEventEmitter.emit('showToast',result.datas.error)
              return
           } 
           Alert.alert(
            '提示',
             result.datas,
            [
              {text:'确认',onPress:()=>{this.onSubmitOK()}}
            ]
          )   
       })
        .catch(error=>{
            this.setState({isLoading:false})
            DeviceEventEmitter.emit('showToast','充值异常,重试或检查网络')
            console.log(error) 
      })
  }
  onSubmitOK()
  {
    this.refs.textInput.clear();
    this.refs.textInputRefer.clear();
    this.member_mobile=this.member_paypwd=''
    this.setState({
      money:''
    })
  }
  onSelect(str)
  {
    this.setState({
      money:str
    })

  }
  _expenses(str)
  {
    let isSelect=str===this.state.money

     return  <TouchableOpacity 
             onPress={()=>this.onSelect(str)}
             style={[styles.expenses,{borderColor:isSelect?'#E53E49':'#ddd'}]}
            >
             <Text style={[styles.gray,{color:isSelect?'#E53E49':'#999'}]}>{str}元</Text>
            </TouchableOpacity>
                            
  }
  render() {
    let loading=this.state.isLoading? <Loading/>:null
    return (
      <View style={styles.conainer}>
                <NavigationBar
                  title='充值'
                  style={{backgroundColor:'#fff'}}
               
                 />
                 <ScrollView
                  keyboardShouldPersistTaps={'handled'}
                 >
                  <Image source={require('../../res/images/ban.png')} style={styles.ban}></Image>
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_mobile=text} 
                         keyboardType='numeric'
                         placeholder ='请输入手机号'
                         ref="textInputRefer"
                         maxLength={11}
                         placeholderTextColor='#ccc'
                         />
                         <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.member_paypwd=text} 
                         placeholder ='请输入支付密码'
                         ref="textInput"
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         secureTextEntry={true}
                         />
                         <Text style={styles.tit}>充话费</Text>
                         <View style={styles.flex}>
                              {this._expenses('10')}
                              {this._expenses('20')}
                              {this._expenses('30')}
                              {this._expenses('50')}
                              {this._expenses('100')}
                              {this._expenses('200')}
                              {this._expenses('300')}
                              {this._expenses('500')}
                         </View>
                         <TouchableNativeFeedback
                           onPress={()=>this.onSubmit()}
                         ><View style={styles.submit}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                  </View>
                  </ScrollView>
                  {loading}
            </View>
    )
  }
}

const styles = StyleSheet.create({
  conainer: {
    flex: 1,
    backgroundColor:'#fff'
  },
  ban:{
    width:width,
    height:110,
    resizeMode:'cover'
  },
  cont:{
    padding:10
  },
  input:{
    height:40,
    borderBottomWidth:1,
    borderColor:'#ddd',
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
  expenses:{
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius:5,
    height:40,
    width:boxW,
    marginLeft:vMargin,
    marginTop:8,
    alignItems:'center',
    justifyContent:'center'
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
  }
})