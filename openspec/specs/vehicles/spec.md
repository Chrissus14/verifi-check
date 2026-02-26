# Vehicle Traction Specification

## Purpose

This spec defines the requirements for adding vehicle traction (tracción) and vehicle type (tipo de vehículo) fields to the vehicle registration system. These fields are required to properly categorize and identify vehicle configurations for verification purposes.

## Requirements

### Requirement: Vehicle Type Selection

The system SHALL allow users to select a vehicle type when registering a vehicle.

The vehicle type options MUST be:
- Automóvil
- Camioneta
- Motocicleta
- Camión
- Otro

#### Scenario: User selects vehicle type

- GIVEN the user is on the vehicle registration form
- WHEN the user selects "Automóvil" from the vehicle type dropdown
- THEN the system SHALL display the traction field

#### Scenario: User selects motorcycle

- GIVEN the user is on the vehicle registration form
- WHEN the user selects "Motocicleta" from the vehicle type dropdown
- THEN the system SHALL hide the traction field
- AND the traction field SHALL NOT be required

### Requirement: Traction Field for Automobiles and Pickups

The system SHALL display a traction field when the vehicle type is "Automóvil" or "Camioneta".

The traction options MUST be:
- Delantera (FWD)
- Trasera (RWD)
- 4x4
- AWD (Tracción Integral)

#### Scenario: User registers automobile with RWD

- GIVEN the user selected "Automóvil" as vehicle type
- WHEN the user selects "Trasera" from the traction dropdown
- AND the user fills all required fields
- AND submits the form
- THEN the vehicle SHALL be saved with traction = "Trasera"

#### Scenario: User registers pickup truck with 4x4

- GIVEN the user selected "Camioneta" as vehicle type
- WHEN the user selects "4x4" from the traction dropdown
- AND the user fills all required fields
- AND submits the form
- THEN the vehicle SHALL be saved with traction = "4x4"

### Requirement: Traction Validation

The traction field MUST be required when vehicle_type is "Automóvil" or "Camioneta".

The traction field MUST be optional (nullable) when vehicle_type is other types.

#### Scenario: User tries to save automobile without traction

- GIVEN the user selected "Automóvil" as vehicle type
- WHEN the user leaves the traction field empty
- AND attempts to submit the form
- THEN the system SHALL display an error message "La tracción es requerida para automóviles"
- AND the vehicle SHALL NOT be saved

#### Scenario: User saves motorcycle without traction

- GIVEN the user selected "Motocicleta" as vehicle type
- WHEN the user leaves the traction field empty
- AND submits the form
- THEN the vehicle SHALL be saved with traction = null

### Requirement: Editing Existing Vehicles

The system SHALL allow editing the traction field on existing vehicles.

- GIVEN a vehicle exists with vehicle_type = "Automóvil" and traction = "Trasera"
- WHEN the user edits the vehicle and changes traction to "Delantera"
- AND saves the changes
- THEN the vehicle SHALL be updated with traction = "Delantera"

### Requirement: Vehicle Type Cannot Change for Vehicles with Traction

If a vehicle has a traction value, changing the vehicle type to one that doesn't support traction SHOULD prompt a confirmation or clear the traction value.

- GIVEN a vehicle exists with vehicle_type = "Automóvil" and traction = "Trasera"
- WHEN the user edits the vehicle and changes vehicle_type to "Motocicleta"
- AND saves the changes
- THEN the traction value SHALL be cleared (set to null)
