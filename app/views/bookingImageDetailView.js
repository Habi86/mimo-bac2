import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  ListView
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Config from 'friedensflotte/app/config/config';
import Firebase from 'friedensflotte/app/components/firebase';
import ErrorDic from 'friedensflotte/app/components/errordict';
import Button from 'friedensflotte/app/components/button';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation';
import TypeIcons from 'friedensflotte/app/components/booking_type';
import CustomModal from 'friedensflotte/app/components/modal';
/* ------------ External Components --------- */
import Icon from 'react-native-vector-icons/FontAwesome';


export default class BookingImageDetailView extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="list" size={30} color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      source: this.props.navigation.state.params.source,
      index: this.props.navigation.state.params.index,
      deleteImageCallback: this.props.navigation.state.params.deleteImageCallback
    }
  }

  componentDidMount() {

  }

  render() {
    const { goBack } = this.props.navigation;

    return (
      <View style={{ marginTop: 0 }}>
        <TopNavigation
          title={'Buchungsbild -' + (this.state.index + 1)}
          leftButton={<Icon name="arrow-left" size={18} color={Config.colors.primaryColorText} onPress={() => goBack()} />}
          rightButton={<Icon name="trash" size={18} color={Config.colors.primaryColorText} onPress={() => { goBack(); this.state.deleteImageCallback() }} />}
        />
        <View style={localStyles.container}>
          <Image style={localStyles.image} source={this.state.source} />
        </View>
      </View>);
  }

  // handleDelete(){
  //   const { goBack } = this.props.navigation;
  //   this.state.deleteImageCallback();
  //   goBack();
  // }
}


const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});