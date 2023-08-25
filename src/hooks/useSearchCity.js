import axios from "axios";
import { useEffect, useState } from "react";

const useSearchCity = (search) => {
  const [cities, setCitites] = useState([]);
  useEffect(() => {
    const handleSearch = async () => {
      const options = {
        method: "GET",
        url: "https://spott.p.rapidapi.com/places",
        params: { q: `${search}`, type: "CITY", limit: 50 },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
          "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        },
      };
      const { data } = await axios.request(options);
      const citiesInfo = data.map(({ name, timezoneId, country }) => ({
        name,
        timezoneId,
        country: country.name,
      }));
      setCitites(citiesInfo);
    };
    handleSearch();
  }, [search]);
  return cities;
};
export default useSearchCity;
