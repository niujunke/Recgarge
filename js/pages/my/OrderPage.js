import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ListView,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  TouchableNativeFeedback,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
import ViewUtils from '../../util/ViewUtils'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DateTimePicker from 'react-native-modal-datetime-picker';
import HttpUtils, {URL,imgURL,imgsURL,localURL} from '../../expand/ado/HttpUtils'
import Storage from '../../expand/ado/Storage'
import GoodsPage from '../GoodsPage'
import Loading from '../../common/Loading'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')

export default class OrderPage extends Component{
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.state = {
       curNow:0
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
	goBack()
	{
     if(this.props.onRefresh)
     {
        this.props.onRefresh(true)
     }
     
	   this.props.navigator.pop()
	}
  refresOrder(i)
  {
     switch(i) {
       case 0:
          this.refs.getAllData.getOrder();
         break;
       case 1:
          this.refs.getData.getOrder(false,20);
         break;
       case 2:
        this.refs.getData.getOrder(false,30);
         break;
       case 3:
        this.refs.getData.getOrder(false,40);
        break;
        case 4:
        this.refs.getData.getOrder(false,0);
        break;
     }
  }
	render(){
		return(
             <View style={styles.container}>
                  <NavigationBar 
                    leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                    title='我的订单'
                    style={{backgroundColor:'#fff'}}
                  />
                  <ScrollableTabView
                    tabBarBackgroundColor="#fff"
                    style={styles.container}
                    tabBarInactiveTextColor="#333"
                    tabBarActiveTextColor="#E53E49"
                    tabBarUnderlineStyle={{backgroundColor:'#E53E49',height:3}}
                    renderTabBar={()=><ScrollableTabBar/>}
                    onChangeTab={(obj)=>{
                      this.refresOrder(obj.i)
                    }}
                  >
                    <OrderTab tabLabel="全部订单"  style={styles.text} {...this.props}  ref="getAllData"> </OrderTab>
                    <OrderTab tabLabel="待发货"  style={styles.text} {...this.props} state="state_pay" ref="getData"></OrderTab>
                    <OrderTab tabLabel="待收货"  style={styles.text} {...this.props} state="state_send" ref="getData"></OrderTab>
                    <OrderTab tabLabel="已完成 "  style={styles.text} {...this.props} state="state_success" ref="getData"></OrderTab>
                    <OrderTab tabLabel="已取消 "  style={styles.text} {...this.props} state="state_cancel" ref="getData"></OrderTab>
                 </ScrollableTabView>
             </View>
             
			)
	}
}
class OrderTab extends Component{
    constructor(props){
       super(props)
       this.Storage=new Storage('user')
       this.demoList = [];
       this.demoListPageInde = [1];
       this.cachedDemoList = [];
       this.buyer_message=''
       this.order_id=''
       this.state={
           dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
           activeTab:0,
           isLoading:true,
           isModal:false,
           Loading:false
        }
    }
  componentDidMount()
  {
    this.isLogin()
  }

  isLogin()
  {
     this.Storage.fetch()
        .then(result=>{
           this.token=result.key  
           this.getOrder()         
        })
        .catch(error=>{ 
          console.log(error)
        })

   }
  getOrder(flag,statu)
  {
         // 取出默认页码
        if(!this.token)return
        if(this.demoListPageInde>this.state.pagetotal)
        {
           this.demoListPageInde=[1]
        }
        let page =flag?this.demoListPageInde[0]:this.demoListPageInde = [1];;
        let formData = new FormData(); 
        let state=statu?statu:this.props.state
        
        let url=state?URL+'index.php?c=member_order&a=order_list&curpage='+page+'&state='+state:URL+'index.php?c=member_order&a=order_list&curpage='+page; 
        console.log(state)
        formData.append('key',this.token);
        console.log(formData)
        HttpUtils.post(url,formData)
         .then(result=>{
              console.log(result)
               // 清空增量数据缓存数组
            this.cachedDemoList = [];
            // 存储新的增量数据
            this.cachedDemoList = this.cachedDemoList.concat(result.datas.order_group_list);

           // 将新数据追加到旧数据中
            flag?this.demoList = this.demoList.concat(result.datas.order_group_list):this.demoList=result.datas.order_group_list;
            this.demoListPageInde[0] += 1;
            console.log('页数'+this.demoListPageInde)
            this.setState({
             dataSource:this.getDataSource(this.demoList),
             isLoading:false,
             hasmore:result.hasmore,
             pagetotal:result.page_total
            })
         
            // 默认每十条为一页，不足十条，则说明没有更多数据
           if(!result.hasmore) {
             this.setState({
               isNoMoreData: true
             });
           }
         })
          .catch(error=>{
             console.log(error)
        }) 
  }
  sureOrder(id)
  {
        let formData = new FormData(); 
        let url=URL+'index.php?c=member_order&a=order_receive'; 
        formData.append('key',this.token);
        formData.append('order_id',id);
        console.log(formData)
       // this.setState({isLoading:true})
        HttpUtils.post(url,formData)
         .then(result=>{
              console.log(result)
              if(result.datas==1)
              {
                this.getOrder()
              }
         })
          .catch(error=>{
             console.log(error)
        }) 
  }
  delOrder(id)
  {
        let formData = new FormData(); 
        let url=URL+'index.php?c=member_order&a=order_delete'; 
        formData.append('key',this.token);
        formData.append('order_id',id);
        console.log(formData)
       // this.setState({isLoading:true})
        HttpUtils.post(url,formData)
         .then(result=>{
              console.log(result)
              if(result.datas==1)
              {
                this.getOrder()
              }
         })
          .catch(error=>{
             console.log(error)
        }) 
  }
   _endReached(){
    // 防止重复申请
    if(this.state.isLoading) {
      return
    }

    // 获取数据
    console.log('下拉页数'+this.demoListPageInde)
    console.log('zong页数'+this.state.pagetotal)
     if(this.demoListPageInde>this.state.pagetotal) 
    {
       return
    }
    this.getOrder(true)
  }

  _renderFooter()
  {
    // 返回没有更多数据视图 缓存的增量数据为0并且页数不是初始页
    if(this.cachedDemoList.length <10 && this.state.isNoMoreData) 
    {
      let tipText=''
      let dataLenth=this.cachedDemoList.length
      if(dataLenth==0)
      {
         tipText='暂无订单！'
      }else if(dataLenth<3)
      {
         tipText=''
      }
      else
      {
         tipText='没有更多数据...'
      }
      return (<View style={[{marginVertical:20,width:width}]}>
          <Text style={{fontSize:14,color:'#999',textAlign:'center'}}>{tipText}</Text>
      </View>);
    }
    if(!this.state.isLoading)
    {
      return (<View style={styles.footer}><ActivityIndicator style={{ marginVertical:20 }}/></View>);
    }
    
  }
  getLocalTime(nows) 
   { 
    var now=new Date(nows*1000); 
    var year=now.getFullYear(); 
    var month=now.getMonth()+1; 
    var date=now.getDate(); 
    var hour=now.getHours(); 
    var minute=now.getMinutes(); 
    var second=now.getSeconds()<10?'0'+now.getSeconds():now.getSeconds(); 
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    }   
    getDataSource(data)
    {
      return this.state.dataSource.cloneWithRows(data)
    }
    renderGoods(data)
    {
      let views=[]
     for (var i=0;i<data.extend_order_goods.length;i++) {  
      let id=data.extend_order_goods[i].goods_id
       views.push(
            <TouchableOpacity
              key={i}
              onPress={()=>{
                 this.props.navigator.push({
                    component:GoodsPage,
                    params:{
                      id:id
                    }
                 })
              }}
            >
             <View style={[styles.flex_row,styles.goods_item]} >
                  <View style={styles.pic}>
                      <Image 
                       source={{uri:imgURL+data.extend_order_goods[i].goods_image}}
                       resizeMode="cover"
                       style={styles.img}
                      />
                    </View>
                    <View style={styles.goods_info}>
                        <Text style={styles.goods_name}>{data.extend_order_goods[i].goods_name}</Text>
                        <View style={[styles.flex_sb,{paddingTop:6}]}>
                          <Text style={styles.red}>￥{data.extend_order_goods[i].goods_price}</Text>
                          <Text style={styles.gray}>X{data.extend_order_goods[i].goods_num}</Text>
                        </View>
                    </View>
                </View>
              </TouchableOpacity>
        )
    }
    return views    
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
  exitOrder(id)
  {
    this.showModal()
    this.order_id=id
  }
  refundOrder()
  {
    this.onRequestClose()
    let formData = new FormData(); 
    let url=URL+'index.php?c=member_order&a=add_refund_all'; 
    formData.append('key',this.token);
    formData.append('order_id',this.order_id);
    formData.append('buyer_message',this.buyer_message);
    console.log(formData)
    this.setState({Loading:true})
    HttpUtils.post(url,formData)
     .then(result=>{
          console.log(result)
          if(result.datas==1)
          {
            this.setState({Loading:false})
            this.getOrder()
          }
     })
      .catch(error=>{
         this.setState({Loading:false})
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
                        <View style={styles.modalTitle}><Text>退款理由</Text></View>
                        <View style={styles.modalContent}>
                              <TextInput
                               style={styles.input}
                               underlineColorAndroid='transparent'
                               onChangeText={text=>this.buyer_message=text} 
                               placeholder ='请输入退款理由'
                               placeholderTextColor='#ccc'
                               multiline={true}

                               />
                        </View>
                        <View style={styles.item}></View>
                        <View style={styles.modalFoot}>
                            <TouchableNativeFeedback
                              onPress={()=>this.refundOrder()}
                            ><View style={styles.password}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                        </View>
                   </View>
                </View>
              </TouchableOpacity>
            </Modal>
  }
    renderRow(item,sectionId,rowId)
    {

       let data=item.order_list[0]
       let state=data.order_state
       let status
        if(state==20){
         status=data.lock_state==0?<TouchableOpacity style={styles.orderBtn}
          onPress={()=>{
            this.exitOrder(data.order_id)
          }}
         ><Text style={{color:'#E53E49'}}>申请退款</Text></TouchableOpacity>:<TouchableOpacity style={styles.orderBtn}
         ><Text style={{color:'#E53E49'}}>退款审核中</Text></TouchableOpacity>
       }
       else if(state==30){
         status=<TouchableOpacity style={styles.orderBtn}
          onPress={()=>{
            this.sureOrder(data.order_id)
          }}
         ><Text style={{color:'#E53E49'}}>确认收货</Text></TouchableOpacity>
       }else if(state==40||state==0){
          status=<TouchableOpacity style={styles.orderBtn}
          onPress={()=>{
            this.delOrder(data.order_id)
          }}
         ><Text style={{color:'#E53E49'}}>删除订单</Text></TouchableOpacity>
       }
        
        return( 
        <View>
            <View style={styles.item}></View>
            <View style={styles.content}>
                <View style={[styles.flex_sb,styles.order_sn]}><View style={styles.flex_row}><Text>订单编号：</Text><Text style={styles.text}>{data.order_sn}</Text></View><Text style={[styles.red,{fontSize:12}]}>{data.state_desc}</Text></View>
                <View style={[styles.flex_row,styles.order_sn]}><Text>下单时间：</Text><Text style={styles.text}>{this.getLocalTime(item.add_time)}</Text></View>
                <View style={styles.line}></View>
                {this.renderGoods(data)}
                <View style={styles.line}></View>
                <View style={[styles.flex_reverse,styles.order_sn,{paddingTop:5}]}><Text style={styles.gray}>(含运费￥{item.limit_price})</Text><Text style={[styles.red,{fontSize:16,paddingRight:5}]}>￥{parseFloat(data.order_amount)+parseFloat(item.limit_price)}</Text><Text>总价：</Text></View>
                <View style={[styles.flex_reverse,{paddingTop:5}]}>{status}</View>
            </View>
            
          </View>
              )
     }
    render()
    {  
        let loading=this.state.Loading? <Loading/>:null
        return <View style={styles.pbt}>
                 <ListView
                   dataSource={this.state.dataSource}
                   style={{paddingBottom:0}}
                   renderRow={(data,sectionId,rowId)=>this.renderRow(data,sectionId,rowId)}
                   enableEmptySections={true}
                   onEndReachedThreshold={20}
                   onEndReached={() =>this._endReached()}
                   renderFooter={() =>this._renderFooter()}
                   refreshControl={
                      <RefreshControl
                         refreshing={this.state.isLoading}
                         onRefresh={()=>this.getOrder()}
                         colors={['#2ca2f9']}
                         title={'加载中...'}
                     />}
                 />
                  {this.randerModal()}
                  {loading}
              </View>
    }
}
const styles=StyleSheet.create({
	 container:{
        flex:1,
        backgroundColor:'#eee',
        borderTopWidth:0.5,
        borderColor:'#dfdfdf'
    },
    content:{
      backgroundColor:'#fff',
      padding:10
    },
     orderBtn:{
      borderColor:'#E53E49',
      width:80,
      height:32,
      justifyContent:'center',
      alignItems:'center',
      marginTop:10,
      marginBottom:10,
      borderWidth:1,
      borderRadius:3
    },
    goods_item:{
      paddingBottom:15,
      paddingTop:15
    },
     flex_row:{
       flexDirection:'row' 
    },
    flex_reverse:{
      flexDirection:'row-reverse',
      alignItems:'center'
    },
     item:{
      height:12,
      backgroundColor:'#eee'
    },
    order_sn:{
      height:25
    },
    row:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#fff',
      padding:10,
      paddingLeft:15,
      paddingRight:15,
      height:50
    },
     flex_sb:{
       justifyContent:'space-between',
      flexDirection:'row',
      backgroundColor:'#fff',
      alignItems:'center'
    },
    text:{
    color:'#333'
  },
  line:{
    height:0.5,
    backgroundColor:'#eee'
  },
  red:{
  	color:'#E53E49'
  },
  gray:{
    color:'#999',
    fontSize:12
  },
  font:{
    fontSize:12,
    color:'#333'
  },
   
    footTxt:{
     color:'#fff'
  },
  time:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#fff',
      height:40,
      borderBottomWidth:0.5 ,
      borderColor:'#eee'
  },
   text:{
      color:'#333'
    },
    goods_name:{
    color:'#333',
    lineHeight:23
  },
  pic:{
    paddingRight:10
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
  price:{
     paddingTop:5,
     paddingBottom:5,
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
      backgroundColor:'rgba(0,0,0,0.3)',
      flexDirection:'column-reverse'
    },
  input:{
    height:100,
    borderBottomWidth:0.5 ,
    borderColor:'#eee',
    marginBottom:10
  },
   modalMain:{
    backgroundColor:'#fff'
  },
   password:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center'
  }
})