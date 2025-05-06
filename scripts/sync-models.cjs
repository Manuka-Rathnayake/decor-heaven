const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const PUBLIC_MODELS_DIR = './public/models';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

console.log("🔁 Starting model sync...");

async function syncModels() {
  if (!fs.existsSync(PUBLIC_MODELS_DIR)) {
    fs.mkdirSync(PUBLIC_MODELS_DIR, { recursive: true });
    console.log(`📁 Created: ${PUBLIC_MODELS_DIR}`);
  }

  try {
    const snapshot = await firestore.collection('products').get();
    const currentFiles = new Set();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const modelUrl = data.modelUrl;

      if (!modelUrl) continue;

      const url = new URL(modelUrl);
      const pathName = decodeURIComponent(url.pathname);
      const name = path.basename(pathName.split("/o/")[1]);
      const destPath = path.join(PUBLIC_MODELS_DIR, name);
      currentFiles.add(name);

      if (fs.existsSync(destPath)) {
        console.log(`✅ Skipping (already exists): ${name}`);
        continue;
      }

      console.log(`⬇️ Downloading: ${name}`);
      const res = await fetch(modelUrl);
      if (!res.ok) {
        console.error(`❌ Failed to fetch ${name}:`, res.status);
        continue;
      }

      const stream = fs.createWriteStream(destPath);
      await new Promise((resolve, reject) => {
        res.body.pipe(stream);
        res.body.on('error', reject);
        stream.on('finish', resolve);
      });

      console.log(`📦 Saved: ${destPath}`);
    }

    // Delete local files no longer in Firestore
    const localFiles = fs.readdirSync(PUBLIC_MODELS_DIR);
    for (const file of localFiles) {
      if (!currentFiles.has(file)) {
        fs.unlinkSync(path.join(PUBLIC_MODELS_DIR, file));
        console.log(`🗑️ Deleted: ${file}`);
      }
    }

    console.log("✅ Model sync completed.");
  } catch (err) {
    console.error("🔥 Sync failed:", err);
  }
}

syncModels();
