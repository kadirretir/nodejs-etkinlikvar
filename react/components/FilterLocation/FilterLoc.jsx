import React, {useState, useEffect, useRef, forwardRef } from "react"
import styles from './filterLocation.module.css'


const FilterDistrict = ({itemList, inputElement}) => {
  const [filteredDistricts, setFilteredDistricts] = useState(itemList)

  const InputElement_2 = useRef()

  const filterBySearch = () => { // Arama sorgusunu küçük harflere dönüştür

    const getDistrictsFromCity = itemList.find((item) => {
      return item.name.toLowerCase() === inputElement.current.value.toLowerCase();
    });

    const getDistrictsInputValue = InputElement_2.current.value.toLowerCase()
    let updatedList = getDistrictsFromCity.districts.filter((item) => {
      return item.name.toLowerCase().includes(getDistrictsInputValue); // Eşleşmeyi includes() yöntemiyle kontrol et
    });
    if (updatedList.length >= 8) {
      updatedList = []; // Eğer güncellenmiş liste 8 veya daha fazla öğe içeriyorsa, listeyi boşalt
    }
    
      setFilteredDistricts(updatedList);
      getRidOfFilter()
  };

  const takeClickedCity = (item, e) => {
    e.preventDefault();
    InputElement_2.current.value = item
    setFilteredDistricts([])
  }
  useEffect(() => {
    setFilteredDistricts([])
  }, [])

  const getRidOfFilter = () => {
    const getDistrictsFromCity = itemList.find((item) => {
      return item.name.toLowerCase() === inputElement.current.value.toLowerCase();
    });
    const query = InputElement_2.current.value.toLowerCase()
    const checkIfMatch = getDistrictsFromCity.districts.find((item) => {
      return item.name.toLowerCase() === query
      });
    if(checkIfMatch) {
      setFilteredDistricts([])
    } 
  }

  return (
    <>
    <input type="text" className="form-control my-4" ref={InputElement_2} onChange={filterBySearch}  placeholder="Lütfen ilçeyi giriniz" />
    <div id={styles.itemList_district}>
      <div className="list-group">
        {filteredDistricts.map((item, id) => (
                  (filteredDistricts.length > 0) ? (
                    <a href="#" key={id} className="list-group-item list-group-item-action" onClick={(e) => takeClickedCity(item.name, e)}>
                      {item.name}
                    </a>
                  ) : ""
                ))}
      </div>
    </div>
    </>
  )
}

const ShowDistrictForm = ({inputElement, itemList}) => {
  if(inputElement.current !== null) {
    const query = inputElement.current.value.toLowerCase()
    const checkIfMatch = itemList.find((item) => {
      return item.name.toLowerCase() === query;
    });
  if(checkIfMatch !== undefined) {
    return < FilterDistrict inputElement={inputElement} itemList={itemList} />
  } else {
    return null
  }

  } else {
    return ""
  }

}


const FilterLocation = () => {
      const [itemList, setItemlist] = useState([])
      const [filteredList, setFilteredList] = useState(itemList);
      const inputElement = useRef(null);

      const filterBySearch = (event) => {
        const query = event.target.value.toLowerCase(); // Arama sorgusunu küçük harflere dönüştür
        
        let updatedList = itemList.filter((item) => {
          return item.name.toLowerCase().includes(query); // Eşleşmeyi includes() yöntemiyle kontrol et
        });
        
        if (updatedList.length >= 8) {
          updatedList = []; // Eğer güncellenmiş liste 8 veya daha fazla öğe içeriyorsa, listeyi boşalt
        }
        
        setFilteredList(updatedList);
        getRidOfFilter()
      };

      const takeClickedCity = (item, e) => {
        e.preventDefault();
        inputElement.current.value = item
        setFilteredList([])
      }

      useEffect(() => {
        setFilteredList([])
      }, [])

      const getRidOfFilter = () => {
        const query = inputElement.current.value.toLowerCase()
        const checkIfMatch = itemList.find((item) => {
          return item.name.toLowerCase() === query;
          });
        if(checkIfMatch) {
          setFilteredList([])
        } 
      }


      useEffect(() => {
        fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,id,districts")
        .then((res) => res.json())
        .then((data) => {
          setItemlist(data.data)
        })
      },[])
      return (
        <div className={styles.App}>
          <div className={styles.searchHeader}>
          <label htmlFor="searchBox" className="form-label fs-5">Konumu<i className="fs-6 text-secondary">(Gerekli)</i></label>
          <input id="searchBox" name="eventPostLocation" ref={inputElement} className="form-control my-2" onChange={filterBySearch}  placeholder="İstanbul, Ankara, İzmir..."  />
         
          </div>
          <div id={styles.itemList}>
            <div className={`list-group ${styles.listGroup}`}>
            {filteredList.map((item, id) => (
              (filteredList.length > 0) ? (
                <a href="#" key={id} className="list-group-item list-group-item-action" onClick={(e) => takeClickedCity(item.name, e)}>
                  {item.name}
                </a>
              ) : ""
            ))}
          </div>
          </div>
          <ShowDistrictForm 
          itemList={itemList}
          inputElement={inputElement} />
        </div>
      );
    }


export default FilterLocation