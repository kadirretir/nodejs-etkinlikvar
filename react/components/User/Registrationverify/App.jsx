import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import InterestsVerify from './InterestsVerify';
const baseURL = process.env.REACT_APP_API_URL;

const App = ({ isVerified }) => {
  
  return (
    <Router>
      <Routes>
      <Route path="/user/registrationverify"
       element={!isVerified.isVerified ? <VerifyRegistration isVerified={isVerified} /> : <InterestsVerify isVerified={isVerified} />}
        />
        <Route path="/user/registrationinterests" element={<InterestsVerify isVerified={isVerified} />} />
      </Routes>
    </Router>
  );
};


const VerifyRegistration = ({ isVerified }) => {
  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [hasSent, setHasSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true)
      const response = await fetch(baseURL + '/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailToken: inputCode })
      });
  
      const result = await response.json();
      setIsLoading(false); 
      // CHECK IF REQUEST OK
      if (response.ok) {
        setHasSent(true)
       
        if(!result.error) {
          setTimeout(() => {
            navigate('/user/registrationinterests');
          }, 2000);
        } 
        if (result.error) {
          setError(result.error)
          setHasSent(false)
        } else {
          setError(result.message)
        }
      
      } else {
        // Hata durumunda
        setError("Girilen Kod Geçersiz")
      }
    } catch (error) {
      setIsLoading(false)
      setError("Beklenmeyen bir hata ile karşılaşıldı")
    }

  };

  return (
    <div className="container verifyContainer mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card p-4 p-md-5">
          <h1 className="card-title text-center fs-2 mb-4">Hesabınızı Doğrulayın</h1>
          <div className="card-body">
            <hr className="my-4" />
            <h1 className="card-text mb-4 fs-5 text-center">
              Aramıza Hoşgeldin {isVerified.username} <br />
              <span className="fs-6">E-Mail'ine gönderdiğimiz postadaki onaylama kodunu aşağıya girdiğinde tamamiyle hazır olacaksın.</span>
            </h1>
  
            <form onSubmit={handleSubmit} id="verificationForm">
              {error && (
                <div className="alert alert-danger fs-6 mb-4" role="alert">
                  {error}
                </div>
              )}
              <div className="form-floating mb-4">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="form-control"
                  id="emailToken"
                  name="emailToken"
                  placeholder="ornek@ornek.com"
                  required
                  autoComplete="off"
                />
                <label htmlFor="emailToken" className="text-secondary fs-6">
                  Örnek: 4360F6
                </label>
              </div>
              <button
                type="submit"
                className="btn w-100 btn-dark d-flex align-items-center justify-content-center"
                disabled={isLoading || hasSent}
              >
                {isLoading ? (
                  <div className="spinner-border me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Doğrula'
                )}
              </button>
            </form>
  
            <p className="mt-4 text-center">
              Eğer doğrulama e-postasını almadıysanız, lütfen spam/junk klasörünü kontrol edin
            </p>
  
            <p className="text-center">
              Yardıma ihtiyacınız varsa lütfen <a href="/complaints">bize bildirin</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default App;
