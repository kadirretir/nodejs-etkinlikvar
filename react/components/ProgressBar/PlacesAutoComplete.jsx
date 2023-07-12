import React, {useState} from 'react'
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import "@reach/combobox/styles.css";

const PlacesAutocomplete = ({ setSelected, setSelectedAddressDistricts, setCheckIfSelected }) => {
    const [foundProvince, setFoundProvince] = useState()
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        types: ["(cities)"],
        componentRestrictions: { country: ["tr"] },
      },
      cache: 24 * 60 * 60,
    });
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
      // GET PROVINCES NAMES
      const response = await fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,id")
      const provincesData = await response.json()
     const provincesDataObject = provincesData.data
     const getProvinceNames = provincesDataObject.map((province) => {
      return province.name
     })
     // CHECK IF DATA FROM GOOGLE AUTOCOMPLETE MATCHES SOME OF TURKIYE API TURKEY PROVINCE NAMES
     const addressMatch = getProvinceNames.some(province => address.includes(province));
     if(addressMatch) {
      const matchingProvinceName = getProvinceNames.find((province) => address.includes(province));
  
      // FIND MATCHING PROVINCE ID
      const matchingProvinceObject = provincesDataObject.find((province) => province.name === matchingProvinceName);
      const matchingProvinceId = matchingProvinceObject.id;
      const getProvinceDistricts = await fetch(`https://turkiyeapi.cyclic.app/api/v1/provinces/${matchingProvinceId}?fields=districts`)
      const responseDistricts = await getProvinceDistricts.json()
      setSelectedAddressDistricts(responseDistricts.data.districts)
     } 

     setCheckIfSelected(value)
    };
  
    const handleOnChange = async (e) => {
      setValue(e.target.value)
      const response = await fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name")
      const provincesData = await response.json()
     const provincesDataObject = provincesData.data
     const getProvinceNames = provincesDataObject.map((province) => {
      return province.name
     })
     const getAutoSuggestData = data.map(({ structured_formatting: { main_text } }) => main_text);
  
    const findProvince = getAutoSuggestData.filter((suggest) => {
      return getProvinceNames.some((province) => suggest.includes(province));
    });
  
     setFoundProvince(findProvince)
    }
  
    return (
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleOnChange}
          disabled={!ready}
          name="eventPostLocation"
          className="combobox-input form-control"
          placeholder="İstanbul, Ankara, İzmir..."
        />
        <ComboboxPopover>
          <ComboboxList className="fs-5">
            {status === "OK" && foundProvince && foundProvince.map((province, index) => {
              return (
                <ComboboxOption key={index} value={province} />
              )
            })}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  };

  export default PlacesAutocomplete;