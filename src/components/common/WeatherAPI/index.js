import React, { Component, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import style from "./WeatherAPI.module.css";

const API_KEY = "722e5a754ab41987e87ad60035c356f2";

function WeatherAPI(props) {
  const { hlat, hlong } = props;
  const [hospitalTemp, setHospitalTemp] = useState();
  const [imgUrl, setImgUrl] = useState("resources/img/sun.png");

  const getWeatherData = (lat, long) => {
    const options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 0
    };
    if ((hlat != null) || (hlong != null)) {
      lat = hlat;
      long = hlong;
      if ((lat !== null) && (long !== null)) {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`)
          .then(response => response.json())
          .then(json => {
            setHospitalTemp(Math.floor(json.main.temp - 273.15));
            setImgUrl(`http://openweathermap.org/img/w/${json.weather[0].icon}.png`);
          })
          .catch(error => {
            console.log('Error', error);
          });
      }
    }
    else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          if ((lat !== null) && (long !== null)) {
            fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`)
              .then(response => response.json())
              .then(json => {
                setHospitalTemp(Math.floor(json.main.temp - 273.15));
                setImgUrl(`http://openweathermap.org/img/w/${json.weather[0].icon}.png`);
              })
              .catch(error => {
                console.log('Error', error);
              });
          }
        }, (error) => {
          console.log(error)
        }, options);
      }
    }
  };
  useEffect(() => {
    getWeatherData(hlat, hlong);
  }, []);

  useEffect(() => {
    getWeatherData(hlat, hlong);
  }, [hlat, hlong]);

  return (
    <div className={style.WeatherAPI_items}>
      <div className={style.WeatherAPI_item}>
        <img alt="weather_icon" src={imgUrl} width="40px" />
      </div>
      <div className={style.WeatherAPI_item}>
        온도 : {hospitalTemp}°C
      </div>
    </div>
  );
}
export default WeatherAPI;