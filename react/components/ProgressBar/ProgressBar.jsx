import React, { useState } from "react";
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

const ProgressBar = ({eventCategories}) => {
  const [eventCategoryState, setEventCategoryState] = useState(eventCategories);
  const [selected, setSelected] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBP-o-ZJuNYF-f6PdriXJ37d-aBlBcj_Ms",
    libraries: ["places"],
  });
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
              <div className="my-3">
              <p className="form-label fs-5">
                  Konum<i className="fs-6 text-secondary">(Gerekli)</i>
                </p>
                <PlacesAutocomplete setSelected={setSelected} />
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
                  Resim Yükleyin<i className="fs-6 text-secondary">(Gerekli)</i>
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

const PlacesAutocomplete = ({ setSelected }) => {
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
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input form-control"
        placeholder="İstanbul, Ankara, İzmir..."
      />
      <ComboboxPopover>
        <ComboboxList className="fs-5">
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default ProgressBar;
