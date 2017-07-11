import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  ListView,
  FlatList,
  TextInput,
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Config from 'friedensflotte/app/config/config';
import Firebase from 'friedensflotte/app/components/firebase';
import ErrorDic from 'friedensflotte/app/components/errordict';
import Button from 'friedensflotte/app/components/button';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation';
import TypeIcons from 'friedensflotte/app/components/booking_type';
import CustomModal from 'friedensflotte/app/components/modal';
/* ------------ External Components --------- */
import Icon from 'react-native-vector-icons/FontAwesome';

let {
  width,
  height
} = Dimensions.get('window');

export default class DetailView extends Component {
  constructor(props) {
    super(props);
    const tripID = this.props.navigation.state.params.tripID;
    this.tripID = tripID;

    // this.renderRow = this.renderRow.bind(this);
    this.renderRowEUR = this.renderRowEUR.bind(this);
    this.renderRowHRK = this.renderRowHRK.bind(this);
    this.renderCrew = this.renderCrew.bind(this);

    this.tripRef = null;
    this.bookingRef = null;
    this.coinListEURRef = null;
    this.coinListHRKRef = null;
    //this.bookingRefNew = Firebase.database().ref('sailingTrips/' + this.tripID + "/bookings").orderByChild('date');

    this.state = {
      isEUR: true,
      isEdit: false,
      SourceEUR: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      SourceHRK: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      currentEUR: 0,
      currentHRK: 0,

      //Coinlist
      coinListEUR: [
        {key: 0, value: 1, currency: 'Cent Münze', amount: null, total: 0},
        {key: 1, value: 2, currency: 'Cent Münze', amount: null, total: 0},
        {key: 2, value: 5, currency: 'Cent Münze', amount: null, total: 0},
        {key: 3, value: 10, currency: 'Cent Münze', amount: null, total: 0},
        {key: 4, value: 20, currency: 'Cent Münze', amount: null, total: 0},
        {key: 5, value: 50, currency: 'Cent Münze', amount: null, total: 0},
        {key: 6, value: 1, currency: 'Euro Münze', amount: null, total: 0},
        {key: 7, value: 2, currency: 'Euro Münze', amount: null, total: 0},
        {key: 8, value: 5, currency: 'Euro Schein', amount: null, total: 0},
        {key: 9, value: 10, currency: 'Euro Schein', amount: null, total: 0},
        {key: 10, value: 20, currency: 'Euro Schein', amount: null, total: 0},
        {key: 11, value: 50, currency: 'Euro Schein', amount: null, total: 0},
        {key: 12, value: 100, currency: 'Euro Schein', amount: null, total: 0},
        {key: 13, value: 200, currency: 'Euro Schein', amount: null, total: 0},
        {key: 14, value: 500, currency: 'Euro Schein', amount: null, total: 0},
      ],
      coinListHRK: [
        {key: 0, value: 1, currency: 'Lipa Münze', amount: null, total: 0},
        {key: 1, value: 2, currency: 'Lipe Münze', amount: null, total: 0},
        {key: 2, value: 5, currency: 'Lipe Münze', amount: null, total: 0},
        {key: 3, value: 10, currency: 'Lipe Münze', amount: null, total: 0},
        {key: 4, value: 20, currency: 'Lipe Münze', amount: null, total: 0},
        {key: 5, value: 50, currency: 'Lipe Münze', amount: null, total: 0},
        {key: 6, value: 1, currency: 'Kuna Münze', amount: null, total: 0},
        {key: 7, value: 2, currency: 'Kuna Münze', amount: null, total: 0},
        {key: 8, value: 5, currency: 'Kuna Münze', amount: null, total: 0},
        {key: 9, value: 25, currency: 'Kuna Münze', amount: null, total: 0},
        {key: 10, value: 1, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 11, value: 2, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 12, value: 10, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 13, value: 20, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 14, value: 50, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 15, value: 100, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 16, value: 500, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 17, value: 1000, currency: 'Kuna Schein', amount: null, total: 0},
        {key: 18, value: 5000, currency: 'Kuna Schein', amount: null, total: 0},
      ],
      coinListEURTotal: 0,
      coinListHRKTotal: 0,
    };

    this.itemsEUR = [];
    this.itemsHRK = [];
    this.counterEUR = 1;
    this.counterHRK = 1;

    this.tmpArrEUR = [];
    this.tmpArrHRK = [];
  }

  static navigationOptions = {
    tabBarIcon: ({tintColor}) => (
      <Image style={{height: (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor}} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')}/>
    ),
  };


/*  test(){
    this.bookingRef = Firebase.database().ref('sailingTrips/' + this.tripID + "/bookings").orderByChild('date');
    this.bookingRef.on('child_added', this.fetchBookingData);
  }*/

  componentDidMount() {
    //fetch trip data TODO fetch all with ONE fetch
    this.tripRef = Firebase.database().ref('sailingTrips/' + this.tripID);
    this.tripRef.on('value', this.fetchAllDataFromTrips);

    //fetch booking data
    this.bookingRef = Firebase.database().ref('sailingTrips/' + this.tripID + "/bookings").orderByChild('date');
    this.bookingRef.on('child_added', this.fetchBookingData);

    // console.log('child_added booking data');
    // console.log(this.bookingRef);

    //this.bookingRefNew.on('child_changed', this.fetchBookingData);

    //Fetch CoinList EUR
    this.coinListEURRef = Firebase.database().ref('sailingTrips/' + this.tripID + "/coinList/EUR");
    this.coinListEURRef.on('child_added', this.fetchCoinListEUR);

    //Fetch CoinList HRK
    this.coinListHRKRef = Firebase.database().ref('sailingTrips/' + this.tripID + "/coinList/HRK");
    this.coinListHRKRef.on('child_added', this.fetchCoinListHRK);
  }
  //
  // shouldComponentUpdate(){
  //   this.bookingRef = Firebase.database().ref('sailingTrips/' + this.tripID + "/bookings").orderByChild('date');
  //   this.bookingRef.on('value', this.fetchBookingData);
  // }

  componentWillUnmount() {
    if (this.tripRef) {
      this.tripRef.off('value', this.fetchAllDataFromTrips);
    }
    if (this.bookingRef) {
      this.bookingRef.off('child_added', this.fetchBookingData);
      this.bookingRef.off('value', this.fetchBookingData);
    }
    if (this.coinListHRKRef) {
      this.coinListHRKRef.off('child_added', this.fetchCoinListHRK);
    }
    if (this.coinListEURRef) {
      this.coinListEURRef.off('child_added', this.fetchCoinListEUR);
    }
    // if (this.bookingRefNew) {
    //   this.bookingRefNew.off('child_changed', this.fetchBookingData);
    // }
  }

  fetchAllDataFromTrips = (dataSnapshot) => {
    this.setState({
      tripID: dataSnapshot.key,
      status: dataSnapshot.child("status").val(),
      title: dataSnapshot.child("title").val(),
      startDate: dataSnapshot.child("startDate").val(),
      endDate: dataSnapshot.child("endDate").val(),
      shipName: dataSnapshot.child("shipName").val(),
      shipNumber: dataSnapshot.child("shipNumber").val(),
      crew: dataSnapshot.child("crew").val(),
    });
  }

  fetchBookingData = (dataSnapshot) => {
    let payer = '';
    if (dataSnapshot.child('currency').val() === 'EUR') {

      for (let i = 0; i < this.state.crew.length; i++) {
        if (i === dataSnapshot.child('payer').val()) {
          payer = this.state.crew[i].name;
        }
      }

      this.setState({
        itemsEUR: this.itemsEUR.push({
          key: dataSnapshot.key,
          counter: this.counterEUR,
          type: dataSnapshot.child('type').val(),
          date: dataSnapshot.child('date').val(),
          payer: payer,
          amount: dataSnapshot.child('amount').val(),
          img: dataSnapshot.child('img').val(),
          currency: dataSnapshot.child('currency').val(),
        }),
        currentEUR: this.state.currentEUR += dataSnapshot.child('amount').val(),
        counterEUR: this.counterEUR++,
        SourceEUR: this.state.SourceEUR.cloneWithRows(this.itemsEUR),
      });
      console.log('child_added setEuro Data');
      console.log(dataSnapshot);


    } else if (dataSnapshot.child('currency').val() === 'HRK') {

      for (let i = 0; i < this.state.crew.length; i++) {
        if (i === dataSnapshot.child('payer').val()) {
          payer = this.state.crew[i].name;
        }
      }

      this.setState({
        itemsHRK: this.itemsHRK.push({
          key: dataSnapshot.key,
          counter: this.counterHRK,
          type: dataSnapshot.child('type').val(),
          date: dataSnapshot.child('date').val(),
          payer: payer,
          amount: dataSnapshot.child('amount').val(),
          img: dataSnapshot.child('img').val(),
          currency: dataSnapshot.child('currency').val(),
        }),
        currentHRK: this.state.currentHRK += dataSnapshot.child('amount').val(),
        counterHRK: this.counterHRK++,
        SourceHRK: this.state.SourceHRK.cloneWithRows(this.itemsHRK),
      });
    }
  }

  fetchCoinListHRK = (dataSnapshot) => {
    if (dataSnapshot) {
      this.tmpArrHRK.push(dataSnapshot.val());
      this.state.coinListHRKTotal += dataSnapshot.child("total").val();
    }
    this.setState({
      coinListHRK: this.tmpArrHRK,
    });
  }

  fetchCoinListEUR = (dataSnapshot) => {
    if (dataSnapshot) {
      this.tmpArrEUR.push(dataSnapshot.val());
      this.state.coinListEURTotal += dataSnapshot.child("total").val();
    }
    this.setState({
      coinListEUR: this.tmpArrEUR,
    });
  }

  render() {
    const {navigate, goBack} = this.props.navigation;

    let completeTrip = (
      <View>
        <View style={styles.modalIcon}>
          <Icon name="check-circle-o" size={50} color={Config.colors.thirdColorText}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Möchtest du den Segeltörn wirklich abschließen und eine Münzliste anlegen?
          </Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity
            onPress={() => {
              this.completeTrip();
              this.refs['completeTrip'].toggle()
            }
            }>
            <Text style={detailView.middleAction}>JA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs['completeTrip'].toggle()
            }}>
            <Text style={detailView.middleAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    let tripIsCosedHint = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{height: 50, width: 50}} source={require('friedensflotte/app/img/icons/profile/info_large_56.png')}/>
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Dieser Törn wurde abgeschlossen und ist somit inaktiv. Es sind keine Änderungen mehr möglich.
          </Text>
        </View>
        <View style={detailView.buttonRowCenter}>
          <TouchableOpacity
            onPress={() => {this.refs['tripIsCosedHint'].toggle()}}>
            <Text style={detailView.middleAction}>VERSTANDEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );


    return (
      <View>
        <TopNavigation
          title={this.props.navigation.state.params.title}
          leftButton={<Icon name="arrow-left" size={25} color={Config.colors.primaryColorText}
                            onPress={() => goBack()}/>}
          rightButton={<Icon name="pencil" size={25} color={Config.colors.primaryColorText}
                             onPress={() => navigate('EditTrip', {tripID: this.state.tripID})}/>}
        />
        <ScrollView>
          <View style={detailView.container}>
            <CustomModal content={tripIsCosedHint} ref={'tripIsCosedHint'}/>
            <View style={detailView.eurKunaContainer}>
              <View style={{paddingTop: 20}}>
                <Image
                  source={require('friedensflotte/app/img/icons/turns/download_20.png')}/>
              </View>
              <View style={detailView.buttonRowCenter}>
                <Button
                  transparent={false}
                  onPress={() => this.setState({isEUR: true})}
                  title={'EURO'}
                  marginTop={10}
                  marginRight={-20}
                  fontSize={12}
                  borderColor={Config.colors.grayColorLighter}
                  borderWidth={0.5}
                  width={100}
                  color={Config.colors.secondaryColorText}
                  backgroundColor={this.state.isEUR ? Config.colors.grayColorLighter : Config.colors.disabledInactiveColorText }/>
                <Button
                  transparent={false}
                  onPress={() => this.setState({isEUR: false})}
                  title={'HRK'}
                  marginTop={10}
                  fontSize={12}
                  width={100}
                  borderColor={Config.colors.grayColorLighter}
                  borderWidth={0.5}
                  color={Config.colors.secondaryColorText}
                  backgroundColor={this.state.isEUR ? Config.colors.disabledInactiveColorText : Config.colors.grayColorLighter }/>
              </View>
              <View>
                <Text style={[detailView.status, {marginTop: 20}]}>STATUS:</Text>
                {this.state.status === "AKTIV" ? (<Text style={detailView.statusActiv}>{this.state.status}</Text>) : (
                  <Text style={detailView.statusInactiv}>{this.state.status}</Text>)}
              </View>
            </View>

            <View style={detailView.tableHeader}>
              <View style={{width: (width / 6) -25}}><Text style={detailView.textHead}>NR.</Text></View>
              <View style={{width: (width / 6) -15}}><Text style={detailView.textHead}>TYP</Text></View>
              <View style={{width: (width / 6) +15}}><Text style={detailView.textHead}>DATUM</Text></View>
              <View style={{width: (width / 6)}}><Text style={detailView.textHead}>NAME</Text></View>
              <View style={{width: (width / 6) +15}}><Text style={detailView.textHead}>+/-</Text></View>
              <View style={{width: (width / 6) -10}}><Text style={detailView.textHead}>BELEG</Text></View>
            </View>


            <View>
              <ListView style={this.state.isEUR === false ? ({display: 'none'}) : (null)}
                        dataSource={this.state.SourceEUR}
                        renderRow={this.renderRowEUR.bind(this)}/>

              <ListView style={this.state.isEUR ? ({display: 'none'}) : (null)}
                        dataSource={this.state.SourceHRK}
                        renderRow={this.renderRowHRK.bind(this)}/>
            </View>

            {/*New booking:*/}
            {this.state.status === "AKTIV"
              ?
              <TouchableOpacity
                onPress={() => navigate('NewBooking', {tripID: this.state.tripID})}>
                <View style={detailView.tableNewBooking}>
                  <Text style={detailView.tableNewBookingText}>+ Neues Ereignis hinzufügen</Text>
                </View>
              </TouchableOpacity>
              : null}

            <View style={[detailView.totalContainer, this.state.status === "INAKTIV" ? {marginTop: 30} : null]}>
              <View><Text style={detailView.totalStatus}>TOTAL/STATUS:</Text></View>
              {this.state.isEUR ? (
                <View><Text style={[detailView.totalValueText, this.getStyleForAmount(this.state.currentEUR)]}>{this.state.currentEUR} €</Text></View>
              ) : (
                <View><Text style={[detailView.totalValueText, this.getStyleForAmount(this.state.currentHRK)]}>{this.state.currentHRK} HRK</Text></View>
              )}
            </View>

            <View style={detailView.informationContainer}>
              <Text style={detailView.informationTitle}>INFORMATION</Text>
              <View style={{marginLeft: 10}}>
                <Text style={detailView.informationTitle}>Törn</Text>
                <Text style={detailView.informationDark}>{this.state.startDate} - {this.state.endDate}</Text>
                <Text style={detailView.informationGreen}>{this.state.title}</Text>
                <Text style={detailView.informationLight}>{this.state.shipName} / {this.state.shipNumber}</Text>
                <Text style={detailView.informationTitle}>Team</Text>
                <View>{this.renderCrew(this)}</View>
              </View>
            </View>

            {this.state.status === "AKTIV" ? (
              <View>
                <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 20}}>
                  <View style={{width: 20, marginTop: 10}}><Icon name="info" size={15}/></View>
                  <View style={{width: 250}}><Text style={detailView.completeTripText}>Drücke auf „abschließen“ um den
                    Segeltörn entgültig zu beenden und eine Münzliste anzulegen.</Text></View>
                </View>
                <CustomModal content={completeTrip} ref={'completeTrip'}/>
                <View style={styles.centerButton}>
                  <Button
                    transparent={false}
                    onPress={() => this.handleCompleteButtonPress()}
                    title="ABSCHLIESSEN"
                    marginTop={30}
                    fontSize={12}
                    backgroundColor={Config.colors.buttonColorDark}
                  />
                </View>
              </View>
            ) : (
              <View style={{paddingBottom: 100}}>
                <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 20}}>
                  <View style={{width: 20, marginTop: 0}}><Icon name="check-circle-o" size={15}/></View>
                  <View style={{width: 250}}><Text style={detailView.completeTripText}>Segeltörn wurde
                    abgeschlossen.</Text></View>
                </View>
                <View>
                  <View style={detailView.tableHeader}>
                    <View style={{width: (width / 3) - 5}}><Text style={detailView.textHead}>TYP</Text></View>
                    <View style={{width: (width / 3) - 10}}><Text style={detailView.textHead}>ANZAHL</Text></View>
                    <View style={{width: (width / 3) - 5}}><Text style={detailView.textHead}>WERT</Text></View>
                  </View>

                  <FlatList
                    data={this.state.coinListEUR}
                    extraData={this.state}
                    renderItem={ ({item}) => this.renderItemEUR(({item}))}
                  />

                  <View style={[detailView.tableHeader, {marginTop: 30}]}>
                    <View style={{width: (width / 3) - 5}}><Text style={detailView.textHead}>TYP</Text></View>
                    <View style={{width: (width / 3) - 10}}><Text style={detailView.textHead}>ANZAHL</Text></View>
                    <View style={{width: (width / 3) - 5}}><Text style={detailView.textHead}>WERT</Text></View>
                  </View>

                  <FlatList
                    data={this.state.coinListHRK}
                    extraData={this.state}
                    renderItem={ ({item}) => this.renderItemHRK(({item}))}
                  />

                </View>


                <View style={styles.centerButton}>
                  <Button
                    transparent={false}
                    onPress={() => {
                      this.saveCoinList();
                    }}
                    title="SPEICHERN"
                    marginTop={30}
                    fontSize={12}
                    backgroundColor={Config.colors.buttonColorDark}

                  />
                </View>

                <View style={detailView.informationContainer}>
                  <Text style={detailView.informationTitle}>ZUSAMMENFASSUNG</Text>
                  <View style={{flexDirection: 'row',}}>
                    <Text style={detailView.informationCoinList}>EURO-MÜNZLISTE: </Text>
                    <Text style={[detailView.informationCoinList, this.getStyleForCoinListTotal(this.state.currentEUR, this.state.coinListEURTotal)]}>{this.state.coinListEURTotal} €</Text>
                  </View>
                  <View style={{flexDirection: 'row',}}>
                    <Text style={detailView.informationCoinList}>KUNA-MÜNZLISTE: </Text>
                    <Text style={[detailView.informationCoinList, this.getStyleForCoinListTotal(this.state.currentHRK, this.state.coinListHRKTotal)]}>{this.state.coinListHRKTotal} HRK</Text>
                  </View>

                  {(this.state.currentEUR !== this.state.coinListEURTotal) && (this.state.currentHRK !== this.state.coinListHRKTotal)
                    ?
                    <View style={{flexDirection: "row", justifyContent: "center", marginTop: 30, marginBottom: 20}}>
                      <View style={{width: 20, marginTop: 0}}><Image
                        style={{width: 20, height: 20}}
                        source={require('friedensflotte/app/img/icons/turns/info_20_red.png')}/></View>

                      <View style={{width: 270}}><Text style={detailView.coinListWarning}>Die Summe der Münzliste stimmt
                        nicht mit dem Stand der Buchungen überein!</Text></View>
                    </View>
                    : null
                  }
                </View>

              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }


  getStyleForAmount(currentValue) {
    if (currentValue < 0) {
      return detailView.totalValueRed;
    }
    else if (currentValue > 0) {
      return detailView.totalValueGreen;
    }
    else {
      return detailView.totalValueBasic;
    }
  }

  getStyleForCoinListTotal(currentValue, coinValue) {
    if (currentValue !== coinValue) {
      return detailView.totalValueRed;
    }
    else {
      return detailView.totalValueGreen;
    }
  }

  handleCompleteButtonPress() {
    this.refs['completeTrip'].toggle();
  }
  handleTripIsInactiveButtonPress() {
    this.refs['tripIsCosedHint'].toggle();
  }

  completeTrip() {
    this.tripRef
    .update({
      status: "INAKTIV",
    })
  }

  saveCoinList() {
    this.coinListEURRef.set(this.state.coinListEUR)
    .then(function () {
      console.log('EUR Coinlist-Update succeeded');
    })
    .catch(function (error) {
      console.log('EUR Coinlist-Update failed');
    });

    this.coinListHRKRef.set(this.state.coinListHRK)
    .then(function () {
      console.log('Kuna Coinlist-Update succeeded');
    })
    .catch(function (error) {
      console.log('Kuna Coinlist-Update failed');
    });

  }

  renderRowEUR(rowData) {
    const {navigate, goBack} = this.props.navigation;
    let component;

    if (rowData.currency === "EUR") {
      component =
        <TouchableOpacity
          onPress={() => this.state.status === "AKTIV" ? navigate('EditBooking', {tripID: this.state.tripID, bookingID: rowData.key, counter: rowData.counter, type: rowData.type}) : this.handleTripIsInactiveButtonPress()}>
          <View style={detailView.tableContainer}>
            <View style={[detailView.tableBorderLeft, {width: (width / 6) -25}]}>
              <Text style={detailView.tableText}>{rowData.counter}</Text>
            </View>
            <View style={[detailView.tableBorder, {width: (width / 6) -15}]}><Image style={{width: 40, height: 40}} source={TypeIcons[rowData.type].image}/></View>
            <View style={[detailView.tableBorder, {width: (width / 6) +15}]}><Text style={detailView.tableText}>{rowData.date}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6)}]}><Text
              style={detailView.tableText}>{rowData.payer.substring(0, 5) + "..."}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6) +15}]}><Text
              style={[detailView.tableText, this.getStyleForAmount(rowData.amount)]}>{rowData.amount}</Text></View>
            <View style={[detailView.tableBorderRight, {width: (width / 6) -10, justifyContent: 'center', alignItems: 'center'}]}><Image source={require('friedensflotte/app/img/icons/turns/add_photo_20.png')}/></View>
          </View>
        </TouchableOpacity>;
    }
    return (
      component
    );
  }

  renderRowHRK(rowData) {
    const {navigate, goBack } = this.props.navigation;
    let component;

    if (rowData.currency === "HRK") {
      component =
        <TouchableOpacity
          onPress={() => this.state.status === "AKTIV" ? navigate('EditBooking', {tripID: this.state.tripID, bookingID: rowData.key, counter: rowData.counter, type: rowData.type}) : null}>
          <View style={detailView.tableContainer}>
            <View style={[detailView.tableBorderTopLeft, {width: (width / 6) -25}]}><Text
              style={detailView.tableText}>{rowData.counter}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6) -15}]}><Image style={{width: 40, height: 40}}
                                                                       source={TypeIcons[rowData.type].image}/></View>
            <View style={[detailView.tableBorder, {width: (width / 6) +15}]}><Text style={detailView.tableText}>{rowData.date}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6)}]}><Text
              style={detailView.tableText}>{rowData.payer.substring(0, 5) + "..."}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6) +15}]}><Text
              style={[detailView.tableText, this.getStyleForAmount(rowData.amount)]}>{rowData.amount}</Text></View>
            <View style={[detailView.tableBorder, {width: (width / 6) -10, justifyContent: 'center', alignItems: 'center'}]}><Image source={require('friedensflotte/app/img/icons/turns/add_photo_20.png')}/></View>
          </View>
        </TouchableOpacity>;
    }
    return (
      component
    );
  }

  renderCrew() {
    let component = [];

    //when crew available do:
    if (this.state.crew) {
      let isSkipper = '';
      for (let i = 0; i < this.state.crew.length; i++) {
        if (i === 0) isSkipper = "Skipper";
        else isSkipper = "Betreuer";
        component.push(
          <View key={i}>
            <Text style={detailView.informationDark}>{isSkipper}</Text>
            <Text style={detailView.informationGreen}>{this.state.crew[i].name}</Text>
            <Text style={detailView.informationLight}>{this.state.crew[i].eMail}</Text>
          </View>
        )
      }
      return (
        component
      );
    }
  }

  renderItemEUR({item}) {
    return (
      <View style={detailView.tableContainer} key={item.key}>
        <View style={[detailView.tableBorder, {width: (width / 3) - 5}]}>
          <Text style={detailView.coinTableText}>{item.value} {item.currency}</Text>
        </View>
        <View style={[detailView.tableBorder, {width: (width / 3) - 10}]}>
          <TextInput
            keyboardType='numeric'
            style={[detailView.coinTableText, {
              marginTop: 3,
              height: 20,
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
            }]}
            onChangeText={(text) => {
              var stateCopy = Object.assign({}, this.state);
              this.state.coinListEUR[item.key].amount = parseInt(text);
              this.state.coinListEUR[item.key].total = parseInt(text) * item.value;
              this.setState(stateCopy);
            }}
            value={this.state.coinListEUR[item.key].amount ? this.state.coinListEUR[item.key].amount.toString() : null}
          />
        </View>
        <View style={[detailView.tableBorder, {width: (width / 3) - 5}]}>
          <Text
            style={detailView.coinTableText}>{this.state.coinListEUR[item.key].total ? this.state.coinListEUR[item.key].total : '0'} €</Text>
        </View>
      </View>
    );
  }

  renderItemHRK({item}) {
    return (
      <View style={detailView.tableContainer} key={item.key}>
        <View style={[detailView.tableBorder, {width: (width / 3) - 5}]}>
          <Text style={detailView.coinTableText}>{item.value} {item.currency}</Text>
        </View>
        <View style={[detailView.tableBorder, {width: (width / 3) - 10}]}>
          <TextInput
            keyboardType='numeric'
            style={[detailView.coinTableText, {
              marginTop: 3,
              height: 20,
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
            }]}
            onChangeText={(text) => {
              var stateCopy = Object.assign({}, this.state);
              this.state.coinListHRK[item.key].amount = parseInt(text);
              this.state.coinListHRK[item.key].total = parseInt(text) * item.value;
              this.setState(stateCopy);
            }}
            value={this.state.coinListHRK[item.key].amount ? this.state.coinListHRK[item.key].amount.toString() : null}
          />
        </View>
        <View style={[detailView.tableBorder, {width: (width / 3) - 5}]}>
          <Text
            style={detailView.coinTableText}>{this.state.coinListHRK[item.key].total ? this.state.coinListHRK[item.key].total : '0'} HRK </Text>
        </View>
      </View>
    );
  }
}


const detailView = StyleSheet.create({
  container: {
    backgroundColor: Config.colors.primaryColorText,
    minHeight: Dimensions.get('window').height - 100,
    padding: 10,
    paddingBottom: 50,
  },

  eurKunaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: Config.colors.secondaryColor,
    borderRadius: 5,
  },
  tableContainer: {
    flexDirection: 'row',
  },
  tableBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: Config.colors.grayColorLighter,
    borderBottomWidth: 0.5,
    borderBottomColor: Config.colors.grayColorLighter,
  },
  tableNewBooking: {
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Config.colors.grayColorLighter,
  },
  tableNewBookingText: {
    color: Config.colors.grayColorDark,
    fontSize: 14,
    fontFamily: Config.fonts.mBold,
    textAlign: 'center',
    paddingVertical: 5,
  },
  tableBorderLeft: {
    borderBottomWidth: 0.5,
    borderBottomColor: Config.colors.grayColorLighter,
  },
  tableBorderRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: Config.colors.grayColorLighter,
    borderBottomWidth: 0.5,
    borderBottomColor: Config.colors.grayColorLighter,
  },
  tableText: {
    paddingTop: 13,
    color: Config.colors.secondaryColorText,
    fontSize: 12,
    fontFamily: Config.fonts.mBold,
    textAlign: 'center'
  },
  buttonRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    color: Config.colors.grayColorDark,
    fontSize: 9,
    fontFamily: Config.fonts.mBold,
    textAlign: "right",
  },
  statusActiv: {
    color: Config.colors.fontGreenColor,
    fontSize: 9,
    fontFamily: Config.fonts.mBold,
    textAlign: "right",
  },
  statusInactiv: {
    color: Config.colors.warningColor,
    fontSize: 9,
    fontFamily: Config.fonts.mBold,
    textAlign: "right",
  },
  head: {
    height: 40,
    backgroundColor: Config.colors.secondaryColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.colors.secondaryColor,
  },
  textHead: {
    color: Config.colors.thirdColorText,
    fontSize: 11,
    fontFamily: Config.fonts.mExtrabold,
    textAlign: 'center'
  },
  text: {
    color: Config.colors.secondaryColorText,
    fontSize: 12,
    fontFamily: Config.fonts.mBold,
    textAlign: 'center'
  },
  row: {
    height: 30,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  totalStatus: {
    color: Config.colors.grayColorDark,
    fontSize: 18,
    fontFamily: Config.fonts.mRegular,
  },
  totalValueText: {
    fontSize: 25,
    fontFamily: Config.fonts.mRegular,
    marginTop: -7,
  },
  totalValueGreen: {
    color: Config.colors.thirdColor,
  },
  totalValueRed: {
    color: Config.colors.warningColor,
  },
  totalValueBasic: {
    color: Config.colors.secondaryColorText,
  },


  informationContainer: {
    backgroundColor: Config.colors.mainBackgroundColor,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 50,
  },
  informationTitle: {
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
    color: Config.colors.grayColorLight,
    marginBottom: 8,
  },
  informationDark: {
    fontFamily: Config.fonts.mBold,
    fontSize: 12,
    color: Config.colors.grayColorDark,
    marginLeft: 10,
  },
  informationGreen: {
    fontFamily: Config.fonts.mBold,
    fontSize: 18,
    color: Config.colors.thirdColorText,
    marginLeft: 10,

  },
  informationLight: {
    fontFamily: Config.fonts.mBold,
    fontSize: 14,
    color: Config.colors.grayColor,
    marginLeft: 10,
    marginBottom: 8,
  },

  completeTripText: {
    fontSize: 14,
    color: Config.colors.grayColorDark,
    fontFamily: Config.fonts.mBold,
  },
  leftAction: {
    color: Config.colors.warningColor,
    textAlign: 'left',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },
  middleAction: {
    color: Config.colors.thirdColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
  },

  //Coinlist
  coinTableText: {
    color: Config.colors.secondaryColorText,
    fontSize: 12,
    fontFamily: Config.fonts.mBold,
    textAlign: 'center',
    paddingVertical: 5,
  },
  coinListWarning: {
    fontSize: 14,
    color: Config.colors.warningColor,
    fontFamily: Config.fonts.mBold,

  },
  informationCoinList: {
    fontFamily: Config.fonts.mBold,
    fontSize: 14,
    color: Config.colors.grayColorDark,
    marginBottom: 8,
    marginLeft: 10
  },


});
