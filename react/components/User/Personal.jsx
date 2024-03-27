import React, {useState, useEffect} from 'react';

const PersonalInfo = ({userData}) => {

    function formatDate(dateString) {
        if (!dateString) return ''; // dateString null veya undefined ise boş string dön
        const event = new Date(dateString);
        const day = event.getDate().toString().padStart(2, '0');
        const month = (event.getMonth() + 1).toString().padStart(2, '0');
        const year = event.getFullYear();
        return `${day}/${month}/${year}`; // gg/aa/yyyy formatında
      }
      
      // ... diğer fonksiyonlar ve kullanımlar aynı kalacak
      

function getDayFromDate(dateString) {
  const formattedDate = formatDate(dateString);
  return formattedDate ? formattedDate.substring(0, 2) : '';
}

function getMonthFromDate(dateString) {
  const formattedDate = formatDate(dateString);
  return formattedDate ? formattedDate.substring(3, 5) : '';
}

function getYearFromDate(dateString) {
  const formattedDate = formatDate(dateString);
  return formattedDate ? formattedDate.substring(6, 10) : '';
}

const day = getDayFromDate(userData.birthDate);
const month = getMonthFromDate(userData.birthDate);
const year = getYearFromDate(userData.birthDate);

    const [gender, setGender] = useState(userData.gender);
    const [birthDate, setBirthDate] = useState({
        day: day,
        month: month,
        year: year
    });
    const [twitter, setTwitter] = useState(userData.twitterLink)

    const handleChange = (e) => {
        if (e.target.name === "gender") {
          // Eğer değişen input 'gender' ise, onu doğrudan güncelle
          setGender(e.target.value);
        } else {
          // Değilse, 'birthDate' içindeki ilgili alanı güncelle
          const newData = { ...birthDate };
          newData[e.target.name] = e.target.value;
          setBirthDate(newData);
        }
      }

      const handleSubmit = (e) => {
        // Kullanıcı adı, biyografi ve resim dosyası değişiklik kontrolü
        const isGenderChanged = gender !== userData.gender;
        let isBirthChanged = false;
        
        // userData.birthDate kontrolü
        const userBirthDay = userData.birthDate ? getDayFromDate(userData.birthDate) : '';
        const userBirthMonth = userData.birthDate ? getMonthFromDate(userData.birthDate) : '';
        const userBirthYear = userData.birthDate ? getYearFromDate(userData.birthDate) : '';
      
        // Doğum tarihi değişiklik kontrolü
        isBirthChanged = birthDate.day !== userBirthDay ||
                         birthDate.month !== userBirthMonth ||
                         birthDate.year !== userBirthYear;
        
        // Eğer doğum tarihi veya cinsiyet değiştiyse, formu gönder
        if (isBirthChanged || isGenderChanged || twitter) {
          // Form gönderilecek
        } else {
          // Değişiklik yoksa, form gönderimini engelle
          e.preventDefault();
        }
      }


      useEffect(() => {
        // Yalnızca url boş değilse ve http/https ile başlamıyorsa https:// ekleyin
        if (twitter && !twitter.match(/^(http|https):\/\//)) {
          setTwitter('https://' + twitter);
        }
      }, []); // useEffect'i yalnızca ilk render'da çalıştırın


     

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                        <form onSubmit={handleSubmit} action="/user/personalinfo" method='POST'>
                            <h5 className='text-secondary mb-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 bi bi-emoji-smile" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
</svg>
                                Bu bilgileri size en uygun etkinlikleri göstermek için kullanacağız.</h5>
                        <h1 className='fs-5 mb-2'>Doğum Tarihiniz</h1>
                            <div className='row g-1'>

                                <div className="col-lg-2 col-4">
                                  <input onChange={handleChange} value={birthDate.day} className='form-control border border-1 focus-ring focus-ring-secondary me-2' placeholder='Gün' type="number" id="day" name="day" min="1" max="31" />
                                </div>

                                <div className="col-lg-2 col-4">
                                    <select
                                    value={birthDate.month}
                                     onChange={handleChange} 
                                     className='form-control border border-1 focus-ring focus-ring-secondary me-2'
                                      id="month"
                                       name="month">
                                        <option value="01">Ocak</option>
                                        <option value="02">Şubat</option>
                                        <option value="03">Mart</option>
                                        <option value="04">Nisan</option>
                                        <option value="05">Mayıs</option>
                                        <option value="06">Haziran</option>
                                        <option value="07">Temmuz</option>
                                        <option value="08">Ağustos</option>
                                        <option value="09">Eylül</option>
                                        <option value="10">Ekim</option>
                                        <option value="11">Kasım</option>
                                        <option value="12">Aralık</option>
                                    </select>
                                </div>

                                <div className="col-lg-2 col-4">
                                    <input onChange={handleChange} value={birthDate.year} className='form-control border border-1 focus-ring focus-ring-secondary' type="number" id="year" name="year" min="1900" max="2099" placeholder='Yıl' />
                                </div>
                            </div>

                            <div className="row">
                                <h1 className='fs-5 mt-4 mb-2'>Cinsiyet</h1>
                                <div className="col-lg-3 col-5">
                                    <select
                                    onChange={handleChange}
                                    className='form-control border border-1 focus-ring focus-ring-secondary me-2'
                                    id="gender"
                                    name="gender"
                                    value={gender} // "Söylemek İstemiyorum" için varsayılan değer olarak '3' kullanılıyor.
                                    required
                                    >

                                    <option value="Söylememeyi tercih ederim">Söylememeyi tercih ederim</option>
                                    <option value="Kadın">Kadın</option>
                                    <option value="Erkek">Erkek</option>
                                    <option value="Listede Yok">Listede Yok</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-4">
                              <div className="col-lg-4 col-6">
                               <label className='fs-5 my-2' htmlFor="facebook">
                                X (İsteğe Bağlı):
                                </label>
                                <input type="url" value={twitter} id="twitter" onChange={(e) => setTwitter(e.target.value)} name='twitter' placeholder='https://www.twitter.com/profil-url-adresiniz/' className='form-control border border-1 border-secondary-subtle focus-ring focus-ring-dark' />
                                <h5 className='text-secondary mt-2'>

                                Profilinizde görünecektir.</h5>
                              </div>
                            </div>
                            <button className='mt-5 ms-2 btn btn-dark' type='submit'>Kaydet</button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo;