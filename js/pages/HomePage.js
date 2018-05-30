/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  BackHandler,
  ToastAndroid,
  DeviceEventEmitter//事件发射器
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Toast ,{DURATION}from 'react-native-easy-toast'
import Recgarge from './Recgarge';
import MyPage from './my/MyPage'
import TransferPage from './TransferPage';
import LoginPage from './LoginPage'
import ShopPage from './ShopPage';
import ShopCarPage from './ShopCarPage';
import Storage from '../expand/ado/Storage'
var firstClick = 0;
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.Storage=new Storage('user')
    this.state = {
      selectedTab:this.props.selectedTab?this.props.selectedTab:'home'
    };
  }
  componentDidMount()
  {
    this.isLogin()
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    this.listener=DeviceEventEmitter.addListener('showToast',(text)=>{
        this.toast.show(text,1500);
    })
  }
  componentWillUnMount()
  {
     BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
     this.listener&&this.listener.remove();
  }
  onBackAndroid = () => {
   var timestamp = (new Date()).valueOf();
        if (timestamp - firstClick > 2000) {
            firstClick = timestamp;
            ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
            return true;
        } else {
            this.listener&&this.listener.remove();
            return false;
        }

};

  isLogin()
  {
     let that=this
     this.Storage.fetch()
        .then(result=>{
           console.log(result.key)
        })
        .catch(error=>{
            that.props.navigator.push({
                        component:LoginPage
                      })  
              console.log(error)
        })
  }
  _renderTab(Component,selectTab,title,renderIcon)
  {
    return <TabNavigator.Item
              selected={this.state.selectedTab === selectTab}
              selectedTitleStyle={{color:'#E53E49'}}
              title={title}
              renderIcon={() => <Image style={styles.icon} source={renderIcon} />}
              renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'#E53E49'}]} source={renderIcon} />}
              onPress={() => this.setState({ selectedTab: selectTab })}>
              <Component  {...this.props}/>
            </TabNavigator.Item>
  }
  render() {
    return (
      <View style={styles.container}>
          <TabNavigator>
            {this._renderTab(Recgarge,'home','充值',require('../../res/images/ic_polular.png'))}
            {this._renderTab(TransferPage,'transfer','转账',require('../../res/images/ic_favorite.png'))}
            {this._renderTab(ShopPage,'shop','商城',require('../../res/images/ic_shop.png'))}
            {this._renderTab(ShopCarPage,'shopCar','购物车',require('../../res/images/ic_car.png'))}
            {this._renderTab(MyPage,'my','我的',require('../../res/images/ic_my.png'))}
           </TabNavigator>
           <Toast ref={toast=>this.toast=toast} position='center'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page: {
    flex: 1,
    backgroundColor: 'red'
  },
  page2: {
    flex: 1,
    backgroundColor: 'blue'
  },
  icon: {
    width: 22,
    height: 22
  }
});

