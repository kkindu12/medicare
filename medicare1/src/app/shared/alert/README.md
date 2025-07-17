# Alert Component Usage Guide

This alert system provides a modern, Bootstrap-styled alternative to native browser alerts that can be used throughout the Angular application.

## Components Created

- **AlertComponent**: `src/app/shared/alert/alert.component.ts`
- **AlertService**: `src/app/shared/alert/alert.service.ts`

## How to Use

### 1. Import the AlertService in your component

```typescript
import { AlertService } from '../shared/alert/alert.service';

export class YourComponent {
  constructor(private alertService: AlertService) {}
}
```

### 2. Basic Alert Examples

#### Success Alert
```typescript
this.alertService.showSuccess('Success!', 'Operation completed successfully!');
```

#### Error Alert
```typescript
this.alertService.showError('Error!', 'Something went wrong. Please try again.');
```

#### Warning Alert
```typescript
this.alertService.showWarning('Warning!', 'This action cannot be undone.');
```

#### Info Alert
```typescript
this.alertService.showInfo('Information', 'Here is some important information.');
```

### 3. Confirmation Dialog

```typescript
// Basic confirmation
const result = await this.alertService.showConfirm(
  'Delete Item', 
  'Are you sure you want to delete this item?'
);

if (result) {
  // User clicked confirm
  console.log('User confirmed');
} else {
  // User clicked cancel
  console.log('User cancelled');
}
```

#### Custom confirmation with custom button text
```typescript
const result = await this.alertService.showConfirm(
  'Save Changes',
  'Do you want to save your changes?',
  'Save',      // Confirm button text
  'Discard'    // Cancel button text
);
```

### 4. Example Usage in a Component

```typescript
import { Component } from '@angular/core';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  
  constructor(private alertService: AlertService) {}
  
  saveData() {
    try {
      // Simulate save operation
      this.alertService.showSuccess('Success!', 'Data saved successfully!');
    } catch (error) {
      this.alertService.showError('Error!', 'Failed to save data.');
    }
  }
  
  async deleteItem() {
    const confirmed = await this.alertService.showConfirm(
      'Delete Item',
      'This will permanently delete the item. Are you sure?'
    );
    
    if (confirmed) {
      // Perform delete operation
      this.alertService.showSuccess('Deleted!', 'Item has been deleted.');
    }
  }
  
  showInfo() {
    this.alertService.showInfo('Info', 'This is some useful information.');
  }
}
```

## Features

- **Modern Design**: Clean, Bootstrap-styled modal interface
- **Responsive**: Works on all screen sizes
- **Type Safety**: Full TypeScript support with interfaces
- **Promise-based Confirmations**: Easy async/await support
- **Customizable**: Custom button text and alert types
- **Global Availability**: Single component instance available app-wide
- **Non-intrusive**: Doesn't replace existing alerts, works alongside them

## Alert Types

- `success`: Green checkmark icon for successful operations
- `error`: Red exclamation icon for errors and failures
- `warning`: Orange exclamation icon for warnings and confirmations
- `info`: Blue info icon for informational messages

## Installation

The alert system is already integrated into the app component and available throughout the application. No additional setup is required - just inject the `AlertService` into any component where you want to show alerts.
