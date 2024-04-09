import React, {useState, useEffect,} from 'react'
import eventSubCategories from '../../NewEvent/eventSubCategories';


const Interests = ({isVerified}) => {
    const [activeCategory, setActiveCategory] = useState(Object.keys(eventSubCategories)[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [hasSent, setHasSent] = useState(false)

    const handleShowMore = () => {
      const categories = Object.keys(eventSubCategories);
      const currentIndex = categories.indexOf(activeCategory);
      const nextIndex = (currentIndex + 1) % categories.length;
      setActiveCategory(categories[nextIndex]);
    };
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value.toLocaleUpperCase('TR'));
    };

    const filteredSubCategories = searchTerm
    ? [].concat(...Object.values(eventSubCategories)).filter(sub => sub.toLocaleUpperCase('TR').includes(searchTerm.toLocaleUpperCase('TR'))).slice(0,6)
    : eventSubCategories[activeCategory];



    const handleSubCategoryClick = (subCategory) => {
        const isAlreadySelected = selectedSubCategories.includes(subCategory);

        if (isAlreadySelected) {
          setSelectedSubCategories(selectedSubCategories.filter(sub => sub !== subCategory));
        } else {
          setSelectedSubCategories([...selectedSubCategories, subCategory]);
        }
      };

      const handleForm = () => {
        const dynamicUserId = isVerified._id;
        setIsLoading(true)
        fetch("/user/interests", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: dynamicUserId,
              selectedContents: selectedSubCategories
            })
        })
        .then(response => {
            if (response.ok) {
              setHasSent(true)
                setIsLoading(false)
                    window.location.href = `/members/${dynamicUserId}`
            } else {
              setHasSent(false)
                console.error('İstek gönderilirken bir hata oluştu.');
                // İstek başarısız ise burada yapılacak işlemleri ekleyebilirsiniz
            }
        })
        .catch(error => {
          setHasSent(false)
            setIsLoading(false)
            console.error('Bir hata oluştu:', error);
        });
      }
      
      

  return (
    <div className="container">
    <div className="row">
        <h1 className="fs-1 text-center mt-5">İlgi Alanlarınız</h1>

        <div className="col-lg-4 d-flex flex-column justify-content-start align-items-center">
                <h4 className="my-5 fs-4">İlgi alanınızı bulamadınız mı? Arayın.</h4>

                <label className="fs-4 mb-2" htmlFor="searchinterests">İlgi alanlarını ara</label>
            <input type="search" onChange={handleSearch} className="border border-1 form-control" id="searchinterests" />
            <div id="subCategoryContainer" style={{height: "10rem"}} className="d-flex flex-wrap mt-5 justify-content-center align-items-center">
            
          <div className='d-flex align-items-center justify-content-center flex-wrap'>
          {filteredSubCategories.map(subCategory => (
          <button key={subCategory}
          onClick={() => handleSubCategoryClick(subCategory)}
           className={`btn btn-outline-info me-2 mb-2 ${selectedSubCategories.includes(subCategory) ? 'active' : ''}`}
           aria-pressed={selectedSubCategories.includes(subCategory) ? 'true' : 'false'}
           data-bs-toggle="button">{subCategory}</button>
        ))}
          </div>
                <div id="interestsResults">
                {filteredSubCategories.length === 0 && searchTerm && (
                        <p className="text-center fs-5">Sonuç bulunamadı.</p>
                    )}
                </div>

            </div>
            <button id="showMoreBtn" className="btn btn-primary mb-3 mt-5 mx-auto" onClick={handleShowMore}>Daha Fazla Gör</button>
            
        </div>

        <div id="categoryContainerParent" style={{paddingTop: "4.5rem"}} className="col-lg-7 d-flex flex-column justify-content-start align-items-center">
        {selectedSubCategories.length > 0 && (
                        <p className="text-center fs-4">Seçimleriniz:</p>
                    )}
            <div id="selectedCategoriesContainer" className="d-flex flex-wrap mt-5 justify-content-center align-items-center sub-category-buttons">
            {selectedSubCategories.map(subCategory => (
  <button
    key={subCategory}
    className="btn btn-danger me-2 mb-2"
    onClick={() => handleSubCategoryClick(subCategory)}
  >
    {subCategory} <span aria-hidden="true">×</span>
  </button>
))}

            </div>
        </div>
        <div className="col-lg-1 d-flex">
            <div className="row d-flex">
                <div className="col align-self-end d-flex">
                    <button type="button" 
                    onClick={handleForm} id="saveButton"
                    disabled={isLoading || hasSent ? true : false}
                    className="btn d-flex align-items-center justify-content-center btn-dark px-3 py-2">
                        {isLoading ? <div className="spinner-border" role="status">
  <span className="visually-hidden">Loading...</span>
</div> : "Kaydet"}
                    </button>
                </div>
            </div>
            
        </div>
    </div>
  </div>
  )
}

export default Interests