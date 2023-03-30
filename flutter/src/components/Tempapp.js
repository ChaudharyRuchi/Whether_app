
import React, { useEffect, useState } from "react";
import Geolocation from '@react-native-community/geolocation';
import "../components/temp.css"



const Tempapp = () => {

  const [city, setCity] = useState(null);
  const [search, setSearch] = useState("");
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {            //geolocation is used to retrieve the device's current location
    Geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=75b4df6f2068a26ea852308cbde7d64b`
        fetchWeatherData(url);
      },
      error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  const fetchWeatherData = async (url) => {
    const response = await fetch(url);
    const resJson = await response.json();
    setCity(resJson);
  };

  const searchHandler = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=75b4df6f2068a26ea852308cbde7d64b`;
    fetchWeatherData(url);
  };

  const addFavoriteLocationHandler = () => {
    if (city) {
      const newFavoriteLocations = [...favoriteLocations];
      newFavoriteLocations.push(city.name);
      setFavoriteLocations(newFavoriteLocations);
      localStorage.setItem('favoriteLocations', JSON.stringify(newFavoriteLocations));
    }
  };

  useEffect(() => {
    const savedFavoriteLocations = JSON.parse(localStorage.getItem('favoriteLocations'));
    if (savedFavoriteLocations) {
      setFavoriteLocations(savedFavoriteLocations);
    }
  }, []);

  return (
    <div className="container">
        <h1>Flutter Weather App</h1>
    <div className="mini-container">
      <div className="home">
        
        {city ? (
          <div>
            <h2>Current Location:</h2>
            <div>
              <h3>{city.name}</h3>
              <p>{city.main.temp}°C</p>
              <p>Min: {city.main.temp_min}°C | Max: {city.main.temp_max}°C</p>
              <button onClick={addFavoriteLocationHandler}>Add to Favorites</button>
            </div>
          </div>
        ) : (
          <p className="errorMsg">No Data Found</p>
        )}
      </div>
      <div className="search">
        <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button onClick={searchHandler}>Search</button>
      </div>
      <div className="detail">
        {city ? (
          <div>
            <h3>{city.name}</h3>
            <p>{city.main.temp}°C</p>
            <p>Min: {city.main.temp_min}°C | Max: {city.main.temp_max}°C</p>
          </div>
        ) : (
          <p className="errorMsg">No Data Found</p>
        )}
      </div>
      <div className="favorites">
        <h2>Favorite Locations:</h2>
        <ul>
          {favoriteLocations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
    
  );
};

export default Tempapp;
