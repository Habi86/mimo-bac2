import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Modal,
  Dimensions,
  Platform
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Config from 'friedensflotte/app/config/config';
/* ------------ External Components --------- */
import { BlurView } from 'react-native-blur';

export default class CustomModal extends Component {
  constructor(){
    super();
    this.state = {
      modalVisible: false,
      viewRef: null,
    }
  }

  render() {
    return(
      <View>
      <Modal
      animationType={"slide"}
      transparent={true}
      visible={this.state.modalVisible}>
      <BlurView
        style={modalstyles.absolute}
        viewRef={this.state.viewRef}
        blurType="dark"
        blurRadius={15}
        downsampleFactor={5}
        overlayColor={Config.colors.secondaryColorText}
        blurAmount={15}/>
      {Platform.OS === "android" &&
      <BlurView
          style={modalstyles.absoluteAndroid}
          viewRef={this.state.viewRef}
          blurType="dark"
          blurRadius={15}
          downsampleFactor={5}
          overlayColor={Config.colors.secondaryColorText}
          blurAmount={15}/>
      }
       <View style={modalstyles.modal}>
         {this.props.content}
       </View>
    </Modal>
  </View>

    );
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});

  }
  //reference to this function
  toggle(){
    this.setModalVisible(!this.state.modalVisible);
  }

}

const modalstyles = StyleSheet.create({
  modal:{
    height: Dimensions.get('window').height-80,
    width: Dimensions.get('window').width-30,
    marginTop: 80,
    marginLeft: 15,
    marginRight: 10,
    marginBottom: 60,
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 40,
    paddingRight: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  absolute: {
   position: "absolute",
   top: 0, left: 0, bottom: 0, right: 0,
  },
  absoluteAndroid: {
   position: "absolute",
   top: 0, left: 0, bottom: 0, right: 0,
   backgroundColor: Config.colors.secondaryColorText,
   opacity: 0.5
  },
});
