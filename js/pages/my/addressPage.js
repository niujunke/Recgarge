import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ListView,
  Alert,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
import Storage from '../../expand/ado/Storage'
import ViewUtils from '../../util/ViewUtils'
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
import NewAddress from './NewAddress'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class addressPage extends Component {
   constructor(props) {
      super(props);
      this.Storage=new Storage('user')
      this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
      this.state={
        dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),
        flag:false
      }
      
    }
  componentDidMount()
  {
     this.backPress.componentDidMount();
     this.isLogin();
     console.log(this.state.statu)
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
  newAdd(data)
  {
    this.data=data;
   // console.log(this.data)
   if(!this.props.onCallBack)return
    this.props.onCallBack(data)
    this.props.navigator.pop()
  }
  Tip(id)
  {
     Alert.alert(
        '提示',
        '确定删除该收货地址？',
        [
          {text:'取消',style:'cancel'},
          {text:'确认',onPress:()=>{this.delAdd(id)}}
        ]
      )
  }
  delAdd(id)
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_address&a=address_del'; 
      formData.append('key',this.state.key);
      formData.append('address_id',id);
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          console.log(result)
          if(result.datas==1)
          {
            this.getAddresList()
          }
       })
        .catch(error=>{
            console.log(error) 
      })
  }
  renderItem(data)
  {
      return(
        <View>
        <TouchableOpacity
           onPress={()=>this.newAdd(data)}
        >
          <View style={[styles.flex_sb,styles.flex_row]} >
                <View style={styles.wrap}>
                    <View style={[styles.row,{paddingBottom:5}]}>
                      <Text style={[styles.text,{paddingRight:10}]}>{data.true_name}</Text>
                      <Text style={styles.text}>{data.mob_phone}</Text>
                    </View>
                    <Text style={styles.gray}>{data.area_info+data.address}</Text>
                </View>
               <TouchableOpacity
                onPress={()=>{
                  this.Tip(data.address_id)
                }}
               ><Image style={[styles.ic,{tintColor:'#bbb'}]} source={require('./images/ic_del.png')}/></TouchableOpacity>
         </View>
         <View style={styles.line}></View>
        </TouchableOpacity>
        </View>
        )
    
         
  }
  getDataSource(data)
  {
    return this.state.dataSource.cloneWithRows(data)
  }
  isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           console.log(result)
           this.setState({
              key:result.key
           })
           this.getAddresList()   
        })
        .catch(error=>{ 
          console.log(error)
        })

  }
  getAddresList()
  {
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_address&a=address_list'; 
      formData.append('key',this.state.key);
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          console.log(result)
           this.setState({
               dataSource:this.getDataSource(result.datas.address_list),
               isLoading:false,
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
                  title='地址管理'
                  leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                  style={{backgroundColor:'#fff'}}
                  />  
                  <View style={styles.item}></View>
                   <ListView
                   dataSource={this.state.dataSource}
                   renderRow={(data)=>this.renderItem(data)}
                   enableEmptySections={true}
                 />
                  <TouchableOpacity
                   style={[styles.wrap,styles.addressBut]}
                    onPress={()=>{
                      let that=this
                       this.props.navigator.push({
                       component:NewAddress,
                       params:{
                              onChang:(falg)=>{
                                if(falg)
                                {
                                  that.getAddresList()
                                }
                                
                              }
                           }
                      }) 
                    }}
                  >
                   <Text style={{fontSize:16,color:'#fff'}}>新增收货地址</Text>
                  </TouchableOpacity>               
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
    wrap:{
      padding:10,
      paddingLeft:15,
      paddingRight:15,
      backgroundColor:'#fff'
    },
    row:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#fff'
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
      backgroundColor:'#fff',
      justifyContent:'space-between'
    },
  ic:{
    width:20,
    height:20,
    marginRight:8
  },
  text:{
    color:'#333'
  },
  line:{
    height:1,
    backgroundColor:'#eee'
  },
  addressBut:{
    position:'absolute',
    bottom:0,
    width:width,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#E53E49'
  }
  })