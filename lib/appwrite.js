import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteエンドポイント
  .setProject('675183a100255c6c9a3f'); // AppwriteプロジェクトID

const databases = new Databases(client);

export { client, databases };