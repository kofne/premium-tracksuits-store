
console.log('PROJECT_ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
console.log('CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
console.log('PRIVATE_KEY length:', process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length);

if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('One or more environment variables are missing!');
  process.exit(1);
}
