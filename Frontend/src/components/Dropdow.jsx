import React, { useState, useEffect } from 'react';
import axios from 'axios';




function Dropdown() {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [museums, setMuseums] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    // const [selectedMuseum , setSelectedMuseum] = useState('');
    // const [selectedTicket , setSelectedTicket] = useState('');

    useEffect(()=>{
        axios.get("http://localhost:3000/api/states")
        .then(response => setStates(response.data))
        .catch(error => console.error("error fetching states" , error))
    },[])
    useEffect(()=>{
        if(selectedState){
        axios.get(`http://localhost:3000/api/cities?state_code=${selectedState}`)
        .then(response => setCities(response.data))
        .catch(error => console.error("error fetching states" , error))

        axios.get(`http://localhost:3000/api/museums?state_code=${selectedState}`)
        .then(response => setMuseums(response.data))
        .catch(error => console.error("error fetching museums" , error))
    }
    else{
        setCities([]),
        setMuseums([])
    }
    },[selectedState])

    useEffect(() => {
      if (selectedCity) {
        axios.get(`http://localhost:3000/api/museums?city_name=${selectedCity}`)
          .then(response => setMuseums(response.data))
          .catch(error => console.error('Error fetching museums:', error));
      } 
       else {
        setMuseums([]);
      }
    }, [selectedCity]);

    const styles = {
      dropdownButtons: {
        display: 'flex',
        marginBottom: '20px',
      },
      label: {
        fontSize: '14px',
        marginBottom: '5px',
        color: '#333',
        fontWeight: 'bold',
      },
      select: {
        padding: '10px',
        borderRadius: '50px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        fontSize: '14px',
        width: '200px',
        transition: 'border-color 0.3s ease',
      },
      selectFocus: {
        borderColor: '#007BFF',
        outline: 'none',
      },
      selectDisabled: {
        backgroundColor: '#e9ecef',
        cursor: 'not-allowed',
      },
      container:{
        display:'flex',
      },
    };

  return (
    <div>
    <div style={styles.container}>
        <div style={styles.dropdownButtons}>
        <select 
          value={selectedState} 
          onChange={e => setSelectedState(e.target.value)}
          style={styles.select}
        >
          <option value="">--Select State--</option>
          {states.map(state => (
            <option key={state.id} value={state.state_code}>
              {state.name}
            </option>
          ))}
        </select>

        </div>
        <div style={styles.dropdownButtons}>
        <select 
          value={selectedCity} 
          onChange={e => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          style={styles.select}
        >
          <option value="">--Select City--</option>
          {cities.map(city => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        </div>
        </div>


        <div>
        {museums.map(museum => (
          <div key={museum.id}>
            <h2>{museum.name}</h2>
            {museum.image_data && (
              <img 
              src={``} 
                alt={museum.name} 
                style={{ width: '200px', height: '150px' }}
              />
            )}
            <p>{museum.city_name}</p>
          </div>
        ))}
      </div>

      
    </div>
  )
}

export default Dropdown

