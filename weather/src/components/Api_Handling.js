import React, { useState } from 'react'

export const fetchApi = async (city) =>{
      try{
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d4b46c2c7f164904808190436252207&q=${city}`)
        const data = await response.json()
        return data 
      }
      catch(error){
        console.log(error)
        return error
      }
    }
