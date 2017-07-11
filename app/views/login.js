import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Button from 'friedensflotte/app/components/button';
import TextfieldWithFloatingLabel from 'friedensflotte/app/components/texfield_with_floating_labels'
import Config from 'friedensflotte/app/config/config';
import Firebase from 'friedensflotte/app/components/firebase';
import ErrorDic from 'friedensflotte/app/components/errordict';
import CustomModal from 'friedensflotte/app/components/modal';
import LinearGradient from 'react-native-linear-gradient';
import {Item} from 'native-base';

let width = Dimensions.get('window').width - 40; // minus margin
const eyeIconOpen = (<Image style={styles.pwIcons} source={require('friedensflotte/app/img/icons/login/password_visible_20.png')}/>);
const eyeIconClosed = (<Image style={styles.pwIcons} source={require('friedensflotte/app/img/icons/login/password_hidden_20.png')}/>);

export default class Login extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(){
    super();
    this.state = {
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: "",
      resetPWsuccess: "",
      showPassword: true,
    }
  }
  //TODO: add password validation

  render() {
    var content = (
      <View>
      <View style={styles.modalIcon}>
        <Image style={{height: 100, width: 100}} source={require('friedensflotte/app/img/icons/login/mail_large_56.png')}/>
      </View>
      {this.state.email ?
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Du hast dein Passwort vergessen?
            Wir senden dir gerne eine E-Mail an
          </Text>
          <Text style={loginstyles.email}>{this.state.email}</Text>
          <Text style={styles.modaltext}>zum Zurücksetzen des Passwort</Text>
          <Text style={{color: Config.colors.thirdColorText}}>{this.state.resetPWsuccess}</Text>
        </View>
        :
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Du hast dein Passwort vergessen?
            Bitte gib dein E-Mail-Adresse ein, mit der du dich bei uns registriert
            hast, damit wir dir eine E-Mail zum Zurücksetzen des Passwort senden können.
          </Text>
          <TextfieldWithFloatingLabel
            password={false}
            placeholder={"E-Mail-Adresse"}
            onChangeText={(value) => this.setState({email: value})}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            keyboardType={'email-address'}
            highlightColor={Config.colors.secondaryColorText}
            color={Config.colors.secondaryColorText}/>
          <Text style={{color: Config.colors.thirdColorText}}>{this.state.resetPWsuccess}</Text>
        </View>
      }
        <View style={loginstyles.buttonRow}>
          <TouchableOpacity
            onPress={() =>  this.handlePWResetPress()}>
            <Text style={loginstyles.leftAction}>SENDEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.refs['CustomModal'].toggle()}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
      </View>
    </View>
    );

    return (
      <LinearGradient
          colors={[Config.colors.primaryColor, Config.colors.primaryColor, Config.colors.secondaryColor]}
          style={loginstyles.linearGradient}
          start={{x: 0.2, y: 0.2}} end={{x: 0.1, y: 0.9}}>
      <View style={styles.containerMain}>
        <View style={loginstyles.loginForm}>
          <CustomModal content={content} ref={'CustomModal'}/>
          <View style={styles.row}>
            <View style={loginstyles.centerImage}>
              <Image
                style={{width: 200, height: 200, resizeMode: 'contain'}}
                source={require('friedensflotte/app/img/logo/mimo_logo_200.png')}
                />
            </View>
            <View>
              <TextfieldWithFloatingLabel
                placeholder={"E-Mail-Adresse"}
                onChangeText={(value) => this.setState({email: value})}
                placeholderTextColor={Config.colors.primaryColorText}
                tintColor={Config.colors.primaryColorText}
                keyboardType={'email-address'}
                highlightColor={Config.colors.primaryColorText}
                color={Config.colors.primaryColorText}
                width={width - 40}/>
            </View>
            <View>
              <Item style={{borderBottomWidth: 0}}>
                <TextfieldWithFloatingLabel
                  password={this.state.showPassword}
                  placeholder={"Passwort"}
                  onChangeText={(value) => this.setState({password: value})}
                  placeholderTextColor={Config.colors.primaryColorText}
                  tintColor={Config.colors.primaryColorText}
                  highlightColor={Config.colors.primaryColorText}
                  color={Config.colors.primaryColorText}
                  width={width - 40}/>
                <TouchableOpacity onPress={()=> this.setState({showPassword: !this.state.showPassword})}>
                  {(this.state.showPassword) ? eyeIconClosed : eyeIconOpen}
                </TouchableOpacity>
              </Item>
              <View>
                <Text style={styles.error}>{this.state.errors}</Text>
                <Text style={styles.error}>{this.state.resetPWsuccess}</Text>
              </View>
              <View style={loginstyles.centerButton}>
                <Button
                  transparent={true} onPress={()=> this.handleLoginButtonPress()}
                  title="ANMELDEN"
                  marginTop={0}
                  fontSize={12}
                  />
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={loginstyles.bottom}
                onPress={() => {this.refs['CustomModal'].toggle()}}>
                <Text style={styles.text}>Passwort vergessen?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={loginstyles.bottom}
                onPress={() =>  this.handleRegisterButtonPress()}>
                <Text style={styles.text}>Noch kein Profil? Jetzt registrieren?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
    );
  }

  handleRegisterButtonPress(){
    this.props.navigation.navigate('Registration');
  }

  handleLoginButtonPress(){
    Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        console.log('User successfully logged in', user)
        this.props.navigation.navigate('MainNavigation');
      })
      .catch((err) => {
        this.setState({
          errors: ErrorDic.get(err.code)
        })
    });
  }

  handlePWResetPress(){
    Firebase.auth().sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({
          resetPWsuccess: "Wir haben dir eine E-Mail zum Zurücksetzen des Passworts gesendet."
        })
        this.refs['CustomModal'].toggle();
      })
      .catch((err) => {
        this.setState({
          errors: ErrorDic.get(err.code)
        })
      });
    }
  }

const loginstyles = StyleSheet.create({
  loginForm:{
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
  },
  bottom:{
    flexDirection:'column',
  },
  linearGradient: {
   flex: 1,
   paddingLeft: 25,
   paddingRight: 25,
 },
 leftAction:{ //rightAction in styles.js
   color: Config.colors.thirdColorText,
   textAlign: 'left',
   fontFamily: Config.fonts.mBold,
   fontSize: 20,
 },
 email:{
   color: Config.colors.secondaryColorText,
   textAlign: 'center',
   fontFamily: Config.fonts.mBoldItalic,
   fontSize: 26,
 },
 buttonRow:{
   flexDirection:'row',
   alignItems: 'flex-end',
   justifyContent: 'space-between',
   marginTop: 5,
 },
 centerImage:{
   justifyContent: 'center',
   alignItems: 'center'
 },
  centerButton:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom: 20,
  },
});
