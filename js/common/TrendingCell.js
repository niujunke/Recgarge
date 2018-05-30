import React, {Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview'
export default class TrendingCell extends Component {
  
  render() {
    let description='<p>'+this.props.data.description+'</p>';
    return <TouchableOpacity
             onPress={this.props.onSelect}
           >
              <View style={styles.container}>
                       <Text style={styles.title}>{this.props.data.fullName}</Text>
                       <HTMLView
                         value={description}
                         onLinkPress={(url)=>{}}
                         stylesheet={{
                            p:styles.description,
                            a:styles.description
                         }}
                       />
                       <Text style={styles.description}>{this.props.data.meta}</Text>
                       <View style={styles.flexsb}>
                            <View style={styles.row}>
                              <Text style={styles.author}>Build by:</Text>
                              {this.props.data.contributors.map((result,i,arr)=>{
                                 return <Image
                                         key={i} 
                                        source={{uri:arr[i]}}
                                         style={{width:22,height:22}}
                                         />
                              })}
                             
                            </View>
                              <Image 
                              source={require('../../res/images/ic_star.png')}
                               style={{width:22,height:22}}
                               />
                       </View>
                   </View>
            </TouchableOpacity>
    }
  }

  const styles = StyleSheet.create({
    container:{
       padding:10,
       backgroundColor:'#fff',
       marginVertical:3,
       marginLeft:5,
       marginRight:5,
       borderWidth:0.5,
       borderColor:'#ddd',
       borderRadius:5,
       elevation:2
    },
    flexsb:{
    justifyContent:'space-between',
    flexDirection:'row',
    padding:10
  },
  row:{
     flexDirection:'row'
  } ,
  title:{
     fontSize:16,
     marginBottom:2,
     color:'#212121'
    },
    description:{
      color:'#757575',
      fontSize:14
    },
    author:{
      color:'#757575',
      fontSize:14
    }
  })