import React, {useState} from 'react';


const Profile = ({userData}) => {
    const [showPicSuccess, setShowPicSuccess] = useState(false)
    const [results, setResults] = useState([]);
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

  const data = [
    'Elma',
    'Armut',
    'Muz',
    'Çilek',
    'Karpuz',
    'Kavun',
    'Ananas',
    'Portakal'
  ];

      
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
        const isBiographyChanged = inputAreas.biografy !== userData.biografy;
        const isImageChanged = imageFile !== ""; // Varsayalım ki imageFile, resim dosyasının varlığını kontrol ediyor
      
        // Kullanıcı adı boşsa hata mesajı ekle
        if (!inputAreas.username) {
          e.preventDefault();
          setErrors({
            usernameError: "Kullanıcı adı giriniz"
          });
        }
      
        // Eğer kullanıcı adı boş değilse ve kullanıcı adı, biyografi veya resim dosyası değiştirildiyse, form gönderilecek
        if (inputAreas.username && (isUsernameChanged || isBiographyChanged || isImageChanged)) {
          // Form gönderilebilir
        } else {
          // Form gönderimi engellenir ve hatalar gösterilir
          e.preventDefault();
        }
      }
      
      

      const handleInputChange = (e) => {
  



        if (inputAreas.locationedit) {
          // Basit bir filtreleme işlemi ile arama sonuçlarını güncelle
          const filteredResults = data.filter(item =>
            item.toLowerCase().includes(inputAreas.locationedit.toLowerCase())
          );
          setResults(filteredResults);
        } else {
          // Eğer arama sorgusu boşsa, sonuçları temizle
          setResults([]);
        }


         // Yeni bir obje oluşturup, içine mevcut formData'nın kopyasını alıyoruz
    const newData = { ...inputAreas };
    // Değişen input'un değerini güncelliyoruz
    newData[e.target.name] = e.target.value;
    // setState ile yeni formData'yı ayarlıyoruz
    setInputAreas(newData);
    console.log(newData)
      }
    
        return (
            <>
            <div className="container">
              <div className="row py-2">
                <div className="col-12 col-lg-6 text-center">
                  <h1 className='fs-3 text-dark mb-4 text-start'>Profilim</h1>
                  <form onSubmit={handleForm} action='/user/editprofile' method="post" encType="multipart/form-data">
                  <h3 className='text-start fs-5'>Profil Resmini Değiştir</h3>

                  <div className='row py-2 my-4'>
                    <div className="col-lg-6 align-items-center justify-content-center d-flex">
                    <img src={`./${userData.profileImage}`}  className="rounded-circle me-5 ms-1" width={100} alt="" />
                    </div>

                    <div className="col-lg-6 align-items-center justify-content-start d-flex">
                      <button type='button' className='btn btn-warning align-self-center'>
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
                  <div className="mb-5 mt-2">
                      <p className='text-start'>
                      <label className='form-label fs-4 text-left text-dark' htmlFor='locationedit'>
                      Konumunuz
                      </label>
                      </p>

                      <input
                       type="text"
                        className='form-control border border-1 border-secondary-subtle focus-ring focus-ring-dark py-2'
                         id='locationedit'
                          name='locationedit'
                          value={inputAreas.locationedit}
                          onChange={handleInputChange}
                          />
                              <ul>
                               {results.map((item, index) => (
                                 <li key={index}>{item}</li>
                                  ))}
                              </ul>
                        {errors.locationError !== "" && (
                       <p className='text-danger text-start mt-2'>{errors.locationError}</p>
                      )}
                    </div>



                    <div className="mb-5 mt-2">
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
                          placeholder="Kendiniz hakkında paylaşmak istedikleriniz" style={{height: "100px"}}></textarea>
                        <label className='text-secondary' htmlFor="biografy">Kendiniz hakkında paylaşmak istedikleriniz</label>
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