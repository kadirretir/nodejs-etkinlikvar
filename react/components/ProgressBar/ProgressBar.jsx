import React, { useState, useEffect, useRef } from "react";
import styles from "./progress.module.css";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
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

const libraries = ["places"]

const ProgressBar = ({eventCategories}) => {
  const [eventCategoryState, setEventCategoryState] = useState(eventCategories);
  const [selected, setSelected] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });
  const [selectedAddressDistricts, setSelectedAddressDistricts] = useState()
  const [districtsSearch, setDistrictsSearch] = useState('')
  const [districtsResult, setDistrictsResult] = useState([])
  const districtRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBP-o-ZJuNYF-f6PdriXJ37d-aBlBcj_Ms",
    libraries: libraries
  });

  const isTyping = districtsSearch.replace(/\s+/, '').length > 0;

    useEffect(() => {
      if(isTyping && selectedAddressDistricts) {
        const getDataToArray = selectedAddressDistricts.map(district => {
          return district.name
        })
        const getSearchedDistricts = getDataToArray.filter(district => district.toLowerCase().includes(districtsSearch.toLocaleLowerCase()))
        setDistrictsResult(getSearchedDistricts)
        console.log(districtsSearch)
      } else {
        setDistrictsResult([])
      }
    }, [districtsSearch])

    const handleGetDistrict = (e) => {
      districtRef.current.value = e.target.innerHTML
      setDistrictsResult("")
    }


  if (!isLoaded) {
    return (
      <>
        <div
          className="spinner-border  d-flex align-items-center justify-content-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }



  return (
    <>
      <div className="container">
        <div className="row gx-4 justify-content-center">
          <div className="col-xl-7 my-5">
            <h1 className="fs-1 mb-5">
              Etkinlik Oluştur
              <hr className="border border-1 opacity-75"></hr>
            </h1>
            <form
              action="/events/newevent"
              method="post"
              encType="multipart/form-data">
              <div className="my-3">
                <label htmlFor="exampleInputEmail1" className="form-label fs-5">
                  Başlık<i className="fs-6 text-secondary">(Gerekli)</i>
                </label>
                <input
                  type="text"
                  name="eventPostTitle"
                  className="form-control my-2"
                  placeholder="Başlık girin..."
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="my-3">
                <label htmlFor="startDate" className="form-label fs-5">
                  Etkinliğin Tarihi
                  <i className="fs-6 text-secondary">(Gerekli)</i>
                </label>
                <input
                  id="startDate"
                  name="eventPostDate"
                  className="form-control my-2"
                  type="datetime-local"
                />
              </div>
              <div className="my-3 d-flex gap-2">
                <div className="w-50">
                <p className="form-label fs-5">
                  İl<i className="fs-6 text-secondary">(Gerekli)</i>
                </p>
                <PlacesAutocomplete setSelectedAddressDistricts={setSelectedAddressDistricts} setSelected={setSelected} />
                </div>

                <div className={`w-50 ${styles.searchContainer}`}>
                <p className="form-label fs-5">
                  İlçe<i className="fs-6 text-secondary">(Gerekli)</i>
                </p>
                  <input className={`form-control ${isTyping ? styles.typing : null}`}  ref={districtRef} onChange={(e) => setDistrictsSearch(e.target.value)} name="getDistrictName" type="text" placeholder="İlçe" />
                  {districtsResult && isTyping && (
                    <div className={styles.searchResults}> 
                      {districtsResult.map((district, index) => {
                        return (
                          <div onClick={handleGetDistrict} className={styles.searchResultsItems} key={index}>
                            {district}
                          </div>
                        )
                      })}
                      {districtsResult.length === 0 && selectedAddressDistricts && (
                        <div className={styles.resultNotFound}>
                          "{districtsSearch}" ile bağlantılı bir ilçe bulamadık
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="my-3">
              <p className="form-label fs-5">
                  <label htmlFor="fulladress">
                  Tam Adres</label><i className="fs-6 text-secondary">(Gerekli)</i>
                </p>
               <input className="form-control" id="fulladress" name="fulladress" placeholder="Mahalle, Cadde, Sokak, Mevki, Apartman Numarası / Daire numarası " type="text" />
              </div>
              <div className="my-3">
              <p className="form-label fs-5">
                  Kategori<i className="fs-6 text-secondary">(Gerekli)</i>
                </p>
              <select className="form-select" name="getEventCategory" aria-label="select">
                <option className="fs-5" defaultValue disabled>Etkinliğiniz ne ile alakalı?</option>
                  {eventCategoryState.map((category,index) => {
                    return (
                        <option className="fs-5" key={index} defaultValue={index}>{category}</option>
                    )
                  })}
              </select>
              </div>
              <div className="my-4">
                <label htmlFor="floatingTextarea2" className="form-label fs-5">
                  Etkinliğinizde neler yapılacak?
                </label>
                 <textarea
                  className="form-control my-2"
                  name="eventPostDescription"
                  placeholder="Sabah yürüyüşünden sonra doğa gezisine gideceğiz..."
                  id="floatingTextarea2"
                  style={{ height: "100px" }}
                ></textarea> 
              </div>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label fs-5">
                  Resim Yükleyin<i className="fs-6 text-secondary">(Gerekli) (Maksimum 2Mb)</i>
                </label>
                <input
                  className="form-control"
                  name="eventPhoto"
                  type="file"
                  id="formFile"
                />
              </div>
              <button type="submit" className="btn text-white w-100" style={{background: "var(--first-color)"}}>
                Oluştur
              </button>
            </form>
          </div>
          <div className={`col-xl-5 my-5 ${styles.googleMapsContainer}`}>
            <GoogleMap
              center={selected}
              zoom={13}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                zoomControl: false,
                mapTypeControl: false,
              }}
            >
              {selected && <MarkerF position={selected} />}
            </GoogleMap>
          </div>
        </div>
      </div>
    </>
  );
};

const PlacesAutocomplete = ({ setSelected, setSelectedAddressDistricts }) => {
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
          {status === "OK" && foundProvince.map((province, index) => {
            return (
              <ComboboxOption key={index} value={province} />
            )
          })}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default ProgressBar;
