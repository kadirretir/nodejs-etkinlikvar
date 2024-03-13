import React from 'react';
import styles from './events.module.css'


function TrendingCategories ({popularCategories, handleCategoryLeft}) {
    return (
<div className="container">
<div className="row my-5">
 <div className="col-12">
 
   {(popularCategories !== null && Object.keys(popularCategories).length > 0) && (
        <>
         <h2 className="text-emphasis fs-5 py-1">Trend Kategoriler</h2>
         <hr />
         {popularCategories.map((category, id) => (
           <React.Fragment key={id}>
           <button onClick={() => handleCategoryLeft(category)} className={`${styles.categoryButton}`} type="button">{category}</button>
           </React.Fragment>
         ))}
        </>
   )}
   

 </div>
</div>   
</div>

    )
}

export default TrendingCategories;