# SURAKSHA - The Safety Guardian


## Overview
Suraksha is a personal safety application designed to help users feel secure by providing real-time monitoring and emergency alert services. The Website allows users to quickly notify their emergency contacts with their current location in case of danger.

## Features
- **User Account Management**: Simple sign-up and login process 
- **Emergency Contacts**: Store primary and secondary emergency contacts
- **Alert System**: Send alerts with different risk levels (Low, Medium, High)
- **Location Tracking**: Option to include real-time location data with alerts
- **Alert History**: Track all previous safety alerts in one place
- **Responsive Design**: Works seamlessly on both mobile and desktop devices

## Technology Stack
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript (jQuery)
- **UI Components**: Font Awesome for icons
- **Styling**: Modern glass-morphism UI with gradient accents
- **Notifications**: Custom toast notifications
- **Location Services**: Browser Geolocation API
- **Data Storage**: Local storage for user session management

## Screenshots
<img width="1449" alt="S1" src="https://github.com/user-attachments/assets/2278b162-1174-4b15-bf29-cee6a79f56cf" />
<img width="1438" alt="S6" src="https://github.com/user-attachments/assets/cd4258ee-404c-469a-8aa5-546017fc1037" />
<img width="1445" alt="S2" src="https://github.com/user-attachments/assets/b26bd99f-d47f-49ad-be9b-35c43911654c" />
<img width="1434" alt="S3" src="https://github.com/user-attachments/assets/27c989bf-792e-49bd-a387-80b67abb5ba6" />
<img width="1440" alt="S4" src="https://github.com/user-attachments/assets/c05093a8-c5cb-423e-bf80-6d922fb806e3" />
<img width="1030" alt="S5" src="https://github.com/user-attachments/assets/97a4af4a-7006-4ff4-9166-a3a72de805c3" />

## Installation

### Prerequisites
- Web server environment (Apache, Nginx, etc.)
- Backend API server (separate repository)

### Setup
1. Clone the repository:
```bash
git clone [https://github.com/Srishyl/Suraksha-The-Safety-Guardian]
cd suraksha-safety-app
```

2. Open `index.html` in your browser or deploy to a web server.

3. Configure the backend API endpoints in the AJAX calls if necessary.

## Usage

### First-time Users
1. Click "Sign Up" to create a new account
2. Enter your personal details
3. Set up your emergency contacts
4. You're ready to use the alert system

### Using the Alert System
1. Press the "ALERT NOW" button
2. Select the appropriate risk level
3. Choose whether to include your location
4. Press "Send Alert" to notify your emergency contacts

## API Endpoints
The frontend makes calls to the following API endpoints:

- **POST /login**: User authentication
- **POST /register**: New user registration
- **POST /contacts**: Save emergency contacts
- **GET /api/contacts**: Retrieve user's emergency contacts
- **POST /api/alert**: Create a new alert
- **GET /api/alerts**: Retrieve user's alert history
- **POST /api/refresh-token**: Refresh authentication token

## Mobile Enhancements
- Pull-to-refresh functionality for alert history
- Vibration feedback on alert button (when supported)
- Adaptive UI elements optimized for touch interfaces
- Offline detection with appropriate user notifications

## Security Features
- Token-based authentication
- Token expiry and refresh mechanism
- No storage of raw passwords
- Session management

## Future Enhancements
- Push notifications for alerts
- Voice-activated emergency mode
- Integration with emergency services
- Advanced location tracking with journey sharing
- Custom emergency protocols
- Geofencing safety zones

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments
- Font Awesome for icons
- Tailwind CSS for styling
- The browser Geolocation API
- All contributors who have helped enhance this safety application

## Contact
Project Link: https://github.com/Srishyl/Suraksha-The-Safety-Guardian

