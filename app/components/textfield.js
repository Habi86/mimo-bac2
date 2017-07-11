import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';

import {
    MKTextField
} from 'react-native-material-kit';
import Config from 'friedensflotte/app/config/config';

export default class TextfieldCustom extends Component {
    render() {
        return (
            <MKTextField
                onChangeText={this.props.onChangeText}
                defaultValue={this.props.defaultValue}
                style={styles.textfield}
                tintColor={this.props.tintColor || Config.colors.primaryColorText }
                highlightColor={this.props.highlightColor || Config.colors.primaryColorText}
                underlineSize={1}
                fontFamily={Config.fonts.mExtrabold}
                autoCapitalize={'none'}
                keyboardType={this.props.keyboardType}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                textInputStyle={{flex: 1, color: this.props.color || Config.colors.primaryColorText, fontFamily: Config.fonts.mExtrabold ,fontSize: 18, paddingLeft: 20, paddingBottom: 10}}
            />
        );
    }
}

const styles = StyleSheet.create({
    textfield: {
        height: 58,
        paddingBottom: 10,
        width: 300,
    }
});
