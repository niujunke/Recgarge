import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import UserInfo from './UserInfo'
import Account from './Account'
import TradingRecord from './TradingRecord'
import SetPayPassword from './SetPayPassword'
import LoginPage from '../LoginPage'
import addressPage from './addressPage'
import OrderPage from './OrderPage'
import Storage from '../../expand/ado/Storage'
export default class MyPage extends Component {
   constructor(props) {
      super(props);
      this.Storage=new Storage('user')
      this.state={
        name:''
      }
      
    }
  componentDidMount()
  {
     this.isLogin();
  }
  renderItem(imgUrl,text,page)
  {
    return <TouchableOpacity
                   onPress={()=>this.onPushPage(page)}
                  >
              <View style={[styles.flex_sb,styles.row]}>
                          <View style={styles.flex_row}>
                              <Image style={styles.ic} source={imgUrl}/>
                              <Text style={styles.text}>{text}</Text>
                          </View>
                          <Image style={[styles.icon,{tintColor:'#999'}]} source={require('../../../res/images/ic_tiaozhuan.png')}/>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
  }
  onPushPage(page)
  {
     this.props.navigator.push({
        component:page
     }) 
  }
  ExitLogin()
  {
    this.Storage.onRemove()
    this.props.navigator.push({
        component:LoginPage
     }) 
  }
   onExit()
  {
    Alert.alert(
        '提示',
        '确认退出登录吗？',
        [
          {text:'取消',style:'cancel'},
          {text:'确认',onPress:()=>{this.ExitLogin()}}
        ]
      )
  }
  isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           console.log(result)
           this.setState({
              name:result.username
           })
              
        })
        .catch(error=>{ 
          console.log(error)
        })

  }
  render() {

    return( 
       <View style={styles.container}>
               <NavigationBar
                  title='我的'
                  style={{backgroundColor:'#fff'}}
                  />  
                  <View style={styles.item}></View>
                  <View style={styles.flex_sb}>
                       <View style={styles.row}>
                            <Image style={styles.log} source={require('./images/log.png')} />
                            <Text style={styles.text}>{this.state.name}</Text>
                       </View>
                  </View>
                  <View style={styles.item}></View>
                   {this.renderItem(require('./images/ic_info.png'),'个人信息',UserInfo)}
                   {this.renderItem(require('./images/ic_account.png'),'账户信息',Account)}
                   {this.renderItem(require('./images/ic_address.png'),'地址管理',addressPage)}
                   {this.renderItem(require('./images/ic_order.png'),'我的订单',OrderPage)}
                   {this.renderItem(require('./images/ic_record.png'),'交易记录',TradingRecord)}
                   {this.renderItem(require('./images/ic_password.png'),'修改支付密码',SetPayPassword)}
                  <View style={styles.item}></View>
                  <View style={styles.row}>
                      <TouchableOpacity
                        onPress={()=>this.onExit()}
                        style={{flex:1}}
                      >
                        <View style={styles.flex_row}>
                            <Image style={[styles.ic,{tintColor:'#E53E49'}]} source={require('./images/ic_exit.png')}/>
                            <Text style={styles.text}>退出</Text>
                        </View>    
                      </TouchableOpacity>               
                  </View>
          </View>
         )
    }
  }

  const styles = StyleSheet.create({
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
      paddingRight:15
    },
    log:{
      width:60,
      height:60,
      marginRight:10
    },
    flex_row:{
       flexDirection:'row',
       alignItems:'center'
    },
    flex_sb:{
      justifyContent:'space-between'
    },
   icon:{
    height:20,
    width:20
  },
  ic:{
    width:25,
    height:25,
    marginRight:8
  },
  text:{
    color:'#333'
  },
  line:{
    height:1,
    backgroundColor:'#eee'
  }
  })