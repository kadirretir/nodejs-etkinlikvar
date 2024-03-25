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
        const getDataFromApi = async () => {
          const response = await fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,id,districts")
         const provincesData = await response.json()
         const provincesDataObject = provincesData.data
       const getProvinceNames = provincesDataObject.map((province) => {
        return province;
       })
       setFullData(getProvinceNames)

       return getProvinceNames;
        }
        getDataFromApi()
       
      }, [])



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

      const handleChange = () => {
        setIsSubscribed(current => !current);
      };

  return (
    <form
    onSubmit={formHandlerOnSubmit}
      action="/events/newevent"
      method="post"
      encType="multipart/form-data">
      <div className="my-3">
        <label htmlFor="exampleInputEmail1" className="form-label fs-5">
          Başlık<i className="fs-6 text-secondary">(Gerekli)</i>
        </label>
        <input
        onChange={handleInputChange}
        value={titleInput}
          type="text"
          name="eventPostTitle"
          className="form-control my-2"
          placeholder="Başlık girin..."
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          autoComplete='off'
        />
            <h1 className='text-danger'>{inputErrors.titleError.length > 0 && inputErrors.titleError}</h1>
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
        value={currentDate}
        onChange={handleDateChange}
      />
      </div>
      <div className="my-3 d-flex gap-2">
      <div className={`w-50 ${styles.searchContainer}`}>
        <p className="form-label fs-5">
        <label htmlFor="cityname">
          İl</label><i className="fs-6 text-secondary">(Gerekli)</i>
        </p>
        <input className='form-control'autoComplete='off' value={cityInput} onChange={handleCityChange} id='cityname' name='cityname' type="text" placeholder='İl' />
        {cityResults && isTypingCity && (
            <div className={styles.searchResults}> 
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
        <input className="form-control" autoComplete='off'  disabled={citySubmitted || districtsSearch ? false : true} value={districtInput} onChange={handleDistrictChange} name="getDistrictName" id='getDistrictName' type="text" placeholder="İlçe" /> 
          {districtsResults && (
            <div className={styles.searchResults}> 
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
       <input className="form-control" id="fulladress" name="fulladress" value={fullAddressInput} onChange={handleInputChange} placeholder="Mahalle, Cadde, Sokak, Mevki, Apartman Numarası / Daire numarası " type="text" />
       <h1 className='text-danger my-2'>{inputErrors.fullAdressError.length > 0 && inputErrors.fullAdressError}</h1>
      </div>
      <div className="d-flex my-3">

        <div style={{width: "50%"}}>
            <p className="form-label fs-5">
              Kategori<i className="fs-6 text-secondary">(Gerekli)</i>
            </p>
            <label htmlFor="eventCategory">Kategori:</label>
      <select
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

      <label htmlFor="eventSubCategory">Alt Kategori:</label>
      <select
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

        <div style={{width: "50%"}}>
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
        </div>

    
  
      </div>
      <div className="my-4">
        <label htmlFor="floatingTextarea2" className="form-label fs-5">
          Etkinliğinizde neler yapılacak?
        </label>
         <textarea
         value={descriptionInput}
         onChange={handleInputChange}
          className="form-control my-2"
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