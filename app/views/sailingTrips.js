import React, {Component} from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Firebase from 'friedensflotte/app/components/firebase';
import Config from 'friedensflotte/app/config/config';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation'
import CustomModal from 'friedensflotte/app/components/modal';
import Button from 'friedensflotte/app/components/button';
/* ------------ External Components --------- */
import Icon from 'react-native-vector-icons/FontAwesome';
import {Container, Content, Card, CardItem, Body} from 'native-base';
import Swipeout from 'react-native-swipeout'

export default class SailingTrips extends Component {
  constructor(props) {
    super(props);
    this.tripRef = null;
    //const rootBookingRef = Firebase.database().ref('sailingTrips/' + tripID + "/bookings");
    //this.ref = ref;
    //this.rootBookingRef = rootTripRef;
    this.tripExists = false;

    this.state = {
      isEuro: true,
      items: [],
    };

    this.closeTrip = this.closeTrip.bind(this);
    this.deleteTrip = this.deleteTrip.bind(this);

  }

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Image style={{
        height: (Platform.OS === "android") ? 30 : 40,
        width: (Platform.OS === "android") ? 30 : 40,
        tintColor: tintColor,
        paddingTop: -30
      }} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')}/>
    ),
    // tabBarLabel: ({ tintColor }) => (
    //   <Image style={{height: 110, width: 100, tintColor: this.tintColor, paddingBottom: 100}} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')}/>
    // )
  };

  componentDidMount() {
    this.tripRef = Firebase.database().ref('sailingTrips/');
    //subscribe to updates
    this.tripRef.on('child_added', this.child_added);
    this.tripRef.on('child_removed', this.child_removed);
    this.tripRef.on('child_changed', this.child_changed);
  }

  componentWillUnmount() {
    //bind to keep reference
    if (this.tripRef) {
      this.tripRef.off('child_added', this.child_added);
      this.tripRef.off('child_removed', this.child_removed);
      this.tripRef.off('child_changed', this.child_changed);
    }
  }

  child_added = (dataSnapshot) => {
    if (dataSnapshot.child('title').val()) {
      let crewArr = dataSnapshot.child('crew').val();
      let userInCrew = crewArr.find(x => x.eMail === Firebase.auth().currentUser.email);
      if (userInCrew) {

        let updatedItems = this.state.items;
        updatedItems.push({tripID: dataSnapshot.key, data: dataSnapshot.val()});
        this.setState({items: updatedItems});
      }
    }
  }

  child_changed = (dataSnapshot) => {
    if (dataSnapshot.child('title').val()) {
      let crewArr = dataSnapshot.child('crew').val();
      let userInCrew = crewArr.find(x => x.eMail === Firebase.auth().currentUser.email);
      if (userInCrew) {

        let updatedItems = this.state.items.map((item) => {
          if (item.tripID == dataSnapshot.key) {
            item.data = dataSnapshot.val();
          }
          return item;
        })
        this.setState({items: updatedItems});
      }
    }
  }

  child_removed = (dataSnapshot) => {
    if (dataSnapshot.child('title').val()) {
      let crewArr = dataSnapshot.child('crew').val();
      let userInCrew = crewArr.find(x => x.eMail === Firebase.auth().currentUser.email);
      if (userInCrew) {
        this.setState({items: this.state.items.filter((x) => x.tripID !== dataSnapshot.key)});
      }
    }
  }

  closeTrip(tripID) {
    const tripRef = Firebase.database().ref('sailingTrips/' + tripID);
    tripRef.child('status').set('INAKTIV')
      .then(function () {
        console.log('Update succeeded');
      })
      .catch(function (error) {
        console.log('Update failed');
      });
  }


  deleteTrip(tripID) {
    let tripRef = Firebase.database().ref('sailingTrips/' + tripID);
    tripRef.remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message)
      });
  }

  render() {
    return (
      <View style={{backgroundColor: Config.colors.mainBackgroundColor, height: Dimensions.get('window').height}}>
        <TopNavigation
          title={'Meine Törns'}
          rightButton={
            (Platform.OS === 'ios') ? <TouchableOpacity style={SailingTrip.iconsRight}
                                                        onPress={() => this.state.isEuro ? this.setState({isEuro: false}) : this.setState({isEuro: true})}>
              <Image
                source={require('friedensflotte/app/img/icons/booking_types/mimo_type_icons_geldwechsel_50@1x.png')}
                style={{tintColor: Config.colors.disabledInactiveColorText}}/>
            </TouchableOpacity>
              : <Icon name="money" size={25} color={Config.colors.primaryColorText}
                      onPress={() => this.state.isEuro ? this.setState({isEuro: false}) : this.setState({isEuro: true})}/>
          }
        />
        <ScrollView>
          <View style={styles.card}>
            {(this.state.items.length != 0) ?
              <FlatList
                testID = "ListOfTrips"
                extraData={this.state.isEuro}
                keyExtractor={(item, index) => item.tripID}
                data={this.state.items}
                renderItem={ (item) => this.renderItem(item)}/>
              :
              <Card style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 10,
                borderColor: '#F7F7F7',
                backgroundColor: "#F7F7F7",
                borderWidth: 0,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowRadius: 0,
                shadowOpacity: 0,
                elevation: 0,
              }}>
                <CardItem style={{
                  flex: 0.9,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  backgroundColor: "#F7F7F7"
                }}>
                  <CardItem style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 5,
                    width: 70,
                    backgroundColor: Config.colors.grayColorLighter
                  }}/>
                  <View
                    style={{marginBottom: 10, width: 90, height: 8, backgroundColor: Config.colors.grayColorLighter}}/>
                  <View style={{
                    marginBottom: 10,
                    width: 160,
                    height: 20,
                    backgroundColor: Config.colors.grayColorLighter
                  }}/>
                  <View style={{
                    marginBottom: 10,
                    width: 120,
                    height: 15,
                    backgroundColor: Config.colors.grayColorLighter
                  }}/>
                  <View style={{width: 90, height: 10, backgroundColor: Config.colors.grayColorLighter}}/>
                </CardItem>
                <CardItem style={{
                  flex: 0.5,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: "#F7F7F7",
                  alignItems: 'center',
                  borderLeftWidth: 0.5,
                  borderLeftColor: Config.colors.grayColorLighter,
                  marginTop: 10,
                  marginBottom: 10
                }}>
                  <Text
                    style={{color: Config.colors.grayColorLighter, fontFamily: Config.fonts.mExtrabold, fontSize: 30}}>EURO</Text>
                </CardItem>

              </Card>
            }
          </View>
        </ScrollView>
      </View>

    );
  }

  renderItem({item}) {
    const {navigate, goBack} = this.props.navigation;

    let currentEUR = 0;
    let currentHRK = 0;

    //get amount of all bookings
    for (var key in item.data.bookings) {
      if (item.data.bookings.hasOwnProperty(key)) {
        let booking = item.data.bookings[key];
        if (booking.currency == "EUR") {
          currentEUR += booking.amount;
        }
        else {
          currentHRK += booking.amount;
        }
      }
    }
    // Buttons
    let swipeoutBtnClose = [{
      text: <Image style={{height: 30, width: 30}}
                   source={require('friedensflotte/app/img/icons/turns/lock_turn_26.png')}/>,
      backgroundColor: Config.colors.fontGreenColor,
      onPress: () => this.closeTrip(item.tripID),
    }];
    let swipeoutBtnDelete = [{
      text: <Image style={{height: 30, width: 30}}
                   source={require('friedensflotte/app/img/icons/turns/delete_turn_26.png')}/>,
      backgroundColor: Config.colors.warningColor,
      onPress: () => this.deleteTrip(item.tripID),
      //onPress: () => this.refs['contentSwipeDelete'].toggle()
    }];

/*    let contentSwipeDelete = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 100, width: 100}} source={require('friedensflotte/app/img/icons/turns/delete_large_56.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Möchtest du diesen Segeltörn wirklich löschen?
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => this.deleteTrip(item.tripID)}>
            <Text style={SailingTrips.leftAction}>LÖSCHEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs['contentSwipeDelete'].toggle()
            }}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );*/

    return (
      <Swipeout left={swipeoutBtnClose} right={swipeoutBtnDelete} autoClose={true}
                style={{backgroundColor: Config.colors.primaryColorText, marginBottom: 10,}}>
        {/*<CustomModal content={contentSwipeDelete} ref={'contentSwipeDelete'}/>*/}
        <TouchableOpacity
          onPress={() => navigate('DetailView', {tripID: item.tripID, title: item.data.title})}>
          <Card style={{
            flex: 1,
            flexDirection: 'row',
            paddingTop: 10,
            paddingBottom: 10,
            borderColor: '#F7F7F7',
            backgroundColor: "#F7F7F7",
            borderWidth: 0,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 0,
            shadowOpacity: 0,
            elevation: 0,
          }}>
            <CardItem style={{
              flex: 0.9,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              backgroundColor: Config.colors.primaryColorText
            }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={SailingTrip.statusText}>STATUS: </Text>{item.data.status === "AKTIV" ? (
                <Text style={SailingTrip.statusActiv}>{item.data.status}</Text>) : (
                <Text style={SailingTrip.statusInactiv}>{item.data.status}</Text>)}
              </View>
              <Text style={SailingTrip.title}>{item.data.title}</Text>
              <Text style={SailingTrip.shipNumber}>{item.data.shipName} / {item.data.shipNumber}</Text>
              <Text style={SailingTrip.date}>{item.data.startDate} - {item.data.endDate}</Text>

            </CardItem>
            <CardItem style={{
              flex: 0.6,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundColor: "#F7F7F7",
              alignItems: 'center',
              borderLeftWidth: 0.5,
              borderLeftColor: Config.colors.grayColorLighter,
              marginTop: 10,
              marginBottom: 10
            }}>
              {this.state.isEuro ? <Text
                style={[SailingTrip.totalValueBasic, this.getStyleForAmount(currentEUR)]}>{currentEUR > 0 ? "+" : (currentEUR > 0) && "-"}{Math.round(currentEUR)}
                €</Text>
                : <Text
                  style={[SailingTrip.totalValueBasic, this.getStyleForAmount(currentHRK)]}>{currentHRK > 0 ? "+" : (currentHRK > 0) && "-"}{Math.round(currentHRK)}
                  HRK</Text>}
            </CardItem>
          </Card>
        </TouchableOpacity>
      </Swipeout>
    );
  }

  getStyleForAmount(currentValue) {
    if (currentValue < 0) {
      return SailingTrip.totalValueRed;
    }
    else if (currentValue > 0) {
      return SailingTrip.totalValueGreen;
    }
    else {
      return SailingTrip.totalValueBasic;
    }
  }
}

const SailingTrip = StyleSheet.create({

  card: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: Config.colors.primaryColorText,
    backgroundColor: Config.colors.primaryColorText,
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
    height: Dimensions.get('window').height,
  },

  cardItemLeft: {
    flex: 0.9,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Config.colors.primaryColorText,
  },

  cardItemRight: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "#F7F7F7",
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: Config.colors.grayColorLighter,
    marginTop: 10,
    marginBottom: 10
  },

  statusText: {
    color: Config.colors.grayColorDark,
    fontFamily: Config.fonts.mRegular,
    fontSize: 8,
  },
  statusActiv: {
    color: Config.colors.fontGreenColor,
    fontFamily: Config.fonts.mRegular,
    fontSize: 8,
  },
  statusInactiv: {
    color: Config.colors.warningColor,
    fontFamily: Config.fonts.mRegular,
    fontSize: 8,
  },

  title: {
    color: Config.colors.secondaryColorText,
    fontFamily: Config.fonts.mBold,
    fontSize: 22,
  },

  shipNumber: {
    color: Config.colors.grayColorDark,
    fontFamily: Config.fonts.msemiBoldItalic,
    fontSize: 12,
  },
  date: {
    marginTop: 5,
    color: Config.colors.secondaryColor,
    fontFamily: Config.fonts.msemiBold,
    fontSize: 9,
  },
  totalValueGreen: {
    color: Config.colors.thirdColor,
  },
  totalValueRed: {
    color: Config.colors.warningColor,
  },
  totalValueBasic: {
    color: Config.colors.secondaryColorText,
    fontFamily: Config.fonts.mRegular,
    fontSize: 25
  },
  name: {
    color: Config.colors.secondaryColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mBoldItalic,
    fontSize: 26,
  },
  leftAction: { //rightAction in styles.js
    color: Config.colors.thirdColorText,
    textAlign: 'left',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },
  buttonRowCenter: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 10,
  },
  eurKunaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconsRight: {
    height: 50,
    width: 50,
  },
});
