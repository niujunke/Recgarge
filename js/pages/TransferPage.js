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
import Toast,{DURATION} from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import CheckBox from 'react-native-check-box'
import HttpUtils, {URL} from '../expand/ado/HttpUtils'
import Loading from '../common/Loading'
import Storage from '../expand/ado/Storage'

export default class TransferPage extends Component {
  constructor(props) {
    super(props);
    this.phone='';
    this.money='';
    this.pay_password='';
    this.token='';
    this.add_everyday=0
    this.ammounts=[]
    this.Storage=new Storage('user')
    this.state = {
        isLoading:false,
        day:{},
        isChecked:false,
        every:{},
        everyData:[]
    };
  }
  componentDidMount()
  {
     this.isLogin();
  }
  onSubmit()
  {
      if(this.phone.length<11)
      {
       DeviceEventEmitter.emit('showToast','手机号格式不正确')
       return false
      }
      if(this.money=='')
      {
       DeviceEventEmitter.emit('showToast','请输入自由话费金额')
       return false
      }
      if(this.pay_password.length<6)
      {
         DeviceEventEmitter.emit('showToast','请输入6到16位支付密码')
         return false
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=transfer&a=transfer'; 
      formData.append('phone',this.phone);
      formData.append('money',this.money);  
      formData.append('pay_password',this.pay_password);
      formData.append('token',this.token);
      formData.append('add_everyday',this.add_everyday);
      this.add_everyday==1?formData.append('days',JSON.stringify(this.ammounts)):''; 
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
           console.log(result) 
       })
        .catch(error=>{
           this.setState({isLoading:false})
           
      })
  }
   onSubmitOK()
  {
    this.refs.textInput.clear();
    this.refs.textMoney.clear();
    this.refs.textPay.clear();
    this.phone=this.money=this.pay_password=''
    if(this.add_everyday==1)
    {
      this.isLogin()
      this.setState({
        isChecked:false
      })
    }
  }
  isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           console.log(result.key)
            this.token=result.key
            let formData = new FormData(); 
            let url=URL+'index.php?c=transfer&a=everyday'; 
            formData.append('token',this.token);
            HttpUtils.post(url,formData)
             .then(result=>{
                 console.log(result)
                 this.setState({
                    everyData:result.datas
                 }) 
             })
              .catch(error=>{
                 console.log(error)
            })
        })
        .catch(error=>{ 
          console.log(error)
        })

  }
   onClick()
  {
    if(this.state.isChecked)
    {
      this.add_everyday=0
    }
    else
    {
      this.add_everyday=1
    }
    this.setState({
      isChecked:!this.state.isChecked
    })
   
    console.log(this.add_everyday)
  }
  renderCheckBox()
  {
    let leftText='同时添加每日话费';
    let isChecked=this.state.isChecked
    return <CheckBox
            style={styles.check}
            onClick={()=>this.onClick()}
            isChecked={isChecked}
            leftText={leftText}
            checkedImage={<Image source={require('./my/images/ic_check_box.png')} style={{tintColor:'#E53E49'}}/>}
            unCheckedImage={
              <Image source={require('./my/images/ic_check_box_outline_blank.png')}style={{tintColor:'#bbb'}}/>}
          />
  }
  
  selectDay(i)
  {
    let data=this.state.everyData
    if(data[i].select)
    {
       data[i].select=!data[i].select
       this.state.day[i]=! this.state.day[i] 
    }
    else
    {
      data[i].select=true
      this.state.day[i]=true
    }
    this.setState({
      every:this.state.day
    })
  }
  renderEveryDay()
  {
     let data=this.state.everyData
     
     if(!data||data.length===0)return
      let len=data.length;
      let views=[];
      let day=this.state.day 

      for(let i=0;i<len;i++)
      {
         views.push(
            <View style={[styles.row,styles.itemList]} key={i}>
                  <TouchableOpacity 
                   style={[styles.everyDayMoney,{borderColor:this.state.every[i]?'#E53E49':'#21c883'}]}
                   onPress={()=>this.selectDay(i)}
                  >
                  <Text style={{color:this.state.every[i]?'#E53E49':'#21c883'}}>{data[i].day} ￥{data[i].ammount}</Text></TouchableOpacity>
                  <TextInput
                   style={styles.input}
                   underlineColorAndroid='transparent'
                   onChangeText={text=>this.ammounts[i]=data[i].day+','+text} 
                   keyboardType='numeric'
                   placeholder ='转出金额'
                   placeholderTextColor='#ccc'
                   />
                   <Text>{day[i]}</Text>
            </View>
          )
      }
      return views
  }
  render() {
    let everyDay=this.state.everyData?<View style={styles.everyDay}>
                            <Text style={[styles.gray,{paddingLeft:15}]}>每日话费</Text>
                            <View>{this.renderEveryDay()?this.renderEveryDay():null}</View>
                 </View>:null
    let loading=this.state.isLoading? <Loading/>:null
    let everyCheck=this.state.everyData.length?<View style={styles.row}>
                          {this.renderCheckBox()} 
                        </View>:null
    return (
      <View style={styles.conainer}>
                <NavigationBar
                  title='转账'
                  style={{backgroundColor:'#fff'}}
               
                 />
                 <ScrollView
                   keyboardShouldPersistTaps={'handled'}
                 >
                  <View style={styles.item}></View>
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.phone=text} 
                         keyboardType='numeric'
                         placeholder ='转入会员手机号'
                         ref="textInput"
                         maxLength={11}
                         placeholderTextColor='#ccc'
                         />
                         <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.money=text} 
                         keyboardType='numeric'
                         placeholder ='自由话费金额'
                         ref="textMoney"
                         maxLength={6}
                         placeholderTextColor='#ccc'
                         />
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.pay_password=text} 
                         placeholder ='请输入支付密码'
                         ref="textPay"
                         secureTextEntry={true}
                         maxLength={16}
                         placeholderTextColor='#ccc'
                         />
                        <View style={styles.item}></View>
                        {everyCheck}
                        {this.state.isChecked?everyDay:null}
                  </View>
                   <TouchableNativeFeedback
                     onPress={()=>this.onSubmit()} 
                   ><View style={styles.submit}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                  </ScrollView>
                  {loading}
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
    borderBottomWidth:0.5,
    borderColor:'#eee',
    padding:10,
    flex:1
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
    color:"#999",
    fontSize:12
  },
  submit:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    borderRadius:3,
    marginBottom:20
  },
  footTxt:{
     color:'#fff'
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
    check:{
    flex:1
  },
  everyDay:{
    borderTopWidth:1,
    borderColor:'#eee',
    paddingTop:10,
    paddingBottom:20
  },
  everyDayMoney:{
   borderWidth:1,
   borderColor:'#21c883',
   borderRadius:5,
   height:40,
   alignItems:'center',
   justifyContent:'center',
   padding:5,
   flex:1
  },
  itemList:{
    marginTop:10
  }
})