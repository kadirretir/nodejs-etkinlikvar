import React from 'react'
import styles from './privacy.module.css';

const Privacy = () => {
  return (
    <div className="container">
    <div className="row">
        <div className="col-12">
            <h1 className='fs-2'>Gizlilik ve Güvenlik</h1>
            <hr />
            <p className={`text-secondary fs-5 ${styles.width}`}>
              Gizliliğiniz ve güvenliğiniz bizim için büyük önem taşıyor ve platformda geçirdiğiniz süre boyunca güvenliğizi maksimum düzeyde tutmak 
              için elimizden geleni yapıyoruz.
            </p>
            <p className='my-3'>Eğer yardıma ihtiyacın olduğunu düşünüyorsan bizimle <a href='/complaints'>iletişime</a> geçebilirsinin.</p>
        </div>
    </div>
</div>
  )
}

export default Privacy