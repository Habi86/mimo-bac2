import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
/* ------------ Selfbuilt Components --------- */
import Config from 'friedensflotte/app/config/config';
import NavigationBar from 'react-native-navbar';

export default class TopNavigation extends Component {
    render() {
        return (
            <NavigationBar
                style={{backgroundColor: Config.colors.primaryColor, height: 50}}
                title={{
                    title:this.props.title,
                    tintColor: Config.colors.thirdColor,
                    style: {fontFamily: Config.fonts.mBold}
                }}
                leftButton={{
                    title: this.props.leftButton,
                    style: {padding: 5, width: 60, height: 40},
                    handler: this.props.onPress,
                }}
                rightButton={{
                    title: this.props.rightButton,
                    style: {padding: 5, width: 40, height: 40},
                    handler: this.props.onPress
                }}
                statusBar={{
                  style: 'light-content',
                  tintColor: Config.colors.primaryColor,
                  backgroundColor: Config.colors.primaryColor
                }}
            />
        );
    }

}
