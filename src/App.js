import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import './App.css'

const endpointUrl = 'https://query.wikidata.org/sparql';

const sparqlQuery = `SELECT ?country ?countryLabel ?population ?capital ?capitalLabel ?officialLanguage ?officialLanguageLabel ?president ?presidentLabel ?currency ?currencyLabel
WHERE 
{
  ?country wdt:P31 wd:Q3624078.
  ?country rdfs:label ?countryLabel.
  ?country wdt:P1082 ?population.
  ?country wdt:P36 ?capital.
  ?capital rdfs:label ?capitalLabel.
  ?country wdt:P37 ?officialLanguage.
  ?officialLanguage rdfs:label ?officialLanguageLabel.
  ?country wdt:P6 ?president.
  ?president rdfs:label ?presidentLabel.
  ?country wdt:P38 ?currency.
  ?currency rdfs:label ?currencyLabel.
  FILTER (lang(?countryLabel) = "en")
  FILTER (lang(?officialLanguageLabel) = "en")
  FILTER (lang(?capitalLabel) = "en")
  FILTER (lang(?presidentLabel) = "en")
  FILTER (lang(?currencyLabel) = "en")
}`;


function App() { 

  function test(res) {
    // Déclaration du dictionnaire qui va contenir les informations
  const countries = {};
    // Parcours des résultats de la requête
    for (const result of res.results.bindings) {
      // Récupération du nom du pays
      const countryName = result.countryLabel.value;
  
      // Vérification si le pays existe déjà dans le dictionnaire
      if (countries[countryName]) {
        // Si oui, ajout des informations dans le tableau correspondant
        countries[countryName].population.push(result.population.value);
        countries[countryName].area.push(result.area.value);
        countries[countryName].capital.push(result.capitalLabel.value);
        countries[countryName].officialLanguage.push(result.officialLanguage.value);
        countries[countryName].president.push(result.president.value);
        countries[countryName].currency.push(result.currency.value);
      } else {
        // Si non, création du pays dans le dictionnaire avec les informations
        countries[countryName] = {
          population: [result.population.value],
          area: [result.area.value],
          capital: [result.capitalLabel.value],
          officialLanguage: [result.officialLanguage.value],
          president: [result.president.value],
          currency: [result.currency.value]
        };
      }
    }  
    return countries;
  }

  const [data, setData] = useState();
  async function requete () {
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };
    const response = await fetch(fullUrl, { headers });
    const data_aw = await response.json();
    var tab = test(data_aw)
    setData(tab);    
    console.log(tab)
  }
  
  useEffect(() => {   
    requete()
    }  
, []);

return (

  <div id="chartDiv"><Chart/></div>
);
  }

export default App;