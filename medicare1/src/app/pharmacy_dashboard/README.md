# Pharmacy & Laboratory Dashboard

## Overview
The Pharmacy & Laboratory Dashboard is a comprehensive interface for managing pharmacy operations, prescriptions, lab tests, inventory, and reports within the Medicare system.

## Features

### 🏥 Dashboard Overview
- **Welcome Section**: Personalized greeting with priority notifications
- **Statistics Cards**: Real-time metrics for pending prescriptions, lab tests, inventory, and reports
- **Quick Actions**: Process Orders and Quick Chat buttons

### 📊 Key Metrics
- **Pending Prescriptions**: Currently showing 12 items
- **Lab Test Requests**: Currently showing 8 items  
- **Out-of-Stock Items**: Currently showing 3 items
- **Reports Uploaded Today**: Currently showing 15 items

### 🗂️ Navigation Tabs
- **Prescriptions**: Manage patient prescriptions
- **Lab Tests**: Handle laboratory test requests
- **Inventory**: Track medication and supply inventory
- **Reports**: View and manage reports
- **Payments**: Process and track payments

### 📋 Recent Prescriptions
- View recent prescription entries with status indicators
- Patient information including name, medication, and prescribing doctor
- Time stamps and status badges (PENDING, URGENT)
- Quick access to add new prescriptions

## Access Instructions

### 1. Development Environment
```bash
cd "c:\Users\Supun Piyumal\OneDrive\Desktop\Pharmacy & Laboratory Dashboard\medicare\medicare1"
ng serve --port 4201
```

### 2. Direct URL Access
Navigate to: `http://localhost:4201/pharmacy`

### 3. Through Application Flow
1. Start from the signin page: `http://localhost:4201/signin`
2. Sign in with valid credentials
3. Navigate to `/pharmacy` route

## Component Structure

### Files Created/Modified:
- `pharmacy&laboratory.component.ts` - Main component logic
- `pharmacy&laboratory.component.html` - Template structure
- `pharmacy&laboratory.component.scss` - Styling and responsive design
- `app.routes.ts` - Updated with pharmacy route
- `index.ts` - Export configuration

### Key Functionality:
- **Responsive Design**: Optimized for desktop and mobile devices
- **Interactive Elements**: Hover effects and animations
- **Data Binding**: Angular reactive features
- **Route Protection**: Integrated with AuthGuard

## Styling Features

### Color Scheme:
- **Primary Background**: Linear gradient from #667eea to #764ba2
- **Card Backgrounds**: White with subtle shadows
- **Status Colors**: Yellow (pending), Red (urgent), Blue (info), Green (success)

### Typography:
- **Font Family**: Segoe UI system font stack
- **Responsive**: Scales appropriately on different screen sizes
- **Accessibility**: High contrast ratios for readability

## Technical Implementation

### Angular Features Used:
- **Standalone Components**: Modern Angular architecture
- **CommonModule**: For structural directives (*ngFor, *ngIf)
- **Data Binding**: Property and event binding
- **TypeScript Interfaces**: Type safety for data structures

### Browser Compatibility:
- Modern browsers with ES6+ support
- CSS Grid and Flexbox layouts
- Backdrop-filter effects for glass morphism

## Future Enhancements
- Real-time data integration with backend API
- Advanced filtering and search capabilities
- Print functionality for prescriptions and reports
- Integration with external pharmacy systems
- Mobile app companion

## Support
For technical issues or feature requests, refer to the main Medicare application documentation or contact the development team.
