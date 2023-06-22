import React, {useState, useEffect, useRef, forwardRef } from "react"
import styles from './filterLocation.module.css'


const FilterLocation = () => {
  const autocompleteOptions = {
    types: ["(regions)"],
    componentRestrictions: { country: "tr" }, // Sadece Türkiye'ye özgü yerleri almak için
  };
  
      return (
        <div className={styles.App}>
          <div className={styles.searchHeader}>
          <label htmlFor="searchBox" className="form-label fs-5">Konumu<i className="fs-6 text-secondary">(Gerekli)</i></label>
          <input id="searchBox" name="eventPostLocation" className="form-control my-2"  placeholder="İstanbul, Ankara, İzmir..."  />
       
          </div>
        </div>
      );
    }


export default FilterLocation