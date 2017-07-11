//just for basic styles - use components stylesheet if possible
import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';

import Config from 'friedensflotte/app/config/config';

const styles = StyleSheet.create({
  containerMain:{
    flex: 1,
    //backgroundColor: Config.colors.primaryColor,
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "stretch",
  },
  container:{
    flex: 1,
    backgroundColor: Config.colors.primaryColor,
  },
  tabView: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    width: Dimensions.get('window').width,
    flex: 2,
    //padding: 35,
    padding: 5,
    backgroundColor: Config.colors.mainBackgroundColor,
    elevation: 0,
  },
  card2: {
      flex: 1,flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: "#F7F7F7",
      borderWidth: 0,
      shadowOffset: {
            width: 0,
            height: 0,
        },
      shadowRadius: 0,
      shadowOpacity: 0,
  },
  profileView: {
    width: Dimensions.get('window').width,
    flex: 2,
    backgroundColor: Config.colors.mainBackgroundColor,
    padding: 10,
  },
  loginfield:{
    marginBottom: 30,
  },
  pwIcons:{
    width: 25,
    height: 25,
    marginLeft: -40,
  },
  pwIconsBlack:{
    width: 25,
    height: 25,
    marginLeft: -40,
    tintColor: Config.colors.secondaryColorText,
  },
  btn:{
      borderColor: Config.colors.primaryColorText, borderWidth: 1,
  },
  centerButton:{
    flexDirection:'row',
    justifyContent:'center',
    marginBottom: 40,
  },
  text:{
    color: Config.colors.primaryColorText,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: Config.fonts.mBlack,
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textDark:{
    color: Config.colors.secondaryColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.mExtrabold,
    fontSize: 12,
    fontWeight: 'normal',
  },
  error:{
    fontFamily: Config.fonts.mRegular,
    fontSize: 12,
    lineHeight: 15,
    color: Config.colors.warningColor,
    backgroundColor: 'transparent',
  },
  modaltext:{
    color: Config.colors.secondaryColorText,
    textAlign: 'center',
    fontFamily: Config.fonts.msemiBold,
    fontSize: 18,
  },
  modalIcon:{
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent:{
    alignItems: 'center',
  },
  buttonRow:{
    flexDirection:'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  rightAction:{
    color: Config.colors.grayColorDark,
    textAlign: 'right',
    fontFamily: Config.fonts.mBold,
    fontSize: 20,
    marginLeft:30,
  },
});

export default styles
