require('dotenv').config({ path: '.env.local' });

console.log('PRIVATE_KEY length:', process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length);
console.log('PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
console.log('EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
