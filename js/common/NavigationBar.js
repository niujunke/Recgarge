import React, {Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StatusBar
} from 'react-native';
const NAVBAR_HEIGHT_ANROID = 50;
const NAVBAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
const StatesBarShape={
  backgroundColor:PropTypes.string,
  barStyle:PropTypes.oneOf(['default','light-content','dark-content']),
  hidden:PropTypes.bool
}
export default class NavigatorBar extends Component {
  static propTypes={ //属性约束的类型
    style:View.propTypes.style,
    title:PropTypes.string,
    titleView:PropTypes.element,
    hide:PropTypes.bool,
    leftButton:PropTypes.element,
    rightButton:PropTypes.element,
    statusBar:PropTypes.shape(StatesBarShape)
  }
  static defaultProps = {
    statusBar:{
      barStyle:'light-content',
      hidden:false
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false
    };
  }
  render() {
    let status=<View styel={styles.statusBar}>
        <StatusBar />
      </View>
    let titleView =this.props.titleView ? this.props.titleView : 
    <Text style={styles.title}>{this.props.title}</Text>
    let content=<View style={styles.navBar}>
     {this.props.leftButton}
     <View style={styles.titleViewContainer}>
       {titleView}
     </View>  
     {this.props.rightButton} 
     </View>
    return (
       <View style = {[styles.conainer,this.props.style]}>
          {status}
          {content}
          
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    conainer:{
      backgroundColor: 'gray',
    },
    text: {
      fontSize: 20
    },
    navBar:{
      justifyContent:'space-between',
      alignItems:'center',
      height:Platform.OS=='ios'?NAVBAR_HEIGHT_IOS:NAVBAR_HEIGHT_ANROID,
      flexDirection:'row'
    },
    titleViewContainer:{
      justifyContent:'center',
      alignItems:'center',
      position:'absolute',
      left:40,
      right:40,
      top:0,
      bottom:0
    },
    title:{
      fontSize:18,
      color:'#333'
    },
    statusBar:{
      height:Platform.OS==='ios'?STATUS_BAR_HEIGHT:0
    }
  })