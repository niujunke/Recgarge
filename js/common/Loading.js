import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class Loading extends Component {
    render()
    {
      return <View style={styles.loading}>
                      <ActivityIndicator
                      color={this.props.color}
                      style={[styles.centering,this.props.style, {transform: [{scale: 1.5}]}]}
                      size="large"
                      />
             </View>
    }
  }

const styles = StyleSheet.create({
  loading:{
  position:'absolute',
  width:width,
  height:height,
  top:0,
  left:0,
  bottom:0,
  right:0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:'rgba(0,0,0,0.0)'
},
centering: {
  padding: 8,
  width:55,
  height:55,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius:5,
  backgroundColor:'rgba(0,0,0,0.4)'
}
})