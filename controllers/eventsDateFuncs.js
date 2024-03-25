const Event = require("../models/eventSchema");
const getDates = require("./getDates");
const mongoose = require('mongoose');

const {getDate, getTomorrowDate, getWeekRange, getWeekendRange, getNextWeekRange} = getDates;
// -------------------------FILTERING FOR TODAY EVENTS FUNCTION----------------------------
function filterEventsToday(events, dateObjFormat, currentHour) {
    return events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
        const eventSaat = String(turkiyeZamanDilimi.getHours()).padStart(2, '0');
        const eventDakika = String(turkiyeZamanDilimi.getMinutes()).padStart(2, '0');
    
        const isSameDay = turkiyeZamanDilimi.toDateString() === dateObjFormat.toDateString();
        const isLaterTime = `${eventSaat}:${eventDakika}` > currentHour;
    
        return isSameDay && isLaterTime;
      });
  }


async function getTodaysEvents(events) {
  const formattedDate = getDate(); // Bugünün tarihi
  const dateObjFormat = new Date(formattedDate);
  const currentHour = formattedDate.substring(11, 16);

  if (events.length > 0) {
    // eventIds dizisi doluysa, ObjectId'lerle filtreleme fonksiyonunu kullan
    const findGenerallySearchedEvents = await Event.find({_id: events})
    return filterEventsToday(findGenerallySearchedEvents, dateObjFormat, currentHour);
  } else {
    // eventIds dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
    const allEvents = await Event.find({ 
      date: { $gte: dateObjFormat }, // Belirtilen tarihten sonraki etkinlikleri getirir
      status: { $ne: "cancelled" } // "cancelled" durumuna sahip olmayan etkinlikleri getirir
    }).limit(40);
    return filterEventsToday(allEvents, dateObjFormat, currentHour);
  }
}




// ----------------------FILTERING FOR Tomorrow EVENTS FUNCTION----------------------------
function filterEventsTomorrow(events, dateObjFormat) {
    return events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
        const isSameDay = turkiyeZamanDilimi.toDateString() === dateObjFormat.toDateString();
        return isSameDay 
      });
  }


async function getTomorrowsEvents (events) {
    const formattedDate = getTomorrowDate();
    const dateObjFormat = new Date(formattedDate);

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await Event.find({_id: events})
        return filterEventsTomorrow(findGenerallySearchedEvents, dateObjFormat);
 
      } else {
        // events dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
        const allEvents = await Event.find({ 
            date: { $gte: dateObjFormat }, // Belirtilen tarihten sonraki etkinlikleri getirir
            status: { $ne: "cancelled" } // "cancelled" durumuna sahip olmayan etkinlikleri getirir
        }).limit(40);
        return filterEventsTomorrow(allEvents, dateObjFormat);
      }
}  


//---------------------- FILTER EVENTS FOR THIS WEEK--------------------------------------

function filterEventsThisWeek(events, startOfWeek, endOfWeek) {
    return events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    
        const isWithinWeek = turkiyeZamanDilimi >= startOfWeek && turkiyeZamanDilimi <= endOfWeek;
        const isLaterTime = turkiyeZamanDilimi > new Date();
    
        return isWithinWeek && isLaterTime;
      });
  }

async function getThisWeeksEvents (events) {
    const { startOfWeek, endOfWeek } = getWeekRange();

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await Event.find({_id: events})
        return filterEventsThisWeek(findGenerallySearchedEvents, startOfWeek, endOfWeek);
      } else {
        const allEvents = await Event.find({ 
            date: { 
              $gte: startOfWeek, // Bu hafta başlangıç tarihinden büyük veya eşit olan
              $lte: endOfWeek     // Bu hafta bitiş tarihinden küçük veya eşit olan
            },
            status: { $ne: "cancelled" }
          }).limit(40);
        return filterEventsThisWeek(allEvents, startOfWeek, endOfWeek);
      }
}  


// ------------------------------ FILTER EVENTS THIS WEEKEND -------------------------
function filterEventsThisWeekend(events, startOfWeekend, endOfWeekend) {
    return events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));

        const isWithinWeek = turkiyeZamanDilimi >= startOfWeekend && turkiyeZamanDilimi <= endOfWeekend;
        const isLaterTime = turkiyeZamanDilimi > new Date();

         return isWithinWeek && isLaterTime;
      });
  }


async function getThisWeekendEvents (events) {
    const { startOfWeekend, endOfWeekend } = getWeekendRange();

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await Event.find({_id: events})
        return filterEventsThisWeekend(findGenerallySearchedEvents, startOfWeekend, endOfWeekend);
      } else {
        const allEvents = await Event.find({ 
            date: { 
              $gte: startOfWeekend, // Bu hafta başlangıç tarihinden büyük veya eşit olan
              $lte: endOfWeekend     // Bu hafta bitiş tarihinden küçük veya eşit olan
            },
            status: { $ne: "cancelled" }
          }).limit(40);
        return filterEventsTomorrow(allEvents, startOfWeekend, endOfWeekend);
      }
}  


// ------------------------------ FILTER EVENTS NEXT WEEK -------------------------
function filterEventsNextWeek (events, startOfWeek, endOfWeek) {
    return events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));

        const isWithinWeek = turkiyeZamanDilimi >= startOfWeek && turkiyeZamanDilimi <= endOfWeek;
        const isLaterTime = turkiyeZamanDilimi > new Date();

        return isWithinWeek && isLaterTime;
      });
  }


async function getNextWeekEvents (events) {
    const {startOfWeek, endOfWeek} = getNextWeekRange();

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await Event.find({_id: events})
        return filterEventsNextWeek(findGenerallySearchedEvents, startOfWeek, endOfWeek);
      } else {
        const allEvents = await Event.find({ 
            date: { 
              $gte: startOfWeek, // Bu hafta başlangıç tarihinden büyük veya eşit olan
              $lte: endOfWeek     // Bu hafta bitiş tarihinden küçük veya eşit olan
            },
            status: { $ne: "cancelled" }
          }).limit(40);
        return filterEventsTomorrow(allEvents, startOfWeek, endOfWeek);
      }
} 


module.exports = {
    getTodaysEvents: getTodaysEvents,
    getTomorrowsEvents: getTomorrowsEvents,
    getThisWeeksEvents: getThisWeeksEvents,
    getThisWeekendEvents: getThisWeekendEvents,
    getNextWeekEvents: getNextWeekEvents
}
