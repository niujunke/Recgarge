import React, {Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
export default class ViweUtils{
	static getLeftButton(callBack)
	{
		return <TouchableOpacity
                onPress={callBack}
                >
               <Image style={styles.icon} source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
            </TouchableOpacity>
	}
}
const styles = StyleSheet.create({
  icon:{
    width:22,
    height:22,
    margin:5,
    tintColor:'#333'
  }
})