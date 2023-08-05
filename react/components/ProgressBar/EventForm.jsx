import React, {useState, useEffect} from 'react'
import styles from "./progress.module.css";
import PlacesAutocomplete from "./PlacesAutoComplete";


const EventForm = ({
    setSelected, 
    eventCategoryState,
    titleInput,
    districtInput,
    setDistrictInput,
    fullAddressInput,
    descriptionInput,
    imageInput,
    setImageInput,
    inputErrors,
    handleInputChange,
    setCheckIfSelected,
    formHandlerOnSubmit}) => {
    const [selectedAddressDistricts, setSelectedAddressDistricts] = useState()
    const [districtsSearch, setDistrictsSearch] = useState('')
    const [districtsResult, setDistrictsResult] = useState([])


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


        // SEARCH API
      const isTyping = districtsSearch.replace(/\s+/, '').length > 0;
      useEffect(() => {
        if(isTyping && selectedAddressDistricts) {
          const getDataToArray = selectedAddressDistricts.map(district => {
            return district.name
          })
          const getSearchedDistricts = getDataToArray.filter(district => district.toLowerCase().includes(districtsSearch.toLocaleLowerCase()))
          setDistrictsResult(getSearchedDistricts)
        } else {
          setDistrictsResult([])
        }
      }, [districtsSearch])
  
      const handleGetDistrict = (e) => {
        setDistrictInput(e.target.innerHTML)
        setDistrictsResult("")
      }
      
      const handleDistrictChange = (e) =>{
         setDistrictsSearch(e.target.value)
         setDistrictInput(e.target.value)
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
        <div className="w-50">
        <p className="form-label fs-5">
          İl<i className="fs-6 text-secondary">(Gerekli)</i>
        </p>
        <PlacesAutocomplete 
        setCheckIfSelected={setCheckIfSelected}
        setSelectedAddressDistricts={setSelectedAddressDistricts} 
        setSelected={setSelected} />
        </div>

        <div className={`w-50 ${styles.searchContainer}`}>
        <p className="form-label fs-5">
          İlçe<i className="fs-6 text-secondary">(Gerekli)</i>
        </p>
          <input className={`form-control ${isTyping ? styles.typing : null}`} value={districtInput} onChange={handleDistrictChange} name="getDistrictName" type="text" placeholder="İlçe" />
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