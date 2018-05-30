import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import Storage from '../expand/ado/Storage'
import BackPressComponent from '../common/BackPressComponent'
import HttpUtils, {URL,imgURL,imgsURL,localURL} from '../expand/ado/HttpUtils'
import ViewUtils from '../util/ViewUtils'
import addressPage from './my/addressPage'
import OrderPage from './my/OrderPage'
import Loading from '../common/Loading'
import Toast ,{DURATION}from 'react-native-easy-toast'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class BuyStep1 extends Component {
   constructor(props) {
      super(props);
      this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
      this.Storage=new Storage('user')
      this.total_price
      this.freight=0
      this.password=''
      this.state={
        items:{},
        height:100,
        goods_num:1,
        shopCar:0,
        key:'',
        flag:false,
        newAdd:{},
        isModal:false,
        isLoading:false
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
     this.Storage.fetch()
      .then(result=>{
           console.log(result)
           this.setState({
              key:result.key
           })
           this.memberBuy()
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
  memberBuy()
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_buy&a=buy_step1'; 
      formData.append('key',this.state.key);
      formData.append('cart_id',this.props.ifcart==1?this.props.cart_id:this.props.goods_id+'|'+this.props.buynum); 
      this.props.ifcart==1?formData.append('ifcart',1):null;
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
        console.log(result)
          this.setState({
            items:result.datas,
            flag:true
          }) 
        
       })
        .catch(error=>{
            console.log(error) 
      })
  }
  
  renderGoods()
  {
    let total=0
    let views=[]
    if(!this.state.items.store_cart_list.length)return;
    for (let k of Object.keys(this.state.items.store_cart_list[0].goods_list)) {  
       views.push(
            <View style={[styles.row]} key={k}>
              <View style={styles.pic}>
                  <Image 
                   source={{uri:imgURL+this.state.items.store_cart_list[0].goods_list[k].goods_image}}
                   resizeMode="cover"
                   style={styles.img}
                  />
                </View>
              <View style={styles.goods_info}>
                  <Text style={styles.goods_name}>{this.state.items.store_cart_list[0].goods_list[k].goods_name}</Text>
                  <View style={[styles.flex_sb,{paddingTop:6}]}>
                    <Text style={styles.red}>￥{this.state.items.store_cart_list[0].goods_list[k].goods_price}</Text>
                    <Text style={styles.gray}>X{this.state.items.store_cart_list[0].goods_list[k].goods_num}</Text>
                  </View>
              </View>
         </View>
        )
    }
 
       this.total_price= this.state.items.store_cart_list[0].store_goods_total
       this.freight=this.state.items.store_cart_list[0].freight
    return views
  } 
  onSubmit()
  {
    if(this.state.items.address_info.length==0)
    {
       this.toast.show('请选择收货地址',1500);
       return false
    }
    if(this.state.items.available_predeposit==0 || this.state.items.available_predeposit<parseFloat(this.total_price)+parseFloat(this.freight))
    {
       this.toast.show('余额不足，请充值！',1500);
       return false
    }
    if(!this.password)
    {
      this.showModal()
      return false
    }
      
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_buy&a=buy_step2'; 
      let addressId=this.state.newAdd.address_id?this.state.newAdd.address_id:this.state.items.address_info.address_id
      formData.append('key',this.state.key);
      formData.append('cart_id',this.props.ifcart==1?this.props.cart_id:this.props.goods_id+'|'+this.props.buynum); 
      formData.append('address_id',addressId);
      formData.append('vat_hash',this.state.items.vat_hash);
      formData.append('pay_name','online');
      formData.append('pd_pay',1);
      formData.append('password',this.password);
      this.props.ifcart==1?formData.append('ifcart',1):null;
      console.log(formData)
      this.setState({isLoading:true})
      HttpUtils.post(url,formData)
       .then(result=>{
        console.log(result)
        if(result.status==1)
        {
           this.setState({isLoading:false})
           this.props.navigator.push({
             component:OrderPage,
             params:{
               onRefresh:(flag)=>{
                  if(flag&&this.props.ifcart==1)
                  {
                     this.memberBuy()
                     this.total_price=0
                     this.freight=0
                  }
               }
             }
          })
          DeviceEventEmitter.emit('changData',true)
        }  
        
       })
        .catch(error=>{
            console.log(error)
            this.toast.show('提交订单异常,重试或检查网络',1500);
            this.setState({isLoading:false}) 
      })
      this.password=''
  }
  showModal() 
  {
    this.setState({
        isModal:true
    })

  }
  onRequestClose() 
  {
    this.setState({
        isModal:false
    });
  }
  payPs()
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_buy&a=check_password'; 
      formData.append('key',this.state.key);
      formData.append('password',this.password);
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
        console.log(result)
         if(result.status==0)
         {
            this.onRequestClose()
            this.toast.show(result.datas.error,1500);
            this.password=''
            return false
         }
         this.onRequestClose()
         this. onSubmit()
       })
        .catch(error=>{
            console.log(error) 
      })
  }
   randerModal()
  {
    return  <Modal
                animationType='fade'           
                transparent={true}             
                visible={this.state.isModal}    
                onRequestClose={() => {this.onRequestClose()}}  
            >
              <TouchableOpacity style={{flex:1}} onPress={()=>this.onRequestClose()}>
                <View style={styles.modalViewStyle}>
                   <View style={styles.modalMain}>
                        <View style={styles.modalTitle}><Text>输入支付密码</Text></View>
                        <View style={styles.modalContent}>
                              <TextInput
                               style={styles.input}
                               underlineColorAndroid='transparent'
                               onChangeText={text=>this.password=text} 
                               placeholder ='请输入支付密码'
                               placeholderTextColor='#ccc'
                               secureTextEntry={true}
                             
                               />
                        </View>
                        <View style={styles.item}></View>
                        <View style={styles.modalFoot}>
                            <TouchableNativeFeedback
                              onPress={()=>this.payPs()}
                            ><View style={styles.password}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                        </View>
                   </View>
                </View>
              </TouchableOpacity>
            </Modal>
  }
  render() {
    let address=this.state.items.address_info==''||this.state.items.address_info==undefined?<View style={styles.row}>
                    <Text style={styles.text}>请选择收货地址</Text>
                </View>:<View><View style={styles.row}><Text style={[styles.text,{paddingRight:5}]}>{this.state.newAdd.true_name?this.state.newAdd.true_name:this.state.items.address_info.true_name}</Text>
                  <Text style={styles.text}>{this.state.newAdd.mob_phone?this.state.newAdd.mob_phone:this.state.items.address_info.mob_phone}</Text>
                </View> 
                  <View style={{paddingLeft:10}}><Text style={styles.gray}>{this.state.newAdd.address?this.state.newAdd.address+this.state.newAdd.area_info:this.state.items.address_info.address+this.state.items.address_info.area_info}</Text></View>
                </View>
    let loading=this.state.isLoading? <Loading/>:null
    return( 
       <View style={styles.container}>
               <NavigationBar
                  leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                  title='提交订单'
                  style={{backgroundColor:'#fff'}}
                  />
                  <ScrollView>
                   <View style={styles.add}>
                            <Image 
                             source={require('../../res/images/add.png')}
                             resizeMode="stretch"
                             style={{height:4,width:width}}
                            />
                    </View>
                    <TouchableWithoutFeedback
                     onPress={()=>{
                         this.props.navigator.push({
                           component:addressPage,
                           params:{
                              onCallBack:(obj)=>{
                                  this.setState({
                                      newAdd:obj
                                  })
                              }
                           }
                        }) 
                     }}
                    > 
                      <View style={[styles.flex_sb,{paddingBottom:15,paddingTop:15}]}>
                           {address}
                           <Image style={[styles.icon,{tintColor:'#999'}]} source={require('../../res/images/ic_tiaozhuan.png')}/>
                      </View>
                    </TouchableWithoutFeedback>
                   <View style={styles.item}></View>
                   <View style={[styles.flex_sb,styles.row,{height:35}]}>
                        <Text >支付方式</Text>
                        <Text style={styles.text}>账户余额支付</Text>
                       </View>
                  <View style={styles.item}></View>
                   <View style={styles.title}>
                      <Text style={{height:25}}>购物清单</Text>
                      <View style={styles.line}></View>
                   </View>
                  {this.state.flag?this.renderGoods():null}
                   <View style={styles.item}></View>
                   <View style={styles.price}>
                      <View style={[styles.flex_sb,styles.row]}>
                        <Text style={styles.text}>商品金额</Text>
                        <Text style={styles.red}>￥{this.total_price}</Text>
                       </View>
                        <View style={[styles.flex_sb,styles.row]}>
                          <Text style={styles.text}>运费</Text>
                          <Text style={styles.red}>￥{this.freight}</Text>
                       </View>
                       <View style={styles.line}></View>
                       <View style={[styles.row,{flexDirection:'row-reverse'}]}>
                          <Text style={styles.red}>￥{this.state.items.available_predeposit?this.state.items.available_predeposit:0.00}</Text>
                          <Text style={styles.text}>账户可用金额：</Text>
                       </View>
                        <View style={[styles.row,{flexDirection:'row-reverse'}]}>
                          <Text style={styles.red}>￥{parseFloat(this.total_price)+parseFloat(this.freight)}</Text>
                          <Text style={styles.text}>实付金额：</Text>
                       </View>
                   </View>
                    <TouchableNativeFeedback
                           onPress={()=>this.onSubmit()}
                    ><View style={styles.submit}><Text style={styles.footTxt}>提交订单</Text></View></TouchableNativeFeedback>
                </ScrollView>
                <Toast ref={toast=>this.toast=toast}/>
                {this.randerModal()}
                {loading}
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
      paddingTop:5,
      paddingBottom:5
    },
    text:{
      color:'#333'
    },
    flex_row:{
       flexDirection:'row',
       alignItems:'center'

    },
    flex_sb:{
      justifyContent:'space-between',
      flexDirection:'row',
      backgroundColor:'#fff',
      alignItems:'center'
    },
   icon:{
    height:20,
    width:20
  },
  goods_name:{
    color:'#333',
    lineHeight:23
  },
  line:{
    height:1,
    backgroundColor:'#eee'
  },
  pic:{
    padding:10
  },
   img:{
     width:80,
     height:80
  },
  goods_info:{
    flex:1
  },
  title:{
    backgroundColor:'#fff',
    padding:10
  },
   red:{
    color:'#E53E49'
  },
   gray:{
    color:'#999',
    fontSize:12
  },
  price:{
     paddingTop:5,
     paddingBottom:5,
     backgroundColor:'#fff'
  },
    submit:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    borderRadius:3,
    marginLeft:10,
    marginRight:10,
    marginBottom:20
  },
  footTxt:{
     color:'#fff'
  },
  add:{
    width:width
  },
   modalMain:{
    backgroundColor:'#fff'
  },
  modalTitle:{
    height:45,
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth:0.5,
    borderColor:'#eee'
  },
  modalContent:{
    padding:10 
  },
   modalViewStyle:{
      flex:1,
      backgroundColor:'rgba(0,0,0,0.4)',
      flexDirection:'column-reverse'
    },
     input:{
    height:40,
    borderBottomWidth:0.5 ,
    borderColor:'#eee',
    marginBottom:10
  },
   password:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center'
  }
  })