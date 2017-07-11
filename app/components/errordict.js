import Config from 'friedensflotte/app/config/config';

const ErrorDic = new Map([
    ['auth/wrong-password', Config.translations.fbWrongPassword ],
    ['auth/network-request-failed', Config.translations.fbNetworkErr ],
    ['auth/invalid-user-token', Config.translations.fbInvalidUserToken ],
    ['auth/user-token-expired', Config.translations.fbUsertTokenExp ],
    ['auth/user-disabled', Config.translations.fbUserDisabled ],
    ['auth/too-many-requests', Config.translations.fbTooManyRequests ],
    ['auth/invalid-email', Config.translations.fbEmailMalformatted ],
    ['auth/account-exists-with-different-credential', Config.translations.fbAccountExists ],
    ['auth/email-already-in-use', Config.translations.fbAccountExists ], //Maybe change those to FIRAuthErrorCode
    ['auth/requires-recent-login', Config.translations.fbRequireRecentLogin ],
    ['auth/weak-password', Config.translations.fbWeakPassword ],
    ['auth/user-not-found', Config.translations.fbUserNotFound ],
    ['auth/internal-error', Config.translations.fbInternalError ],
]);

export default ErrorDic
