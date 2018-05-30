import React, {Component,PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

export default class CellRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite:false,
      favoriteIcon:require('../../res/images/ic_unstar_transparent.png')
    };
  }
  setFavoriteState(isFavorite)
  {
     this.setState({
        isFavorite:isFavorite,
        favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
     })
  }
  onPressFavorite()
  {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
  }
  render() {
    let favoriteButton=<TouchableOpacity
                         onPress={()=>this.onPressFavorite()}
                        >
                             <Image 
                              source={this.state.favoriteIcon}
                               style={[{width:22,height:22},{tintColor:"#2196f3"}]}
                               />
                      </TouchableOpacity>
    return <TouchableOpacity
             onPress={this.props.onSelect}
           >
              <View style={styles.container}>
                       <Text style={styles.title}>{this.props.data.full_name}</Text>
                       <Text style={styles.description}>{this.props.data.description}</Text>
                       <View style={styles.flexsb}>
                            <View style={styles.row}>
                              <Text>Author:</Text>
                             <Image 
                              source={{uri:this.props.data.owner.avatar_url}}
                               style={{width:22,height:22}}
                               />
                            </View>
                            <View style={styles.row}>
                              <Text>Stars:</Text>
                              <Text>{this.props.data.stargazers_count}</Text>
                            </View>
                            {favoriteButton}
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
    }
  })