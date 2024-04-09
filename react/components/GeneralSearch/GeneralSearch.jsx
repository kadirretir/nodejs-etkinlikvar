import React, { useState } from 'react';
import styles from './generalsearch.module.css'


const GeneralSearch = () => {

  return (
    <div className='container ps-0 ms-3'>
      <div className="row">
        <div className="col-12">
        <form method='get' action='/events'>
            <div className="input-group flex-nowrap position-relative mx-auto w-100">
              <input
                type="search"
                name='searchquery'
                className={`${styles.searchInput} w-75`}
                placeholder="İstediğinizi Arayın..."
                aria-label="generalsearch"
                aria-describedby="generalsearch"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search position-absolute" style={{top: "35%", left: "0.8rem", cursor: "default"}} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
              <button className={styles.btnStyles} type="submit" id="generalsearch">Ara</button>
              
            </div>
</form>
        </div>
      </div>
    </div>
  );
};

export default GeneralSearch;
