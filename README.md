# Parking Spot Reservation System

This application is a Parking Spot Reservation System that allows users to reserve parking spots associated with specific houses and rooms.

## Prerequisites

# Install Dependencies
   - PHP (version >= 8.0)
   - Composer
   - Node.js and npm
   - MySQL database

2. **Clone the Repository**
   ```bash
   git clone https://github.com/MiKoks/ParkimisBroneering-Front.git
   git clone https://github.com/MiKoks/ParkimisBroneering-Back.git

3. # Backend Setup
    composer install

4. # Configure Environment
    copy  .env.example and update the database with your database credentials.

5. # Run migrations
    php artisan migrate --seed

6. # start the backend
    php artisan serve

7. # to run the backend tests
    php artisan test
    php artisan migrate:fresh --seed (if needed) 

8. # frontend setup
    cd (to frontend)
    npm install
    npm run dev
    npm test

