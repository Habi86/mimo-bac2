import {
  Platform,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import uuidV1 from 'uuid/v1';
import RNFS from 'react-native-fs';

import Firebase from 'friedensflotte/app/components/firebase';

class ImageSelector {

  selecetNewImage() {
    return new Promise((resolve, reject) => {

      var options = {
        title: 'Bild für Buchungsbeleg auswählen.',
        mediaType: 'photo',
      };

      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          reject('User cancelled image picker');
        }
        else if (response.error) {
          reject(response.error);
        }
        else {
          const uuid = uuidV1();
          let type;

          if (Platform.OS == "android") {
            type = response.type.substring(response.type.lastIndexOf("/") + 1);
          } else {
            type = response.uri.substring(response.uri.lastIndexOf(".") + 1);
          }

          const localImageStore = RNFS.DocumentDirectoryPath + '/_mimmo/bookingImages/';

          const MkdirOptions = {
            NSURLIsExcludedFromBackupKey: true
          };

          RNFS.mkdir(localImageStore, MkdirOptions).then(() => {

            const path = localImageStore + uuid + '.' + type;
            const filename = uuid + '.' + type;

            RNFS.writeFile(path, response.data, 'base64')
              .then((success) => {
                resolve({ source: { uri: "file://" + path }, filename , type});
              })
              .catch((err) => {
                reject(err);
              });
          });
        }
      });
    })
  }
}

export default new ImageSelector();
