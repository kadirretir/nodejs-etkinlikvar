import React, {useState} from 'react';
import IndexFilter from '../IndexFilterLocation/IndexFilter'

const Profile = ({userData}) => {
    const [showPicSuccess, setShowPicSuccess] = useState(false)
    const [imageFile, setImageFile] = useState("");
    
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
        if(imageFile === "") {
          e.preventDefault()
          
        }
      }
    
        return (
            <>
            <div className="container">
              <div className="row py-2">
                <div className="col-12 col-lg-6 text-center">
                  <h1 className='fs-3 text-dark mb-4 text-start'>Profilim</h1>
                  <form onSubmit={handleForm} action='/user/changeprofilePicture' method="post" encType="multipart/form-data">
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
                      <label className='form-label fs-4 text-left text-dark' htmlFor='username'>
                      İsim
                      </label>
                      </p>
                      <input type="text" className='form-control' id='username' name='username' value={userData.username} />
                    </div>
    
                    <div className="">
                    <p className='text-start'>
                      <label className='form-label text-left text-dark fs-4' htmlFor="myemail">
                        E-Posta Adresi
                      </label>
                      </p>
                      <input type="email" className='form-control' id="myemail" name="myemail"  />
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