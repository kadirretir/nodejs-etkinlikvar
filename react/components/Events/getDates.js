 // get current DATE
 const getDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Ay indeksi 0'dan başlar, bu yüzden 1 ekliyoruz.
    const year = currentDate.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
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
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));
    return { startOfWeek, endOfWeek };
  };
  
  const getWeekendRange = () => {
    const currentDate = new Date();
    const startOfWeekend = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 5));
    const endOfWeekend = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));
    return { startOfWeekend, endOfWeekend };
  };

  const getNextWeekRange = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay() + 1)));
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay() + 7)));
    return { startOfWeek, endOfWeek };
  };

module.exports = {
    getDate: getDate,
    getTomorrowDate: getTomorrowDate,
    getWeekRange: getWeekRange,
    getWeekendRange: getWeekendRange,
    getNextWeekRange: getNextWeekRange
}