import React, {useState, useRef, useEffect} from 'react';
import styles from './profile.module.css';
import debounce from 'lodash.debounce';

const Profile = ({userData}) => {
    const [showPicSuccess, setShowPicSuccess] = useState(false)
    const [imageFile, setImageFile] = useState("");
    const [inputAreas, setInputAreas] = useState({
      biografy: userData.biografy,
      username: userData.username,
      locationedit: userData.location,
    })
  const [errors, setErrors] = useState({
    usernameError: "",
    locationError: ""
  })
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const searchRef = useRef()
  const searchResultsRef = useRef()


  useEffect(() => {
    const getProvinces = async () => {
        try {
            const response = await fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,districts");
            const data = await response.json();
            const getProvincesToArray = data.data.map((names) => names.name);
            const districts = data.data.map((data) =>
                data.districts.map((names) => ({
                    name: names.name,
                    city: data.name
                }))
            );

            const districtsArray = districts.flat();
            getProvincesToArray.push(districtsArray);


            const districtsWithCity = districtsArray.map((district) => `${district.name}, ${district.city}`);
            const provinceNames = getProvincesToArray.slice(0, getProvincesToArray.length - 1);

            const combinedArray = provinceNames.concat(districtsWithCity);
            const filterResults = combinedArray.filter((names) => names.toLocaleUpperCase('TR').includes(search.toLocaleUpperCase('TR')));
            setSearchResults(filterResults);
        } catch (error) {
            throw new Error(error);
        } 

    }

    const debouncedGetProvinces = debounce(getProvinces, 300); // 500 milisaniyelik gecikme
    if (search.trim().length > 0) {
        debouncedGetProvinces();
    }

    return () => {
        debouncedGetProvinces.cancel(); // Temizleme işlevi bileşen yeniden yüklenirken çalışır.
    }

}, [search]);


    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)

      return () => {
          document.removeEventListener("mousedown", handleClickOutside)
      }
}, [])

const handleClickOutside = (e) => {
  if(searchRef.current && searchResultsRef.current && !(searchRef.current.contains(e.target) || searchResultsRef.current.contains(e.target))) {
    setSearchResults("");

  }
}

const handleProvinceClick = (e) => {
  const areaName = e.currentTarget.querySelector("#areaName").textContent;
  searchRef.current.value = areaName
  setSearchResults("");

}



    /// ---------------------------- FILE SIZE OPTIONS --------------------------------------------------
      const checkFileSize = (event) => {
        const file = event.target.files[0];
        const maxSize = 2 * 1024 * 1024; // Maksimum 2MB (2 * 1024 * 1024 bayt)
      
        if (file && file.size > maxSize) {
          alert("Dosya boyutu 2MB'dan büyük olamaz.");
          // Dosyayı yüklemeyi engellemek için input değerini sıfırla
          event.target.value = "";
          setImageFile("")
        }
    
        if(event.target.files.length > 0) {
            setImageFile(event.target.value)
            setShowPicSuccess(true)
        } else {
          setImageFile("")
          setShowPicSuccess(false)
        }
    
      };
     
      const cancelImageUpload = (e) => {
        e.preventDefault();
        setImageFile("")
        setShowPicSuccess(false)
      }

      const handleForm = (e) => {
        // Kullanıcı adı, biyografi ve resim dosyası değişiklik kontrolü
        const isUsernameChanged = inputAreas.username !== userData.username;
        const isLocationChanged = searchRef.current.value !== "" && searchRef.current.value !== userData.location
        const isBiographyChanged = inputAreas.biografy !== userData.biografy;
        const isImageChanged = imageFile !== ""; // Varsayalım ki imageFile, resim dosyasının varlığını kontrol ediyor
        if (!inputAreas.username) {
          e.preventDefault();
          setErrors({
            usernameError: "Kullanıcı adı giriniz"
          });
        }

        if (!inputAreas.locationedit) {
          e.preventDefault();
          setErrors({
            usernameError: "Şehir seçiniz"
          });
        }
      
        // Eğer kullanıcı adı boş değilse ve kullanıcı adı, biyografi veya resim dosyası değiştirildiyse, form gönderilecek
        if (inputAreas.username && (isUsernameChanged || isBiographyChanged || isImageChanged || isLocationChanged)) {
          // Form gönderilebilir
        } else {
          // Form gönderimi engellenir ve hatalar gösterilir
          e.preventDefault();
        }
      }
      
      

      const handleInputChange = (e) => {
        // Mevcut inputAreas'ın kopyasını alıyoruz
        const newData = { ...inputAreas };
        // Değişen input'un değerini güncelliyoruz
        newData[e.target.name] = e.target.value;
        // Yeni verileri state'e kaydediyoruz
        setInputAreas(newData);
      
        if (search) {
          setInputAreas(prevState => ({
            ...prevState,
            locationedit: search
          }));
        }
      };
      
    
        return (
            <>
            <div className="container">

              <div className="row py-2">

                <div className="col-12 col-lg-6 text-center">
                  <h1 className='fs-3 text-dark mb-4 text-start'>Profilim</h1>

                  <form onSubmit={handleForm} action='/user/editprofile' method="post" encType="multipart/form-data">
                  <h3 className='text-start fs-5'>Profil Resmini Değiştir</h3>

                  <div className='row py-2 my-4'>
                    <div className="col-lg-6 text-center align-items-center justify-content-center d-flex">
                    <img src={`./${userData.profileImage}`}  className="rounded-circle" width={100} alt="" />
                    </div>

                    <div className="col-lg-6 align-items-center justify-content-center d-flex ">
                      <button type='button' className='btn btn-warning align-self-center mt-3'>
                        <label htmlFor="profilePictureInput" style={{cursor: "pointer"}}>
                        Masaüstünden Yükle
                          </label>
                          </button>
                  
                      <input
                      value={imageFile}
                        type="file"
                        id="profilePictureInput"
                        name="newUserPhoto"
                        style={{ display: 'none' }}
                        onChange={checkFileSize}
                        accept="image/png, image/jpeg, image/jpg"
                      />
                    </div>
                
                
                  </div>
                  {showPicSuccess && (
                        <div className='d-flex flex-column align-items-center justify-content-center my-3'> 
                        <b className='text-success fs-5 my-3'>Resim başarıyla yüklendi!</b>
                        <button type='submit' className='btn btn-danger py-2 mx-auto' onClick={cancelImageUpload}>İptal</button>
                    </div>
                  )}

              
    
                  <div className="d-flex flex-column ps-3">
                  <div className="mb-3 mt-2 position-relative">
                      <p className='text-start'>
                      <label className='form-label fs-4 text-left text-dark' htmlFor='locationedit'>
                      Konumunuz
                      </label>
                      </p>

                     <div className={styles.InputContainer}>
                      <input
                        type="search"
                          className={`form-control border border-1 border-secondary-subtle focus-ring focus-ring-dark py-2 ${styles.inputItself} ${search.trim().length > 0 ? styles.typing : null}`}
                          id='locationedit'
                            name='locationedit'
                            ref={searchRef}
                            autoComplete='off'
                            placeholder={inputAreas.locationedit}
                            onChange={(e) => setSearch(e.target.value)}
                            />
                     </div>
                        
                      <div ref={searchResultsRef} className={styles.searchResults}> 
                      {search.trim().length > 0 && searchResults.length > 0 && (
                              <div className="fs-5 text-left py-3">
                              {searchResults.slice(0,10).map((provinces, index) => (
                                  <div className={`d-flex flex-row align-items-center ${styles.searchResultsItems}`} onClick={handleProvinceClick} key={index}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--first-color)" style={{marginRight: "0.3rem"}} className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                    </svg>
                                <div id='areaName'>
                                {provinces}
                                </div>
                                </div>
                              ))}
                            </div>
                          )}
                   
                      </div>
             
                             
                        {errors.locationError !== "" && (
                       <p className='text-danger text-start mt-2'>{errors.locationError}</p>
                      )}
                    </div>



                    <div className="mb-3 mt-2">
                      <p className='text-start'>
                      <label className='form-label fs-4 text-left text-dark' htmlFor='username'>
                      İsim <span className='fs-5'>(Gerekli)</span>
                      </label>
                      </p>

                      <input
                       type="text"
                        className='form-control border border-1 border-secondary-subtle focus-ring focus-ring-dark py-2'
                         id='username'
                          name='username'
                          onChange={handleInputChange}
                           value={inputAreas.username} />

                        {errors.usernameError !== "" && (
                       <p className='text-danger text-start mt-2'>{errors.usernameError}</p>
                      )}
                    </div>
    
                    <div className="my-2">
                        <p className='form-label text-start fs-4 text-dark'>
                      Biyografi
                          </p>
                      <div className="form-floating mb-3">
                        <textarea 
                        className="form-control border border-1 border-secondary-subtle  focus-ring focus-ring-dark " 
                        onChange={handleInputChange}
                        value={inputAreas.biografy}
                        name='biografy'
                        id="biografy"
                       style={{minHeight: "100px", width: "100%"}}></textarea>
                        <label className='text-secondary'  style={{minHeight: "100px", width: "100%"}} htmlFor="biografy">Kendiniz hakkında paylaşmak istedikleriniz</label>
                    </div>

                    </div>
{/*     
                    <div className="">
                    <p className='text-start'>
                      <label className='form-label text-left text-secondary' htmlFor="myemail">
                        Konumum
                      </label>
                      </p>
                        <IndexFilter />
                    </div> */}
                  </div>
               
                    <div className="row">
                      <div className="col text-start my-5">
                       <button className='btn btn-dark px-4 py-2' type='submit'>Kaydet</button>
                      </div>
                    </div>
               
                  </form>
                </div>
              </div>
            </div>
            </>
        )
    }

export default Profile;