import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, ParkingRecord, Config } from '../types';

const KEYS = {
    ACTIVE_VEHICLES: '@parking_app_active_vehicles',
    HISTORY: '@parking_app_history',
    CONFIG: '@parking_app_config',
};

export const getActiveVehicles = async (): Promise<Vehicle[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.ACTIVE_VEHICLES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading active vehicles', e);
        return [];
    }
};

export const saveVehicle = async (vehicle: Vehicle): Promise<void> => {
    try {
        const current = await getActiveVehicles();
        const updated = [...current, vehicle];
        await AsyncStorage.setItem(KEYS.ACTIVE_VEHICLES, JSON.stringify(updated));
    } catch (e) {
        console.error('Error saving vehicle', e);
    }
};

export const removeVehicle = async (plate: string): Promise<void> => {
    try {
        const current = await getActiveVehicles();
        const updated = current.filter(v => v.plate !== plate);
        await AsyncStorage.setItem(KEYS.ACTIVE_VEHICLES, JSON.stringify(updated));
    } catch (e) {
        console.error('Error removing vehicle', e);
    }
};

export const getHistory = async (): Promise<ParkingRecord[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.HISTORY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading history', e);
        return [];
    }
};

export const saveHistoryRecord = async (record: ParkingRecord): Promise<void> => {
    try {
        const current = await getHistory();
        const updated = [record, ...current]; // Newest first
        await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
        console.error('Error saving history', e);
    }
};

export const getConfig = async (): Promise<Config> => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.CONFIG);
        return jsonValue != null ? JSON.parse(jsonValue) : { serverIp: '' };
    } catch (e) {
        console.error('Error reading config', e);
        return { serverIp: '' };
    }
};

export const saveConfig = async (config: Config): Promise<void> => {
    try {
        await AsyncStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
        console.error('Error saving config', e);
    }
};
