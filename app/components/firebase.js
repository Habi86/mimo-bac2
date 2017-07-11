import RNFirebase from 'react-native-firebase';
const configurationOptions = {
  debug: true,
  persistence: true,
};
const Firebase = new RNFirebase(configurationOptions);

export default Firebase
