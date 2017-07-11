import {
  Platform,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import uuidV1 from 'uuid/v1';

import Firebase from 'friedensflotte/app/components/firebase';

class ImageUploader {

  uploadNewImage(image) {
    return new Promise((resolve, reject) => {

      let metadata = {
        contentType: `image/${image.type}`,
      };

      Firebase.storage()
        .ref('/bookingImages/' + image.filename)
        .putFile(image.source.uri,metadata)
        .then((uploadedFile) => {
          resolve(uploadedFile);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default new ImageUploader();
