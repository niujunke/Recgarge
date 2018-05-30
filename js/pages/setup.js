import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import WelcomePage from './WelcomePage'
function setup()
{//初始化配置
	class Root extends Component{
		renderScene(route,navigator)
		{
			let Component=route.component;
			return <Component navigator={navigator} {...route.params}/>
		}
		render()
		{
			return <Navigator
                   initialRoute={{component:WelcomePage}}
                   renderScene={(route,navigator)=>this.renderScene(route,navigator)}
			/>
		}
	}
	
	return <Root/>
}
module.exports=setup;