import axios from 'axios'

export default {
  getForecast: async function () {
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=51.09&longitude=4.37&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin'
    )

    var probability = Math.max(
      response.data.hourly.precipitation_probability[0],
      response.data.hourly.precipitation_probability[1],
      response.data.hourly.precipitation_probability[2]
    )

    return `Daily max is ${response.data.daily.temperature_2m_max[0]} C, min is ${response.data.daily.temperature_2m_min[0]} C. In the next 3 hours, precipitation probability is ${probability}%`
  },
}
