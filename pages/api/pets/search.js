import { Client, Databases, Query } from 'appwrite';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // クエリパラメータを取得
  const { name, species, breed, age } = req.query;

  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID);

    const databases = new Databases(client);

    // 検索クエリの構築
    let queries = [];

    if (name) {
      queries.push(Query.search('name', name));
    }
    if (species) {
      queries.push(Query.equal('species', species));
    }
    if (breed) {
      queries.push(Query.equal('breed', breed));
    }
    if (age) {
      queries.push(Query.equal('age', parseInt(age)));
    }

    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PETS_COLLECTION_ID,
      queries
    );

    return res.status(200).json(response.documents);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
}