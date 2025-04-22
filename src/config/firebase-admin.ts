
import * as admin from 'firebase-admin';

const serviceAccount = {
  "type": "service_account",
  "project_id": "decor-haven",
  "private_key_id": "5c7bf690698612a5ed38b4acb9bc638636798c2e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyCcGbtG6xuA/9\nCTSxuu6k0lhA/DuMGNpwlMSFpS6pCrcLz7hIIHp+xVhiknuA1aA+vRpnEeo8mnry\nphOTa7riRHzyV/HqfDbiZ0o6XzHXE1ElED/+Dq+g9ucfgzhTs4QQBvMFR6JScvqL\nPbf1S6m+VJ7u74d/NDLoVW85/Lr1a99m/4h3OQh5DFjKnbAiQNcgBXOS02/VNI3A\ncSU0ANmm7ttzn0v1toQM7wN8hAJuPRX6ureMh1hCiafrhs933P1fk5uOkLhu6uBl\n+6Sp8puP2+15r0C/e7dMylfdwNmAG2CSJZF079XaaBXvyMJrws6k6234qMW8dIdP\ng8rzPtyZAgMBAAECggEAEMFO9tqt3uHQog1KEpPiE6GMFrQ7h71rCVSm2LZT7tVd\npqnqJjeQRPqeN8tLU4jx52r1NNAAeFWdeSqHWxoKC3NLQvoN1UsoAHnyCA5KFXtG\n6V20eAdlIJk75RZR/bvo6M05SmeUb31MoOqyXk5m73eX7CqfWNROb4O4JP/o5GHA\ndgaHZFJxQPnXgm9umPkyH60t4kwgPv0t/95PxOCn+QI3994Fdd9dDzBr5zQzlABA\nGmXV8hjoPKkkoZIlkcjurr3a4JRsw6m09jwb1Yu3T3/K+A0R18ZejnPIPyF9KSbk\nSHfyfHEDC/h5kQGI7JeEP5Fb0jOhWTy3U3RpYV4NJQKBgQDtOmX+ZV9dys43gTsK\nN2Mr22Otf2gVJVEVOXrds01OVdd+VFlyWj6RzqAM3ma4IHjwC4t0Mo/rGensftR1\n2cxm7zsEayYQkpZF5dNZj+CdGedrZHzg4OZUF2R/4TcseP9e/3zXMSbilKlTclrU\npa7PU2dMOPw9mFrxxBN+sPF/JwKBgQDAIFP4cUR0H5R1M64CXSgPGOKR+pkO7rLF\nHnn+0Qbo7bA79GWTRYPquLg8C94q3+661XBqG5L3UzU9xIxPaNwlKqJEU/6kCdR8\n1urf0jaKLXA/gyyfj6gQz6obcEiUxml3qJfA0hA5jtg4/FbP+v6rY2Ff3/0vLwN3\nIIAa4AYePwKBgQCQsylZZi4ogLcOhiYkEirMqpJ/VpJ/K3bs0lXOezrxSE0cgojY\nxpEZ0QYxM0tGjpAWI4SZiOneRr04AxjHFeWm989w34alXzSISCqFm8wvJ4jQKcg+\nRxBXRLmJgy9rUha6tG5KuHF2jaVHAB7FTJZ3YfFFPhEl5RO8GpSll3qGywKBgBN+\ntEaPZ7zIv42s8sk2nqv5gHQDk6haPDWYRBTBLQxRogJTaEMrWJlmqPse0SpUkqrO\noZuCtMT34n0kBoDASSZUTybTxxDqFm+cdzTC5dnbhnpLWynNr+YUzFQAbrz57RXB\nO7TLG+5bOkF+CWkNNO47JVRPLCevg5CA8b7IYJaNAoGAZ0Faw/9EWgyZvxs6txgr\nG3eiIYdtohgcunyIxmMGtBxcn7VuTqGcdGtzz56aQDmZnWAA7iJedC5mmhkks2fc\n1z3WknEw/tbz2oeA7bdBw7q3s35NyphtiE0z2KVCESBGFqHB0o+27QQLyR/+AOo0\njns3M5sAfL2jC1+vpzQTjnQ=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@decor-haven.iam.gserviceaccount.com",
  "client_id": "106395594733029026192",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40decor-haven.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;
