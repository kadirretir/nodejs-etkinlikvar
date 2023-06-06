const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const options = {
  dbName: "etkinlikvar"
};

let connection; // Bağlantıyı saklamak için bir değişken oluşturun

const connectToDb = async () => {
  try {
    if (!connection) {
      // Bağlantı yoksa bağlantıyı oluştur
      connection = await mongoose.connect(uri, options);
      console.log("MONGODB BAĞLANTISI SAĞLANDI");

      // Bağlantı olayları için olay dinleyicilerini ekleyin
      connection.connection.on("error", (err) => {
        console.error(err);
      });

      connection.connection.on("disconnected", () => {
        console.log("MONGODB BAĞLANTISI KAPATILDI");
        connection = null; // Bağlantıyı null olarak ayarla
      });
    }

    return connection;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = connectToDb;