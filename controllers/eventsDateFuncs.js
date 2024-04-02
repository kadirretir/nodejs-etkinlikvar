const Event = require("../models/eventSchema");
const getDates = require("./getDates");
const mongoose = require('mongoose');

const {getDate, getTomorrowDate, getWeekRange, getWeekendRange, getNextWeekRange} = getDates;

// Sayfalama için gerekli fonksiyon
let lastId = null;

const getPaginatedEvents = async (dateFormats, page, category, province, currentHour) => {
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
    const today = new Date(dateFormats.toISOString().split('T')[0]); // 2024-04-02
    query.date = {
        $gte: today,
        $lt: new Date(today.getTime() + 86400000) // Add one day to get the end of the day
    }
      if(currentHour) {
        query.$expr = {
          $gt: [
              { $dateToString: { format: "%H:%M", date: "$date", timezone: "Europe/Istanbul" } },
              currentHour
          ]
      };
      }

  }

    // Initialize an array to store combined events
    let combinedEvents = [];

    // Fetch events for each page iteratively
    for (let i = 1; i <= page; i++) {
        const currentPageEvents = await Event.find(query)
            .limit(20)
            .populate('attendees', 'profileImage username');

        combinedEvents = [...combinedEvents, ...currentPageEvents]; // Append events

        // Update query for the next page (if applicable)
        if (currentPageEvents.length > 0 && i < page) {
            query._id = { $gt: currentPageEvents[currentPageEvents.length - 1]._id };
        }
    }

    return combinedEvents;
};



const getPaginatedGeneralSearched = async (eventsIds, page, limit = 20) => {
  const skip = (page - 1) * limit;
  return Event.find({ _id: { $in: eventsIds } })
    .skip(skip)
    .limit(limit)
    .populate('attendees');
};



async function getTodaysEvents(page, events, category, province) {
  const formattedDate = getDate(); // Bugünün tarihi
  const dateObjFormat = new Date(formattedDate);
  const currentHour = formattedDate.substring(11, 16);
  if (events.length > 0) {
    // eventIds dizisi doluysa, ObjectId'lerle filtreleme fonksiyonunu kullan
    const findGenerallySearchedEvents = await getPaginatedGeneralSearched(events, page)            
    return filterEventsToday(findGenerallySearchedEvents, dateObjFormat, currentHour);
  } else {
    // category ile filtre gerçekleştirildiyse category ile gönder
    let allEvents = [];
    if(category && province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, province)
    } else if (category) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category)
    } else if (province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, province)
    } else {
    // eventIds dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
     allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, undefined, currentHour)
  
    }
      return allEvents;
      // return filterEventsToday(allEvents, dateObjFormat, currentHour);
  }
}






async function getTomorrowsEvents (page, events, category, province) {
    const formattedDate = getTomorrowDate();
    const dateObjFormat = new Date(formattedDate);

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await getPaginatedGeneralSearched(events, page)
        return filterEventsTomorrow(findGenerallySearchedEvents, dateObjFormat);
 
      } else {
    // category ile filtre gerçekleştirildiyse category ile gönder
    let allEvents = [];
    if(category && province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category, province)
    } else if (category) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, category)
    } else if (province) {
      allEvents =  await getPaginatedEvents(dateObjFormat, page, undefined, province)
    } else {
    // eventIds dizisi boşsa, veritabanından çek ve filtreleme fonksiyonunu kullan
     allEvents =  await getPaginatedEvents(dateObjFormat, page)
    }

    return allEvents;
  
      // return filterEventsTomorrow(allEvents, dateObjFormat);
  }
}  



async function getThisWeeksEvents (page, events, category, province) {
    const { startOfWeek, endOfWeek } = getWeekRange();
    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await getPaginatedGeneralSearched(events, page)
        return filterEventsThisWeek(findGenerallySearchedEvents, startOfWeek, endOfWeek);
      } else {
        let newEvents = [];
        if(category && province) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, province)
        } else if (category) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category)
        } else if (province) {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, province)
        } else {
          newEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page)
        }
        // return filterEventsThisWeek(newEvents, startOfWeek, endOfWeek);

        return newEvents;
      }
}  





async function getThisWeekendEvents (page, events, category, province) {
    const { startOfWeekend, endOfWeekend } = getWeekendRange();

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await getPaginatedGeneralSearched(events, page)
        return filterEventsThisWeekend(findGenerallySearchedEvents, startOfWeekend, endOfWeekend);
      } else {
        let AllEvents = [];
        if(category && province) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, category, province)
        } else if (category) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, category);
        } else if (province) {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page, undefined, province);
        } else {
          AllEvents = await getPaginatedEvents({week: [startOfWeekend, endOfWeekend]}, page);
        }

        return AllEvents;
        // return filterEventsThisWeekend(AllEvents, startOfWeekend, endOfWeekend);
      }
}  

async function getNextWeekEvents (page, events, category, province) {
    const {startOfWeek, endOfWeek} = getNextWeekRange();

    if (events.length > 0) {
        // events dizisi doluysa, filtreleme fonksiyonunu kullan
        const findGenerallySearchedEvents = await getPaginatedGeneralSearched(events, page)
        return filterEventsNextWeek(findGenerallySearchedEvents, startOfWeek, endOfWeek);
      } else {
        let allEvents = [];
        if(category && province) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category, province)
        } else if (category) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, category)
        } else if (province) {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page, undefined, province)
        } else {
          allEvents = await getPaginatedEvents({week: [startOfWeek, endOfWeek]}, page)
        }
        return allEvents;

        // return filterEventsNextWeek(AllEvents, startOfWeek, endOfWeek);
      }
} 


module.exports = {
    getTodaysEvents: getTodaysEvents,
    getTomorrowsEvents: getTomorrowsEvents,
    getThisWeeksEvents: getThisWeeksEvents,
    getThisWeekendEvents: getThisWeekendEvents,
    getNextWeekEvents: getNextWeekEvents
}
