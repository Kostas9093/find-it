import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// All the text of the app lives here, in English (en) and Greek (el).
// To change wording, edit these strings. To add a language, add another block.
const resources = {
  en: {
    translation: {
      appName: 'Find It',

      // Auth
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      login: 'Log in',
      signup: 'Create account',
      logout: 'Log out',
      createAccount: 'Create your account',
      welcomeBack: 'Welcome back',
      privacyNote:
        'Your email is only used for login and password recovery. The items you save stay on this device and are never uploaded.',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      resetPasswordTitle: 'Reset your password',
      resetEmailSent: 'Check your email for a link to reset your password.',
      sendResetLink: 'Send reset link',
      backToLogin: 'Back to log in',
      passwordsDontMatch: 'Passwords do not match.',
      passwordTooShort: 'Password must be at least 6 characters.',
      emailInUse: 'That email already has an account. Try logging in.',
      invalidEmail: 'Please enter a valid email address.',
      wrongCredentials: 'Incorrect email or password.',
      configNotSet:
        'The app is not connected to Firebase yet. Add your Firebase keys in src/firebase.js (see SETUP.md, Step 2).',
      emailAuthDisabled:
        'Email/Password sign-in is turned off in Firebase. Enable it under Authentication → Sign-in method.',
      networkError: 'No internet connection. Please check it and try again.',

      // Home
      homeTitle: 'What would you like to do?',
      addItemOption: 'Add an item location',
      findItemOption: 'Find an item location',
      fingerprintLock: 'Fingerprint lock',
      fingerprintLockHint: 'Require your fingerprint to open the app.',
      unlockPrompt: 'Use your fingerprint to open Find It.',
      unlockWithFingerprint: 'Unlock with fingerprint',
      unlock: 'Unlock',
      lockTitle: 'Enter your password to continue',
      logOutInstead: 'Forgot it? Log out and sign in with email',
      noFingerprint:
        'No fingerprint is set up on this phone yet. Add one in your phone settings, then try again.',
      pluginNeeded:
        'Fingerprint is not active yet. In Median, enable the "Face ID / Touch ID / Android Biometrics" plugin (Native Plugins tab), then rebuild and reinstall the app.',

      // Add item
      addItemTitle: 'Add an item location',
      itemNameLabel: 'Name or nickname of the item',
      itemNamePlaceholder: 'e.g. Passport, Spare key',
      itemDescriptionLabel: 'Description',
      itemDescriptionPlaceholder: 'A few words to help you remember it',
      itemLocationLabel: 'Where did you store it?',
      itemLocationPlaceholder: 'e.g. Bedroom drawer, behind the books',
      save: 'Save',
      saving: 'Saving...',
      itemSaved: 'Saved! You can find it later by name or description.',

      // Find item
      findItemTitle: 'Find an item location',
      searchPlaceholder: 'Type a name or a few words from the description',
      storedIn: 'Stored in',
      noResults: 'No matching items found.',
      startTyping: 'Start typing to search your items.',
      delete: 'Delete',
      cancel: 'Cancel',
      confirmDeleteTitle: 'Delete this item?',
      confirmDeleteMessage:
        'This will permanently remove "{{name}}" from this device. This cannot be undone.',
      itemDeleted: 'Item deleted.',

      // General
      back: 'Back',
      required: 'Please fill in the name and location.',
      somethingWrong: 'Something went wrong. Please try again.',
      loading: 'Loading...',
    },
  },
  el: {
    translation: {
      appName: 'Find It',

      // Auth
      email: 'Email',
      password: 'Κωδικός',
      confirmPassword: 'Επιβεβαίωση κωδικού',
      login: 'Σύνδεση',
      signup: 'Δημιουργία λογαριασμού',
      logout: 'Αποσύνδεση',
      createAccount: 'Δημιουργήστε τον λογαριασμό σας',
      welcomeBack: 'Καλώς ήρθατε ξανά',
      privacyNote:
        'Το email χρησιμοποιείται μόνο για σύνδεση και ανάκτηση κωδικού. Τα αντικείμενα που αποθηκεύετε παραμένουν σε αυτή τη συσκευή και δεν ανεβαίνουν ποτέ online.',
      forgotPassword: 'Ξεχάσατε τον κωδικό;',
      noAccount: 'Δεν έχετε λογαριασμό;',
      haveAccount: 'Έχετε ήδη λογαριασμό;',
      resetPasswordTitle: 'Επαναφορά κωδικού',
      resetEmailSent: 'Ελέγξτε το email σας για τον σύνδεσμο επαναφοράς κωδικού.',
      sendResetLink: 'Αποστολή συνδέσμου',
      backToLogin: 'Επιστροφή στη σύνδεση',
      passwordsDontMatch: 'Οι κωδικοί δεν ταιριάζουν.',
      passwordTooShort: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.',
      emailInUse: 'Υπάρχει ήδη λογαριασμός με αυτό το email. Δοκιμάστε σύνδεση.',
      invalidEmail: 'Εισάγετε έγκυρη διεύθυνση email.',
      wrongCredentials: 'Λάθος email ή κωδικός.',
      configNotSet:
        'Η εφαρμογή δεν είναι συνδεδεμένη με το Firebase. Προσθέστε τα κλειδιά στο src/firebase.js (δείτε SETUP.md, Βήμα 2).',
      emailAuthDisabled:
        'Η σύνδεση με Email/Κωδικό είναι απενεργοποιημένη στο Firebase. Ενεργοποιήστε την από Authentication → Sign-in method.',
      networkError: 'Δεν υπάρχει σύνδεση στο διαδίκτυο. Ελέγξτε τη και δοκιμάστε ξανά.',

      // Home
      homeTitle: 'Τι θα θέλατε να κάνετε;',
      addItemOption: 'Προσθήκη τοποθεσίας αντικειμένου',
      findItemOption: 'Εύρεση τοποθεσίας αντικειμένου',
      fingerprintLock: 'Κλείδωμα με δακτυλικό αποτύπωμα',
      fingerprintLockHint: 'Απαιτείται το δακτυλικό σας αποτύπωμα για να ανοίξει η εφαρμογή.',
      unlockPrompt: 'Χρησιμοποιήστε το δακτυλικό σας αποτύπωμα για να ανοίξετε το Find It.',
      unlockWithFingerprint: 'Ξεκλείδωμα με δακτυλικό αποτύπωμα',
      unlock: 'Ξεκλείδωμα',
      lockTitle: 'Εισάγετε τον κωδικό σας για να συνεχίσετε',
      logOutInstead: 'Το ξεχάσατε; Αποσυνδεθείτε και συνδεθείτε με email',
      noFingerprint:
        'Δεν έχει οριστεί δακτυλικό αποτύπωμα σε αυτό το τηλέφωνο. Προσθέστε ένα στις ρυθμίσεις και δοκιμάστε ξανά.',
      pluginNeeded:
        'Το δακτυλικό αποτύπωμα δεν είναι ενεργό. Στο Median, ενεργοποιήστε το plugin "Face ID / Touch ID / Android Biometrics" (καρτέλα Native Plugins), και ξαναφτιάξτε/επανεγκαταστήστε την εφαρμογή.',

      // Add item
      addItemTitle: 'Προσθήκη τοποθεσίας αντικειμένου',
      itemNameLabel: 'Όνομα ή παρατσούκλι του αντικειμένου',
      itemNamePlaceholder: 'π.χ. Διαβατήριο, Εφεδρικό κλειδί',
      itemDescriptionLabel: 'Περιγραφή',
      itemDescriptionPlaceholder: 'Λίγες λέξεις για να το θυμάστε',
      itemLocationLabel: 'Πού το αποθηκεύσατε;',
      itemLocationPlaceholder: 'π.χ. Συρτάρι κρεβατοκάμαρας, πίσω από τα βιβλία',
      save: 'Αποθήκευση',
      saving: 'Αποθήκευση...',
      itemSaved: 'Αποθηκεύτηκε! Θα το βρείτε αργότερα με το όνομα ή την περιγραφή.',

      // Find item
      findItemTitle: 'Εύρεση τοποθεσίας αντικειμένου',
      searchPlaceholder: 'Πληκτρολογήστε όνομα ή λίγες λέξεις από την περιγραφή',
      storedIn: 'Αποθηκευμένο σε',
      noResults: 'Δεν βρέθηκαν αντικείμενα.',
      startTyping: 'Ξεκινήστε να πληκτρολογείτε για αναζήτηση.',
      delete: 'Διαγραφή',
      cancel: 'Ακύρωση',
      confirmDeleteTitle: 'Διαγραφή αυτού του αντικειμένου;',
      confirmDeleteMessage:
        'Θα αφαιρεθεί οριστικά το "{{name}}" από αυτή τη συσκευή. Δεν μπορεί να αναιρεθεί.',
      itemDeleted: 'Το αντικείμενο διαγράφηκε.',

      // General
      back: 'Πίσω',
      required: 'Συμπληρώστε το όνομα και την τοποθεσία.',
      somethingWrong: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
      loading: 'Φόρτωση...',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en', // remember last choice
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
