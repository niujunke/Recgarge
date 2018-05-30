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
  RefreshControl
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
import ViewUtils from '../../util/ViewUtils'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DateTimePicker from 'react-native-modal-datetime-picker';
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
import Storage from '../../expand/ado/Storage'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')

export default class TradingRecord extends Component{
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.search_phone='';
    this.state = {
       isModal:false,
       isDateTimePickerVisible: false,
       text:'选择日期',
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
	   this.props.navigator.pop()
	}
  showModal() 
  {
    this.setState({
        isModal:true
    })
    console.log(this.state.isModal)
  }
  onRequestClose() 
  {
    this.setState({
        isModal:false
    });
  }
  _showDateTimePicker()
 {
    this.setState({ isDateTimePickerVisible: true })
 }
 _hideDateTimePicker()
 {
  this.setState({ isDateTimePickerVisible: false })
 }
_handleDatePicked(date)
{
   var time=JSON.stringify(date)
   var day=time.match(/\d{4}-\d{2}-\d{2}/g)
    this.setState({
    text:day
   })
   console.log(day[0]);
   this._hideDateTimePicker();
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
                        <View style={styles.modalTitle}><Text>输入搜索条件</Text></View>
                        <View style={styles.modalContent}>
                              <TextInput
                               style={styles.input}
                               underlineColorAndroid='transparent'
                               onChangeText={text=>this.search_phone=text} 
                               keyboardType='numeric'
                               placeholder ='请输入手机号'
                               placeholderTextColor='#ccc'
                               />
                              <TouchableOpacity style={styles.time}
                               onPress={()=>this._showDateTimePicker()}
                              >
                                      <Text style={styles.text}>{this.state.text}</Text>
                              </TouchableOpacity>
                              <View style={styles.line}></View>
                        </View>
                        <View style={styles.item}></View>
                        <View style={styles.modalFoot}>
                            <TouchableNativeFeedback
                              onPress={()=>this.onSearch()}
                            ><View style={styles.submit}><Text style={styles.footTxt}>确认</Text></View></TouchableNativeFeedback>
                        </View>
                   </View>
                </View>
              </TouchableOpacity>
            </Modal>
  }
  onSearch()
  {
     let now=this.state.curNow
     console.log(this.state.text[0])
     if(now==0)
     {
        console.log('手机充值-搜索')
         this.refs.getDeal.isLogin('deal',this.search_phone,this.state.text[0]);
     }
     else
     {
        console.log('会员转账-搜索')
        this.refs.getOut.isLogin('transfer_out',this.search_phone,this.state.text[0]);
     }
     this.search_phone=''
     this.setState({
       text:'选择日期'
     })
     this.onRequestClose()
  }
  renderDateTimePicker()
  {
    return  <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={(date)=>this._handleDatePicked(date)}
              onCancel={()=>this._hideDateTimePicker()}
            />
  }

	render(){
    let rightButton= <TouchableOpacity
                       style={styles.rightBtn}
                       onPress={() => this.showModal()}
                    >
                    <Text>筛选</Text>
                  </TouchableOpacity>
   
		return(
             <View style={styles.container}>
                  <NavigationBar 
                    leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                    title='交易记录'
                    style={{backgroundColor:'#fff'}}
                     rightButton={rightButton}
                  />
                  <ScrollableTabView
                    tabBarBackgroundColor="#fff"
                    style={styles.container}
                    tabBarInactiveTextColor="#333"
                    tabBarActiveTextColor="#E53E49"
                    tabBarUnderlineStyle={{backgroundColor:'#E53E49',height:3}}
                    renderTabBar={()=><ScrollableTabBar/>}
                     page={this.state.curNow}
                    onChangeTab={(obj)=>{
                      this.setState({
                        curNow:obj.i
                      })
                    }}
                  
                  >
                    <TradingRecordTab tabLabel="手机充值" index={0} style={styles.text} {...this.props} ref="getDeal"> </TradingRecordTab>
                    <TradingRecordTab tabLabel="会员转账" index={1}  style={styles.text} {...this.props} ref="getOut"></TradingRecordTab>
                 </ScrollableTabView>
                 {this.randerModal()}
                 {this.renderDateTimePicker()}
             </View>
             
			)
	}
}
class TradingRecordTab extends Component{
    constructor(props){
       super(props)
       this.Storage=new Storage('user')
        this.state={
           dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
           activeTab:0,
           isLoading:true,
           nowCur:this.props.index
        }
    }
    componentDidMount()
    {
      let activeTab= this.state.nowCur
      if(activeTab==0)
      {
         this.isLogin('deal',null,null)
      }
      else
      {
         this.isLogin('transfer_out',null,null)
      }
    }

  isLogin(key,phone,day)
  {
      this.setState({
                     isLoading:true
                 })
     this.Storage.fetch()
        .then(result=>{
           this.token=result.key
            let formData = new FormData(); 
            let url=URL+'index.php?c=user&a='+key; 
            formData.append('token',this.token);
            phone?formData.append('search_phone',phone):'';
            day&&day!=='选择日期'?formData.append('search_day',day):'';
            console.log(formData)
            HttpUtils.post(url,formData)
             .then(result=>{
                 this.setState({
                    dataSource:this.getDataSource(result.datas),
                     isLoading:false,
                 })
                  console.log(result)
             })
              .catch(error=>{
                 console.log(error)
            })    
        })
        .catch(error=>{ 
          console.log(error)
        })

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
    renderRow(data)
    {
       let statu='';
       if(data.status==0){
        statu='申请驳回'
      }
      if(data.status==1){
        statu='正在处理'
      }
      if(data.status==2){
        statu='充值完成'
      }
     
       let content=this.props.index==0?<View style={[styles.flex_sb,styles.row]}>
                       <View>
                        <Text style={styles.text}>{data.telphone}</Text>
                        <Text style={styles.gray}>{this.getLocalTime(data.apply_time)}</Text>
                       </View>
                        <Text style={styles.red}>￥{data.ammount}</Text>
                        <Text style={styles.red}>{statu}</Text>
                   </View>:<View style={[styles.flex_sb,styles.row]}>
                           <View>
                            <Text style={styles.text}>{data.truename}</Text>
                            <Text style={styles.gray}>{this.getLocalTime(data.input_time)}</Text>
                           </View>
                           <View style={styles.cols}><Text style={styles.font}>自由话费</Text><Text style={styles.red}>￥{data.cash_ammount}</Text></View>
                           <View style={styles.cols}><Text style={styles.font}>每日话费</Text><Text style={styles.red}>￥{data.everyday_ammount}</Text></View>
                      </View>
        return( 
            <View>
                {content}
                <View style={styles.line}></View>
            </View>
              )
     }
    render()
    {  
        return <View style={styles.pbt}>
                 <View style={styles.item}></View>
                 <ListView
                   dataSource={this.state.dataSource}
                   renderRow={(data)=>this.renderRow(data)}
                   enableEmptySections={true}
                   refreshControl={
                      <RefreshControl
                         refreshing={this.state.isLoading}
                         onRefresh={()=>this.isLogin(this.state.nowCur,null,null)}
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
      height:50
    },
     flex_sb:{
      justifyContent:'space-between'
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
   rightBtn:{
    position:'absolute',
    right:20
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
  submit:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center'
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
    pbt:{
      paddingBottom:20
    },
    cols:{
      alignItems:'center'
    }
})