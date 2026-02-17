export const VEHICLE_BRANDS = [
  'Acura', 'Audi', 'BMW', 'Chevrolet', 'Chrysler', 'Dodge', 'Fiat', 'Ford',
  'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia', 'Land Rover',
  'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
  'Nissan', 'Porsche', 'Ram', 'Renault', 'Seat', 'Subaru', 'Suzuki',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
].sort();

export const COMMON_MODELS: Record<string, string[]> = {
  'Renault': ['Kwid', 'Stepway', 'Logan', 'Duster', 'Oroch', 'Captur', 'Koleos'],
  'Chevrolet': ['Aeo', 'Beat', 'Spark', 'Onix', 'Cavalier', 'Trax', 'Tracker', 'Equinox', 'Silverado'],
  'Nissan': ['March', 'Versa', 'Sentra', 'Altima', 'V-Drive', 'Kicks', 'X-Trail', 'NP300'],
  'Volkswagen': ['Vento', 'Jetta', 'Golf', 'Polo', 'Virtus', 'Tiguan', 'Taos', 'Teramont'],
  'Toyota': ['Yaris', 'Corolla', 'Camry', 'Prius', 'Hilux', 'Tacoma', 'RAV4', 'Sienna'],
  'Mazda': ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-9'],
  'Honda': ['City', 'Civic', 'Accord', 'Fit', 'HR-V', 'CR-V'],
  'Ford': ['Figo', 'Fiesta', 'Focus', 'Fusion', 'EcoSport', 'Escape', 'Explorer', 'F-150'],
};

export const SMART_RULES = [
  { brand: 'Renault', sub_brand: 'Kwid', type: 'Estática' },
  { brand: 'Chevrolet', sub_brand: 'Beat', type: 'Estática' },
  { brand: 'Nissan', sub_brand: 'V-Drive', type: 'Dinámica' },
  { brand: 'Volkswagen', sub_brand: 'Vento', type: 'Dinámica' },
  { brand: 'Toyota', sub_brand: 'Yaris', type: 'Dinámica' },
  { brand: 'Mazda', sub_brand: undefined, type: 'Estática' },
  { brand: 'Porsche', sub_brand: undefined, type: 'Estática' },
  { brand: 'Ferrari', sub_brand: undefined, type: 'Estática' },
  { brand: 'Lamborghini', sub_brand: undefined, type: 'Estática' },
] as const;

