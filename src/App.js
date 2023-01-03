import React, { useState, useEffect } from 'react';

const endpointUrl = 'https://query.wikidata.org/sparql';

const sparqlQuery = `SELECT DISTINCT ?country ?countryLabel ?capital ?capitalLabel
WHERE
{
  ?country wdt:P31 wd:Q3624078 .
  #not a former country
  FILTER NOT EXISTS {?country wdt:P31 wd:Q3024240}
  #and no an ancient civilisation (needed to exclude ancient Egypt)
  FILTER NOT EXISTS {?country wdt:P31 wd:Q28171280}
  OPTIONAL { ?country wdt:P36 ?capital } .

  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
}
ORDER BY ?countryLabel`;



function App() { 

  const [data, setData] = useState();
  useEffect(() => {
    async function query () {
      const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
      const headers = { 'Accept': 'application/sparql-results+json' };
      const response = await fetch(fullUrl, { headers });
      const data_aw = await response.json();
      setData(data_aw.results.bindings);    
  }
  query();
    }  
, []);

return (
  
  <div>
    {data ? data.map(item => (
      <div key={item.country.value}>
        <p>{item.countryLabel ? item.countryLabel.value : 'pas de valeur'}</p>
        <p>{item.capitalLabel ? item.capitalLabel.value : 'pas de valeur'}</p>
      </div>
    )) : 'Loading...'}
  </div>
);
  }

  export default App;