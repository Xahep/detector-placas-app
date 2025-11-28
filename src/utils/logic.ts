import { VehicleType } from '../types';

export const PRICING = {
    Carro: 3600,
    Moto: 1500,
};

export const calculateCost = (entryTime: string, exitTime: string, type: VehicleType): { totalTimeMinutes: number; cost: number } => {
    const start = new Date(entryTime);
    const end = new Date(exitTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    const diffHours = Math.ceil(diffMinutes / 60);

    // Business rule: Charge per hour or fraction
    // However, the prompt says "puedes calcularlo proporcionalmente por minutos para exactitud en el MVP"
    // But also "Carros: $3.600 COP / hora".
    // Let's stick to "Charge per hour or fraction" as it's standard for parking, 
    // but if the prompt implies proportional, I will use proportional for exactness if requested.
    // "El cobro se realiza por hora o fracción (puedes calcularlo proporcionalmente por minutos para exactitud en el MVP)"
    // This is slightly ambiguous. "Por hora o fracción" usually means 1 min = 1 hour charge.
    // "Proporcionalmente por minutos" means (price/60) * minutes.
    // I will implement proportional billing for fairness/MVP simplicity as suggested.

    const pricePerHour = PRICING[type];
    const pricePerMinute = pricePerHour / 60;
    const cost = Math.ceil(diffMinutes * pricePerMinute);

    return {
        totalTimeMinutes: diffMinutes,
        cost: cost, // Round up to nearest peso
    };
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const validatePlate = (plate: string, type: VehicleType): boolean => {
    const cleanPlate = plate.toUpperCase().replace(/\s/g, '');

    if (type === 'Carro') {
        // ABC 123 -> 3 letters, 3 numbers
        return /^[A-Z]{3}\d{3}$/.test(cleanPlate);
    } else {
        // AAA 12A -> 3 letters, 2 numbers, 1 letter
        return /^[A-Z]{3}\d{2}[A-Z]$/.test(cleanPlate);
    }
};

export const formatPlate = (plate: string): string => {
    return plate.toUpperCase();
};
