import { getConfig } from '../utils/storage';

export interface PredictionResponse {
    success: boolean;
    placas: string[];
    num_placas: number;
    image: string; // Base64
    message: string;
}

export const predictPlate = async (imageUri: string): Promise<PredictionResponse> => {
    const config = await getConfig();

    if (!config.serverIp) {
        throw new Error('IP_NOT_CONFIGURED');
    }

    const formData = new FormData();
    // @ts-ignore - React Native FormData expects { uri, name, type }
    formData.append('file', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
    });

    try {
        const response = await fetch(`http://${config.serverIp}:8080/predict`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PredictionResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
};
