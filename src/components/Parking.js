import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = 'http://localhost:8000';

function Parking() {
    const [houses, setHouses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [parkingSpots, setParkingSpots] = useState([]);
    const [vehicleReg, setVehicleReg] = useState('');

    const [selectedHouse, setSelectedHouse] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedSpot, setSelectedSpot] = useState('');
    const [message, setMessage] = useState(null);

    const isHouseSelected = selectedHouse.length > 0;
    const isRoomSelected = selectedRoom.length > 0;
    const isVehicleRegValid = vehicleReg.length > 0;
    const isSpotSelected = selectedSpot.length > 0;

    const formStep = isHouseSelected ? isRoomSelected ? isVehicleRegValid ? isSpotSelected ? 5 : 4 : 3 : 2 : 1;

    useEffect(() => {
        axios.get('/api/houses')
            .then(res => setHouses(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setSelectedRoom('');
        setParkingSpots([]);
        if (selectedHouse) {
            axios.get(`/api/rooms?house_id=${selectedHouse}`)
                .then(res => {
                    setRooms(res.data);
                })
                .catch(err => console.error(err));
        } else {
            setRooms([]);
        }
    }, [selectedHouse]);

    useEffect(() => {
        if (selectedHouse) {
            axios.get('/api/free-parking', {
                params: {
                    house_id: selectedHouse,
                }
            })
            .then(res => {
                setParkingSpots(res.data);
            })
            .catch(err => {
                console.error('Error fetching parking spots:', err);
            });
        } else {
            setParkingSpots([]);
        }
    }, [selectedHouse]);

    const handleBooking = () => {
        if (!vehicleReg || !selectedSpot || !selectedHouse || !selectedRoom) {
          setMessage({ type: 'danger', text: 'Please fill in all fields and select a parking spot!' });
          return;
        }
      
        axios
          .post('/api/book-parking', {
            spot_id: selectedSpot,
            vehicle_reg_number: vehicleReg,
            house_id: selectedHouse,
            room_id: selectedRoom,
          })
          .then(() => {
            setMessage({
              type: 'success',
              text: `Parking spot ${selectedSpot} at house ${houses.find((h) => h.id === parseInt(selectedHouse))?.name} has been successfully booked!`,
            });
            setSelectedHouse('');
            setSelectedRoom('');
            setVehicleReg('');
            setSelectedSpot('');
            setParkingSpots([]);
          })
          .catch((err) => {
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            console.error('Booking error details:', err);
            setMessage({
              type: 'danger',
              text: errorMessage,
            });
          });
    };

    const handleClearAll = () => {
        setSelectedHouse('');
        setSelectedRoom('');
        setVehicleReg('');
        setSelectedSpot('');
        setParkingSpots([]);
        setMessage(null);
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleVehicleRegChange = (e) => {
        const value = e.target.value;
        setVehicleReg(value);
    };

    return (
        <div className="container">
            <h1 className="fw-bold">Parking Spot Reservation</h1>

            {message && (
                <div className={`alert alert-${message.type} text-center`} role="alert">
                    {message.text}
                </div>
            )}

            {/* House Selection */}
            {formStep >= 1 && (
                <div className="selectHouse mb-3">
                    <label className="form-label">
                        Select a House:
                        <select
                            className="form-select rounded-3"
                            onChange={(e) => setSelectedHouse(e.target.value)}
                            value={selectedHouse}
                        >
                            <option value="">Select a House</option>
                            {houses.map(house => (
                                <option key={house.id} value={house.id}>
                                    {house.name} (Free: {house.available_spots} / Total: {house.total_spots})
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {/* Room Selection */}
            {formStep >= 2 && (
                <div className="selectRoom mb-3">
                    <label className="form-label">
                        Select a Room:
                        <select
                            className="form-select rounded-3"
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            value={selectedRoom}
                        >
                            <option value="">Select a Room</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {/* Vehicle Registration Number */}
            {formStep >= 3 && (
                <div className="carRegistration mb-3">
                    <label className="form-label">
                        Vehicle Registration Number:
                        <input
                            type="text"
                            placeholder="Enter Vehicle Reg. Number"
                            value={vehicleReg}
                            onChange={handleVehicleRegChange}
                            className="form-control rounded-3"
                        />
                    </label>
                </div>
            )}

            {/* Parking Spot Selection */}
            {formStep >= 4 && (
                <div className="parkingSpots mb-3">
                    <label className="form-label">
                        Select a Parking Spot:
                        <select
                            className="form-select rounded-3"
                            onChange={(e) => setSelectedSpot(e.target.value)}
                            value={selectedSpot}
                        >
                            <option value="">-- Select a Parking Spot --</option>
                            {parkingSpots.map(spot => (
                                <option key={spot.id} value={spot.id}>
                                    Spot {spot.id}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {/* Register Button */}
            {formStep === 5 && (
                <div className="registerButton">
                    <button
                        className="btn btn-primary rounded-3"
                        onClick={handleBooking}
                        disabled={!selectedSpot || !vehicleReg}
                    >
                        Register
                    </button>
                </div>
            )}

            {/* Clear All Button */}
            <button
                className="btn btn-danger position-absolute bottom-0 start-0 mb-3 ms-3 shadow"
                onClick={handleClearAll}
            >
                Clear All
            </button>
        </div>
    );
}

export default Parking;
