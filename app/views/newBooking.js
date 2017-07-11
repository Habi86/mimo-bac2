import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
/* ------------ StyleSheets --------- */
import styles from 'friedensflotte/app/styles/style';
/* ------------ Selfbuilt Components --------- */
import Button from 'friedensflotte/app/components/button';
import TextfieldWithFloatingLabel from 'friedensflotte/app/components/texfield_with_floating_labels'
import Textfield from 'friedensflotte/app/components/textfield'
import Config from 'friedensflotte/app/config/config';
import Firebase from 'friedensflotte/app/components/firebase';
import MainNavigation from 'friedensflotte/app/views/mainNavigation';
import ErrorDic from 'friedensflotte/app/components/errordict';
import CustomModal from 'friedensflotte/app/components/modal';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation';
import DetailView from 'friedensflotte/app/views/detailView';
import Type from 'friedensflotte/app/components/booking_type';
import LoadingSpinner from 'friedensflotte/app/components/loadingSpinner';
import ImageUploader from 'friedensflotte/app/services/imageUploader';
import ImageSelector from 'friedensflotte/app/services/imageSelector';

/* ------------ External Components --------- */
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import Dates from 'react-native-dates';
import moment from 'moment';

import uuidV1 from 'uuid/v1';

const horizontalMargin = 5;
const slideWidth = 140;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;
let width = Dimensions.get('window').width - 40; // minus margin

export default class NewBooking extends Component {
  //https://firebase.google.com/docs/storage/
  constructor(props) {
    super(props);
    //console.log(this.props.navigation.state.params.tripID); //get from navigator later
    const tripID = this.props.navigation.state.params.tripID;
    this.tripID = tripID;
    const bookingRef = Firebase.database().ref('sailingTrips/' + tripID + "/bookings");
    this.bookingRef = bookingRef;
    this.tripRef = null;

    this.state = {
      date: null,
      title: "",
      type: 0,
      img: "",
      currency: "EUR",
      payer: 0,
      amount: 0,
      crew: [],
      errors: "",
      isEdit: false,
      isEuro: true,
      focus: 'date',
      bookingImages: [{}, {}, {}, {}],
      isImageLoading: new Array(4).fill(false),
    }
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image style={{ height: (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor }} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')} />
    )
  };

  componentDidMount() {
    this.tripRef = Firebase.database().ref('sailingTrips/' + this.tripID);
    this.tripRef.on('value', this.fetchTripData);
  }

  componentWillUnmount() {
    if (this.tripRef) {
      this.tripRef.off('value', this.fetchTripData);
    }
  }

  fetchTripData = (snapshot) => {
    const actualTrip = snapshot.val();
    this.setState({
      crew: actualTrip.crew,
      title: actualTrip.title
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;

    const isDateBlocked = (date) =>
      date.isBefore(moment(), 'day');

    let contentDatePicker = (
      <View>
        <View style={bookings.centerButton}>
          <Button
            iconLeft={true}
            transparent={true}
            title={this.state.date ? this.state.date : 'Datum auswählen'}
            marginTop={30}
            fontSize={12}
            borderColor={Config.colors.secondaryColorText}
            borderWidth={0.5}
            color={Config.colors.primaryColor}>
          </Button>
        </View>
        <View style={{ width: width + 5, marginLeft: -37 }}>
          <Dates
            date={this.state.date}
            onDatesChange={this.onDateChange.bind(this)}
            isDateBlocked={isDateBlocked} />
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

    let contentSaveBooking = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{ height: 100, width: 100 }} source={require('friedensflotte/app/img/icons/profile/info_large_56.png')} />
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Möchtest du deine Buchung wirklich speichern?
                    Falls du noch etwas an der Buchung ändern willst, klicke auf Abbrechen.
                </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => this.saveBooking()}>
            <Text style={bookings.leftAction}>JA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs['SaveBookingModal'].toggle()
            }}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    const slides = Type.map((entry, index) => {
      return (
        <View>
          <View key={`entry-${index}`} style={bookings.slide}>
            <Image source={entry.image} />
          </View>
          <View style={styles.centerButton}>
            <Text style={bookings.infotext}>{entry.title}</Text>
          </View>
        </View>
      );
    });

    const crewButtons = this.state.crew.map((entry, index) => {
      return (
        <View style={bookings.centerButton}>
          <Button
            key={index}
            transparent={false} onPress={() => this.setState({ payer: index })}
            title={entry.name}
            marginTop={10}
            fontSize={12}
            borderColor={(this.state.payer == index) && Config.colors.primaryColor || Config.colors.grayColorLighter}
            borderWidth={0.5}
            color={(this.state.payer == index) && Config.colors.primaryColorText || Config.colors.secondaryColorText}
            backgroundColor={(this.state.payer == index) && Config.colors.primaryColor || Config.colors.grayColorLighter} />
        </View>
      );
    });

    let contentSaveBookingWhileUpload = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{ height: 100, width: 100 }} source={require('friedensflotte/app/img/icons/turns/delete_large_56.png')} />
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Bitte warte bis alle Bilder fertig hochgeladen sind.
                </Text>
        </View>
        <View style={styles.buttonRowCenter}>
            <TouchableOpacity
              onPress={() =>this.refs['SaveBookingWhileUploadModal'].toggle()}>
              <Text style={bookings.middleAction}>OK</Text>
            </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <View>
        <TopNavigation
          title={'Neue Buchung'}
          leftButton={<Icon name="arrow-left" size={25} color={Config.colors.primaryColorText} onPress={() => goBack()} />}
          rightButton={<Icon name="check" size={18} color={Config.colors.primaryColorText} onPress={() => this.handleCreateButtonPress()} />} />
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <View style={bookings.bookingsContainer}>
            <CustomModal content={contentDatePicker} ref={'DateModal'} />
            <CustomModal content={contentSaveBooking} ref={'SaveBookingModal'} />
            <CustomModal content={contentSaveBookingWhileUpload} ref={'SaveBookingWhileUploadModal'} />
            <View style={styles.centerButton}>
              <Button
                iconLeft={true}
                transparent={true}
                onPress={() => this.refs['DateModal'].toggle()}
                title={this.state.date ? this.state.date : 'Datum auswählen'}
                marginTop={30}
                fontSize={12}
                borderColor={Config.colors.secondaryColorText}
                borderWidth={0.5}
                color={Config.colors.primaryColor} />
            </View>
            <View>
              <Carousel
                ref={'carousel'}
                sliderWidth={width}
                itemWidth={itemWidth}
                autoplay={false}
                firstItem={0}
                inactiveSlideScale={0.7}
                showsHorizontalScrollIndicator={false}
                enableMomentum={false}
                decelerationRate={'fast'}
                enableSnap={true}>
                {slides}
              </Carousel>
            </View>
            <View style={bookings.buttonRowCenter}>
              <Button
                transparent={false}
                onPress={() => this.setState({ isEuro: true })}
                title={'EURO'}
                marginTop={10}
                marginRight={-20}
                fontSize={12}
                borderColor={Config.colors.grayColorLighter}
                borderWidth={0.5}
                width={100}
                color={Config.colors.secondaryColorText}
                backgroundColor={this.state.isEuro ? Config.colors.grayColorLighter : Config.colors.disabledInactiveColorText} />
              <Button
                transparent={false}
                onPress={() => this.setState({ isEuro: false })}
                title={'KUNA'}
                marginTop={10}
                fontSize={12}
                width={100}
                borderColor={Config.colors.disabledInactiveColorText}
                borderWidth={0.5}
                color={Config.colors.secondaryColorText}
                backgroundColor={this.state.isEuro ? Config.colors.disabledInactiveColorText : Config.colors.grayColorLighter} />
            </View>
            <View style={bookings.info}>
              <TextfieldWithFloatingLabel
                password={false}
                floatingLabelEnabled={true}
                placeholder={'Betrag'}
                onChangeText={(value) => this.setState({ amount: Number(value) })}
                placeholderTextColor={Config.colors.secondaryColorText}
                tintColor={Config.colors.secondaryColorText}
                highlightColor={Config.colors.secondaryColorText}
                color={Config.colors.secondaryColorText}
                width={width - 50}
              />
            </View>
            <View style={bookings.center}>
              <Text style={bookings.editlabel}>Name des Zahlenden</Text>
            </View>
            {crewButtons}
            <View style={bookings.alignImages}>
              {this.state.bookingImages.slice(0, 2).map((value, index) => this.renderBookingImage(value, index))}
            </View>
            <View style={bookings.alignImages}>
              {this.state.bookingImages.slice(2, 4).map((value, index) => this.renderBookingImage(value, index + 2))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderBookingImage(value, index) {
    const { navigate } = this.props.navigation;
    let imageTemplate = null;

    if (value.localSource && !this.state.isImageLoading[index]) {
      console.log(value.localSource);
      imageTemplate = (
        <Image
          style={{ height: 120, width: 120 }}
          source={value.localSource}
        />
      );
    } else if (!this.state.isImageLoading[index]) {
      imageTemplate = (
        <View style={bookings.center}>
          <Text style={bookings.imgLabel}>Foto hinzufügen</Text>
          <Image source={require('friedensflotte/app/img/icons/turns/add_photo_20.png')} />
        </View>
      );
    } else if (value.ref || (this.state.isImageLoading[index] && !value.localSource)) {
      imageTemplate = (
        <View style={{ flex: 1 }}>
          <LoadingSpinner />
        </View>
      );
    } else if (value.localSource && this.state.isImageLoading[index]) {
      imageTemplate = (
        <View style={{ flex: 1 }}>
          <Image
            style={{ height: 120, width: 120 }}
            source={value.localSource}
          >
            <LoadingSpinner />
          </Image>
        </View>
      );
    }

    return (
      (imageTemplate != null) &&
      <TouchableOpacity style={bookings.imgContainer} onPress={() => (value.ref == null) ? this.handleSelectImagePress(index) : navigate('BookingImageDetailView', { source: value.localSource, index: index, deleteImageCallback: () => this.deleteImage(index) })} >
        {imageTemplate}
      </TouchableOpacity>
    );
  }

  async handleSelectImagePress(index) {
    this.setIsImageLoading(index, true);

    let imageObject;

    await ImageSelector.selecetNewImage()
      .then((image) => {
        console.log(image);
        imageObject = image;
        this.setState({
          bookingImages: this.state.bookingImages.map((value, i) => {
            if (i == index) {
              value.localSource = image.source
            }
            return value;
          })
        });
      }).catch((error) => {
        console.log(error)
      }
      );

    await ImageUploader.uploadNewImage(imageObject)
      .then((uploadedFile) => {
        this.setState({
          bookingImages: this.state.bookingImages.map((value, i) => {
            if (i == index) {
              value.ref = uploadedFile.ref;
            }
            return value;
          })
        });
      }).catch((error) => {
        console.error(error);
      })
    this.setIsImageLoading(index, false);

  }


  setIsImageLoading(index, isLoading) {
    this.setState({
      isImageLoading: this.state.isImageLoading.map((value, i) => {
        if (i === index) {
          return isLoading;
        } else {
          return value;
        }
      })
    })
  }

  handleCreateButtonPress() {
    if (!this.state.isImageLoading.includes(true)) {
      this.refs['SaveBookingModal'].toggle();
    } else {
      this.refs["SaveBookingWhileUploadModal"].toggle();
    }
  }

  saveBooking() { //button in header after navigation change

    let filteredBookingImages = this.state.bookingImages.map((value) => {
      value.localSource = null;
      return value;
    });

    this.bookingRef
      .push({
        date: this.state.date,
        type: this.refs['carousel'].currentIndex,
        bookingImages: filteredBookingImages,
        currency: this.state.isEuro ? "EUR" : "HRK",
        payer: this.state.payer,
        amount: this.state.amount,
      }).key
    this.refs['SaveBookingModal'].toggle();
    this.props.navigation.navigate('DetailView', { tripID: this.tripID, title: this.state.title});

  }

  onDateChange({ date }) {
    let formattedDate = date.format('DD.MM.YYYY');
    this.setState({ date: formattedDate });
  }
}

const bookings = StyleSheet.create({
  bookingsContainer: {
    flex: 1,
    backgroundColor: Config.colors.mainBackgroundColor,
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 70,
    //height: Dimensions.get('window').height,
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
    marginHorizontal: 30
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
    color: Config.colors.grayColorLight,
    fontFamily: Config.fonts.mBold,
    fontSize: 12,
    marginTop: 30,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 10,
  },
  imgContainer: {
    backgroundColor: Config.colors.grayColorLighter,
    width: 120,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftAction: { //rightAction in styles.js
    color: Config.colors.thirdColorText,
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
});
