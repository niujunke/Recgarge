import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  WebView,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import Storage from '../expand/ado/Storage'
import BackPressComponent from '../common/BackPressComponent'
import HttpUtils, {URL,imgURL,imgsURL,localURL} from '../expand/ado/HttpUtils'
import ViewUtils from '../util/ViewUtils'
import BuyStep1 from './BuyStep1'
import Swiper from 'react-native-swiper'
import HomePage from './HomePage';
import Toast ,{DURATION}from 'react-native-easy-toast'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class GoodsPage extends Component {
   constructor(props) {
      super(props);
      this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
      this.Storage=new Storage('user')
      this.addNum=0
      this.state={
        items:{},
        height:100,
        goods_num:1,
        shopCar:0,
        key:''
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
          let url=URL+'index.php?c=goods&a=goods_detail&goods_id='+this.props.id; 
          HttpUtils.get(url)
           .then(result=>{
              console.log(result)
              this.setState({
                items:result.datas
              })
              this.carInfo()
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
  renderImg(){
     
        var imageViews=[]; 
        var defaultPc=<Image  key={0} source={{uri:imgURL+this.state.items.goods_image}} style={styles.img}/>
        if(this.state.items.pictures.length==0)return defaultPc;  
        var imgs=this.state.items.pictures;
        imageViews.push(defaultPc)
        for(var i=0;i<imgs.length;i++){  
            imageViews.push(  
                <Image  
                    key={i+1}  
                    style={styles.img}
                    source={{uri:imgsURL+imgs[i].upload_path}}  
                    />  
            );  
        }  
        
        return imageViews;  
    }
  unescapeHTML(a){
     a = "" + a;
     return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }
  carInfo()
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_cart&a=cart_info'; 
      formData.append('key',this.state.key); 
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
           this.setState({
              shopCar:result.datas.num
            })
          
           console.log(result)
       })
        .catch(error=>{
            console.log(error) 
      })
   
  } 
  addCar()
  {
     if(this.state.items.goods_storage==0)
      {
        this.toast.show('库存不足！',1500);
        return 
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_cart&a=cart_add'; 
      this.addNum=this.addNum+this.state.goods_num
      console.log(this.addNum)

      formData.append('goods_id',this.props.id);
      formData.append('quantity',this.addNum); 
      formData.append('key',this.state.key); 
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
           this.setState({
              shopCar:this.state.shopCar+this.state.goods_num
            })
            this.toast.show('加入购物车成功！',1500);
            DeviceEventEmitter.emit('changData',true)
           console.log(result)
       })
        .catch(error=>{
            console.log(error) 
      })
   
  }
  memberBuy()
  {
      if(this.state.items.goods_storage==0)
      {
        this.toast.show('库存不足！',1500);
        return 
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_buy&a=buy_step1'; 
      formData.append('key',this.state.key);
      formData.append('cart_id',this.props.id+'|'+this.state.goods_num); 
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          if(result.code==200)
          {
            this.props.navigator.push({
                 component:BuyStep1,
                 params:{
                  ...this.props,
                  goods_id:this.props.id,
                  buynum:this.state.goods_num
                }
              }) 
          }
           console.log(result)
       })
        .catch(error=>{
            console.log(error) 
      })
  } 
  render() {
    let html=this.unescapeHTML(this.state.items.goods_body )
     html=html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
      return `<img src='${localURL+capture}' />`
    });
    let carNum=this.state.shopCar!==0?<Text style={styles.goods_num}>{this.state.shopCar}</Text>:null;
    return( 
       <View style={styles.container}>
               <NavigationBar
                  leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                  title='商品详情'
                  style={{backgroundColor:'#fff'}}
                  />
                 <ScrollView
                   keyboardShouldPersistTaps={'handled'}
                 >  
                  <Swiper
                      style={styles.swiper}
                      height={350}
                      horizontal={true}
                      paginationStyle={{bottom: 10}}
                      showsPagination={false}
                      showsButtons={false}
                      loop={true}
                      >
                      
                      {this.state.items.pictures==undefined?<ActivityIndicator style={{ marginVertical:20 }}/>:this.renderImg()} 
                  </Swiper>
                  <View>
                       <View style={[{ flexDirection:'column'},styles.row]}>
                            <Text style={styles.text}>{this.state.items.goods_name}</Text>
                            <Text style={styles.red}>￥{this.state.items.goods_price}</Text>
                       </View>
                  </View>
                  <View style={styles.item}></View>
                  <View style={[{ flexDirection:'column'},styles.row]}>
                        <View style={styles.flex_row}>
                          <View  style={[{flex:1},styles.flex_row]}>
                            <Text style={styles.gray}>库存：</Text>
                            <Text style={styles.text}>{this.state.items.goods_storage}</Text>
                          </View>
                          <View style={[{flex:1},styles.flex_row]}>
                            <Text style={styles.gray}>销量：</Text>
                            <Text style={styles.text}>{this.state.items.goods_salenum}</Text>
                          </View>
                        </View>                
                  </View>
                  <View style={styles.item}></View>
                   <View style={[styles.flex_sb,styles.row,styles.flex_row]}>
                       <Text style={styles.gray}>购买数量</Text>
                       <View style={[styles.flex_row,styles.num]}>
                            <TouchableOpacity style={styles.numFont}
                               onPress={()=>{
                               if(this.state.goods_num==1)return
                               this.setState({
                                 goods_num:this.state.goods_num-1
                               })
                             }}
                            ><Image style={styles.ic} source={require('../../res/images/ic_minus.png')} /></TouchableOpacity>
                            <View style={[styles.numFont,styles.bor]}><Text style={styles.text,styles.fontSize}>{this.state.goods_num}</Text></View>
                            <TouchableOpacity style={styles.numFont}
                             onPress={()=>{
                               this.setState({
                                 goods_num:this.state.goods_num+1
                               })
                             }}
                            ><Image style={styles.ic} source={require('../../res/images/ic_add.png')} /></TouchableOpacity>
                       </View>
                  </View>
                  <View style={styles.item}></View>
                  <View style={{height:this.state.height}}>
                    <WebView 
                      source={{html: `<!DOCTYPE html><html><script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;var pic=document.getElementsByTagName('img');for(var i=0;i<pic.length;i++){pic[i].style.cssText='width:100%;vertical-align:middle';}}</script><body>${html}</body></html>`}}
                      style={{flex:1}}
                      scrollEnabled={false}
                      automaticallyAdjustContentInsets={true}
                      contentInset={{top:0,left:0}}

                      onNavigationStateChange={(title)=>{
                        if(title.title != undefined) {
                          this.setState({
                            height:(parseInt(title.title)+20)
                          })
                        }
                      }}
                      >
                    </WebView>
                   </View>
                 </ScrollView>
                  <View style={[styles.flex_row,styles.bot]}>
                       <TouchableOpacity style={[styles.carNum,styles.btn]}
                         onPress={()=>{
                             this.props.navigator.resetTo({
                               component:HomePage,
                                params:{
                                  ...this.props,
                                  selectedTab:'shopCar'
                                }
                            }) 
                         }}
                       >
                        <View ><Image style={styles.icon} source={require('../../res/images/ic_car.png')} />{carNum}</View>
                       </TouchableOpacity> 
                       <TouchableOpacity style={[styles.addCar,styles.btn]}
                         onPress={()=>this.addCar()}
                       ><View ><Text style={styles.buyFont}>加入购物车</Text></View></TouchableOpacity>
                       <TouchableOpacity style={[styles.buy,styles.btn]}
                          onPress={()=>this.memberBuy()}
                       ><View ><Text style={styles.buyFont}>立即购买</Text></View></TouchableOpacity> 
                   </View>
                   <Toast ref={toast=>this.toast=toast} position='center'/>
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
      height:8,
      backgroundColor:'#eee'
    },
    row:{
      backgroundColor:'#fff',
      padding:10
    },
    
    flex_row:{
       flexDirection:'row',
       alignItems:'center'
    },
    flex_sb:{
      justifyContent:'space-between'
    },
   icon:{
    height:25,
    width:25,
    tintColor:'#bbb'
  },
  ic:{
    width:16,
    height:16,
    tintColor:'#666'
  },
  text:{
    color:'#333'
  },
   img: {
        height:350,
    },
    swiper:{
      backgroundColor:'#fff'
    },
    red:{
    color:'#E53E49',
    fontSize:14,
    paddingTop:5
  },
   gray:{
    color:'#999'
  },
  num:{
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius:3,
    width:100,
    height:35,
    justifyContent:'center'
  },
  bor:{
    borderColor:'#ddd',
    borderLeftWidth:1,
    borderRightWidth:1
  },
  numFont:{
   flex:1,
   justifyContent:'center',
   height:35,
   alignItems:'center'
  },
  fontSize:{
    fontSize:18
  },
  bot:{
    height:50,
    backgroundColor:'#eee',
    position:'absolute',
    bottom:0,
    width:width
  },
  carNum:{
    width:80,
    backgroundColor:'#fff',
    borderTopWidth:0.5,
    borderColor:'#eee'
  },
   addCar:{
   flex:1,
   backgroundColor:'#ffb03f'
  },
   buy:{
   flex:1,
   backgroundColor:'#f23030'
  },
  btn:{
    height:50,
    alignItems:'center',
    justifyContent:'center'
  },
  buyFont:{
     color:'#fff'
  },
  goods_num:{
    color:'#fff',
    backgroundColor:'#f23030',
    position:'absolute',
    right:-5,
    top:-6,
    width:15,
    height:15,
    borderRadius:30,
    textAlign:'center',
    fontSize:12
  }
  })