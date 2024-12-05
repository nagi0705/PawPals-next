// lib/appwrite.js
import { Client } from 'appwrite';

const client = new Client()
  .setEndpoint('http://localhost/v1') // Appwriteのエンドポイント（例: https://cloud.appwrite.io/v1）
  .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトID

export default client;