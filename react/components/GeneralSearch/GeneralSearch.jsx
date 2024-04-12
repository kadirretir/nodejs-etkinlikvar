import React, { useState } from 'react';
import styles from './generalsearch.module.css'

const GeneralSearch = () => {

  return (
    <div className='container w-100'>
      <form method='get' action='/events' className='d-flex align-items-start justify-content-center'>
        <div className={`input-group flex-nowrap position-relative`}>
          <input
            type="search"
            name='searchquery'
            className={`form-control ${styles.searchInput}`}
            placeholder="İstediğinizi Arayın..."
            aria-label="generalsearch"
            aria-describedby="generalsearch"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search position-absolute" style={{top: "35%", left: "0.8rem", cursor: "default", zIndex: "500"}} viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
          <button className={styles.btnStyles} type="submit" id="generalsearch">Ara</button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSearch;
