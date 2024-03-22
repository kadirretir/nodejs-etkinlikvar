import React, { useState } from 'react';

const GeneralSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='container ms-3'>
      <div className="row">
        <div className="col-12">
        <form method='get' action='/events'>
  <div className="input-group">
    <input
      type="search"
      name='searchquery'
      className=""
      placeholder="İstediğinizi Arayın..."
      aria-label="generalsearch"
      aria-describedby="generalsearch"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button className="btn btn-outline-secondary" type="submit" id="generalsearch">Ara</button>
  </div>
</form>

          {/* Arama sonuçlarını burada listeleyin */}
          {/* <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result.name}</li> // Örnek bir listeleme
            ))}
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default GeneralSearch;
