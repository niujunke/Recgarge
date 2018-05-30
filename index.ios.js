/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  Component
} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
export default class iooc_gp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'home'
    };
  }
  render() {
    return (
      <View style={styles.container}>
    /* <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          selectedTitleStyle={{color:'blue'}}
          title="最热"
          renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_polular.png')} />}
          renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'blue'}]} source={require('./res/images/ic_polular.png')} />}
          badgeText="1"
          onPress={() => this.setState({ selectedTab: 'home' })}>
          <View style={styles.page}></View>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'trending'}
          selectedTitleStyle={{color:'blue'}}
          title="趋势"
          renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_trending.png')} />}
          renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'blue'}]} source={require('./res/images/ic_trending.png')}/>}
          onPress={() => this.setState({ selectedTab: 'trending' })}>
          <View style={styles.page2}></View>
        </TabNavigator.Item>
          <TabNavigator.Item
          selected={this.state.selectedTab === 'favorite'}
          selectedTitleStyle={{color:'blue'}}
          title="收藏"
          renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_favorite.png')} />}
          renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'blue'}]} source={require('./res/images/ic_favorite.png')} />}
          onPress={() => this.setState({ selectedTab: 'favorite' })}>
          <View style={styles.page}></View>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'my'}
          selectedTitleStyle={{color:'blue'}}
          title="我的"
          renderIcon={() => <Image style={styles.icon} source={require('./res/images/ic_my.png')} />}
          renderSelectedIcon={() => <Image style={[styles.icon,{tintColor:'blue'}]} source={require('./res/images/ic_my.png')}/>}
          onPress={() => this.setState({ selectedTab: 'my' })}>
          <View style={styles.page2}></View>
        </TabNavigator.Item>
    </TabNavigator>*/
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

AppRegistry.registerComponent('iooc_gp', () => iooc_gp);