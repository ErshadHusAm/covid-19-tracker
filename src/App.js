import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Select
} from "@material-ui/core";
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import './App.css';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

//STATE = HOW TO WRITE A VARIABLE IN REACT
//USEEFFECT = Runs a piece of code based on a given condition
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTabledata] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat:34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);
  useEffect(() => {
   // the code here will run once the component loads and not again after
   // async -> send a request, wait, do
   const getCountriesData = async () => {
     await fetch ("https://disease.sh/v3/covid-19/countries")
     .then((response)=> response.json())
     .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));
          //sorting =>
          const sortedData = sortData(data);
          //render data on page load for table and dropdown
          setTabledata(sortedData);
          setMapCountries(data);
          setCountries(countries);
     });
    };
   getCountriesData();
  }, []);

  const onCountryChange = async(event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode);
    // if worldwide is selected
    const url = countryCode === "worldwide" 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response=> response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });

  };

  return (
    <div className="app"> 
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (<MenuItem value={country.value}>{country.name}</MenuItem>))}
            </Select>
          </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e)=> setCasesType("cases")}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}/>
            <InfoBox 
            active={casesType === "recovered"}
            onClick={(e)=> setCasesType("recovered")}
            title="Recovered Cases" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}/>
            <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={(e)=> setCasesType("deaths")}
            title="Deaths Cases" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}/>
          </div>
          <Map 
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
    </div>
      <Card className="app_right">
      <CardContent>
        <h3>Live cases by country</h3>  
        <Table countries={tableData} />
        <h3 className="lineHeading">Worldwide new {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType} />
      </CardContent>

    </Card>

    </div>
  );
}

export default App;
