import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  DeviceEventEmitter,
  TouchableNativeFeedback 
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import Storage from '../expand/ado/Storage'
import HttpUtils, {URL,imgURL,imgsURL,localURL} from '../expand/ado/HttpUtils'
import Loading from '../common/Loading'
import CheckBox from 'react-native-check-box'
import BuyStep1 from './BuyStep1'
import HomePage from './HomePage'
import GoodsPage from './GoodsPage'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class shopCarPage extends Component {
   constructor(props) {
      super(props);
      this.Storage=new Storage('user')
      this.state={
        items:{},
        dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
        height:100,
        goods_num:1,
        shopCar:0,
        key:'',
        flag:false,
        isChecked:false,
        totalNum:0,
        isLoading:false,
        allChecked:false,
        totalPrice:0,
        cartList:[]
      }
      
    }
  componentDidMount()
  {    
     this.isLogin();
     this.chang=DeviceEventEmitter.addListener('changData',(flag)=>{
        if(flag)
        {
          this.carList()
        }
    })
  }
  componentWillUnMount()
  {
     this.chang&&this.chang.remove();
  }
  isLogin()
  {
     this.Storage.fetch()
      .then(result=>{
           console.log(result)
           this.setState({
              key:result.key
           })
           this.carList()
        })
        .catch(error=>{ 
          console.log(error)
        })
  }
 
  goBack()
  {
     this.props.navigator.pop()
  }
  carList()
  {
      this.setState({isLoading:true})
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_cart&a=cart_list'; 
      formData.append('key',this.state.key);
      //formData.append('cart_id',this.props.id+'|'+this.state.goods_num); 
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
           this.setState({
             dataSource:this.getDataSource(result.datas.cart_list),
             totalNum:result.datas.totalNum,
             totalPrice:result.datas.sum,
             cartList:result.datas.cart_list,
             isLoading:false
            })

          console.log(result)
       })
        .catch(error=>{
            console.log(error) 
      })
  }
 getDataSource(data)
  {
    return this.state.dataSource.cloneWithRows(data)
  }
   onClick(data)
  {
    if(data.checked==0)
    {
      data.checked=1
    }
    else
    {
       data.checked=0
       this.setState({
         allChecked:false
       })
    }
    this.setState({
      isChecked:!this.state.isChecked
    })
   this.carChang(data.cart_id,data.goods_num,data.checked)
  }
  allClick()
  {
    let data=this.state.cartList
    for(var i=0;i<data.length;i++)
    {
        if(this.state.allChecked)
        {
           data[i].checked=0
        }
        else
        {
           data[i].checked=1
        }
        this.carChang(data[i].cart_id,data[i].goods_num,data[i].checked) 
    }
    this.setState({
      allChecked:!this.state.allChecked
    })
  }
  renderCheckBox(data)
  {
    let isChecked=data.checked==0?false:true
    this.state.isChecked=isChecked
    return <CheckBox
            onClick={()=>this.onClick(data)}
            isChecked={this.state.isChecked}
            checkedImage={<Image source={require('./my/images/ic_check_box.png')} style={{tintColor:'#E53E49'}}/>}
            unCheckedImage={
              <Image source={require('./my/images/ic_check_box_outline_blank.png')}style={{tintColor:'#bbb'}}/>}
          />
  }
  carChang(cart_id,quantity,isChecked)
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_cart&a=cart_edit_quantity'; 
      formData.append('key',this.state.key);
      formData.append('cart_id',cart_id); 
      formData.append('quantity',quantity);
      formData.append('checked',isChecked); 
      this.setState({isLoading:true})
      HttpUtils.post(url,formData)
       .then(result=>{
          this.carList()
          this.setState({isLoading:false})
          console.log(result)
       })
        .catch(error=>{
            this.setState({isLoading:false})
            console.log(error) 
      })
  }
  delCart(id)
  {
    let formData = new FormData(); 
      let url=URL+'index.php?c=member_cart&a=cart_del'; 
      formData.append('key',this.state.key);
      formData.append('cart_id',id); 
      HttpUtils.post(url,formData)
       .then(result=>{
          this.carList()
          console.log(result)
       })
        .catch(error=>{
            this.setState({isLoading:false})
            console.log(error) 
      })
  }
  setNum(data,flag)
  {
     if(flag)
     {
       if(data.goods_num==1)return
       data.goods_num--
       console.log(123)
     }
     else
     {
      data.goods_num++
     }
     this.carChang(data.cart_id,data.goods_num,1)
     this.setState({
        goods_num:data.goods_num
     })
      console.log(data.goods_num)
  }
  renderAllCheckBox()
  {
    let isChecked=false
    let leftText='全选';
    return <CheckBox
            style={styles.check}
            onClick={()=>this.allClick()}
            isChecked={this.state.allChecked}
            rightText={leftText}
            checkedImage={<Image source={require('./my/images/ic_check_box.png')} style={{tintColor:'#E53E49'}}/>}
            unCheckedImage={
              <Image source={require('./my/images/ic_check_box_outline_blank.png')}style={{tintColor:'#bbb'}}/>}
          />
  }
  buy()
  {
    let data=this.state.cartList
    let cartIdArr = [];
    for(var i=0;i<data.length;i++)
    {
        if(data[i].checked==1)
        {
            var cartId = data[i].cart_id;
            var cartNum =data[i].goods_num;
            var cartIdNum = cartId+"|"+cartNum;
            cartIdArr.push(cartIdNum);
        }
        
    }
    var cart_id = cartIdArr.toString();
    console.log(cart_id)
     if(cart_id=='')
    {
        DeviceEventEmitter.emit('showToast','请选择商品！')
        return;
    }
    this.props.navigator.push({
       component:BuyStep1,
       params:{
        ifcart:1,
        cart_id:cart_id
      }
    }) 
  }
  renderRow(data)
  {
    this.state.goods_num=data.goods_num
    return <View>
             <View style={[styles.row]} >
               {this.renderCheckBox(data)} 
               <TouchableOpacity
                 onPress={()=>{
                    this.props.navigator.push({
                    component:GoodsPage,
                    params:{
                      id:data.goods_id
                    }
                   })
                 }}
               >
                  <View style={styles.pic}>
                      <Image 
                       source={{uri:imgURL+data.goods_image}}
                       resizeMode="cover"
                       style={styles.img}
                      />
                    </View>
                </TouchableOpacity>
              <View style={styles.goods_info}>
                  <Text style={styles.goods_name}>{data.goods_name}</Text>
                  <View style={[styles.flex_sb,{paddingTop:0}]}>
                    <Text style={styles.red}>￥{data.goods_price}</Text> 
                  </View>
                  <View style={[styles.flex_sb,{paddingTop:6}]}>
                      <View style={[styles.flex_row,styles.num]}>
                                <TouchableOpacity style={styles.numFont}
                                   onPress={()=>{
                                   this.setNum(data,true)
                                 }}
                                ><Image style={styles.ic} source={require('../../res/images/ic_minus.png')} /></TouchableOpacity>
                                <View style={[styles.numFont,styles.bor]}><Text style={styles.text,styles.fontSize}>{this.state.goods_num}</Text></View>
                                <TouchableOpacity style={styles.numFont}
                                 onPress={()=>{
                                  this.setNum(data,false)
                                 }}
                                ><Image style={styles.ic} source={require('../../res/images/ic_add.png')} /></TouchableOpacity>
                      </View>
                      <TouchableOpacity
                      onPress={()=>{
                        this.delCart(data.cart_id)
                      }}
                     ><Image style={[styles.ic_del,{tintColor:'#bbb'}]} source={require('./my/images/ic_del.png')}/></TouchableOpacity>
                  </View>
              </View>
            </View>
            <View style={styles.line}></View>
        </View>
  } 
  render() {
    let loading=this.state.isLoading? <Loading color='#E53E49' style={{backgroundColor:'rgba(0,0,0,0.0)',height:30}}/>:null
    let cartBar=this.state.cartList.length?<View style={[styles.flex_sb,styles.totalBar]}>
                      <View>
                          {this.renderAllCheckBox()}
                      </View>
                      <View style={[styles.flex_row]}>
                          <View style={[styles.row]}>
                             <Text style={styles.text}>合计：</Text>
                             <Text style={[styles.red,{fontSize:16}]}><Text  style={{fontSize:12}}>￥</Text>{this.state.totalPrice}</Text>
                          </View>
                          <TouchableOpacity  style={styles.buy}
                           onPress={()=>{
                              this.buy()
                           }}
                          ><Text style={{color:'#fff',fontSize:16}}>结算({this.state.totalNum})</Text></TouchableOpacity>
                      </View>
                 </View>:null
    let carItem=this.state.cartList.length? <ListView
                                       dataSource={this.state.dataSource}
                                       enableEmptySections={true}
                                       renderRow={(data)=>this.renderRow(data)}
                                        style={{marginTop:10}}
                                     />:<View style={styles.carTip}>
                                            <View style={styles.carIc}><Image style={[styles.icon,{tintColor:'#fafafa'}]} source={require('../../res/images/ic_car.png')}/></View> 
                                            <Text style={styles.carText}>购物车还是空的</Text>
                                            <TouchableOpacity style={styles.carBtn}
                                             onPress={()=>{
                                                 this.props.navigator.resetTo({
                                                      component:HomePage,
                                                        params:{
                                                      ...this.props,
                                                      selectedTab:'shop'
                                                    }
                                                  });
                                             }}
                                            ><Text style={{color:'#fff',fontSize:18}}>去逛逛</Text></TouchableOpacity>
                                        </View>
    return( 
       <View style={styles.container}>
               <NavigationBar
                  title='购物车'
                  style={{backgroundColor:'#fff'}}
                  />
                {carItem}
                {cartBar}
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
    carBtn:{
      backgroundColor:'#E53E49',
      width:120,
      height:40,
      justifyContent:'center',
      alignItems:'center'
    },
    carIc:{
      width:120,
      height:120,
      backgroundColor:'#ddd',
      borderRadius:60,
      justifyContent:'center',
      alignItems:'center'
    },
    carText:{
      fontSize:18,
      marginBottom:20,
      marginTop:10,
      color:'#999'
    },
    carTip:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
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
    height:50,
    width:50
  },
  ic:{
    width:13,
    height:13,
    tintColor:'#666'
  },
  ic_del:{
    width:20,
    height:20
  },
   check:{
    width:100
  },
  num:{
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius:3,
    width:100,
    height:30,
    justifyContent:'center'
  },
   numFont:{
   flex:1,
   justifyContent:'center',
   height:30,
   alignItems:'center'
  },
   bor:{
    borderColor:'#ddd',
    borderLeftWidth:1,
    borderRightWidth:1
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
  totalBar:{
    height:45,
    borderColor:'#ddd',
    borderTopWidth:0.5 ,
    paddingLeft:10
  },
  buy:{
    backgroundColor:'#E53E49',
    height:45,
    width:100,
    alignItems:'center',
    justifyContent:'center'
  }
  })