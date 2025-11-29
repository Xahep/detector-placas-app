import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { validatePlate, formatPlate } from '../utils/logic';
import { saveVehicle, getActiveVehicles } from '../utils/storage';
import { VehicleType } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { predictPlate } from '../services/api';

export const EntryScreen = () => {
    const navigation = useNavigation();
    const [plate, setPlate] = useState('');
    const [type, setType] = useState<VehicleType>('Carro');
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    // AI State
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [detectedPlates, setDetectedPlates] = useState<string[]>([]);

    const pickImage = async (source: 'camera' | 'gallery') => {
        try {
            let result;
            if (source === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                    base64: false,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.8,
                    base64: false,
                });
            }

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
                setDetectedPlates([]);
                processImage(result.assets[0].uri);
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'No se pudo cargar la imagen');
        }
    };

    const processImage = async (uri: string) => {
        setLoading(true);
        try {
            const response = await predictPlate(uri);
            if (response.success) {
                if (response.image) {
                    setImage(`data:image/jpeg;base64,${response.image}`);
                }
                setDetectedPlates(response.placas || []);
                if (response.placas && response.placas.length > 0) {
                    // Auto-select first plate if available
                    handlePlateSelect(response.placas[0]);
                }
            } else {
                Alert.alert('Info', 'No se detectaron placas');
            }
        } catch (e: any) {
            if (e.message === 'IP_NOT_CONFIGURED') {
                Alert.alert('Configuración', 'Por favor configura la IP del servidor en la pestaña Configuración');
            } else {
                Alert.alert('Error', 'Falló la conexión con el servicio de IA');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePlateSelect = (selectedPlate: string) => {
        const formatted = formatPlate(selectedPlate);
        setPlate(formatted);
        validateSoft(formatted);
    };

    const validateSoft = (text: string) => {
        const formatted = formatPlate(text);
        if (!validatePlate(formatted, type)) {
            setWarning('Formato no estándar, por favor verificar');
        } else {
            setWarning('');
        }
    };

    const handleTextChange = (text: string) => {
        setPlate(text);
        validateSoft(text);
    };

    const handleSave = async () => {
        setError('');
        const formattedPlate = formatPlate(plate);

        // Soft validation check - we allow saving even if warning exists, 
        // but we should ensure it's not empty
        if (!formattedPlate) {
            setError('La placa es obligatoria');
            return;
        }

        const active = await getActiveVehicles();
        if (active.some(v => v.plate === formattedPlate)) {
            Alert.alert('Error', 'Este vehículo ya se encuentra en el parqueadero');
            return;
        }

        await saveVehicle({
            plate: formattedPlate,
            type,
            entryTime: new Date().toISOString(),
        });

        Alert.alert('Éxito', 'Vehículo registrado correctamente', [
            {
                text: 'OK', onPress: () => {
                    setPlate('');
                    setImage(null);
                    setDetectedPlates([]);
                    setWarning('');
                    // @ts-ignore
                    navigation.navigate('Activos');
                }
            }
        ]);
    };

    return (
        <Layout>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* AI Section */}
                    <View style={styles.aiSection}>
                        <View style={styles.imageContainer}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <MaterialCommunityIcons name="camera-outline" size={48} color="#cbd5e1" />
                                    <Text style={styles.placeholderText}>Sin imagen</Text>
                                </View>
                            )}
                            {loading && (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color="#4f46e5" />
                                    <Text style={styles.loadingText}>Procesando...</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => pickImage('camera')} disabled={loading}>
                                <MaterialCommunityIcons name="camera" size={24} color="white" />
                                <Text style={styles.actionButtonText}>Cámara</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => pickImage('gallery')} disabled={loading}>
                                <MaterialCommunityIcons name="image" size={24} color="white" />
                                <Text style={styles.actionButtonText}>Galería</Text>
                            </TouchableOpacity>
                        </View>

                        {detectedPlates.length > 0 && (
                            <View style={styles.chipsContainer}>
                                <Text style={styles.chipsLabel}>Placas Detectadas:</Text>
                                <View style={styles.chipsRow}>
                                    {detectedPlates.map((p, index) => (
                                        <TouchableOpacity key={index} style={styles.chip} onPress={() => handlePlateSelect(p)}>
                                            <Text style={styles.chipText}>{p}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            onPress={() => { setType('Carro'); validateSoft(plate); }}
                            style={[
                                styles.typeButton,
                                type === 'Carro' ? styles.typeButtonActive : styles.typeButtonInactive
                            ]}
                        >
                            <MaterialCommunityIcons name="car" size={32} color={type === 'Carro' ? '#4f46e5' : '#94a3b8'} />
                            <Text style={[styles.typeText, type === 'Carro' ? styles.typeTextActive : styles.typeTextInactive]}>
                                Carro
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { setType('Moto'); validateSoft(plate); }}
                            style={[
                                styles.typeButton,
                                type === 'Moto' ? styles.typeButtonActive : styles.typeButtonInactive
                            ]}
                        >
                            <MaterialCommunityIcons name="motorbike" size={32} color={type === 'Moto' ? '#4f46e5' : '#94a3b8'} />
                            <Text style={[styles.typeText, type === 'Moto' ? styles.typeTextActive : styles.typeTextInactive]}>
                                Moto
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Input
                        label="Placa del Vehículo"
                        placeholder="Ej: ABC 123"
                        value={plate}
                        onChangeText={handleTextChange}
                        autoCapitalize="characters"
                        error={error}
                        maxLength={10} // Increased to allow non-standard
                    />

                    {warning !== '' && (
                        <Text style={styles.warningText}>{warning}</Text>
                    )}

                    <Button title="Registrar Ingreso" onPress={handleSave} style={styles.submitButton} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    aiSection: {
        marginBottom: 24,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        alignItems: 'center',
    },
    placeholderText: {
        color: '#94a3b8',
        marginTop: 8,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        color: '#4f46e5',
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#4f46e5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    chipsContainer: {
        marginTop: 16,
    },
    chipsLabel: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#e0e7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#c7d2fe',
    },
    chipText: {
        color: '#4f46e5',
        fontWeight: 'bold',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    typeButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeButtonActive: {
        borderColor: '#4f46e5',
        backgroundColor: '#e0e7ff',
    },
    typeButtonInactive: {
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    typeText: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    typeTextActive: {
        color: '#4f46e5',
    },
    typeTextInactive: {
        color: '#94a3b8',
    },
    submitButton: {
        marginTop: 16,
        marginBottom: 32,
    },
    warningText: {
        color: '#f59e0b', // amber-500
        fontSize: 14,
        marginTop: -12,
        marginBottom: 16,
        marginLeft: 4,
    },
});
