import React from 'react';

function TrendingEvents ({trendingEvents}) {

    return (
      <div className="container">
    <div className="row my-5">
       <div className="col-12">
       {(trendingEvents !== null && Object.keys(trendingEvents).length > 0) && (
            <React.Fragment>
              <h1 className="text-start text-emphasis fs-5">Trend Etkinlikler</h1>
         <hr />
         {trendingEvents && trendingEvents.map((singular, id) => (
                 <div className="card mb-3" key={id} style={{maxWidth: "540px"}}>
                 <div className="row g-0">
                   <div className="col-md-4">
                   <img src={`../${singular.eventImage}`} className="img-fluid rounded-start" alt="" />
                   </div>
                   <div className="col-md-8">
                     <div className="card-body">
                       <h5 className="card-title">{singular.title}</h5>
                       <p className="card-text">{singular.description}</p>
                       <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                     </div>
                   </div>
                 </div>
               </div>
         ))}
            </React.Fragment>
         )}
    
       </div>
    </div>   
    </div>
 
    )
    }


export default TrendingEvents;