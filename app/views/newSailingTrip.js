import React, {Component} from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  Slider,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';

/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Firebase from 'friedensflotte/app/components/firebase';
import Button from 'friedensflotte/app/components/button';
import Config from 'friedensflotte/app/config/config';
import CustomModal from 'friedensflotte/app/components/modal';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation'

/* ------------ External Components --------- */
import TextfieldWithFloatingLabel from 'friedensflotte/app/components/texfield_with_floating_labels'
import * as Animatable from 'react-native-animatable';
import Dates from 'react-native-dates';
import moment from 'moment';

const horizontalMargin = 5;
const slideWidth = 140;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;
let width = Dimensions.get('window').width - 40; // minus margin


export default class NewSailingTrip extends Component {
  constructor(props) {
    super(props);
    this.renderSupervisor = this.renderSupervisor.bind(this);

    this.tripRef = null;
    this.userRef = null;

    this.state = {
      title: null,
      shipName: null,
      shipNumber: null,
      Source: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      value: this.props.value,
      crew: [],
      skipperName: "", //Skipper

      //datePicker
      date: null,
      focus: 'startDate',
      startDate: null,
      endDate: null,

      viewKey: Math.random(),
    };
    this.items = [];
  }

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Image style={{height:  (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor}}
             source={require('friedensflotte/app/img/icons/menu/add_turn_44.png')}/>
    )
  };

  componentDidMount() {
    this.tripRef = Firebase.database().ref('sailingTrips/');
    this.userRef = Firebase.database().ref('users/' + Firebase.auth().currentUser.uid);

    this.userRef.on('value', this.fetchSkipperName);

  }

  componentWillUnmount() {
    if (this.userRef) {
      this.userRef.off('value', this.fetchSkipperName);
    }
  }

  fetchSkipperName = (snapshot) => {
    const user = snapshot.val();
    this.setState({
      skipperName: user.name,
    });
  };

  //TODO: implement workflow to open modal (to delete data when switching windows)

  addTrip() {
    if (this.state.title !== '') {
      this.tripRef.push({
        uid: Firebase.auth().currentUser.uid,
        status: 'AKTIV',
        title: this.state.title,
        shipName: this.state.shipName,
        shipNumber: this.state.shipNumber,
        startDate: this.state.startDate.format('DD.MM.YYYY'),
        endDate: this.state.endDate.format('DD.MM.YYYY'),
        crew: [
          {name: this.state.skipperName, eMail: Firebase.auth().currentUser.email},
          {name: this.state.name1, eMail: this.state.eMail1},
          {name: this.state.name2, eMail: this.state.eMail2},
          {name: this.state.name3, eMail: this.state.eMail3},
          {name: this.state.name4, eMail: this.state.eMail4},
          {name: this.state.name5, eMail: this.state.eMail5},
        ]
      });
    }

    this.setState({
      title: null,
      shipName: null,
      shipNumber: null,
      Source: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      value: '',
      crew: [],
      skipperName: "", //Skipper

      //datePicker
      date: null,
      focus: 'startDate',
      startDate: null,
      endDate: null
    });
    this.items = [];
  }

  handleButtonPress() {
    this.state.viewKey= Math.random();
    this.refs['AddTripModal'].toggle();
  }

  render() {

/*    let content = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 100, width: 100}}
                 source={require('friedensflotte/app/img/icons/profile/info_large_56.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Dein neuer Törn ist noch nicht vollständig angelegt.
            Möchtest du wirklich fortfahren? Alle eingegebenen Daten werden dann gelöscht.
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => this.handleCloseTurnButtonPress()}>
            <Text style={newSailingTrip.leftAction}>FORTFAHREN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs['CustomModal'].toggle()
            }}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );*/

    let contentAddTrip = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 100, width: 100}}
                 source={require('friedensflotte/app/img/icons/turns/check_large_56.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Der Segeltörn wurde erfolgreich angelegt!
          </Text>
        </View>
        <View style={newSailingTrip.buttonRowCenter}>
          <TouchableOpacity
            onPress={() => {
              this.refs['AddTripModal'].toggle();
              this.props.navigation.navigate('SailingTrips')
            }}>
            <Text style={newSailingTrip.middleAction}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const onDatesChange = ({startDate, endDate, focusedInput}) =>
      this.setState({...this.state, focus: focusedInput}, () =>
        this.setState({...this.state, startDate, endDate})
      );

    const isDateBlocked = (date) =>
      date.isBefore(moment(), 'day');

    let contentDatePicker = (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            iconLeft={true}
            transparent={true}
            title={this.state.startDate ? this.state.startDate.format('DD.MM.YYYY') : 'von'}
            marginTop={30}
            width={120}
            fontSize={12}
            borderColor={Config.colors.secondaryColorText}
            borderWidth={0.5}
            color={Config.colors.thirdColorText}>
          </Button>
          <Text style={[newSailingTrip.picDateText, {marginTop: 40, paddingHorizontal: 10,}]}>-</Text>
          <Button
            iconLeft={true}
            transparent={true}
            title={this.state.endDate ? this.state.endDate.format('DD.MM.YYYY') : 'bis'}
            marginTop={30}
            width={120}
            fontSize={12}
            borderColor={Config.colors.secondaryColorText}
            borderWidth={0.5}
            color={Config.colors.thirdColorText}>
          </Button>
        </View>
        <View style={{width: width + 5, marginLeft: -37}}>
          <Dates
            onDatesChange={onDatesChange}
            isDateBlocked={isDateBlocked}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            focusedInput={this.state.focus}
            range
          />

        </View>
        <View style={bookings.buttonCenter}>
          <Button
            transparent={false} onPress={() => this.refs['DateModal'].toggle()}
            title={'FERTIG'}
            marginTop={30}
            fontSize={12}
            backgroundColor={Config.colors.buttonColorDark}
          />
        </View>
      </View>
    );

    return (
      <View>
        <TopNavigation title={'Neuer Törn'}/>
        <View style={newSailingTrip.tripContainer}>
          {/*<CustomModal content={contentAddTripValidate} ref={'AddTripValidateModal'}/>*/}
          <CustomModal content={contentAddTrip} ref={'AddTripModal'}/>
          <ScrollView>
            <View key = {this.state.viewKey}>
              <View>
                <View style={{flexDirection: "row", justifyContent: "center",}}>
                  <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Titel des Törns"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  textInputStyle={Config.colors.secondaryColorText}
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({title: text})}
                  width={width - 40}
                  /></View>
  
                <View style={{flexDirection: "row", justifyContent: "center",}}>
                  <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Schiffsname"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({shipName: text})}
                  width={width - 40}
                  /></View>
                <View style={{flexDirection: "row", justifyContent: "center",}}>
                  <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Schiffsnummer"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({shipNumber: text})}
                  width={width - 40}
                  /></View>
              </View>


              <CustomModal content={contentDatePicker} ref={'DateModal'}/>
              {this.state.startDate && this.state.endDate ? (<View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                  }}>
                  <Button
                    iconLeft={true}
                    transparent={true}
                    onPress={() => this.refs['DateModal'].toggle()}
                    title={this.state.startDate ? this.state.startDate.format('DD.MM.YYYY') : 'von'}
                    marginTop={30}
                    width={130}
                    fontSize={12}
                    borderColor={Config.colors.secondaryColorText}
                    borderWidth={0.5}
                    color={Config.colors.thirdColorText}/>
                  <Text style={[newSailingTrip.picDateText, {marginTop: 40,}]}>-</Text>
                  <Button
                    iconLeft={true}
                    transparent={true}
                    onPress={() => this.refs['DateModal'].toggle()}
                    title={this.state.endDate ? this.state.endDate.format('DD.MM.YYYY') : 'bis'}
                    marginTop={30}
                    width={130}
                    fontSize={12}
                    borderColor={Config.colors.secondaryColorText}
                    borderWidth={0.5}
                    color={Config.colors.thirdColorText}/>
                </View>
              ) : (<View style={styles.centerButton}>
                  <Button
                    transparent={false}
                    onPress={() => this.refs['DateModal'].toggle()}
                    title="Zeitraum wählen"
                    marginTop={30}
                    fontSize={18}
                    backgroundColor={Config.colors.primaryColorText}
                    borderColor={Config.colors.secondaryColorText}
                    color={Config.colors.secondaryColorText}
                    width={250}
                    customMarginLeft={25}/>
                </View>
              )}

              <View>
                <Text style={newSailingTrip.sliderText}>
                  Anzahl der Betreuer: {this.state.value && +this.state.value.toFixed(3) || 0}
                </Text>
                <Slider style={newSailingTrip.slider}
                        {...this.props}
                        minimumValue={0}
                        maximumValue={5}
                        value={0}
                        step={1}
                        minimumTrackTintColor={'#95989A'}
                        maximumTrackTintColor={'#95989A'}
                        thumbImage={require('friedensflotte/app/img/filledCircle.png')}
                        onValueChange={(value) => this.setState({value: value})}/>
              </View>

              <View>
                {this.renderSupervisor()}
              </View>
            </View>


            <View style={styles.centerButton}>
              <Button
                transparent={false}
                onPress={() => {
                  this.addTrip();
                  this.handleButtonPress()
                }}
                title="ANLEGEN"
                marginTop={30}
                fontSize={12}
                backgroundColor={Config.colors.buttonColorDark}

              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }


  renderSupervisor() {
    let component = [];

    for (let i = 0; i < this.state.value; i++) {
      component.push(
        <Animatable.View animation="fadeInUp" style={newSailingTrip.superVisorContainer} key={i}>
          <TextfieldWithFloatingLabel
            password={false}
            placeholder={"Name Betreuer " + (i + 1)}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            highlightColor="rgba(67,67,67,0.7)"
            textInputStyle={Config.colors.secondaryColorText}
            color={Config.colors.secondaryColorText}
            onChangeText={(text) => this.setState({["name" + (i + 1)]: text})}
            width={width - 40}
          />
          <TextfieldWithFloatingLabel
            password={false}
            placeholder={"E-Mail Betreuer " + (i + 1)}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            highlightColor="rgba(67,67,67,0.7)"
            color={Config.colors.secondaryColorText}
            onChangeText={(text) => this.setState({["eMail" + (i + 1)]: text})}
            width={width - 40}
          />
        </Animatable.View>
      )
    }
    return (
      component
    );
  }

}


const newSailingTrip = StyleSheet.create({

  tripContainer: {
    backgroundColor: Config.colors.primaryColorText,
    margin: 5,
    minHeight: Dimensions.get('window').height - 120,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  superVisorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  picDateText: {
    fontSize: 20,
    fontFamily: Config.fonts.mBold,
    color: Config.colors.secondaryColorText,
  },

  sliderText: {
    color: Config.colors.grayColorDark,
    fontSize: 18,
    marginTop: 20,
    fontFamily: Config.fonts.mBlack,
    fontWeight: 'bold',
    paddingLeft: 50,
  },
  slider: {
    marginLeft: 30,
    marginRight: 30,
  },
  leftAction: { //rightAction in styles.js
    color: Config.colors.thirdColorText,
    textAlign: 'left',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },

  buttonRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  middleAction: {
    color: Config.colors.thirdColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },
});

const bookings = StyleSheet.create({
  bookingsContainer: {
    flex: 1,
    backgroundColor: Config.colors.mainBackgroundColor,
    margin: 10,
    padding: 10,
  },
  infotext: {
    color: Config.colors.primaryColor,
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
    marginBottom: 10,
  },
  editlabel: {
    fontSize: 14,
    fontFamily: Config.fonts.mBold,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    paddingBottom: 30
  },
  info: {
    marginLeft: 30,
    marginRight: 30,
  },
  centerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alignImages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginTop: 20,
  },
  imgLabel: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: Config.colors.grayColorLight,
    fontFamily: Config.fonts.mBold,
    fontSize: 12,
    marginTop: 30,
  },
});