 // get current DATE
 const getDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Ay indeksi 0'dan başlar, bu yüzden 1 ekliyoruz.
  const year = currentDate.getFullYear();

  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minute = String(currentDate.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}.${month}.${day} ${hour}:${minute}`;
  return formattedDate;
}



const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.getDate();
  const month = tomorrow.getMonth() + 1;
  const year = tomorrow.getFullYear();
  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  return formattedDate;
};

const getWeekRange = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const startOfWeek = new Date(year, month, day - (currentDate.getDay() + 6) % 7);
  const endOfWeek = new Date(year, month, day + (6 - currentDate.getDay() + 7) % 7 + 1);

  // Hafta sonu güncellemesi
  if (endOfWeek.getDay() === 0) {
    // Eğer endOfWeek Pazar günü ise
    endOfWeek.setDate(endOfWeek.getDate() + 1); // endOfWeek'u Pazartesi gününe taşı
  } else if (endOfWeek.getDay() === 6) {
    // Eğer endOfWeek Cumartesi günü ise
    endOfWeek.setDate(endOfWeek.getDate() + 2); // endOfWeek'ü Pazartesi gününe taşı
  }

  return { startOfWeek, endOfWeek };
};



const getWeekendRange = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const startOfWeekend = new Date(currentDate);
  const endOfWeekend = new Date(currentDate);

  // Şu anki günü kontrol et ve hafta sonu günlerini ayarla
  if (currentDay === 0) { // Pazar
    startOfWeekend.setDate(currentDate.getDate() + 6); // Bir sonraki Cumartesi
    endOfWeekend.setDate(currentDate.getDate() + 7); // Bir sonraki Pazar
  } else if (currentDay === 6) { // Cumartesi
    startOfWeekend.setDate(currentDate.getDate()); // Aynı gün
    endOfWeekend.setDate(currentDate.getDate() + 1); // Bir sonraki Pazar
  } else { // Diğer günler
    startOfWeekend.setDate(currentDate.getDate() + (6 - currentDay)); // Bir sonraki Cumartesi
    endOfWeekend.setDate(currentDate.getDate() + (7 - currentDay)); // Bir sonraki Pazar
  }

  // Saat, dakika ve saniye bilgilerini sıfırla
  startOfWeekend.setHours(0, 0, 0, 0);
  endOfWeekend.setHours(23, 59, 59, 999);

  return { startOfWeekend, endOfWeekend };
};


const getNextWeekRange = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay() + 1));
  const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay() + 7));
  return { startOfWeek, endOfWeek };
};

module.exports = {
  getDate: getDate,
  getTomorrowDate: getTomorrowDate,
  getWeekRange: getWeekRange,
  getWeekendRange: getWeekendRange,
  getNextWeekRange: getNextWeekRange
}