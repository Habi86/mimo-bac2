import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Button from 'friedensflotte/app/components/button';
import TextfieldWithFloatingLabel from 'friedensflotte/app/components/texfield_with_floating_labels'
import Textfield from 'friedensflotte/app/components/textfield'
import Config from 'friedensflotte/app/config/config';
import Firebase from 'friedensflotte/app/components/firebase';
import MainNavigation from 'friedensflotte/app/views/mainNavigation'
import ErrorDic from 'friedensflotte/app/components/errordict';
import CustomModal from 'friedensflotte/app/components/modal';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation';
/* ------------ External Components --------- */
import {Item} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

let width = Dimensions.get('window').width - 40; // minus margin
const eyeIconOpen = (<Image style={styles.pwIconsBlack} source={require('friedensflotte/app/img/icons/login/password_visible_20.png')}/>);
const eyeIconClosed = (<Image style={styles.pwIconsBlack} source={require('friedensflotte/app/img/icons/login/password_hidden_20.png')}/>);

export default class Profile extends Component {
  constructor(){
    super();
    //const tripRef = Firebase.database().ref('sailingTrips/');
  //  this.tripRef = tripRef;
    this.tripRef = null;
    this.ref = null;


    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isSkipper: "",
      errors: "",
      isEdit: false,
      pwFieldClicked: false,
      allTurnsClosed: true,
      showPassword: true,
    }
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image style={{height: (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor}} source={require('friedensflotte/app/img/icons/menu/profile_44.png')}/>
    )
  };

  componentDidMount() {
    this.tripRef = Firebase.database().ref('sailingTrips/').orderByChild('status').equalTo('AKTIV');
    this.ref = Firebase.database().ref('users/'+ Firebase.auth().currentUser.uid);

    this.ref.on('value', this.setUserData);
    this.tripRef.on('value', this.checkIfAllTurnsAreClosed);
  }

  componentWillUnmount() {
    if (this.ref) {
      this.ref.off('value', this.setUserData);
    }
    if (this.tripRef) {
      this.tripRef.off('value', this.checkIfAllTurnsAreClosed);
    }
  }

  setUserData = (snapshot) => {
    const user = snapshot.val();
    const userAuthData = Firebase.auth().currentUser;
    this.setState({
      name: user.name,
      isSkipper: user.isSkipper,
      email: userAuthData.email,
      password: userAuthData.password,
      passwordConfirmation: userAuthData.passwordConfirmation,
      passwordOld: "",
      resetPWsuccess: "",
    });
  }

  checkIfAllTurnsAreClosed = (dataSnapshot) => {
    let user = Firebase.auth().currentUser;
    dataSnapshot.forEach((childSnapshot) => {
      if(childSnapshot.val().uid == user.uid){
        this.setState({allTurnsClosed: false});
      }
      childSnapshot.val().crew.map((crewMember) => {
        if(crewMember.eMail == user.email){
          this.setState({allTurnsClosed: false});
        }
      });
    });
  }

  render() {
    let content = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 100, width: 100}} source={require('friedensflotte/app/img/icons/profile/delete_large_56@1x.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Möchtest du dein Profil wirklich löschen?
            Alle deine Daten gehen dabei unwiderrruflich verloren.
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>  this.handleDeleteButtonPress()}>
            <Text style={profile.leftAction}>LÖSCHEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {this.refs['CustomModal'].toggle()}}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    let contentRoleChange = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 100, width: 100}} source={require('friedensflotte/app/img/icons/profile/info_large_56.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Bevor du deine Rolle wechseln kannst müssen alle Törns,
            an denen du beteiligt bist, abgeschlossen werden.
          </Text>
        </View>
        <View style={profile.buttonRowCenter}>
          <TouchableOpacity
            onPress={() => this.refs['RoleChangeModal'].toggle()}>
            <Text style={profile.middleAction}>VERSTANDEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    let contentPWReset = (
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
          <Text style={profile.email}>{this.state.email}</Text>
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
            keyboardType={'email-address'}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            highlightColor={Config.colors.secondaryColorText}
            color={Config.colors.secondaryColorText}/>
          <Text style={{color: Config.colors.thirdColorText}}>{this.state.resetPWsuccess}</Text>
        </View>
      }
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>  this.handlePWResetPress()}>
            <Text style={profile.leftAction}>SENDEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.refs['PWResetModal'].toggle()}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
      </View>
    </View>
    );

    return (
      <View>
        <TopNavigation title={'Mein Profil'}/>
        <ScrollView>
              <View style={profile.profileContainer}>
                <CustomModal content={content} ref={'CustomModal'}/>
                <CustomModal content={contentRoleChange} ref={'RoleChangeModal'}/>
                <CustomModal content={contentPWReset} ref={'PWResetModal'}/>
                <View style={profile.buttons}>
                  {this.state.isEdit ? null : <TouchableOpacity
                    onPress={() =>  this.handleEditButtonPress()}>
                    <Text style={styles.textDark}>BEARBEITEN</Text>
                  </TouchableOpacity>}
                  {this.state.isEdit ? null : <TouchableOpacity
                    onPress={() => {this.refs['CustomModal'].toggle()}}>
                    <Text style={styles.textDark}>LÖSCHEN</Text>
                  </TouchableOpacity>}
                </View>
                <View style={profile.icon}>
                  <Image style={{height: 100, width: 100}} source={require('friedensflotte/app/img/icons/profile/profile_72.png')}/>
                  {this.state.isEdit && this.state.allTurnsClosed ? (
                    <View style={profile.buttonRow}>
                      <Button
                        transparent={true}
                        backgroundColor={this.state.isSkipper && Config.colors.selectedButtonColor}
                        onPress={()=> this.setState({isSkipper: true})}
                        title="SKIPPER"
                        borderWidth={0.5}
                        width={130}
                        borderColor={Config.colors.secondaryColorText}
                        color={Config.colors.secondaryColorText}
                        marginRight={10}
                        />
                      <Button
                        transparent={true}
                        backgroundColor={!this.state.isSkipper && Config.colors.selectedButtonColor}
                        onPress={()=> this.setState({isSkipper: false})}
                        title="BETREUER"
                        borderWidth={0.5}
                        width={130}
                        borderColor={Config.colors.secondaryColorText}
                        color={Config.colors.secondaryColorText}
                        />
                    </View>
                  ) : (
                    <Text style={profile.role}>{this.state.isSkipper ? 'SKIPPER' : 'BETREUER'}</Text>
                  )}
                </View>
                <View style={profile.info}>
                  {this.state.isEdit ? (
                    <TextfieldWithFloatingLabel
                      password={false}
                      floatingLabelEnabled={false}
                      placeholder={'Vorname, Nachname'}
                      defaultValue={this.state.name}
                      onChangeText={(value) => this.setState({name: value})}
                      placeholderTextColor={Config.colors.secondaryColorText}
                      tintColor={Config.colors.secondaryColorText}
                      highlightColor={Config.colors.secondaryColorText}
                      color={Config.colors.secondaryColorText}
                      width={width - 40}
                      value={this.state.name}
                    />
                  ) : (
                    <View>
                      <Text style={profile.editlabel}>Vorname, Nachname</Text>
                      <Text style={profile.infotext}>{this.state.name}</Text>
                    </View>
                  )}
                  {this.state.isEdit ? (
                    <TextfieldWithFloatingLabel
                      password={false}
                      floatingLabelEnabled={false}
                      placeholder={'E-Mail-Adresse'}
                      defaultValue={this.state.email}
                      onChangeText={(value) => this.setState({email: value})}
                      keyboardType={'email-address'}
                      placeholderTextColor={Config.colors.secondaryColorText}
                      tintColor={Config.colors.secondaryColorText}
                      highlightColor={Config.colors.secondaryColorText}
                      color={Config.colors.secondaryColorText}
                      width={width - 40}
                      value={this.state.email}
                    />
                  ) : (
                    <View>
                      <Text style={profile.editlabel}>E-Mail-Adresse</Text>
                      <Text style={profile.infotext}>{this.state.email}</Text>
                    </View>
                  )}
                 {this.state.isEdit ? (
                   <View>
                     <TextfieldWithFloatingLabel
                       password={true}
                       floatingLabelEnabled={false}
                       placeholder={'Altes Passwort'}
                       onChangeText={(value) => this.setState({passwordOld: value})}
                       placeholderTextColor={Config.colors.secondaryColorText}
                       tintColor={Config.colors.secondaryColorText}
                       highlightColor={Config.colors.secondaryColorText}
                       color={Config.colors.secondaryColorText}
                       onFocus={() => this.setState({pwFieldClicked: true})}
                       width={width - 40}
                     />
                     {this.state.pwFieldClicked ? (
                       <Animatable.View animation="fadeInUp">
                        <Item style={{borderBottomWidth: 0}}>
                         <TextfieldWithFloatingLabel
                             password={this.state.showPassword}
                             placeholder={'Neues Passwort'}
                             onChangeText={(value) => this.setState({password: value})}
                             placeholderTextColor={Config.colors.secondaryColorText}
                             tintColor={Config.colors.secondaryColorText}
                             highlightColor={Config.colors.secondaryColorText}
                             color={Config.colors.secondaryColorText}
                             width={width - 40}
                         />
                          <TouchableOpacity onPress={()=> this.setState({showPassword: !this.state.showPassword})}>
                            {(this.state.showPassword) ? eyeIconClosed : eyeIconOpen}
                          </TouchableOpacity>
                         </Item>
                           <TextfieldWithFloatingLabel
                             password={true}
                             placeholder={'Neues PW bestätigen'}
                             onChangeText={(value) => this.setState({passwordConfirmation: value})}
                             placeholderTextColor={Config.colors.secondaryColorText}
                             tintColor={Config.colors.secondaryColorText}
                             highlightColor={Config.colors.secondaryColorText}
                             color={Config.colors.secondaryColorText}
                             width={width - 40}
                           />
                             <TouchableOpacity
                               style={profile.centerButton}
                               onPress={() => this.refs['PWResetModal'].toggle()}>
                               <Text style={profile.editlabel}>Passwort vergessen?</Text>
                             </TouchableOpacity>
                       </Animatable.View>
                    ): null}
                    </View>
                   )
                   : (
                     <View>
                     <Text style={profile.editlabel}>Passwort</Text>
                     <Text style={profile.infotext}>•••••••</Text>
                     <Text style={styles.error}>{this.state.errors}</Text>
                     <Text style={{color: Config.colors.thirdColorText}}>{this.state.resetPWsuccess}</Text>
                     </View>
                   )}
                </View>
                <View style={styles.centerButton}>
                  <Button
                    transparent={false} onPress={this.state.isEdit ? ()=> this.handleUpdateButtonPress() : ()=> this.handleLogoutButtonPress() }
                    title={this.state.isEdit ? 'SPEICHERN' : 'ABMELDEN'}
                    marginTop={10}
                    fontSize={12}
                    backgroundColor={Config.colors.buttonColorDark}
                    />
                </View>
              </View>
        </ScrollView>
      </View>
    );
  }

  changeIcon(){
    console.log('clicked Icon');
    return eyeIconOpen;
  }

  handleLogoutButtonPress(){
    Firebase.auth().signOut()
    .then(() => {
      this.props.navigation.goBack();
    })
    .catch((err) => {
      this.setState({
        errors: ErrorDic.get(err.code)
      })
    });
  }

  handleEditButtonPress(){
    this.setState({isEdit: true});
    //TODO: implement RoleChangeModal if role should be changed (check if all törns are closed)
    this.refs['RoleChangeModal'].toggle();
  }

  handleUpdateButtonPress(){
    this.setState({isEdit: false});
    this.setState({pwFieldClicked: false});
    this.updateUserData();
  }

  reauthenticateUser(userAuthData){
    let credential = Firebase.auth.EmailAuthProvider.credential(userAuthData.email, userAuthData.password);
    Firebase.auth().currentUser.reauthenticateWithCredential(credential)
    .then(() => {
      console.log('reauthenticated');
    })
    .catch((err)=> {
      this.setState({
        errors: ErrorDic.get(err.code)
      })
   });
  }

  updateUserData(){
    let userAuthData = Firebase.auth().currentUser;
    console.log(userAuthData);
    userAuthData.updateEmail(this.state.email)
    .then(() => {
      userAuthData.updatePassword(this.state.password)
    })
    .then(() => {
      Firebase.database().ref('users/'+userAuthData.uid)
      .set({
        name: this.state.name,
        isSkipper: this.state.isSkipper,
      })
    })
    .catch((err)=> {
      this.reauthenticateUser(userAuthData);
      this.setState({
        errors: ErrorDic.get(err.code)
      })
    });
  }

  handleDeleteButtonPress(){
    Firebase.auth().currentUser
    .delete()
    .then(() => {
      console.log('User deleted successfully');
      this.props.navigation.goBack();
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
        this.refs['PWResetModal'].toggle();
      })
      .catch((err) => {
        this.setState({
          errors: ErrorDic.get(err.code)
        })
      });
    }
}

const profile = StyleSheet.create({
  profileContainer:{
    flex:1,
    backgroundColor: Config.colors.primaryColorText,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },
  buttons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 10,
  },
  hide:{
    display: 'none',
  },
  icon:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  role:{
    color: Config.colors.thirdColorText,
    fontFamily: Config.fonts.mExtrabold,
    fontSize: 16,
    fontWeight: 'normal'
  },
  info:{
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  label:{
    color: Config.colors.secondaryColorText,
    fontFamily: Config.fonts.mBold,
    fontSize: 14,
  },
  editlabel:{
    fontSize: 14,
    fontFamily: Config.fonts.mBold,
    paddingLeft: 20,
  },
  infotext:{
    color: Config.colors.secondaryColorText,
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  buttonRow:{
    flexDirection:'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonRowCenter:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  leftAction:{
    color: Config.colors.warningColor,
    textAlign: 'left',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },
  middleAction:{
    color: Config.colors.thirdColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },
  email:{
    color: Config.colors.secondaryColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mBoldItalic,
    fontSize: 26,
  },
  centerButton:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom: 5,
  },
});
