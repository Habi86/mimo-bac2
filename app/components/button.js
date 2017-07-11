import React, { Component } from 'react';
import {
  Text
} from 'react-native';

/* ------------ Components --------- */
import { Button, Icon } from 'native-base';
import Config from 'friedensflotte/app/config/config';

class myButton extends Component {
  render() {
    return (
      <Button
        onPress={this.props.onPress}
        rounded transparent={this.props.transparent}
        iconLeft={this.props.iconLeft}
        disabled={this.props.disabled}
        style={{
          borderColor: this.props.borderColor || Config.colors.primaryColorText,
          borderWidth: this.props.borderWidth || 2,
          backgroundColor: this.props.backgroundColor || 'transparent',
          marginTop: this.props.marginTop,
          marginRight: this.props.marginRight,
          padding: 20, width: this.props.width || 160,
          justifyContent: 'center'}}>
          {/*this.props.iconLeft && <Image style={{height: 20, width: 20, marginRight: 10}} source={require('friedensflotte/app/img/icons/turns/calendar_20.png')}/>*/}
          <Text style={{
              color: this.props.color || Config.colors.primaryColorText,
              fontFamily: Config.fonts.mExtrabold,
              fontSize: this.props.fontSize,
              marginLeft: this.props.customMarginLeft}}>
              {this.props.title}
            </Text>
          </Button>
    );
  }
}


export default myButton
