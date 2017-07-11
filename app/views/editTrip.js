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
  TextInput,
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
import Icon from 'react-native-vector-icons/FontAwesome';
import TextfieldWithFloatingLabel from 'friedensflotte/app/components/texfield_with_floating_labels'
import * as Animatable from 'react-native-animatable';
import Dates from 'react-native-dates';
import moment from 'moment';

const horizontalMargin = 5;
const slideWidth = 140;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;
let width = Dimensions.get('window').width - 40; // minus margin


export default class EditTrip extends Component {
  constructor(props) {
    super(props);
    this.renderSupervisor = this.renderSupervisor.bind(this);
    this.tripID = this.props.navigation.state.params.tripID;
    this.tripRef = null;

    this.state = {
      title: '',
      shipName: '',
      shipNumber: '',
      Source: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      crew: [],
      value: null,
      skipperName: "", //Skipper
      date: null,
      focus: 'startDate',
      startDate: null,
      endDate: null
    };
    this.items = [];
  }

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Image style={{height: (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor}} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')}/>
    )
  };

  componentDidMount() {
    //Fetch tripSource
    this.tripRef = Firebase.database().ref('sailingTrips/' + this.tripID);
    this.tripRef.on('value', this.fetchTripSource);
  }

  componentWillUnmount() {
    if (this.tripRef) {
      this.tripRef.off('value', this.fetchTripSource);
    }
  }

  fetchTripSource = (dataSnapshot) => {
    this.items.push(dataSnapshot.val());
    this.setState({
      Source: this.state.Source.cloneWithRows(this.items),
      status: dataSnapshot.child("status").val(),
      title: dataSnapshot.child("title").val(),
      shipName: dataSnapshot.child("shipName").val(),
      shipNumber: dataSnapshot.child("shipNumber").val(),
      crew: dataSnapshot.child("crew").val(),
      //datePicker
      date: null,
      startDate: dataSnapshot.child("startDate").val(),
      endDate: dataSnapshot.child("endDate").val(),
      focus: 'startDate',

    });
    this.setState({
      value: this.state.crew.length,
      sliderValue: this.state.crew.length - 1
    });

    //Push crewArray to maximum of 5 placeholder -> fixes (onChangeText=> this.state.crew.push({name: text}); in render Supervisor
    let crewLength = this.state.crew.length;
    let test = 5 - crewLength;
    for (let i = 0; i < test; i++) {
      this.state.crew.push({name: '', eMail: ''});
    }
  }

  updateTrip() {
    this.tripRef.update({
      status: this.state.status,
      title: this.state.title,
      shipName: this.state.shipName,
      shipNumber: this.state.shipNumber,
    });

    let refreshArr = [];
    for (let i = 0; i < this.state.value; i++) {
      refreshArr.push(
        {name: this.state.crew[i].name, eMail: this.state.crew[i].eMail}
      )
    }
    Firebase.database().ref('sailingTrips/' + this.tripID + '/crew').set(refreshArr)
      .then(function () {
        console.log('Crew-Update succeeded');
      })
      .catch(function (error) {
        console.log('Crew-Update failed');
      });


    if (typeof this.state.startDate !== 'string') {
      this.tripRef.update({
        startDate: this.state.startDate.format('DD.MM.YYYY'),
        endDate: this.state.endDate.format('DD.MM.YYYY'),
      });
    }
  }

  render() {
    const {navigate, goBack} = this.props.navigation;

    //TODO Validate Form
/*    let content = (
      <View>
        <View style={styles.modalIcon}>
          <Icon name="exclamation-circle" size={50} color={Config.colors.thirdColorText}/>
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
            <Text style={editTrip.leftAction}>FORTFAHREN</Text>
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

    const onDatesChange =
      ({startDate, endDate, focusedInput}) => this.setState({...this.state, focus: focusedInput},
        () => this.setState({
          ...this.state,
          startDate,
          endDate
        }),
      );

    const isDateBlocked = (date) =>
      date.isBefore(moment(), 'day');

    let contentDatePicker = (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Button
            iconLeft={true}
            transparent={true}
            title={typeof this.state.startDate !== 'string' && this.state.startDate ? this.state.startDate.format('DD.MM.YYYY') : this.state.startDate}
            marginTop={30}
            width={130}
            fontSize={12}
            borderColor={Config.colors.secondaryColorText}
            borderWidth={0.5}
            color={Config.colors.thirdColorText}>
          </Button>
          <Text style={[editTrip.picDateText, {marginTop: 40, paddingHorizontal: 10,}]}>-</Text>
          <Button
            iconLeft={true}
            transparent={true}
            title={typeof this.state.endDate !== 'string' && this.state.endDate ? this.state.endDate.format('DD.MM.YYYY') : this.state.endDate}
            marginTop={30}
            width={130}
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
            startDate={typeof this.state.startDate !== 'string' ? this.state.startDate : null}
            endDate={typeof this.state.endDate !== 'string' ? this.state.startDate : null}
            focusedInput={this.state.focus}
            range
          />

        </View>
        <View style={editTrip.buttonCenter}>
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
        <TopNavigation
          leftButton={
            <Icon name="arrow-left" size={25} color={Config.colors.primaryColorText}
                            onPress={() => this.props.navigation.goBack()}/>}
          title={'Törn bearbeiten'}
          rightButton={<Icon name="check" size={25} color={Config.colors.primaryColorText} onPress={() => {
            this.updateTrip();
            this.props.navigation.goBack()
          }}/>}/>
        <View style={editTrip.tripContainer}>
          {/*<CustomModal content={contentRoleChange} ref={'RoleChangeModal'}/>*/}
          <ScrollView>
            <View>
              <View style={[editTrip.buttonRowCenter, {marginBottom: 20}]}>
                <Button
                  transparent={false}
                  onPress={() => this.setState({status: "AKTIV"})}
                  title={'AKTIV'}
                  marginTop={10}
                  marginRight={-20}
                  fontSize={12}
                  borderColor={Config.colors.grayColorLighter}
                  borderWidth={0.5}
                  width={150}
                  color={this.state.status === "AKTIV" ? Config.colors.primaryColorText : Config.colors.secondaryColorText}
                  backgroundColor={this.state.status === "AKTIV" ? Config.colors.fontGreenColor : Config.colors.disabledInactiveColorText }/>
                <Button
                  transparent={false}
                  onPress={() => this.setState({status: "INAKTIV"})}
                  title={'INAKTIV'}
                  marginTop={10}
                  fontSize={12}
                  width={150}
                  borderColor={Config.colors.grayColorLighter}
                  borderWidth={0.5}
                  color={this.state.status === "INAKTIV" ? Config.colors.primaryColorText : Config.colors.secondaryColorText}
                  backgroundColor={this.state.status === "INAKTIV" ? Config.colors.warningColor : Config.colors.disabledInactiveColorText }/>
              </View>
              <View style={editTrip.refactorMe}>
                <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Titel des Törns"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  textInputStyle={Config.colors.secondaryColorText}
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({title: text})}
                  value={this.state.title}
                  width={width - 40}
                />
                <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Schiffsname"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({shipName: text})}
                  value={this.state.shipName}
                  width={width - 40}
                />
                <TextfieldWithFloatingLabel
                  password={false}
                  placeholder={"Schiffsnummer"}
                  placeholderTextColor={Config.colors.secondaryColorText}
                  tintColor={Config.colors.secondaryColorText}
                  highlightColor="rgba(67,67,67,0.7)"
                  color={Config.colors.secondaryColorText}
                  onChangeText={(text) => this.setState({shipNumber: text})}
                  value={this.state.shipNumber}
                  width={width - 40}
                />
              </View>


              <CustomModal content={contentDatePicker} ref={'DateModal'}/>
              {this.state.startDate && this.state.endDate ? (<View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}>
                  <Button
                    iconLeft={true}
                    transparent={true}
                    onPress={() => this.refs['DateModal'].toggle()}
                    title={typeof this.state.startDate !== 'string' && this.state.endDate ? this.state.startDate.format('DD.MM.YYYY') : this.state.startDate}
                    marginTop={30}
                    width={120}
                    fontSize={12}
                    borderColor={Config.colors.secondaryColorText}
                    borderWidth={0.5}
                    color={Config.colors.thirdColorText}/>
                  <Text style={[editTrip.picDateText, {marginTop: 40,}]}>-</Text>
                  <Button
                    iconLeft={true}
                    transparent={true}
                    onPress={() => this.refs['DateModal'].toggle()}
                    title={typeof this.state.endDate !== 'string' && this.state.endDate ? this.state.endDate.format('DD.MM.YYYY') : this.state.endDate}
                    marginTop={30}
                    width={120}
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
                <Text style={editTrip.sliderText}>
                  Anzahl der Betreuer: {this.state.sliderValue}
                </Text>
                <Slider style={editTrip.slider}
                        {...this.props}
                        minimumValue={0}
                        maximumValue={5}
                        value={this.state.sliderValue}
                        step={1}
                        minimumTrackTintColor={'#95989A'}
                        maximumTrackTintColor={'#95989A'}
                        thumbImage={require('friedensflotte/app/img/filledCircle.png')}
                        onValueChange={(value) => this.setState({sliderValue: value, value: value + 1})}/>
              </View>

              <View>
                {this.renderSupervisor()}
              </View>
            </View>


            <View style={styles.centerButton}>
              <Button
                transparent={false}
                onPress={() => {
                  this.updateTrip();
                  this.props.navigation.goBack()
                }}
                title="SPEICHERN"
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

    for (let i = 1; i < this.state.value; i++) { //1 cz do not show Skipper (don't edit Skipper)!
      component.push(
        <Animatable.View animation="fadeInUp" style={[editTrip.refactorMe, {marginBottom: 30}]} key={i}>
          <TextfieldWithFloatingLabel
            password={false}
            placeholder={"Name Betreuer " + (i)}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            highlightColor="rgba(67,67,67,0.7)"
            textInputStyle={Config.colors.secondaryColorText}
            color={Config.colors.secondaryColorText}
            width={width - 40}
            onChangeText={(text) => {

              if (typeof this.state.crew[i] === 'object') {
                var stateCopy = Object.assign({}, this.state);
                this.state.crew[i].name = text;
                this.setState(stateCopy);
              } else {
                //this.state.crew.push({name: text});
              }
            }}
            //value={typeof this.state.crew[i] === 'object' ? this.state.crew[i].name : ''}
            value={this.state.crew[i].name}
          />
          <TextfieldWithFloatingLabel
            password={false}
            placeholder={"E-Mail Betreuer " + (i)}
            placeholderTextColor={Config.colors.secondaryColorText}
            tintColor={Config.colors.secondaryColorText}
            highlightColor="rgba(67,67,67,0.7)"
            color={Config.colors.secondaryColorText}
            width={width - 40}
            onChangeText={(text) => {
              if (typeof this.state.crew[i] === 'object') {
                var stateCopy = Object.assign({}, this.state);
                this.state.crew[i].eMail = text;
                this.setState(stateCopy);
              } else {
                //this.state.crew.push({eMail: text});
              }
            }}
            //value={typeof this.state.crew[i] === 'object' ? this.state.crew[i].eMail : ''}
            value={this.state.crew[i].eMail}
          />
        </Animatable.View>
      )
    }
    return (
      component
    );
  }

}


const editTrip = StyleSheet.create({

  tripContainer: {
    backgroundColor: Config.colors.primaryColorText,
    margin: 5,
    minHeight: Dimensions.get('window').height - 120,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refactorMe: {
    marginLeft: 27,
  },
  picDateText: {
    fontSize: 20,
    fontFamily: Config.fonts.mBold,
    color: Config.colors.secondaryColorText,
  },

  sliderText: {
    color: Config.colors.grayColorDark,
    fontSize: 18,
    marginTop: 40,
    fontFamily: Config.fonts.mBlack,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slider: {
    marginHorizontal: 30
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
