import './App.css';
import { useEffect, useState } from 'react';

function App() {
  // get api key from .env file
  const [api_key] = useState(process.env.REACT_APP_API_KEY);

  const [cityValue, setCityValue] = useState('');
  const [icon, setIcon] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        setLat(location.coords.latitude);
        setLon(location.coords.longitude);
      }
      , (err) => {
        setLat(0);
        setLon(0);
      }
    );
  }, [])

  const getUrl = () => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

  useEffect(() => {
    fetch(getUrl())
      .then(res => res.json())
      .then(data => {
        if (data?.name) {
          setCityValue(`${data.name} - ${data.sys.country}`);
        }

        if (data?.weather && data.weather.length > 0 && data.weather[0].icon) {
          setIcon(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
        }

        if (data?.main?.temp) {
          calcCelsius(data.main.temp);
          calcFahrenheit(data.main.temp);
        }

        if (data?.sys?.sunrise) {
          const aux = new Date(data.sys.sunrise * 1000);
          setSunrise(`${aux.getHours()}:${aux.getMinutes()}`);
        }

        if (data?.sys?.sunset) {
          const aux = new Date(data.sys.sunset * 1000);
          setSunset(`${aux.getHours()}:${aux.getMinutes()}`);
        }
      })
  }, [lat, lon])

  const calcCelsius = (temp) => setCelsius(Math.round(temp - 273.15));

  const calcFahrenheit = (temp) => setFahrenheit(Math.round(1.8 * (temp - 273.15) + 32));

  return (
    <div className="App">
      <div>
        <h1>Time in your location</h1>
        <div>
          <img src={`${icon}`} alt='imagen del tiempo' />
        </div>
        <span data-editable="text" data-label="City to search" id="code_1">
          <h2>
            {cityValue}
          </h2>
        </span>

        <div>
          <h2>Temperature</h2>
          <h3>{celsius}°C - {fahrenheit}°F</h3>
        </div>
        <div>
          <h3>
            Salida del sol: {sunrise}
          </h3>
          <h3>
            Puesta del sol: {sunset}
          </h3>
        </div>
      </div>
      <footer className="App-footer">
        <p>
          Created by <a href="https://github.com/ruugii">Roger Barrero</a>
        </p>
        <p>
          <a href="https://github.com/ruugii/Time-in-your-location">
            Github repository <img src="/github-logo.svg" alt="github logo" width="20px" />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
