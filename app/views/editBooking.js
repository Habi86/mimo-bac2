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
import ErrorDic from 'friedensflotte/app/components/errordict';
import CustomModal from 'friedensflotte/app/components/modal';
import TopNavigation from 'friedensflotte/app/components/topNavigation/topNavigation';
import DetailView from 'friedensflotte/app/views/detailView';
import NewBooking from 'friedensflotte/app/views/newBooking';
import Type from 'friedensflotte/app/components/booking_type';
import LoadingSpinner from 'friedensflotte/app/components/loadingSpinner';
import ImageUploader from 'friedensflotte/app/services/imageUploader';
import ImageSelector from 'friedensflotte/app/services/imageSelector';

/* ------------ External Components --------- */
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import Dates from 'react-native-dates';
import moment from 'moment';

import RNFS from 'react-native-fs';

const horizontalMargin = 5;
const slideWidth = 140;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 100;
let width = Dimensions.get('window').width - 40; // minus margin

export default class EditBooking extends Component {
  //https://firebase.google.com/docs/storage/
  constructor(props) {
    super(props);
    const tripID = this.props.navigation.state.params.tripID;
    const type = this.props.navigation.state.params.type;
    const bookingID = this.props.navigation.state.params.bookingID;
    const internalID = this.props.navigation.state.params.counter
    const tripRef = Firebase.database().ref('sailingTrips/' + tripID);
    const bookingRef = Firebase.database().ref('sailingTrips/' + tripID + '/bookings/' + bookingID);
    this.tripRef = tripRef;
    this.bookingRef = bookingRef;
    this.bookingID = bookingID;
    this.tripID = tripID;
    this.internalID = internalID;
    this.type = type;

    this.state = {
      date: null,
      title: "",
      type: type,
      currency: "EUR",
      payer: 0,
      amount: 0,
      crew: [], //Betreuer
      errors: "",
      isEdit: false,
      isEuro: true,
      payerName: "",
      bookingImages: [{}, {}, {}, {}],
      isImageLoading: [false, false, false, false]
    }
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Image style={{ height: (Platform.OS === "android") ? 30 : 40, width: (Platform.OS === "android") ? 30 : 40, tintColor: tintColor }} source={require('friedensflotte/app/img/icons/menu/my_turns_44.png')} />
    ),
  };

  componentDidMount() {
    //fetch crew data
    this.tripRef
      .on('value', (snapshot) => {
        const actualTrip = snapshot.val();
        if (actualTrip) {
          this.setState({
            title: actualTrip.title,
            crew: actualTrip.crew,
            payerName: actualTrip.crew[actualTrip.bookings[this.bookingID].payer].name
          });
        }
      });

    this.bookingRef
      .on('value', (snapshot) => {
        const booking = snapshot.val();
        if (booking) {
          this.setState({
            date: booking.date,
            type: booking.type,
            currency: booking.currency,
            isEuro: this.handleCurrency(booking.currency),
            payer: booking.payer,
            amount: booking.amount,
            bookingImages: (booking.bookingImages) ? booking.bookingImages : [{}, {}, {}, {}]
          });

          if (booking.bookingImages) {
            booking.bookingImages.map((value, index) => {
              if (value.ref && !value.localSource) {
                this.downloadMissingImage(index);
              }
            });
          }
        }
      });
  }

  handleCurrency(curr) {
    if (curr == "EUR") {
      return true;
    }
    else return false;
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
            transparent={false}
            title={'SPEICHERN'}
            onPress={() => this.refs['DateModalEdit'].toggle()}
            marginTop={30}
            fontSize={12}
            backgroundColor={Config.colors.buttonColorDark} />
        </View>
      </View>
    );

    let contentDeleteBooking = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{ height: 100, width: 100 }} source={require('friedensflotte/app/img/icons/turns/delete_large_56.png')} />
        </View>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>
            Möchtest du deine Buchung wirklich löschen?
                </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => this.handleDeleteButtonPress()}>
            <Text style={bookings.leftAction}>LÖSCHEN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs['DeleteBookingModal'].toggle()
            }}>
            <Text style={styles.rightAction}>ABBRECHEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    let contentSaveBookingWhileUpload = (
      <View>
        <View style={styles.modalIcon}>
          <Image style={{ height: 100, width: 100 }} source={require('friedensflotte/app/img/icons/profile/info_large_56.png')} />
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

    return (
      <View>
        <TopNavigation
          title={'Eintrag bearbeiten'}
          leftButton={<Icon name="arrow-left" size={25} color={Config.colors.primaryColorText} onPress={() => goBack()} />}
          rightButton={this.state.isEdit ? <Icon name="check" size={25} color={Config.colors.primaryColorText} onPress={() => this.handleUpdateButtonClick()} /> : <Icon name="pencil" size={25} color={Config.colors.primaryColorText} onPress={() => this.handleClick()} />}
        />
        <ScrollView style={{ backgroundColor: '#fff' }}>
          <View style={bookings.bookingsContainer}>
            <CustomModal content={contentDatePicker} ref={'DateModalEdit'} />
            <CustomModal content={contentDeleteBooking} ref={'DeleteBookingModal'} />
            <CustomModal content={contentSaveBookingWhileUpload} ref={'SaveBookingWhileUploadModal'} />
            <View style={bookings.buttons}>
              <Text style={styles.textDark}>No{this.internalID}</Text>
              <Text style={styles.textDark}>{this.state.date}</Text>
            </View>
            <View style={styles.centerButton}>
              {this.state.isEdit && <Button
                iconLeft={true}
                transparent={true}
                onPress={() => this.refs['DateModalEdit'].toggle()}
                title={this.state.date ? this.state.date : 'Datum auswählen'}
                marginTop={30}
                fontSize={12}
                borderColor={Config.colors.secondaryColorText}
                borderWidth={0.5}
                color={Config.colors.primaryColor} />}
            </View>
            {this.state.isEdit &&
              <View>
                <Carousel
                  ref={'carousel'}
                  sliderWidth={width}
                  itemWidth={itemWidth}
                  autoplay={false}
                  firstItem={this.state.type}
                  showsHorizontalScrollIndicator={false}
                  enableMomentum={false}
                  inactiveSlideScale={0.7}
                  scrollEnabled={true}
                  decelerationRate={'fast'}
                  enableSnap={true}>
                  {slides}
                </Carousel>
              </View>}
            {!this.state.isEdit &&
              <View>
                <Carousel
                  ref={'carousel'}
                  sliderWidth={width}
                  itemWidth={itemWidth}
                  firstItem={this.state.type}
                  scrollEnabled={false}
                  inactiveSlideScale={0.6}
                  inactiveSlideOpacity={0.5}
                  showsHorizontalScrollIndicator={false}
                  enableMomentum={false}
                  decelerationRate={'fast'}
                  enableSnap={true}>
                  {slides}
                </Carousel>
              </View>}
            {this.state.isEdit ?
              <View>
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
                  <Text style={bookings.editlabel}>Betrag</Text>
                  <Textfield
                    password={false}
                    floatingLabelEnabled={false}
                    placeholder={(this.state.amount).toString()}
                    defaultValue={(this.state.amount).toString()}
                    onChangeText={(value) => this.setState({ amount: Number(value) })}
                    placeholderTextColor={Config.colors.secondaryColorText}
                    tintColor={Config.colors.secondaryColorText}
                    highlightColor={Config.colors.secondaryColorText}
                    color={Config.colors.secondaryColorText} />
                </View>
              </View>
              :
              <View>
                <View style={bookings.center}>
                  <Text style={bookings.editlabelInactive}>{this.state.payerName}</Text>
                </View>
                <View style={bookings.centerButton}>
                  <Button
                    transparent={false}
                    disabled={true}
                    title={this.state.amount + " " + this.state.currency}
                    marginTop={10}
                    fontSize={15}
                    borderColor={Config.colors.buttonColorDark}
                    backgroundColor={Config.colors.buttonColorDark}
                    borderWidth={0.5}
                    color={Config.colors.primaryColorText} />
                </View>
              </View>}
            {this.state.isEdit &&
              <View>
                <View style={bookings.center}>
                  <Text style={bookings.editlabel}>Name des Zahlenden</Text>
                </View>
                {crewButtons}
              </View>}
            <View style={bookings.alignImages}>
              {this.state.bookingImages.slice(0, 2).map((value, index) => this.renderBookingImage(value, index))}
            </View>
            <View style={bookings.alignImages}>
              {this.state.bookingImages.slice(2, 4).map((value, index) => this.renderBookingImage(value, index + 2))}
            </View>
              <View style={bookings.centerButton}>
                <Button
                  transparent={false}
                  onPress={() => this.refs['DeleteBookingModal'].toggle()}
                  title={'TÖRN LÖSCHEN'}
                  marginTop={30}
                  fontSize={10}
                  borderColor={Config.colors.warningColor}
                  borderWidth={0.5}
                  color={Config.colors.primaryColorText}
                  backgroundColor={Config.colors.warningColor} />
              </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderBookingImage(value, index) {
    console.log(value);
    const { navigate } = this.props.navigation;
    let imageTemplate = null;

    if (value.localSource && !this.state.isImageLoading[index]) {
      imageTemplate = (
        <Image
          style={{ height: 120, width: 120 }}
          source={value.localSource}
        />
      );
    }
    else if (!value.ref && this.state.isEdit && !this.state.isImageLoading[index]) {
      imageTemplate = (
        <View style={bookings.center}>
          <Text style={bookings.imgLabel}>Foto hinzufügen</Text>
          <Image source={require('friedensflotte/app/img/icons/turns/add_photo_20.png')} />
        </View>
      );
    }
    else if (value.ref || (this.state.isImageLoading[index] && !value.localSource)) {
      imageTemplate = (
        <View style={{ flex: 1 }}>
          <LoadingSpinner />
        </View>
      );
    }
    else if (value.localSource && this.state.isImageLoading[index]) {
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

  handleUpdateButtonClick() {
    if (!this.state.isImageLoading.includes(true)) {


      let filteredBookingImages = this.state.bookingImages.map((value) => {
        return {
          ref: value.ref
        };
      });

      this.bookingRef
        .set({
          date: this.state.date,
          type: this.refs['carousel'].currentIndex,
          currency: this.state.isEuro ? "EUR" : "HRK",
          payer: this.state.payer,
          amount: this.state.amount,
          bookingImages: filteredBookingImages,
        })
      this.setState({ isEdit: false });
      this.props.navigation.navigate('DetailView', {tripID: this.tripID, title: this.state.title});
      // TODO: show popup
    } else {
      this.refs["SaveBookingWhileUploadModal"].toggle();
    }
  }

  deleteImage(index) {

    RNFS.unlink(this.state.bookingImages[index].localSource.uri)
      .then((value) => {

      }).catch((error) => {
        console.error(error);
      });

    let updatedBookingImages = this.state.bookingImages.map((value, i) => {
      if (i == index) {
        return {};
      }
      else {
        return value;
      }
    });

    this.setState({ bookingImages: updatedBookingImages });

    this.bookingRef
      .set({
        date: this.state.date,
        type: this.refs['carousel'].currentIndex,
        currency: this.state.isEuro ? "EUR" : "HRK",
        payer: this.state.payer,
        amount: this.state.amount,
        bookingImages: updatedBookingImages,
      })

  }

  handleShowImagePress(index) {

  }

  async handleSelectImagePress(index) {

    let imageObject;

    this.setIsImageLoading(index, true);

    await ImageSelector.selecetNewImage()
      .then((image) => {
        imageObject = image;
        this.setState({
          bookingImages: this.state.bookingImages.map((value, i) => {
            if (i === index) {
              return ({
                ref: (value.ref) ? value.ref : null,
                localSource: image.source
              })
            } else {
              return value;
            }
          }),
        });
      }).catch((error) => {
        this.setIsImageLoading(index, false);
        console.log(error)
      }
      );

    if (imageObject) {
      await ImageUploader.uploadNewImage(imageObject)
        .then((uploadedFile) => {
          this.setState({
            bookingImages: this.state.bookingImages.map((value, i) => {
              if (i == index) {
                if (Platform.OS == "android") {
                  value.ref = uploadedFile.ref;
                } else {
                  value.ref = "/" + uploadedFile.ref;
                }
              }
              return value;
            }),
          });
          this.setIsImageLoading(index, false);
          console.log(this.state.isImageLoading);
        }).catch((error) => {
          this.setIsImageLoading(index, false);
          console.error(error);
        })
    }

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

  async downloadMissingImage(index) {
    try {

      if (this.state.bookingImages[index].ref) {

        const ref = this.state.bookingImages[index].ref;
        const localImageStore = RNFS.DocumentDirectoryPath + '/_mimmo/';

        //check if folder is available
        let isFolderAvailable = true;
        await RNFS.exists(localImageStore + 'bookingImages/')
          .then((value) => {
            isFolderAvailable = value;
          })
        console.log("Folder:", isFolderAvailable);


        //if not make new folder
        if (!isFolderAvailable) {
          const MkdirOptions = {
            NSURLIsExcludedFromBackupKey: true // iOS only
          };
          await RNFS.mkdir(localImageStore, MkdirOptions)
        }

        //check if file is available
        let isFileAvailable = true;
        await RNFS.exists(localImageStore + ref)
          .then((value) => {
            isFileAvailable = value;
          })

        console.log("File:", isFileAvailable);

        //if not download file
        if (!isFileAvailable) {
          await Firebase.storage()
            .ref(ref)
            .downloadFile(localImageStore + ref);
        }

        //set new local image source
        this.setState({
          bookingImages:
          this.state.bookingImages.map((value, i) => {
            if (i == index) {
              value.localSource = { uri: "file://" + localImageStore + ref }
            }
            return value;
          })
        });
      }

    } catch (err) {
      console.error(err);
    }
  }


  handleDeleteButtonPress() {
    this.bookingRef.remove();
    this.setState({ isEdit: false });
    this.refs['DeleteBookingModal'].toggle();
    this.props.navigation.goBack();
  }

  onDateChange({ date }) {
    let formattedDate = date.format('DD.MM.YYYY');
    this.setState({ date: formattedDate });
  }

  handleClick() {

    let bookingImages = new Array(4).fill({});

    if (this.state.bookingImages) {
      bookingImages = this.state.bookingImages;
      let newPlaceholder = new Array(4 - this.state.bookingImages.length).fill({});
      bookingImages.push(...newPlaceholder);
    }

    this.setState({
      isEdit: true,
      bookingImages: bookingImages
    });

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
    marginTop: 20,
    paddingLeft: 20,
  },
  editlabelInactive: {
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
  iconsRight: {
    height: 20,
    width: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  leftAction: { //rightAction in styles.js
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
});
