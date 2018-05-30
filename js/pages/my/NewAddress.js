import React, {
  Component
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableNativeFeedback,
  TouchableOpacity
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast'
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import BackPressComponent from '../../common/BackPressComponent'
import Storage from '../../expand/ado/Storage'
import HttpUtils, {URL} from '../../expand/ado/HttpUtils'
import Picker from 'react-native-picker'
export default class NewAddress extends Component {
  constructor(props) {
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.Storage=new Storage('user')
    this.true_name='';
    this.mob_phone='';
    this.city_id='';
    this.area_id='';
    this.address='';
    this.state = {
        isLoading:true,
        areaList:[],
        cityList:[],
        regionList:[]
    };
  }
  componentDidMount()
  {
     this.backPress.componentDidMount();
     this.isLogin()
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
  onSubmit()
  {
      if(this.true_name.length<2)
      {
         this.toast.show('请输入真实姓名',1500)
         return false
      }
      if(this.mob_phone.length<11)
      {
         this.toast.show('请输入手机号码',1500)
         return false
      }
      if(this.state.cityContent.length<2)
      {
         this.toast.show('请选择省份',1500)
         return false
      }
      if(this.state.city<2)
      {
         this.toast.show('请选择城市',1500)
         return false
      }
      if(this.state.region<2)
      {
         this.toast.show('请选择区县',1500)
         return false
      }
       if(this.address.length<5)
      {
          this.toast.show('请输入详细地址',1500);
         return false
      }
      let formData = new FormData(); 
      let url=URL+'index.php?c=member_address&a=address_add'; 
      let area_info=this.state.cityContent+this.state.city+this.state.region
      formData.append('key',this.state.key);
      formData.append('true_name',this.true_name);  
      formData.append('mob_phone',this.mob_phone);
      formData.append('city_id',this.city_id);
      formData.append('area_id',this.area_id);
      formData.append('address',this.address);
      formData.append('area_info',area_info);
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          console.log(result)
          if(result.code==200)
          {
              this.toast.show('保存地址成功！',1500);
              this.props.onChang(true)
              this.props.navigator.pop()
          }
       })
        .catch(error=>{
          console.log(error+'1123')
      })
  }
   isLogin()
  {
     this.Storage.fetch()
        .then(result=>{
             this.setState({
              key:result.key
           })
            this.getAreaList(null) 
        })
        .catch(error=>{ 
          console.log(error)
        })

  }
  goBack()
  {
     this.props.navigator.pop()
  }
  getAreaList(area_id,type)
  {
     if(type==3)return;
     let formData = new FormData(); 
      let url=URL+'index.php?c=member_address&a=area_list'; 
      formData.append('key',this.state.key);
      area_id?formData.append('area_id',area_id):null;
      console.log(formData)
      HttpUtils.post(url,formData)
       .then(result=>{
          console.log(result)
          switch(type) {
         case 1:
           this.setState({cityList:result.datas.area_list })
           break;
         case 2:
            this.setState({regionList:result.datas.area_list })
           break;
           default:
           this.setState({areaList:result.datas.area_list })
       }
         
       })
        .catch(error=>{
            console.log(error) 
      })
  }

  _pickerShow(type){
       let area_name=[]
       let arr
       switch(type) {
         case 1:
            arr=this.state.areaList
           break;
         case 2:
             arr=this.state.cityList?this.state.cityList:[]
           break;
          case 3:
             arr=this.state.regionList?this.state.regionList:[]
           break;
          default:
             arr=this.state.areaList
       }
       if(arr.length==0)return
       for (var i = 0; i <arr.length; i++) 
       {
           let obj={area_id:arr[i].area_id}
           area_name[arr[i].area_name]=obj
       }
        Picker.init({
            pickerData:Object.keys(area_name),
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            pickerTitleText:'选择城市',
            pickerToolBarBg: [232, 232, 232, 1],
            pickerBg:[245,245,245,1],
            pickerToolBarFontSize: 16,
            pickerFontSize: 20,
            onPickerConfirm: (data) => { 
                switch(type) {
                      case 1:
                        this.setState({cityContent:data[0]})                       
                        break;
                      case 2:
                        this.setState({city:data[0]})
                         this.city_id=area_name[data].area_id
                        break;
                      case 3:
                        this.setState({region:data[0]})
                        this.area_id=area_name[data].area_id
                        break;
                    }    
                 this.getAreaList(area_name[data].area_id,type)                  
            }
        });
        Picker.show();
    }


  render() {
    let content=this.state.cityContent?<Text>{this.state.cityContent}</Text>:<Text style={ styles.gray}>省份</Text>
    let content2=this.state.city?<Text>{this.state.city}</Text>:<Text style={ styles.gray}>城市</Text> 
    let content3=this.state.region?<Text>{this.state.region}</Text>:<Text style={ styles.gray}>区县</Text>  
    console.log(this.state.city)                        
    return (
      <View style={styles.conainer}>
                <NavigationBar
                  leftButton={ViewUtils.getLeftButton(()=>this.goBack())}
                  title='新增收货地址'
                  style={{backgroundColor:'#fff'}}
                 />
                  <View style={styles.item}></View>
                  <View style={styles.cont}>
                        <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.true_name=text} 
                         placeholder ='请输入姓名'
                         maxLength={5}
                         placeholderTextColor='#ccc'
                         />
                         <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.mob_phone=text} 
                         keyboardType='numeric'
                         placeholder ='手机号码'
                         maxLength={11}
                         placeholderTextColor='#ccc'
                         />
                          <TouchableNativeFeedback  
                              onPress={()=>this._pickerShow(1)}
                          >
                           <View style={[styles.input,styles.flex]}>
                              {content}
                          </View>
                         </TouchableNativeFeedback>
                          <TouchableNativeFeedback  
                              onPress={()=>{
                                  this.state.cityContent?this._pickerShow(2):null
                              } }
                          >
                           <View style={[styles.input,styles.flex]}>
                              {content2}
                          </View>
                         </TouchableNativeFeedback>
                          <TouchableNativeFeedback  
                              onPress={()=>{
                                this.state.city?this._pickerShow(3):null
                              } }
                          >
                           <View style={[styles.input,styles.flex]}>
                              {content3}
                          </View>
                         </TouchableNativeFeedback>
                          <TextInput
                         style={styles.input}
                         underlineColorAndroid='transparent'
                         onChangeText={text=>this.address=text} 
                         placeholder ='详细地址'
                         placeholderTextColor='#ccc'
                         />
                  </View>
                   <TouchableNativeFeedback
                    onPress={()=>this.onSubmit()}
                   ><View style={styles.submit}><Text style={styles.footTxt}>保存</Text></View></TouchableNativeFeedback>
                   <Toast ref={toast=>this.toast=toast}/>
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
    borderBottomWidth:1,
    borderColor:'#eee',
    padding:10
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
    color:"#ccc"
  },
  submit:{
   backgroundColor:'#E53E49',
    height:45,
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    marginLeft:10,
    marginRight:10,
    borderRadius:3
  },
  footTxt:{
     color:'#fff'
  },
   item:{
      height:12,
      backgroundColor:'#eee'
    }
})