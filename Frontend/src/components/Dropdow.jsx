import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Dropdown() {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [museums, setMuseums] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedMuseum, setSelectedMuseum] = useState(''); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get("http://localhost:3000/api/states")
            .then(response => setStates(response.data))
            .catch(error => console.error("Error fetching states:", error));
    },);

     useEffect(() => {
        const params = new URLSearchParams(location.search);
        const state = params.get('state');
        const city = params.get('city');
        const museum = params.get('museum');
        console.log(city);
        console.log(museum);
        if (state) setSelectedState(state);
        if (city) setSelectedCity(city);
        if (museum) setSelectedMuseum(museum);
    }, [location.search]);

    useEffect(() => {
        if (selectedState) {
            axios.get(`http://localhost:3000/api/cities?state_code=${selectedState}`)
                .then(response => setCities(response.data))
                .catch(error => console.error("Error fetching cities:", error));

            axios.get(`http://localhost:3000/api/museums?state_code=${selectedState}`)
                .then(response => setMuseums(response.data))
                .catch(error => console.error("Error fetching museums:", error));


            navigate(`/home/museum?state=${selectedState}`, { replace: true });
             //After navigation fetching it once again to render according to state
            axios.get(`http://localhost:3000/api/museums?state_code=${selectedState}`)
                .then(response => setMuseums(response.data))
                .catch(error => console.error("Error fetching museums:", error));
            
            setSelectedCity(''); 
            setSelectedMuseum('');
        } else {
            setCities([]);
            setMuseums([]);
        }
    }, [selectedState]);

    useEffect(() => {
        if (selectedCity) {
            axios.get(`http://localhost:3000/api/museums?city_name=${selectedCity}`)
                .then(response => setMuseums(response.data))
                .catch(error => console.error('Error fetching museums:', error));

                if(selectedCity!=setSelectedCity){
                    const queryParams = new URLSearchParams(location.search);
                    queryParams.delete('museum'); 
        
                    setSelectedMuseum('');
        
                    navigate(`/home/museum?state=${selectedState}`);
                    console.log("Hlo saby");
                }

        }
    }, [selectedCity, selectedState]);

    useEffect(() => {

        if(setSelectedCity){
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('city', selectedCity);
            navigate(`/home/museum?state=${selectedState}&city=${selectedCity}`, { replace: true });
        }
        if (selectedMuseum) {

            const queryParams = new URLSearchParams(location.search);
            queryParams.set('museum', selectedMuseum);
            
            navigate(`/home/museum?state=${selectedState}&city=${selectedCity}&museum=${selectedMuseum}`, { replace: true });
        }
    }, [selectedCity,selectedMuseum, navigate, location.search]);



    const styles = {
        dropdownButtons: {
            display: 'flex',
            marginBottom: '20px',
        },
        select: {
            padding: '10px',
            borderRadius: '50px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            fontSize: '14px',
            width: '200px',
            transition: 'border-color 2s ease',
        },
        container: {
            display: 'flex',
        },
    };

    const filteredMuseums = museums.filter(museum => {
        return (
            (!selectedState || museum.state_code === selectedState) &&
            (!selectedCity || museum.city_name === selectedCity) &&
            (!selectedMuseum || museum.name === selectedMuseum)
        );
    });

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
                <div style={styles.dropdownButtons}>
                    <select 
                        value={selectedMuseum} 
                        onChange={e => setSelectedMuseum(e.target.value)}
                        disabled={!selectedCity}
                        style={styles.select}
                    >
                        <option value="">--Select Museum--</option>
                        {museums.map(museum => (
                            <option key={museum.id} value={museum.name}>
                                {museum.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                {filteredMuseums.map(museum => (
                    <div key={museum.id}>
                        <h2>{museum.name}</h2>
                        <p>{museum.city_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dropdown;
