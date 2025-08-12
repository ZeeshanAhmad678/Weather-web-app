import React, { useState } from 'react'

export const fetchApi = async (city) =>{
      try{
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}=${city}`)
        const data = await response.json()
        return data 
      }
      catch(error){
        console.log(error)
        return error
      }
    }
