import React, {useState, useEffect, useRef } from "react"
import styles from './filterLocation.module.css'
import itemList from './cityData.js'

const FilterLocation = () => {
    
      const [filteredList, setFilteredList] = useState(itemList);
      const inputElement = useRef();

      const filterBySearch = (event) => {
        const query = event.target.value.toLowerCase(); // Arama sorgusunu küçük harflere dönüştür
        
        let updatedList = itemList.filter((item) => {
          return item.sehir.toLowerCase().includes(query); // Eşleşmeyi includes() yöntemiyle kontrol et
        });
        
        if (updatedList.length >= 8) {
          updatedList = []; // Eğer güncellenmiş liste 8 veya daha fazla öğe içeriyorsa, listeyi boşalt
        }
        
        setFilteredList(updatedList);
      };

      const takeClickedCity = (item, e) => {
        e.preventDefault();
        inputElement.current.value = item
        setFilteredList([])
      }


      useEffect(() => {
        setFilteredList([])
      }, [])
      return (
        <div className={styles.App}>
          <div className={styles.searchHeader}>
          <label htmlFor="searchBox" className="form-label fs-5">Konumu<i className="fs-6 text-secondary">(Gerekli)</i></label>
            <input id="searchBox" name="eventPostLocation"  ref={inputElement} className="form-control my-2 " placeholder="İstanbul, Ankara, İzmir..." onChange={filterBySearch} />
         
          </div>
          <div id={styles.itemList}>
            <div className={`list-group ${styles.listGroup}`}>
            {filteredList.map((item, id) => (
              (filteredList.length > 0) ? (
                <a href="#" key={id} className="list-group-item list-group-item-action" onClick={(e) => takeClickedCity(item.sehir, e)}>
                  {item.sehir}
                </a>
              ) : ""
            ))}
          </div>
          </div>
        </div>
      );
    }


export default FilterLocation