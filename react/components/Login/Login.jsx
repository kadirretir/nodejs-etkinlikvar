import React, {useState, useEffect, useRef} from 'react'
import styles from './Login.module.css'
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

const Login = ({errorMessage}) => {
    const [errorState, setErrorState] = useState(null)
    const [showRegisterForm, setShowRegisterForm] = useState(false);


    const handleRegisterLinkClick = (e) => {
        e.preventDefault();
        setShowRegisterForm(true);
        if(errorState !== null && errorState.length > 0) {
            setErrorState(null)
        } 
      };

      const handleReverseLinkClick = (e) => {
        e.preventDefault();
        setShowRegisterForm(false);
        if(errorState !== null && errorState.length > 0) {
          setErrorState(null)
      } 
      }

      useEffect(() => {
        setErrorState(errorMessage)
        if (errorMessage[0] === "Bu e-posta zaten kullanılıyor") {
          setShowRegisterForm(true);
        }
      }, [errorMessage])

      async function recapthaOnChange(value) {
        try {
          // secret=6LeotD4nAAAAAIRM5E7ivgFcregwvJ0akQRXr-NB
          // https://www.google.com/recaptcha/api/siteverify

          await axios.post("/send-recaptha", { value: value })

      
          // const data = await response.json();

          
          // Doğrulama başarılıysa, data.success değeri true olacaktır.
        
        } catch (error) {
          console.error("ReCAPTCHA doğrulama hatası:", error);
          // Hata durumunda gerekli işlemleri yapabilirsiniz.
        }
      }
      

  return (
    <>
    <div className="container-fluid">
        <div className="row d-flex"  style={{height: "100vh"}}>
        <div className="col-md-12 col-xl-6 py-5 order-xl-2 d-flex flex-column align-items-center justify-content-center bg-secondary-subtle" style={{minHeight: "95vh"}}>
            {showRegisterForm ? (
              <RegisterForm 
              errorState={errorState}
              handleReverseLinkClick={handleReverseLinkClick}
              /> // Kayıt formu görüntüleniyor
            ) : (
                <div className={`py-4 ${styles.loginBackground}`}>
                  <h1 className="modal-title fs-1  text-center mt-3 fw-bold">
                    Giriş Yap
                  </h1>
                  <form  action='/auth/login' method='post' className="w-75 mx-auto my-0 mt-5 rounded-3 py-5">
                  {errorState !== null && errorState.length > 0 && (
                  <h1 className="alert alert-danger">{errorState}</h1>
                  )}
                    <div className="inputField">
                      <input type="text" id="email" name="email" placeholder="E-Posta" />
                    </div>
                    <div className="inputField">
                      <input type="password" id="password" name="password" placeholder="Parola" />
                    </div>
                    <button type="submit" className="loginButton">Giriş Yap</button>
                    <p className='fs-4 text-center mt-3'>Hesabın yok mu? <a href="/" onClick={handleRegisterLinkClick}>Kayıt Ol</a></p>
                

                    <div className="d-flex justify-content-center mt-3"> 
                    <ReCAPTCHA
                      className='mt-3 d-block mx-auto'
                        sitekey="6LeotD4nAAAAAKbVbnsFin9OprFTW_fV4vJpO2w_"
                          onChange={recapthaOnChange}
                          />
                      </div>
                  </form>
                </div>
           
            )}
            </div>

            <div className="col-md-12 col-xl-6 h-100 order-xl-1 d-flex flex-column justify-content-evenly align-items-center bg-white">
                <div className={`logo d-flex flex-column align-items-start ${styles.loginLogo}`} >
                    <a href="/" style={{fontSize:"4rem"}}>etkinlikvar</a> <br />
                    <p className="fs-5 fst-italic text-secondary">Şimdi ücretsiz kayıt ol,<br/> etkinliklere katılmaya başla!</p>
                </div>
                <div style={{marginTop: "-10rem"}}>
                    <h1 className='fs-1 text-dark fw-bold' style={{fontFamily: 'var(--second-font)'}}>Yaşadığınız ilde neler var?</h1>
                    <p className='fs-4 text-secondary mt-2'>Şimdi görün ve katılın...</p>
                </div>
            </div>

        </div>
    </div>
    </>
  )
}


const RegisterForm = ({handleReverseLinkClick, errorState}) => {
  const [errorMessages, setErrorMessages] = useState(
   { usernameError: "",
    emailError: "",
    passwordError: "",
    ageError: "",
  }
  )
  const [isFormValid, setFormValid] = useState(false);
  const [isAgeVerified, setAgeVerified] = useState(true);
  const emailInput = useRef();
  const usernameInput = useRef();
  const passwordInput = useRef();

  const handleInputChange = () => {
    const username = usernameInput.current.value;
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    // Regex kontrollerini burada gerçekleştirin
  
    // Örneğin, username alanı için minimum 3 karakter kontrolü:
    const isUsernameValid = username.length >= 4;
    
    if(!isUsernameValid) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        usernameError: "Kullanıcı adı 4 karakterden büyük olmalıdır",
      }));
    }  else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        usernameError: "",
      }));
    }
    // Örneğin, email alanı için geçerli email kontrolü:
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        emailError: "E-Mail formatı uyuşmuyor",
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        emailError: "",
      }));
    }

  
    // Password alanı için minimum 6 karakter kontrolü:
    const isPasswordValid = password.length >= 6;

  
    if (!isPasswordValid) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        passwordError: "Şifreniz 6 karakter veya daha uzun olmalıdır",
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        passwordError: "",
      }));
    }

    if (!isAgeVerified) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        ageError: "18 yaşından büyük olmalısınız",
      }));
    }  else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        ageError: "",
      }));
    }
  
    // Formun geçerli olup olmadığını kontrol edin
    const isFormValid = isUsernameValid && isEmailValid && isPasswordValid;
  
    // isFormValid state'ini güncelleyin
    setFormValid(isFormValid);
  };

  const handleAgeVerificationChange = (event) => {
    const isChecked = event.target.checked;
    setAgeVerified(isChecked);
  };

  const handleSubmit = (event) => {
    if (!isFormValid || !isAgeVerified) {
        event.preventDefault();
        handleInputChange()
    } 
  };

return (
    <div className={`py-5 my-5 ${styles.loginBackground}`}>
        <h1 className="modal-title fs-3 text-center mt-1 fw-bold">
                            Üye Ol
                        </h1>
                        <form onSubmit={handleSubmit} method="POST" action="/auth/register" className="w-75 mx-auto my-0 mt-4">
                        {errorState !== null && errorState.length > 0 && (
                        <h1 className="alert alert-danger">{errorState}</h1>
                        )}
                            <div className="inputField">
                                <label htmlFor="signupusername">Adınız</label>
                                <input type="text" ref={usernameInput}  onChange={handleInputChange}  id="signupusername"
                                    name="signupusername" placeholder="Adınız" />
                                     {errorMessages.usernameError !== "" ? <b className='text-danger'>{errorMessages.usernameError}</b> : null} 
                            </div>
                            <div className="inputField">
                                <label htmlFor="signupemail">E-Postanız</label>
                                <input type="email" ref={emailInput}  onChange={handleInputChange}   id="signupemail"  name="signupemail" placeholder="E-Mail" />
                                {errorMessages.emailError !== "" ? <b className='text-danger'>{errorMessages.emailError}</b> : null} 
                            </div>
                            <div className="inputField">
                                <label htmlFor="signuppassword">Parola</label>
                                <input type="password" ref={passwordInput}  onChange={handleInputChange}  name="signuppassword"
                                    id="signuppassword" placeholder="Parola" />
                                    {errorMessages.passwordError !== "" ? <b className='text-danger'>{errorMessages.passwordError}</b> : null}
                            </div>
                            <div className="inputField">
                                <label htmlFor="location">Konum</label>
                                <input type="text" name="location" 
                                id="location" placeholder="Şehir, ilçe, mahalle " />
                                <b className="text-muted infoInput">Konumunuzu yakınınızdaki etkinlikleri
                                    size göstermek için kullanacağız.</b>
                            </div>
                            <label htmlFor="ageVerification" className="rememberMe">
                                <input type="checkbox" defaultChecked={isAgeVerified}
                                    id="ageVerification" name="ageVerification"
                                    onChange={handleAgeVerificationChange}/>
                                <span className="checkboxCustom"></span>
                                18 Yaşından Büyüğüm
                            </label><br />
                            {errorMessages.ageError !== "" ? <b className='text-danger'>{errorMessages.ageError}</b> : null}
                            <button type="submit" className="loginButton">Kaydol</button>
                            <p className='fs-4 text-center mt-3'>Zaten Üye misin? <a href="/" onClick={handleReverseLinkClick}>Giriş Yap</a></p>
                            <p className="p-3 fs-6">Kaydolarak <a href="#">Hizmet Şartları</a>, <a href="#">Çerez
                                    Politikası</a> ve <a href="#">Gizlilik Politikası</a> şartlarını kabul etmiş
                                olursunuz.</p>
                        </form>
    </div>
)
}

export default Login