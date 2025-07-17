# EMR Models Documentation

This directory contains all the TypeScript interfaces and types used in the Medicare EMR system.

## Files

### Core Models
- **`User.ts`** - User interface for system users with authentication details
- **`Patient.ts`** - Patient interface containing patient information and records
- **`PatientRecord.ts`** - Core patient record structure
- **`PatientRecordWithUser.ts`** - Extended patient record that includes user information

### Supporting Models
- **`Report.ts`** - Interface for medical reports and documents
- **`Medication.ts`** - Interface for medication information (name, dosage, frequency, dates)
- **`PatientReportResponse.ts`** - API response structure for patient reports

### Exports
- **`index.ts`** - Central export file for all models using TypeScript `export type` syntax

## Usage

Import interfaces from the index file:

```typescript
import type { Patient, User, Report, Medication } from './models';
```

Or import specific interfaces directly:

```typescript
import type { Patient } from './models/Patient';
import type { Medication } from './models/Medication';
```

## Notes

- All exports use `export type` to comply with TypeScript's `isolatedModules` setting
- Models follow consistent naming conventions
- Interfaces include optional properties where appropriate
- Cross-references between models use proper imports
