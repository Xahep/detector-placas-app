export type VehicleType = 'Carro' | 'Moto';

export interface Vehicle {
    plate: string;
    type: VehicleType;
    entryTime: string; // ISO string
}

export interface ParkingRecord extends Vehicle {
    exitTime: string; // ISO string
    totalTimeMinutes: number;
    cost: number;
}

export interface Config {
    serverIp: string;
}
