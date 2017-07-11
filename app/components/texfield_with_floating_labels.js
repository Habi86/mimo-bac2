import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';

import {
    MKTextField
} from 'react-native-material-kit';
import Config from 'friedensflotte/app/config/config';

class TextfieldWithFloatingLabel extends Component {
    render() {
        return (
            //check duration and opacity of floating label
            //default value is white = primaryColorText
            //to change to black send props secondaryColorText
            <MKTextField
                floatingLabelEnabled={this.props.floatingLabelEnabled || true}
                floatingLabelAniDuration={200}
                floatingopacityAniDur={1}
                floatingLabelBottomMargin={8}
                password={this.props.password}
                onChangeText={this.props.onChangeText}
                onFocus={this.props.onFocus}
                placeholder={this.props.placeholder}
                style={[styles.textfieldWithFloatingLabel, {width: this.props.width || 300}]}
                placeholderTextColor={this.props.placeholderTextColor || Config.colors.primaryColorText}
                tintColor={this.props.tintColor || Config.colors.primaryColorText }
                highlightColor={this.props.highlightColor || Config.colors.primaryColorText}
                underlineSize={1}
                fontFamily={Config.fonts.mBold}
                autoCapitalize={'none'}
                keyboardType={this.props.keyboardType}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                textInputStyle={{flex: 1, color: this.props.color || Config.colors.primaryColorText, fontFamily: Config.fonts.mBold ,fontSize: 18, paddingLeft: 20, paddingBottom: 10, marginTop:15}}
                floatingLabelFont={{
                    fontSize: 17,
                    fontFamily: Config.fonts.mBold,
                    paddingLeft: 23,
                    marginBottom: 40,
                    color: this.props.color || Config.colors.primaryColorText
                }}
                value={this.props.value}
                width={this.props.width}
            />
        );
    }
}

const styles = StyleSheet.create({
    textfieldWithFloatingLabel: {
        height: 60,
        marginTop: 10,
        paddingBottom: 10,
    }
});

export default TextfieldWithFloatingLabel
