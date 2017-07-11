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
/* ------------ External Components --------- */
import LinearGradient from 'react-native-linear-gradient';
import {Item} from 'native-base';

let width = Dimensions.get('window').width - 40; // minus margin
const eyeIconOpen = (<Image style={styles.pwIcons} source={require('friedensflotte/app/img/icons/login/password_visible_20.png')}/>);
const eyeIconClosed = (<Image style={styles.pwIcons} source={require('friedensflotte/app/img/icons/login/password_hidden_20.png')}/>);

export default class Registration extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isSkipper: true,
      errors: "",
      showPasswordRegistration: true,
    }
  }
  //TODO: add password validation
  render() {
    return (
      <LinearGradient colors={[Config.colors.primaryColor, Config.colors.primaryColor, Config.colors.secondaryColor]} style={registerstyles.linearGradient}>
      <View style={styles.containerMain}>
        <View style={registerstyles.loginForm}>
          <View>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={registerstyles.label}>Rolle:</Text>
            </View>
            <View style={registerstyles.buttonRow}>
              <Button
                transparent={true}
                backgroundColor={this.state.isSkipper && Config.colors.selectedButtonColor}
                onPress={()=> this.setState({isSkipper: true})}
                title="SKIPPER"
                borderWidth={0.5}
                width={130}
                />
              <Button
                transparent={true}
                backgroundColor={!this.state.isSkipper && Config.colors.selectedButtonColor}
                onPress={()=> this.setState({isSkipper: false})}
                title="BETREUER"
                borderWidth={0.5}
                width={130}
                />
            </View>
            <View>
              <TextfieldWithFloatingLabel
                password={false}
                placeholder={"Vorname Nachname"}
                onChangeText={(value) => this.setState({name: value})}
                placeholderTextColor={Config.colors.primaryColorText}
                tintColor={Config.colors.primaryColorText}
                highlightColor={Config.colors.primaryColorText}
                color={Config.colors.primaryColorText}
                width={width - 40}/>
              <TextfieldWithFloatingLabel
                password={false}
                placeholder={"E-Mail-Adresse"}
                onChangeText={(value) => this.setState({email: value})}
                keyboardType={'email-address'}
                placeholderTextColor={Config.colors.primaryColorText}
                tintColor={Config.colors.primaryColorText}
                highlightColor={Config.colors.primaryColorText}
                color={Config.colors.primaryColorText}
                width={width - 40}/>
            </View>
            <View>
              <Item style={{borderBottomWidth: 0}}>
                <TextfieldWithFloatingLabel
                  password={this.state.showPasswordRegistration}
                  placeholder={"Passwort"}
                  onChangeText={(value) => this.setState({password: value})}
                  placeholderTextColor={Config.colors.primaryColorText}
                  tintColor={Config.colors.primaryColorText}
                  highlightColor={Config.colors.primaryColorText}
                  color={Config.colors.primaryColorText}
                  width={width - 40}/>
                <TouchableOpacity onPress={()=> this.setState({showPasswordRegistration: !this.state.showPasswordRegistration})}>
                  {(this.state.showPasswordRegistration) ? eyeIconClosed : eyeIconOpen}
                </TouchableOpacity>
              </Item>
              <Item style={{borderBottomWidth: 0}}>
                <TextfieldWithFloatingLabel
                  password={this.state.showPasswordRegistration}
                  placeholder={"Passwort wiederholen"}
                  onChangeText={(value) => this.setState({passwordConfirmation: value})}
                  placeholderTextColor={Config.colors.primaryColorText}
                  tintColor={Config.colors.primaryColorText}
                  highlightColor={Config.colors.primaryColorText}
                  color={Config.colors.primaryColorText}
                  width={width - 40}/>
              </Item>
              <Text style={styles.error}>{this.state.errors}</Text>
              <View style={registerstyles.centerButton}>
                <Button
                  transparent={true}
                  onPress={()=> this.handleRegisterButtonPress()}
                  title="REGISTRIEREN"
                  marginTop={10}
                  />
              </View>
            </View>
            <TouchableOpacity
              style={registerstyles.bottom}
              onPress={() =>  this.handleLoginButtonPress()}>
              <Text style={styles.text}>Du hast schon ein Profil? Jetzt anmelden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
    );
  }

  handleRegisterButtonPress(){
    Firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
      this.addUserDataAfterRegistration()
      Firebase.auth().currentUser
        .sendEmailVerification()
        .then(()=>{
          //TODO: show confirmation message
          this.props.navigation.goBack();
        })
      })
      .catch((err) => {
        this.setState({
          errors: ErrorDic.get(err.code)
        })
    });
  }

  handleLoginButtonPress(){
    this.props.navigation.goBack();
  }

  addUserDataAfterRegistration(){
    Firebase.database()
      .ref('users/'+Firebase.auth().currentUser.uid)
      .set({
           name: this.state.name,
           isSkipper: this.state.isSkipper,
      }).catch((err)=> {
        errors: ErrorDic.get(err.code)
      });
  }
}

const registerstyles = StyleSheet.create({
  loginForm:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
  //  paddingLeft: 10,
    //paddingRight: 10,
    //paddingTop: 30,
    margin: 35,
  },
  bottom:{
    flexDirection:'column',
    // paddingTop: 60,
  },
  buttonRow:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  label:{
    fontSize: 16,
    color: Config.colors.primaryColorText,
    fontFamily: Config.fonts.mExtrabold,
    backgroundColor: 'transparent',
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
 buttonRowModal:{
   flexDirection:'row',
   alignItems: 'flex-end',
   justifyContent: 'space-between',
   marginTop: 5,
 },
  centerButton:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom: 20,
  },
});
