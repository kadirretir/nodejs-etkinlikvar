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
              <form action="/events/newevent" method='post' encType="multipart/form-data">
              <div className="my-3">
                <label htmlFor="exampleInputEmail1" className="form-label fs-5">Başlık<i className="fs-6 text-secondary">(Gerekli)</i></label>
                <input type="text" name="eventPostTitle" className="form-control my-2" placeholder='Başlık girin...' id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
              <div className="my-3">
              <label htmlFor="exampleInputEmail1" className="form-label fs-5">Etkinliğin Tarihi<i className="fs-6 text-secondary">(Gerekli)</i></label>
                  <input id="startDate" name="eventPostDate" className="form-control my-2" type="datetime-local" />
                </div>

                <div className="my-3">
                <FilterLocation />
                </div>


                <div className="my-4">
                <label htmlFor="floatingTextarea2" className="form-label fs-5">Etkinliğinizde neler yapılacak?</label>
                <textarea className="form-control my-2" name='eventPostDescription' placeholder="Sabah yürüyüşünden sonra doğa gezisine gideceğiz..." id="floatingTextarea2" style={{height: "100px"}}></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="formFile" className="form-label fs-5">Resim Yükleyin<i className="fs-6 text-secondary">(Gerekli)</i></label>
                <input className="form-control" name='eventPhoto' type="file" id="formFile" />
              </div>
                <button type='submit' className="btn btn-primary">Oluştur</button>
              </form>
            <button className="btn text-white" style={{background: "var(--first-color)"}} onClick={handleButton}>Sonraki Aşama</button>
    </div>

    <div className="col-md-5">
        <div className="container d-flex justify-content-center" style={{height: "50%"}}>
            <div className={`w-75 bg-light d-block p-3 h-100 rounded-5 ${styles.newEventRightContainer}`}>
             <div className="container">
             
               
             </div>
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