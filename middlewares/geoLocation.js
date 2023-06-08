const getLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json');
      if (!response.ok) {
        throw new Error('Unable to retrieve location');
      }
      const data = await response.json();
      // const { city, region, country_name } = data;
    } catch (error) {
      console.error('Error retrieving location:', error);
    }
  };
  
module.exports = getLocation