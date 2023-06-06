import React, {useState} from "react"
import styles from './filterLocation.module.css'


const FilterLocation = (props) => {
  console.log(props)
    const itemList = [
        "İstanbul",
        "Ankara",
        "İzmir",
        "Cherry",
        "Milk",
        "Peanuts",
        "Butter",
        "Tomato"
      ];
    
      const [filteredList, setFilteredList] = new useState(itemList);
    
      const filterBySearch = (event) => {
        // Access input value
        const query = event.target.value;
        // Create copy of item list
        var updatedList = [...itemList];
        // Include all elements which includes the search query
        updatedList = updatedList.filter((item) => {
          return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
        // Trigger render with updated values
        setFilteredList(updatedList);
      };
      return (
        <div className={styles.App}>
          <div className={styles.searchHeader}>
            <input id={styles.searchBox} className="form-control" onChange={filterBySearch} />
         
          </div>
          <div id={styles.itemList}>
            <ol>
              {filteredList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      );
    }


export default FilterLocation