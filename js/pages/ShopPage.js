import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import HttpUtils, {URL,imgURL} from '../expand/ado/HttpUtils'
import GoodsPage from './GoodsPage';
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')

export default class ShopPage extends Component{
    constructor(props){
       super(props)
        this.demoList = [];
        this.demoListPageInde = [1];
        this.cachedDemoList = [];
        this.state={
           dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
           isLoading:true,
           isNoMoreData:false,
           hasmore:true,
           pagetotal:null
        }
    }
    componentDidMount()
    {
      this.isLogin();  
    }

  isLogin(flag)
  {
     
       // 取出默认页码
      if(this.demoListPageInde>this.state.pagetotal)
      {
         this.demoListPageInde=[1]
      }
      let page =flag?this.demoListPageInde[0]:this.demoListPageInde = [1];;
      //if(!flag)this.demoList=[]
      console.log('页'+this.demoListPageInde)
      console.log('页数0'+page)
      let url=URL+'index.php?c=goods&a=goods_list&curpage='+page; 
      
      this.setState({isLoading:true})
      HttpUtils.get(url)
       .then(result=>{
          console.log(result)
         
          // 页数+1
         // 清空增量数据缓存数组
            this.cachedDemoList = [];
            // 存储新的增量数据
            this.cachedDemoList = this.cachedDemoList.concat(result.datas.goods_list);

           // 将新数据追加到旧数据中
            flag?this.demoList = this.demoList.concat(result.datas.goods_list):this.demoList=result.datas.goods_list;
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
    getDataSource(data)
    {
      return this.state.dataSource.cloneWithRows(data)
    }
    renderRow(data)
    {

       let content=<View style={styles.item}>
                       <View style={styles.pc}>
                         <TouchableWithoutFeedback
                            onPress={()=>{
                            this.props.navigator.push({
                               component:GoodsPage,
                               params:{
                                ...this.props,
                                id:data.goods_id
                              }
                            })
                          }}
                         >
                           <Image 
                               source={{uri:imgURL+data.goods_image}}
                               resizeMode="cover"
                               style={styles.img}
                            />
                        </TouchableWithoutFeedback>
                       </View>
                       <View style={styles.text}>
                          <Text style={styles.goods_name}  numberOfLines={2}>{data.goods_name}</Text>
                          <Text style={styles.red}>￥{data.goods_price}</Text>
                       </View>
                   </View>
        return( 
            <View>
                {content}
            </View>
              )
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
    this.isLogin(true)
  }
  _renderFooter()
  {
    // 返回没有更多数据视图 缓存的增量数据为0并且页数不是初始页
    if(this.cachedDemoList.length <20 && this.state.isNoMoreData) 
    {
      return (<View style={[{marginVertical:20,width:width}]}>
          <Text style={{fontSize:14,color:'#999',textAlign:'center'}}>没有更多数据啦...</Text>
      </View>);
    }
    if(!this.state.isLoading)
    {
      return (<View style={styles.footer}><ActivityIndicator style={{ marginVertical:20 }}/></View>);
    }
    
  }
    render()
    {  
        return  <View style={styles.container}>
                  <NavigationBar 
                    title='商城'
                    style={{backgroundColor:'#fff'}}
                  />
                 <ListView
                   contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}}
                   dataSource={this.state.dataSource}
                   style={{paddingBottom:0}}
                   renderRow={(data)=>this.renderRow(data)}
                   enableEmptySections={true}
                   onEndReachedThreshold={20}
                   onEndReached={() =>this._endReached()}
                   renderFooter={() =>this._renderFooter()}
                   refreshControl={
                      <RefreshControl
                         refreshing={this.state.isLoading}
                         onRefresh={()=>this.isLogin()}
                         colors={['#2ca2f9']}
                         title={'加载中...'}
                     />}
                 />
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
    item:{
    flexDirection:'column',
    marginLeft:5,
    backgroundColor:'#fff',
    marginRight:5,   
    width:(width/2)-10,
    marginTop:10,
    padding:15
  },
    text:{
    paddingTop:5
  },
  red:{
  	color:'#E53E49',
    fontSize:14
  },
  gray:{
    color:'#999',
    fontSize:12
  },
  goods_name:{
    height:39,
    color:'#666',
    lineHeight:21,
    fontSize:13
  },
  img:{
     backgroundColor: 'transparent',
     height:150
  },
  activity:{
    marginVertical:20,
  },
  footer:{
    justifyContent:'center',
    alignItems:'center',
    width:width                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  }
})