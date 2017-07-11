const Config = {
  colors: {
    // ui elements
    primaryColor: '#56CCB6', //topnavi
    secondaryColor: '#52A8B9', //tabbar
    thirdColor: '#3C9887', //view title
    buttonColorDark: '#2E6A76', //buttons dark, active tab
    borderColorDark: '#95989A',
    mainBackgroundColor: '#EEEEEE',
    disabledActiveColorText: '#2E6A76', //tabbar
    disabledInactiveColorText: '#f7f7f7', //tabbar
    //text
    primaryColorText: '#f7f7f7',
    secondaryColorText: '#434343',
    thirdColorText :'#2E6A76', //person details
    selectedButtonColor:'rgba(97,97,97,0.3)',
    //special text
    warningColor: '#B23E39', //highlights, delete, minusbeträge, warning
    fontGreenColor: '#3C9887', //positiver kassenstand
    //grau
    grayColorDark: '#727272', //törn details
    grayColor: '#B7B7B7B7',
    grayColorLight: '#AAAAAA', //törn details lighter
    grayColorLighter: '#DDDDDD',
  },
  fonts:{
    mBlack: 'Muli-Black',
    mExtrabold: 'Muli-ExtraBold',
    mRegular: 'Muli-Regular',
    mBold: 'Muli-Bold',
    msemiBoldItalic: 'Muli-SemiBoldItalic',
    msemiBold: 'Muli-SemiBold',
    mBoldItalic: 'Muli-BoldItalic'

  },
  translations:{
    fbNetworkErr: 'Ein Netzwerkfehler ist aufgetreten (durch ein Timeout, Nichterreichen eines Hosts).',
    fbWrongPassword: 'E-Mail-Adresse und Passwort passen nicht zusammen oder das Passwort ist falsch.',
    fbEmailMalformatted: 'Die E-Mail-Adresse hat nicht das richtige Format.',
    fbTooManyRequests: 'Es wurden zuviele Zugriffe von diesem Gerät getätigt, bitte warte kurz und probiere es erneut.',
    fbUserDisabled: 'Der User wurde deaktiviert. Bitte registriere dich neu.',
    fbInvalidUserToken: 'Der User-Token ist invalid. Bitte versuche es noch einmal.',
    fbUsertTokenExp: 'Der User-Token ist leider abgelaufen. Bitte melde dich erneut an.',
    fbAccountExists: 'Es gibt schon einen Benutzer mit dieser E-Mail-Adresse. Bitte verwende eine andere E-Mail-Adresse.',
    fbRequireRecentLogin: 'Um dein Passwort zu ändern musst du eingeloggt sein.',
    fbWeakPassword: 'Das Passwort ist unsicher, bitte verwende ein anderes.',
    fbUserNotFound: 'Der User mit der angegebenen E-Mail-Adresse konnte nicht gefunden werden.',
    fbInternalError: 'Ein interner Fehler ist aufgetreten, bitte wende dich an den App-Hersteller.'
  }
}

export default Config
