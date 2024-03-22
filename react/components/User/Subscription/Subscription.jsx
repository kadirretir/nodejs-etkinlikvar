import React from 'react'
import styles from './subscription.module.css'

const Subscription = () => {

  return (
    <div className="container">
    <div className="row">
        <div className="col-12">
            <h1 className='fs-2'>E+ Aboneliği</h1>
            <hr />
           <div className='w-75 p-4 mt-5 border border-secondary-subtle rounded-3'>
           <p className='text-dark' style={{fontSize: "1.5rem", fontWeight: "600", fontFamily: "var(--second-font)"}}>Henüz etkinlikdolu+ abonesi değilsiniz.</p>
           <p className='fs-5 my-3 lh-sm tracking-widest'>
           etkinlikdolu+ abonesi olarak, diğer tüm abonelerin erişebildiği istatistikler, organizatör olarak özgürce etkinlik kurabilme,
            en güncel bildirimleri alma ve diğer doluca etkinlikdolu deneyimlerini reklamsız şekilde deneyimleyebilirsiniz.
           </p>
          <a href="/pricing">
          <button className={`${styles.btnStyles}`}>7 Gün Ücretsiz Dene</button>
          </a>
           </div>
        </div>
    </div>
</div>
  )
}

export default Subscription