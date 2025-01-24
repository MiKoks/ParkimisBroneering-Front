import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Parking from '../components/Parking';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Parking spot booking', () => {
  // Test: Should successfully book a parking spot
  it('should successfully book a parking spot', async () => {
    axios.post.mockResolvedValue({
      data: { success: true, message: 'Parking spot booked successfully' },
    });
    axios.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: 'House A', available_spots: 1, total_spots: 2 },
          { id: 2, name: 'House B', available_spots: 1, total_spots: 1 },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, house_id: 1, name: 'Room 101' },
          { id: 2, house_id: 1, name: 'Room 102' },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, status: 'available' },
          { id: 2, status: 'available' },
        ],
      });

    render(<Parking />);

    // Select House A
    const houseSelect = await screen.findByLabelText(/Select a House/i);
    await userEvent.selectOptions(houseSelect, '1');
    console.log('Selected house value:', houseSelect.value);
    expect(houseSelect.value).toBe('1');

    // Select Room 101
    const roomSelect = await screen.findByLabelText(/Select a Room/i);
    await userEvent.selectOptions(roomSelect, '1');
    console.log('Selected room value:', roomSelect.value);
    expect(roomSelect.value).toBe('1');

    // Enter Vehicle Registration Number
    const vehicleRegInput = screen.getByLabelText(/Vehicle Registration Number/i);
    await userEvent.type(vehicleRegInput, 'ABC123');
    console.log('Vehicle registration value:', vehicleRegInput.value);
    expect(vehicleRegInput.value).toBe('ABC123');

    // Select Parking Spot 1
    const parkingSpotSelect = await screen.findByLabelText(/Select a Parking Spot/i);
    await userEvent.selectOptions(parkingSpotSelect, '1');
    console.log('Selected parking spot value:', parkingSpotSelect.value);
    expect(parkingSpotSelect.value).toBe('1');

    // Submit the booking
    const registerButton = screen.getByText(/Register/i);
    await userEvent.click(registerButton);

    expect(axios.post).toHaveBeenCalledWith('/api/book-parking', {
      spot_id: '1',
      vehicle_reg_number: 'ABC123',
      house_id: '1',
      room_id: '1',
    });

    const successMessage = await screen.findByText((content) =>
      content.includes('Parking spot 1 at house House A has been successfully booked!')
    );
    expect(successMessage).toBeInTheDocument();
  });

  // Test: Testing if state is updated if fields are filled and dropdowns selected.
  it('should update the state correctly when filling fields and selecting dropdown options', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: 'House A', available_spots: 1, total_spots: 2 },
          { id: 2, name: 'House B', available_spots: 1, total_spots: 1 },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, house_id: 1, name: 'Room 101' },
          { id: 2, house_id: 1, name: 'Room 102' },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, status: 'available' },
          { id: 2, status: 'available' },
        ],
      });
  
    render(<Parking />);
  
    //Select House A
    const houseSelect = await screen.findByLabelText(/Select a House/i);
    expect(houseSelect).toBeInTheDocument();
    await userEvent.selectOptions(houseSelect, '1');
    await waitFor(() => expect(houseSelect.value).toBe('1'));
    //console.log('House selection state is correct:', houseSelect.value);
  
    // Verify Room dropdown is updated after selecting a house
    const roomSelect = await screen.findByLabelText(/Select a Room/i);
    expect(roomSelect).toBeInTheDocument();
    await userEvent.selectOptions(roomSelect, '1');
    await waitFor(() => expect(roomSelect.value).toBe('1'));
    //console.log('Room selection state is correct:', roomSelect.value);
  
    //Enter Vehicle Registration Number
    const vehicleRegInput = screen.getByLabelText(/Vehicle Registration Number/i);
    expect(vehicleRegInput).toBeInTheDocument();
    await userEvent.type(vehicleRegInput, 'TEST123');
    await waitFor(() => expect(vehicleRegInput.value).toBe('TEST123'));
    console.log('Vehicle registration state is correct:', vehicleRegInput.value);
  
    const parkingSpotSelect = await screen.findByLabelText(/Select a Parking Spot/i);
    expect(parkingSpotSelect).toBeInTheDocument();
    await userEvent.selectOptions(parkingSpotSelect, '1');
    await waitFor(() => expect(parkingSpotSelect.value).toBe('1'));
    console.log('Parking spot selection state is correct:', parkingSpotSelect.value);
  
    expect(houseSelect.value).toBe('1');
    expect(roomSelect.value).toBe('1');
    expect(vehicleRegInput.value).toBe('TEST123');
    expect(parkingSpotSelect.value).toBe('1');
  });
  // Test: testing if error message is shown if booking fails.
  it('should show an error message when booking fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Failed to book parking spot' } },
    });

    axios.get
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: 'House A', available_spots: 0, total_spots: 2 },
          { id: 2, name: 'House B', available_spots: 0, total_spots: 1 },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, name: 'Room 101' },
          { id: 2, name: 'Room 102' },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          { id: 1, status: 'available' },
          { id: 2, status: 'available' },
        ],
      });

    render(<Parking />);

    // Select House A
    const houseSelect = await screen.findByLabelText(/Select a House/i);
    expect(houseSelect).toBeInTheDocument();
    await userEvent.selectOptions(houseSelect, '1');
    expect(houseSelect.value).toBe('1');
    //console.log("House selected value:", houseSelect.value);

    //Select Room 101
    const roomSelect = await screen.findByLabelText(/Select a Room/i);
    expect(roomSelect).toBeInTheDocument();
    await userEvent.selectOptions(roomSelect, '1');
    expect(roomSelect.value).toBe('1');
    //console.log("Room selected value:", roomSelect.value);

    //Enter Vehicle Registration Number
    const vehicleRegInput = screen.getByLabelText(/Vehicle Registration Number/i);
    expect(vehicleRegInput).toBeInTheDocument();
    await userEvent.type(vehicleRegInput, 'XYZ789');
    expect(vehicleRegInput.value).toBe('XYZ789');
    //console.log("Vehicle Registration Number entered:", vehicleRegInput.value);

    //Select Parking Spot 1
    const parkingSpotSelect = await screen.findByLabelText(/Select a Parking Spot/i);
    expect(parkingSpotSelect).toBeInTheDocument();
    await userEvent.selectOptions(parkingSpotSelect, '1');
    expect(parkingSpotSelect.value).toBe('1');
    //console.log("Parking spot selected value:", parkingSpotSelect.value);

    //Submit the booking
    const registerButton = screen.getByRole('button', { name: /Register/i });
    expect(registerButton).toBeInTheDocument();
    await userEvent.click(registerButton);
    const errorMessage = await screen.findByText(/Failed to book parking spot/i);
    expect(errorMessage).toBeInTheDocument();
  });

  // Test: Testing if correct ammount of houses/parking spots is shown in dropdown.
  it('should display the correct number of houses and parking spots', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'House A', available_spots: 1, total_spots: 2 },
        { id: 2, name: 'House B', available_spots: 0, total_spots: 1 },
      ],
    });

    render(<Parking />);
    const houseA = await screen.findByText('House A (Free: 1 / Total: 2)');
    expect(houseA).toBeInTheDocument();
    const houseB = await screen.findByText('House B (Free: 0 / Total: 1)');
    expect(houseB).toBeInTheDocument();
  });
});
