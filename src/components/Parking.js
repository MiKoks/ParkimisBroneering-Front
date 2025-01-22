import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000';
function Parking() {
    const [houses, setHouses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [vehicleReg, setVehicleReg] = useState('');

    const [selectedHouse, setSelectedHouse] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    useEffect(() => {
        axios.get('/api/houses')
            .then(res => setHouses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedHouse) {
            axios.get(`/api/rooms?house_id=${selectedHouse}`)
                .then(res => setRooms(res.data))
                .catch(err => console.error(err));
        } else {
            setRooms([]);
        }
    }, [selectedHouse]);

    useEffect(() => {
        if (selectedRoom) {
            axios.get(`/api/free-parking?room_id=${selectedRoom}`)
                .then(res => setParkingSpots(res.data))
                .catch(err => console.error(err));
        } else {
            setParkingSpots([]);
        }
    }, [selectedRoom]);

    const handleBooking = (spotId) => {
        if (!vehicleReg) {
            alert('Please enter the vehicle registration number!');
            return;
        }

        axios.post('/api/book-parking', {
            spot_id: spotId,
            vehicle_reg_number: vehicleReg,
        })
        .then(() => {
            alert('Parking spot booked successfully');
            setParkingSpots(prev => prev.filter(spot => spot.id !== spotId));
        })
        .catch(err => alert(err.response?.data?.message || 'Failed to book spot'));
    };

    return (
        <div>
            <label>
                Select a House:
                <select
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    value={selectedHouse}
                >
                    <option value="">-- Select a House --</option>
                    {houses.map(house => (
                        <option key={house.id} value={house.id}>{house.name}</option>
                    ))}
                </select>
            </label>
            {selectedHouse && (
                <label>
                    Select a Room:
                    <select
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        value={selectedRoom}
                    >
                        <option value="">-- Select a Room --</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>
                </label>
            )}
            {selectedRoom && (
                <label>
                    Vehicle Registration Number:
                    <input
                        type="text"
                        placeholder="Enter Vehicle Reg. Number"
                        value={vehicleReg}
                        onChange={(e) => setVehicleReg(e.target.value)}
                    />
                </label>
            )}
            {vehicleReg && (
                <ul>
                    {parkingSpots.map(spot => (
                        <li key={spot.id}>
                            Spot {spot.id} - {spot.status}
                            <button onClick={() => handleBooking(spot.id)}>Book</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Parking;
