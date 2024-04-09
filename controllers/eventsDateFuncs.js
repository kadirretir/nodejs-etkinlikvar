const Event = require("../models/eventSchema");
const getDates = require("./getDates");
const mongoose = require('mongoose');

const {getDate, getTomorrowDate, getWeekRange, getWeekendRange, getNextWeekRange} = getDates;

// Sayfalama için gerekli fonksiyon
let lastId = null;

const getPaginatedEvents = async (dateFormats, page, category, province, currentHour, events) => {
  if (page > 4) {
    throw new Error("Maksimum 80 event gönderilebilir.");
  }
  let query = {
    status: { $ne: "cancelled" }
  };

   // Eğer page 1 ise, lastId'yi sıfırla
   if (page === 1) {
    lastId = null;
  } else if (lastId) {
    query._id = { $gt: lastId };
  }

  if (category) {
    // Eğer category varsa, eventCategory filtrelemesini yap
    query.eventCategory = category;
  }

  if (province) {
    // const [district, city] = province.split(",").map(part => part.trim());
    const selectedParts = province.split(",").map(s => s.trim());
    const selectedCity = selectedParts.length === 2 ? selectedParts[1]: selectedParts[0];
    const selectedDistrict = selectedParts.length === 2 ? selectedParts[0] : null;
    if (selectedDistrict) {
      query.$or = [
        { "cityName": selectedCity, "districtName": selectedDistrict },
        { "districtName": selectedDistrict }
      ];
    } else {
      query["cityName"] = selectedCity;
    }
  }

  if (Object.values(dateFormats).some(Array.isArray)) {
    const now = new Date(); // Şu anki tarih ve saat
    query.date = {
      $gte: dateFormats.week[0],
      $lte: dateFormats.week[1],
      $gt: now // Şu anki tarihten sonraki tarihleri getir
    };
  } 
  else {
    const today = new Date(); // Şu anın tarihini alır
    today.setHours(0, 0, 0, 0); // Saat kısmını sıfırlar (00:00:00)

    // İlgili tarihi al
    const targetDate = dateFormats instanceof Date ? dateFormats : new Date(today.getTime() + 86400000);

    query.date = {
        $gte: targetDate,
        $lt: new Date(targetDate.getTime() + 86400000) // Bir sonraki günün başlangıcı
    };
      if(currentHour) {
        query.$expr = {
          $gt: [
              { $dateToString: { format: "%H:%M", date: "$date", timezone: "Europe/Istanbul" } },
              currentHour
          ]
      };
      }

  }
// GENERALSEARCH İLE EVENT ARATILDIYSA, O EVENTLERİ GÖNDER
  if (events && events.length > 0) {
    // Eğer events dizisi doluysa, sorguya bu eventIds'i ekle
    query._id = { $in: events };  
}
    // Initialize an array to store combined events
    let combinedEvents = [];

    // Fetch events for each page iteratively
    for (let i = 1; i <= page; i++) {
        const currentPageEvents = await Event.find(query)
            .limit(20)
            .populate('attendees', 'profileImage username');

              // Check for week-based filtering and limit events
    if (currentPageEvents.length > 0 && Object.values(dateFormats).some(Array.isArray)) {
      const startOfWeek = dateFormats.week[0];
      const endOfWeek = dateFormats.week[1];

      const limitedEvents = [];
      const remainingEvents = []; // Array to store events outside the grouping

      for (let currentDate = new Date(startOfWeek); currentDate <= endOfWeek; currentDate.setDate(currentDate.getDate() + 1)) {
        const eventsForDay = currentPageEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === currentDate.getFullYear() &&
                 eventDate.getMonth() === currentDate.getMonth() &&
                 eventDate.getDate() === currentDate.getDate();
        });

        // Determine the number of events to take based on total count
        const eventsToTake = currentPageEvents.length > 70 ? 10 : 7;

        // Sort events for the day by date (ascending) and take the required number
        eventsForDay.sort((a, b) => a.date - b.date);
        limitedEvents.push(...eventsForDay.slice(0, Math.min(eventsToTake, eventsForDay.length)));

        // Add remaining events for the day to the 'remainingEvents' array
        remainingEvents.push(...eventsForDay.slice(eventsToTake));
      }

      combinedEvents = [...combinedEvents, ...limitedEvents, ...remainingEvents]; // Append limited and remaining events
    } else {
      combinedEvents = [...combinedEvents, ...currentPageEvents]; // Append as usual
    }


        // Update query for the next page (if applicable)
        if (currentPageEvents.length > 0 && i < page) {
            query._id = { $gt: currentPageEvents[currentPageEvents.length - 1]._id };
        }
    }

    return combinedEvents;
};

function groupEventsByDate(events) {
  const dateGroups = {};
  for (const event of events) {
    const dateString = event.date.toISOString().slice(0, 7); // Extract date part
    if (!dateGroups[dateString]) {
      dateGroups[dateString] = [];
    }
    dateGroups[dateString].push(event);
  }
  return dateGroups;
}


async function getTodaysEvents(page, events, category, province) {
  const formattedDate = getDate(); // Bugünün tarihi
  const dateObjFormat = new Date(formattedDate);
  const currentHour = formattedDate.substring(11, 16);
    // category ile filtre gerçekleştirildiyse category ile gönder
    let allEvents = [];
    if(category && province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, province, undefined, events)
    } else if (category) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, undefined, undefined, events)
    } else if (province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, province, undefined, events)
    } else {
    // eventIds dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
     allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, undefined, currentHour, events)
  
    }
      return allEvents;
      // return filterEventsToday(allEvents, dateObjFormat, currentHour);
}


async function getTomorrowsEvents (page, events, category, province) {
    const formattedDate = getTomorrowDate();
    const dateObjFormat = new Date(formattedDate);

    // category ile filtre gerçekleştirildiyse category ile gönder
    let allEvents = [];
    if(category && province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, province, undefined, events)
    } else if (category) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, undefined, undefined, events)
    } else if (province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, province, undefined, events)
    } else {
    // eventIds dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
     allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, undefined, undefined, events)
    }

    return allEvents;
  
}  


async function getThisWeeksEvents (page, events, category, province) {
    const { startOfWeek, endOfWeek } = getWeekRange();
        let newEvents = [];
        if(category && province) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, province, undefined, events)
        } else if (category) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, undefined, undefined, events)
        } else if (province) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, province, undefined, events)
        } else {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, undefined, undefined, events)
        }
        return newEvents;
}  



async function getThisWeekendEvents (page, events, category, province) {
    const { startOfWeekend, endOfWeekend } = getWeekendRange();
        let AllEvents = [];
        if(category && province) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, category, province, undefined, events)
        } else if (category) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, category, undefined, undefined, events);
        } else if (province) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, undefined, province, undefined, events);
        } else {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, undefined, undefined, undefined, events);
        }
        return AllEvents;

}  

async function getNextWeekEvents (page, events, category, province) {
    const {startOfWeek, endOfWeek} = getNextWeekRange();

        let allEvents = [];
        if(category && province) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, province, undefined, events)
        } else if (category) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, undefined, undefined, events)
        } else if (province) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, province, undefined, events)
        } else {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, undefined, undefined, events)
        }
        return allEvents;
} 


module.exports = {
    getTodaysEvents: getTodaysEvents,
    getTomorrowsEvents: getTomorrowsEvents,
    getThisWeeksEvents: getThisWeeksEvents,
    getThisWeekendEvents: getThisWeekendEvents,
    getNextWeekEvents: getNextWeekEvents
}
