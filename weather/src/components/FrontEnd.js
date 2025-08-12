import React, { useEffect, useState } from "react";
import { FaSearchLocation, FaCrosshairs } from "react-icons/fa";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { fetchApi } from "./Api_Handling";
import LoadingOverlay from "./LoadingOverlay";

function FrontEnd() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");
  const [current, setCurrent] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false)

   const cities = [
  "London", "Manchester", "Birmingham", "Liverpool", "Glasgow", "Bristol",
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Miami",
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra",
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Phalia", "Mandi Bahauddin", "BahawalPur", "Sahiwal", "Gujrat",
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Paris", "Berlin", "Madrid", "Rome", "Amsterdam", "Barcelona", "Vienna", "Prague", "Lisbon", "Brussels", "Copenhagen", "Zurich"
  ];

  const handleInputChange = (e) => {
    setCity(e.target.value);

    if (!e.target.value) {
      setSuggestions([]);
      return;
    }
    const filteredCities = cities.filter((city) =>
      city.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setSuggestions(filteredCities);
  };
  const handleFetch = async () => {
    if (!city) {
      return;
    }
    setLoading(true)
    const fetchedApi = await fetchApi(city);
    const data = fetchedApi;
    console.log("api called");
    setCurrent(data.current);
    setWeather(data.forecast.forecastday[0]);
    setLocation(data.location);
    localStorage.setItem("latestinput", city);
    console.log(localStorage);
    setLoading(false)
  };

  useEffect(() => {
    const storedData = localStorage.getItem("latestinput");
    if (storedData) {
      setCity(storedData);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city) handleFetch();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [city]);

  useEffect(() => {
    const date = new Date(current.last_updated);
    const formattedDate = date.toLocaleString("en-US", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setCurrentTime(formattedDate);
  }, [current.last_updated]);

  function currentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        const apiKey = "AIzaSyDdPGm5bLaSajx0TdIThFSjeEoAkU3ppyI";

        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => console.log(error));
      });
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      {loading && <LoadingOverlay/>}
      <img
        className="absolute top-0 left-0 h-full w-full object-cover brightness-50"
        src="https://i.pinimg.com/1200x/45/56/4c/45564cd584df160aefd24bb225989450.jpg"
        alt=""
      />
      <div className="relative flex justify-center  font-montserrat z-10 items-center">
        <div className="relative w-96 h-auto mt-2 backdrop-blur-md bg-white/30 flex flex-col items-center rounded-md p-2  overflow-hidden">
          <div className="relative ">
            <input
              id="cityInput"
              className=" rounded-full caret-white pl-11  p-[5px] text-white text-lg bg-[#0a2d65] outline-none mt-3 capitalize "
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFetch();
                }
              }}
              type="text"
              placeholder="Search"
              autoComplete="off"
            />
            <FaSearchLocation className="text-white absolute top-6 cursor-pointer  left-4 font-thin" />
            {suggestions.length > 0 && (
              <div
                id="suggestion"
                className=" absolute top-10 z-[999] p-3 w-full rounded-full text-[#0a2d65] font-bold "
              >
                {suggestions.map((value, idx) => (
                  <div
                    key={idx}
                    className="backdrop-blur-3xl cursor-pointer hover:scale-105  mt-[1px] w-full p-3 z-50 transition-all "
                    onClick={() => {
                      setCity(value);
                      setSuggestions([]);
                      handleFetch(value);
                      document.getElementById("cityInput").value = "";
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center mt-2 justify-center">
              <hr className=" w-32  mt-1 border-gray-800" />
              <span className="mx-2">or</span>
              <hr className="w-32 mt-1  border-gray-800" />
            </div>
            <button
              className="flex items-center justify-center cursor-pointer ml-14 font-medium text-white mt-2"
              onClick={currentLocation}
            >
              <FaCrosshairs className="text-[#0a2d65] mr-2" />
              Use Current Location
            </button>
          </div>
          <div className="w-full h-auto p-2 rounded-lg z-50 mt-5 backdrop-blur-md ">
            {current && location && (
              <>
                <div className=" flex items-center justify-center gap-2 text-white text-lg font-medium">
                  <HiOutlineLocationMarker className="text-[#0a2d65]" />
                  {location.name} / {location.region}
                </div>
                <div className=" w-full h-auto mt-2 flex items-center justify-center gap-5 flex-wrap">
                  <div>
                    <img
                      className="w-20 object-cover"
                      src={current.condition.icon}
                      alt="cloud"
                    />
                  </div>
                  <div className="text-white text-center">
                    <p>{currentTime}</p>
                    <span className="flex justify-center items-center flex-wrap gap-3">
                      <p className="text-3xl font-semibold">
                        {current.condition.text}
                      </p>
                      <h2 className="text-3xl font-semibold">
                        {current.temp_c}°C
                      </h2>
                    </span>
                    <p>Feels Like {current.feelslike_c}</p>
                  </div>
                  <div className=" flex items-center  w-[90%]  p-2  rounded-full text-white bg-[#0a2d65]">
                    <WiSunrise className="text-3xl ml-1 " />
                    <p className="ml-1 mr-24">{weather.astro.sunrise}</p>
                    <p>{weather.astro.sunset}</p>
                    <WiSunset className="text-3xl" />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-full flex justify-between items-center text-[#0a2d65] font-medium p-1">
            <p>
              Humidity: <span className="text-white">{current.humidity}%</span>
            </p>
            {/* <p>Rain: <span className='text-white'>{weather.day.daily_chance_of_rain}%</span></p> */}
            <p>
              Wind: <span className="text-white">{current.wind_kph} Km/h</span>
            </p>
          </div>
          {/* per Hour  */}
          <div className=" relative w-[100dvw] h-auto md:px-[450px] p-4 z-50 mt-5 text-sm  ">
            <div className="flex items-center text-white space-x-1 gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide transition-all ">
              {weather &&
                weather.hour &&
                weather.hour.map((hr, idx) => (
                  <div
                    key={idx}
                    className="w-[70px] h-[150px] backdrop-blur-md rounded-full p-2 py-2 flex flex-col items-center justify-center flex-shrink-0 snap-center overflow-hidden"
                  >
                    <p>
                      {new Date(hr.time).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                    <img src={hr.condition.icon} alt="weather visual" />
                    <p>{hr.temp_c}°C</p>
                    <p className="capitalize text-center text-[12px]">
                      {hr.condition.text.split(" ").length >= 2
                        ? hr.condition.text.split(" ")[1]
                        : hr.condition.text}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontEnd;
