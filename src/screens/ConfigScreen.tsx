import React, { useEffect, useState } from 'react';
import { Alert, Text, StyleSheet, View, TouchableOpacity, Linking, Image } from 'react-native';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { getConfig, saveConfig } from '../utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ConfigScreen = () => {
    const [ip, setIp] = useState('');

    useEffect(() => {
        getConfig().then(config => setIp(config.serverIp));
    }, []);

    const handleSave = async () => {
        await saveConfig({ serverIp: ip });
        Alert.alert('Éxito', 'Configuración guardada correctamente');
    };

    const openRepo = () => {
        Linking.openURL('https://github.com/Xahep/detector-placas-app');
    };

    return (
        <Layout>
            <View style={styles.formSection}>
                <Input
                    label="Dirección IP del Servidor"
                    placeholder="Ej: 192.168.1.100"
                    value={ip}
                    onChangeText={setIp}
                    keyboardType="numeric"
                />
                <Button title="Guardar Configuración" onPress={handleSave} style={styles.saveButton} />
            </View>

            <View style={styles.divider} />

            <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Acerca de</Text>

                <View style={styles.appInfoContainer}>
                    <MaterialCommunityIcons name="parking" size={48} color="#4f46e5" />
                    <View style={styles.appInfoText}>
                        <Text style={styles.appName}>ParkingApp</Text>
                        <Text style={styles.appVersion}>v1.0.0</Text>
                    </View>
                </View>

                <Text style={styles.developerText}>Desarrollado por <Text style={styles.boldText}>Xahep</Text></Text>

                <TouchableOpacity style={styles.repoButton} onPress={openRepo}>
                    <MaterialCommunityIcons name="github" size={20} color="#4f46e5" />
                    <Text style={styles.repoButtonText}>Ver Código Fuente</Text>
                </TouchableOpacity>

                <View style={styles.techStack}>
                    <Text style={styles.techText}>Powered by Expo SDK 53 & React Native</Text>
                    <Text style={styles.techText}>AI Plate Detection</Text>
                </View>

                <Text style={styles.copyright}>© 2025 Xahep. Todos los derechos reservados.</Text>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    formSection: {
        marginBottom: 24,
    },
    saveButton: {
        marginTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 24,
    },
    aboutSection: {
        alignItems: 'center',
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#64748b',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    appInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    appInfoText: {
        justifyContent: 'center',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    appVersion: {
        fontSize: 14,
        color: '#64748b',
    },
    developerText: {
        fontSize: 16,
        color: '#334155',
        marginBottom: 24,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    repoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e7ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        gap: 8,
        marginBottom: 32,
    },
    repoButtonText: {
        color: '#4f46e5',
        fontWeight: '600',
    },
    techStack: {
        alignItems: 'center',
        marginBottom: 24,
    },
    techText: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 12,
        color: '#cbd5e1',
    },
});
