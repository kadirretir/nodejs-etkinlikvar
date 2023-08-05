import React, { useState, useRef, useEffect} from "react";
import styles from "./progress.module.css";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import "@reach/combobox/styles.css";
import EventForm from "./EventForm";

const libraries = ["places"]

const ProgressBar = ({eventCategories}) => {
  const [eventCategoryState, setEventCategoryState] = useState(eventCategories);
  const [selected, setSelected] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });
  const [titleInput, setTitleInput] = useState("")
  const [districtInput, setDistrictInput] = useState("")
  const [fullAddressInput, setFullAddressInput] = useState("")
  const [descriptionInput, setDescriptionInput] = useState("")
  const [imageInput, setImageInput] = useState("")

  const [checkIfSelected, setCheckIfSelected] = useState();
  const [inputErrors, setInputErrors] = useState({
    titleError: "",
    dateError: "",
    cityError: "",
    districtError: "",
    fullAdressError: "",
    descriptionError: "",
    imageError: ""
  })

  const handleInputChange = (e) => {
    if(e.target.name === "eventPostTitle") {
      setTitleInput(e.target.value)
    } else if (e.target.name === "eventPostDescription") {
      setDescriptionInput(e.target.value)
    } else if (e.target.name === "fulladress") {
      setFullAddressInput(e.target.value)
    }
  }

  // TITLE ERROR HANDLER
  useEffect(() => {
    const titleRegex = /^[A-Za-z0-9ğüşıöçĞÜŞİÖÇ\s]{1,50}$/;
    const isTitleValid = titleInput.length < 50 && titleRegex.test(titleInput.trim());
    if(titleInput.trim() !== "" && !isTitleValid) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          titleError: "*Lütfen başlığı sadece harf, rakam ve boşluk içerecek, 50 karakterden kısa olacak şekilde yazınız",
        }))
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        titleError: ""
      }))
    }
  }, [titleInput])

    // FULL ADDRESS ERROR HANDLER
  useEffect(() => {
    const addressRegex = /^[A-Za-z0-9ğüşıöçĞÜŞİÖÇ\s.,\/-]{1,110}$/;

    const isAddressValid = addressRegex.test(fullAddressInput.trim());

    if(fullAddressInput.trim() !== "" && !isAddressValid) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          fullAdressError: "*Tam adres geçerli bir formata uymalıdır ve 110 karakterden fazla olamaz",
        }))
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fullAdressError: ""
      }))
    }
  }, [fullAddressInput])

   // DESCRİPTİON ERROR HANDLER
  useEffect(() => {
    const isDescriptionValid = descriptionInput.length < 1000
    if(!isDescriptionValid) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          descriptionError: "*Lütfen açıklamayı 1000 karakterden kısa olacak şekilde yazınız"
        }))
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        descriptionError: ""
      }))
    }
  }, [descriptionInput])

  /// DISTIRCT ERROR HANDLER 
  useEffect(() => {
    const isDistrictValid = districtInput.length <= 0
    if(checkIfSelected !== undefined) {
      if(isDistrictValid) {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          districtError: "Lütfen bir ilçe seçiniz"
        }))
      } else {
        setInputErrors((prevErrors) => ({
          ...prevErrors,
          districtError: ""
        }))
      }
    }
  }, [checkIfSelected, districtInput])

  // IMAGE ERROR HANDLER 
 
  useEffect(() => {
    if(imageInput.length > 1) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: ""
      }))
     } else if (imageInput === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: ""
      }))
     } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "*Lütfen bir resim seçiniz"
      }))
     }
  }, [imageInput])
  
  const checkIfImageSubmitted = () => {
    if(imageInput === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "Lütfen bir resim seçiniz"
      }))
     } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: ""
      }))
     }
  }

  // FORM VALIDATION
  const formHandlerOnSubmit = (e) => {
    checkIfImageSubmitted()

    let hasErrors = false;

    // Title hata kontrolü
    if (titleInput.trim() === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        titleError: "*Lütfen başlık giriniz",
      }));
      hasErrors = true; // Hata olduğunda hasErrors değerini güncelle
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        titleError: "",
      }));
    }
  
    // District hata kontrolü
    if (districtInput.trim() === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        districtError: "*Lütfen ilçe seçiniz",
      }));
      hasErrors = true; // Hata olduğunda hasErrors değerini güncelle
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        districtError: "",
      }));
    }
  
    // Full Address hata kontrolü
    if (fullAddressInput.trim() === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fullAdressError: "*Lütfen tam adresi giriniz",
      }));
      hasErrors = true; // Hata olduğunda hasErrors değerini güncelle
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        fullAdressError: "",
      }));
    }
  
    // Description hata kontrolü
    if (descriptionInput.trim() === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        descriptionError: "*Lütfen açıklama giriniz",
      }));
      hasErrors = true; // Hata olduğunda hasErrors değerini güncelle
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        descriptionError: "",
      }));
    }
  
    // Image hata kontrolü
    if (imageInput.trim() === "") {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "*Lütfen resim seçiniz",
      }));
      hasErrors = true; // Hata olduğunda hasErrors değerini güncelle
    } else {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        imageError: "",
      }));
    }
  
    if (hasErrors) {
      e.preventDefault();
    } 
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBP-o-ZJuNYF-f6PdriXJ37d-aBlBcj_Ms",
    libraries: libraries
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
            <h1 className="fs-1 mb-5 text-center text-lg-start">
              Etkinlik Oluştur
              <hr className="border border-1 opacity-75"></hr>
            </h1>

            <EventForm 
            titleInput={titleInput}
            districtInput={districtInput}
            setDistrictInput={setDistrictInput}
            fullAddressInput={fullAddressInput}
            descriptionInput={descriptionInput}
            imageInput={imageInput}
            setImageInput={setImageInput}
            inputErrors={inputErrors}
            handleInputChange={handleInputChange}
            formHandlerOnSubmit={formHandlerOnSubmit}
            eventCategoryState={eventCategoryState}
            setCheckIfSelected={setCheckIfSelected}
            setSelected={setSelected} />
           
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



export default ProgressBar;
