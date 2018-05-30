import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import NavigationBar from '../../common/NavigationBar'
import BackPressComponent from '../../common/BackPressComponent'
import ViewUtils from '../../util/ViewUtils'
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
import Storage from '../../expand/ado/Storage'

export default class Account extends Component{
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.Storage=new Storage('user')
     this.state={
      items:{},
      daylist:[]
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
  onBackPress(e)
  {
    this.goBack();
    return true;
  }
  isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           this.token=result.key
            let formData = new FormData(); 
            let url=URL+'index.php?c=user&a=account'; 
            formData.append('token',this.token);
            HttpUtils.post(url,formData)
             .then(result=>{
                 this.setState({
                    items:result.datas,
                    daylist:result.datas.dayList
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
	goBack()
	{
	   this.props.navigator.pop()
	}
  dayList()
  {
     let data=this.state.daylist
     if(!data||data.length===0)return
      let len=data.length;
      let views=[];
      for(let i=0;i<len;i++)
      {
         views.push(
               <View key={i}>
                   <View style={[styles.flex_sb,styles.row]} >
                        <View>
                             <Text style={styles.text}>{data[i].day}</Text>
                             <Text style={styles.gray}>自由话费</Text>
                        </View>
                        <Text style={styles.red}>￥{data[i].ammount}</Text>
                    </View>
                   <View style={styles.line}></View>
                </View>

          )
      }
      return views
  }
	render(){
		return( <View style={styles.container}>
                    <NavigationBar 
                      leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                      title='账户信息'
                      style={{backgroundColor:'#fff'}}
                    />
                    <ScrollView>
                    <View style={styles.item}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text style={styles.text}>可用自由话费</Text>
                          <Text style={styles.red}>￥{this.state.items.available}</Text>
                     </View>
                    <View style={styles.line}></View>
                    <View style={[styles.flex_sb,styles.row]}>
                          <Text style={styles.text}>冻结自由话费 </Text>
                          <Text style={styles.red}>￥{this.state.items.freeze}</Text>
                     </View>
                     <View style={styles.line}></View>
                     {this.dayList()}
                     </ScrollView>
               </View>
              
			)
	}
}
const styles=StyleSheet.create({
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
     flex_sb:{
      justifyContent:'space-between'
    },
    text:{
    color:'#333'
  },
  line:{
    height:1,
    backgroundColor:'#eee'
  },
  red:{
  	color:'#E53E49'
  },
  gray:{
    color:'#999',
    paddingTop:2,
    fontSize:12
  }
})