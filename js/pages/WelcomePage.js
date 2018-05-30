import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  InteractionManager,
  TouchableOpacity
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import SplashScreen from 'react-native-splash-screen'
var Dimensions = require('Dimensions');
var {width,height,scale}=Dimensions.get('window')
export default class WelcomePage extends Component{

    componentDidMount() {
        const {navigator} = this.props;  
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
                navigator.resetTo({
                    component: HomePage,
                    name: 'HomePage'
                });
            });
        }, 2000);
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
	render()
	{
		 return (
            <View style={styles.container}>
                {/*<Image style={{flex:1,width:null}} resizeMode='repeat' source={require('../../res/images/LaunchScreen.png')}/>*/}
            </View>
        );
	}
}
const styles=StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#FFF'
	}
})