import React, { useState } from 'react'
import styles from './progress.module.css'
import FilterLocation from '../FilterLocation/FilterLoc.jsx'

const ProgressBar = () => {
  const [progress, setProgress] = useState(0)

  const handleButton = () => {
    if(progress < 100) {
      setProgress(progress + 20)
    }
  }
  const getColor = () => {
    if(progress < 40) {
      return "blue"
    } else if(progress < 80) {
      return "red"
    }
  }

  return (
  <>
     <section className="container-fluid">
      <div className="container">
        <div className="row gx-1 justify-content-center">
        <div className="progress my-5" role="progressbar"  style={{height: "18px"}} aria-label="Example with label" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{width: `${progress}%`, backgroundColor: getColor() }}>{progress}%</div>
                  </div>
    <div className="col-md-7">
    
            <h1 className='fs-1 mb-5'>Etkinlik Oluştur
            <hr className="border border-1 opacity-75"></hr>
            </h1>

          
            <form action="">
            <div className="my-3">
              <label htmlFor="exampleInputEmail1" className="form-label fs-5">Başlık<i className="fs-6 text-secondary">(Gerekli)</i></label>

              <input type="email" className="form-control my-3" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="my-3">
            <label htmlFor="exampleInputEmail1" className="form-label fs-5">Etkinliğin Tarihi<i className="fs-6 text-secondary">(Gerekli)</i></label>
                <input id="startDate" className="form-control my-3" type="datetime-local" />
              </div>
            </form>
            <div className="my-3">
            <label htmlFor="exampleInputEmail1" className="form-label fs-5">Konumu<i className="fs-6 text-secondary">(Gerekli)</i></label>
            <FilterLocation eleman="hello" />
              </div>
            

            <button className="btn btn-success" onClick={handleButton}>Sonraki Aşama</button>
    </div>

    <div className="col-md-5">
        <div className="container d-flex justify-content-center" style={{height: "100%"}}>
            <div className="w-75 bg-white d-block p-3 h-100 rounded-5">
              <h2 className="fs-4 text-primary text-secondary-emphasis fw-semibold" style={{fontFamily: 'var(--second-font)'}}>
                Etkinlik Oluşturmanın Püf Noktaları
                </h2>
            </div>
        </div>
        <div className="container mt-3 d-flex justify-content-center" style={{height: "100%"}}>
            <div className="w-75 bg-white d-block p-3 h-100 rounded-5">
              <h2 className="fs-2 text-left fw-semibold">Herkesin katılmak isteyeceği bir etkinlik oluşturmanın püf noktaları</h2>
            </div>
        </div>
    </div>

  </div>
</div>
  
     </section>
  </>
  )
}

export default ProgressBar