const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

async function cloneDocument(cloneCount) {
  const uri = 'mongodb+srv://kadirretir:tontonrecep123456@etkinlikvarcluster.r1l1zum.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db('etkinlikvar').collection('events');
    const originalDocument = await collection.findOne({ _id: new ObjectId("64b47d30138830dbaca67307") });

    if (!originalDocument) {
        console.error('Klonlama işlemi için belge bulunamadı.');
        return;
      }

    for (let i = 0; i < cloneCount; i++) {
      const cloneDocument = { ...originalDocument };
      delete cloneDocument._id; // Yeni bir _id oluşturmak için _id alanını kaldırabilirsiniz
      await collection.insertOne(cloneDocument);
    }

    console.log(`${cloneCount} doküman başarıyla klonlandı.`);
  } catch (error) {
    console.error('Klonlama işlemi sırasında bir hata oluştu:', error);
  } finally {
    await client.close();
  }
}

module.exports = cloneDocument;
