# PatientRecordCard Component

A reusable Angular component for displaying patient record cards in the EMR system.

## Overview

The `PatientRecordCardComponent` is a standalone component that encapsulates the display logic for individual patient records. It provides a clean, interactive card interface with action buttons for common operations.

## Features

- **Patient Information Display**: Shows patient name, condition, email, visit details, and status
- **Interactive Actions**: Provides buttons for editing records, adding reports, and viewing history
- **Status Indicators**: Visual badges for patient status (Stable/Critical)
- **Responsive Design**: Hover effects and responsive layout
- **Event-Driven**: Uses Angular's Output events for parent communication

## Usage

```html
<app-patient-record-card 
  [record]="patientRecord"
  (editRecord)="onEditRecord($event)"
  (addReport)="onAddReport($event)"
  (viewHistory)="onViewHistory($event)">
</app-patient-record-card>
```

## Inputs

- `record: PatientRecordWithUser` - The patient record data to display

## Outputs

- `editRecord: EventEmitter<PatientRecordWithUser>` - Emitted when edit button is clicked
- `addReport: EventEmitter<PatientRecordWithUser>` - Emitted when add report button is clicked
- `viewHistory: EventEmitter<PatientRecordWithUser>` - Emitted when view history button is clicked

## Styling

The component includes custom SCSS with:
- Hover animations
- Status badge styling
- Responsive button layouts
- Card elevation effects

## Dependencies

- Angular CommonModule
- Bootstrap Icons (for button icons)
- Custom models from `../models`
