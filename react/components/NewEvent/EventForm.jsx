import React, {useState, useEffect} from 'react'
import styles from "./progress.module.css";


const EventForm = ({
    category,
    setCategory,
    subCategory,
    setSubCategory,
    subCategoryOptions,
    eventSubCategories,
    titleInput,
    districtInput,
    cityInput,
    userInfo,
    setCityInput,
    setDistrictInput,
    fullAddressInput,
    descriptionInput,
    imageInput,
    setImageInput,
    inputErrors,
    handleInputChange,
    formHandlerOnSubmit}) => {
   
      const [fullData, setFullData] = useState([])


    const [districtsSearch, setDistrictsSearch] = useState("")
    const [districtsResults, setDistrictsResults] = useState([])

    const [citySearch, setCitySearch] = useState("")
    const [cityResults, setCityResults] = useState([])

    const [citySubmitted, setCitySubmitted] = useState(false)

    // CHECKBOX FOR SINIRLANDIRMA
    const [isSubscribed, setIsSubscribed] = useState(false);

    const current = new Date();
    const turkiyeZamanDilimi = new Date(current.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));

    const year = turkiyeZamanDilimi.getFullYear();
    const month = String(turkiyeZamanDilimi.getMonth() + 1).padStart(2, '0');
    const day = String(turkiyeZamanDilimi.getDate()).padStart(2, '0');
    const hours = String(turkiyeZamanDilimi.getHours()).padStart(2, '0');
    const minutes = String(turkiyeZamanDilimi.getMinutes()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    const [currentDate, setCurrentDate] = useState(formattedDate);
        // HANDLE EVENT DATE
      const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const now = new Date();
    
        if (selectedDate < now) {
          // Seçilen tarih şu anki tarihten önce ise, şimdiki zamanı kullan
          setCurrentDate(formattedDate);
        } else {
          setCurrentDate(e.target.value);
        }
      };

      // GET FULL TURKEY API DATA FROM TURKEY API
        useEffect(() => {
          const fetchData = async () => {
            try {
              const [provinceRes, districtRes] = await Promise.all([
                fetch("https://turkiyeapi.dev/api/v1/provinces?fields=name,id"),
                fetch("https://turkiyeapi.dev/api/v1/districts?fields=name,province")
              ]);
        
              const provincesData = await provinceRes.json();
              const districtsData = await districtRes.json();
        
              // Her province için districts'leri eşleştir
              const combinedData = provincesData.data.map((province) => {
                const relatedDistricts = districtsData.data.filter(
                  (district) => district.province === province.name
                );
        
                return {
                  ...province,
                  districts: relatedDistricts
                };
              });
        
              setFullData(combinedData);
            } catch (error) {
              console.error("Veri alınamadı:", error);
            }
          };
        
          fetchData();
        }, []);



      // CITY SEARCH
      const isTypingCity = citySearch.replace(/\s+/, '').length > 0;
      useEffect(() => {
        if(isTypingCity) {
          const getCityNameFilter = fullData.filter(province => province.name.toLocaleLowerCase().includes(citySearch.toLocaleLowerCase()))
          const getCityNames = getCityNameFilter.map(provinces => provinces.name)
           setCityResults(getCityNames)
        } else {
          setCityResults([])
        }
      
      }, [citySearch])
      
        // DISTRICTS SEARCH API
      useEffect(() => {
        const checkIfCityMatched = fullData.filter(provinces => provinces.name.toLocaleLowerCase() === cityInput.toLocaleLowerCase())
          if(checkIfCityMatched.length > 0) {
            setCitySubmitted(true);
              const getDistricts = checkIfCityMatched.map(districts => districts.districts)
              const getDistrictsNames = getDistricts[0].map(provinceDistricts => provinceDistricts.name)
              const filterDistricts = getDistrictsNames.filter(districts => districts.toLocaleLowerCase().includes(districtsSearch.toLocaleLowerCase()))

              setDistrictsResults(filterDistricts)
              setCityResults(undefined)
        } else {
          setCitySubmitted(false)
          setDistrictsResults([])
        }

      }, [citySearch, districtsSearch])

      // DISTRICTS HANDLERS
      const handleGetDistrict = (e) => {
        setDistrictInput(e.target.innerHTML)
        setDistrictsResults("")
      }
      
      const handleDistrictChange = (e) =>{
         setDistrictsSearch(e.target.value)
         setDistrictInput(e.target.value)
      }


      // CITY HANDLERS
      const handleGetCity = (e) => {
        setCityInput(e.target.innerHTML)
        setCityResults("")
        setCitySubmitted(true)
      }

      const handleCityChange = (e) => {
        setCitySearch(e.target.value)
        setCityInput(e.target.value)
      }


    // CHECK FILE SIZE
      const checkFileSize = (event) => {
        const file = event.target.files[0];
        const maxSize = 2 * 1024 * 1024; // Maksimum 2MB (2 * 1024 * 1024 bayt)
      
        if (file && file.size > maxSize) {
          alert("Dosya boyutu 2MB'dan büyük olamaz.");
          // Dosyayı yüklemeyi engellemek için input değerini sıfırla
          event.target.value = "";
        } 
        setImageInput(event.target.value)
      };


  return (
    <form
    className={`${styles.newEventForm}`}
    onSubmit={formHandlerOnSubmit}
      action="/events/newevent"
      method="post"
      encType="multipart/form-data">
      <div className='my-3'>

        <label htmlFor="exampleInputEmail1" className="form-label fs-5">
          Başlık<i className="fs-6 text-secondary">(Gerekli)</i>
        </label>
        <div className={`${styles.wrapperTitle}`}>
            <input
            onChange={handleInputChange}
            value={titleInput}
              type="text"
              name="eventPostTitle"
              className="my-2"
              placeholder="Başlık girin..."
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              autoComplete='off'
            />
              <span className={`${styles.titleLength}`}>{titleInput.length === 0 ? (100) : Math.max(100 - titleInput.length, 0)}</span>
        </div>
 
            <h1 className='text-danger'>{inputErrors.titleError.length > 0 && inputErrors.titleError}</h1>

      </div>

      <div className="row my-3 d-flex">
        <div className='col-lg-6'>
            <label htmlFor="startDate" className="form-label fs-5">
              Etkinliğin Tarihi
              <i className="fs-6 text-secondary">(Gerekli)</i>
            </label>
            <input
            id="startDate"
            name="eventPostDate"
            className="my-2"
            type="datetime-local"
            value={currentDate}
            onChange={handleDateChange}
          />
        </div>


        <div className="col-lg-6">
             <label htmlFor="getEventPartLimit" className="form-label fs-5">
              Katılımcı Sınırı
              <i className="fs-6 text-secondary">(Opsiyonel)</i>
            </label>

            <select name='getEventPartLimit' id="getEventPartLimit" className='w-100'>
              <option value="">Sınır Yok</option>
              <option value="5">5 Kişi</option>
              <option value="10">10 Kişi</option>
              <option value="15">15 Kişi</option>
              <option value="20">20 Kişi</option>
            </select>
        </div>
   
      </div>
      <div className="my-3 d-flex gap-2">

      <div className={`w-50 ${styles.searchContainer}`}>
        <p className="form-label fs-5">
        <label htmlFor="cityname">
          İl</label><i className="fs-6 text-secondary">(Gerekli)</i>
        </p>

        <div className={`position-relative`}>
          <input 
          autoComplete='off' 
          className={cityResults && cityResults.length > 0 ? styles.isTyping : null} 
          value={cityInput}
            onChange={handleCityChange} 
            style={{paddingLeft: "2rem"}}
            id='cityname' 
            name='cityname' 
            type="text" 
            placeholder='İl' />
            <svg xmlns="https://www.w3.org/2000/svg" fill="currentColor" width="16" height="16"
                 className={`bi bi-geo-alt-fill position-absolute ${styles.cityInputIcon}`}
                 style={{top: "1rem", left: "0.5rem", color: "#c3c3c3"}}
               viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
            </svg>
  
        </div>
    
        {cityResults && isTypingCity && (
            <div className={`${styles.searchResults} ${cityResults && cityResults.length > 0 ? styles.isTypingResults : null}`} > 
              {cityResults.map((cityname, index) => {
                return (
                  <div onClick={handleGetCity} className={styles.searchResultsItems} key={index}>
                    {cityname}
                  </div>
                )
              })}
              {Object.keys(cityResults).length === 0 && (
                <div className={styles.resultNotFound}>
                  "{citySearch}" adında bir il bulamadık
                </div>
              )}
            </div>
          )}
             <h1 className='text-danger my-2'>{inputErrors.cityError.length > 0 && inputErrors.cityError}</h1>
        </div>
     

        <div className={`w-50 ${styles.searchContainer}`}>
        <p className="form-label fs-5">
        <label htmlFor="getDistrictName">
          İlçe</label><i className="fs-6 text-secondary">(Gerekli)</i>
        </p>
        <input autoComplete='off' className={districtsResults.length > 0 ? styles.isTyping : null}    disabled={citySubmitted || districtsSearch ? false : true} value={districtInput} onChange={handleDistrictChange} name="getDistrictName" id='getDistrictName' type="text" placeholder="İlçe" /> 
          {districtsResults && (
            <div className={`${styles.searchResults} ${districtsResults.length > 0 ? styles.isTypingResults : null}`} > 
              {districtsResults.map((district, index) => {
                return (
                  <div onClick={handleGetDistrict} className={styles.searchResultsItems} key={index}>
                    {district}
                  </div>
                )
              })}
              {districtsResults.length === 0 && districtsResults === "" && (
                <div className={styles.resultNotFound}>
                  "{districtsSearch}" ile bağlantılı bir ilçe bulamadık
                </div>
              )}
            </div>
          )}
            <h1 className='text-danger my-2'>{inputErrors.districtError.length > 0 && inputErrors.districtError}</h1>
        </div>
      </div>

      <div className="my-3">
      <p className="form-label fs-5">
          <label htmlFor="fulladress">
          Tam Adres</label><i className="fs-6 text-secondary">(Gerekli)</i>
        </p>
       <input id="fulladress" autoComplete='off' name="fulladress" value={fullAddressInput} onChange={handleInputChange} placeholder="Mahalle, Cadde, Sokak, Mevki, Apartman Numarası / Daire numarası " type="text" />
       <h1 className='text-danger my-2'>{inputErrors.fullAdressError.length > 0 && inputErrors.fullAdressError}</h1>
      </div>
      <div className="d-flex my-3">

        <div className='w-50'>
            <p className="form-label fs-5">
              Kategori<i className="fs-6 text-secondary">(Gerekli)</i>
            </p>
      <select
      className='w-100'
        id="eventCategory"
        value={category}
        name='eventCategory'
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Seçiniz...</option>
        {Object.keys(eventSubCategories).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      </div>
              <div className='w-50'>
                <p className="form-label fs-5">
                İlgili Alan<i className="fs-6 text-secondary">(Gerekli)</i>
              </p>
            <select
               className='w-100'
        id="eventSubCategory"
        name='eventSubCategory'
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        required
      >
        <option value="">Seçiniz...</option>
        {subCategoryOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
              </div>
   
       
        {/* <div style={{width: "50%"}}>
        {userInfo !== "free" ? (
          <>
                   <div className="form-check form-switch form-check">
                <input className="form-check-input"
                  
                 type="checkbox" 
                 id="flexSwitchCheckReverse"/>
                <label className="form-check-label fs-5" htmlFor="flexSwitchCheckReverse">Katılımcı Sınırlandırması (E+)</label>
              </div>


              <select className="form-select" name="getEventCategory" aria-label="select" disabled>
              <option className="fs-5" defaultValue>Sınırlandırma</option>
             
              </select>
          </>
     
              ) : (
                <>
                  <div className="form-check form-switch form-check">
                <input className="form-check-input"
                  value={isSubscribed}
                  onChange={handleChange}
                 type="checkbox" 
                 id="flexSwitchCheckReverse"/>
                <label className="form-check-label fs-5" htmlFor="flexSwitchCheckReverse">Katılımcı Sınırlandırması (E+)</label>
              </div>

                <select className="form-select" name="getEventPartLimit" aria-label="select">
                              {[...Array(20)].map((_, index) => (
                                      <option className='fs-5' key={index + 1}>{`${index + 1}`}</option>         
                                  ))}
                    </select>
                </>
    
           )}
        </div> */}

    
  
      </div>
      <div className="my-4">
        <label htmlFor="floatingTextarea2" className="form-label fs-5">
          Etkinliğinizde neler yapılacak?
        </label>
         <textarea
         value={descriptionInput}
         onChange={handleInputChange}
          className=" my-2"
          name="eventPostDescription"
          placeholder="Sabah yürüyüşünden sonra doğa gezisine gideceğiz..."
          id="floatingTextarea2"
          style={{ height: "100px" }}
        ></textarea> 
         <h1 className='text-danger my-2'>{inputErrors.descriptionError.length > 0 && inputErrors.descriptionError}</h1>
      </div>
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label fs-5">
          Resim Yükleyin<i className="fs-6 text-secondary">(Gerekli) (Maksimum 2Mb)</i>
        </label>
        <input
        value={imageInput}
        onChange={checkFileSize}
        accept="image/png, image/jpeg, image/jpg"
          className="form-control"
          name="eventPhoto"
          type="file"
          id="formFile"
        />
           <h1 className='text-danger my-2'>{inputErrors.imageError.length > 0 && inputErrors.imageError}</h1>
      </div>
      <button type="submit" className="btn text-white w-100" style={{background: "var(--first-color)"}}>
        Oluştur
      </button>
    </form>
  )
}

export default EventForm