import React, { useEffect, useState } from 'react';
import { Alert, Text, StyleSheet } from 'react-native';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { getConfig, saveConfig } from '../utils/storage';

export const ConfigScreen = () => {
    const [ip, setIp] = useState('');

    useEffect(() => {
        getConfig().then(config => setIp(config.serverIp));
    }, []);

    const handleSave = async () => {
        await saveConfig({ serverIp: ip });
        Alert.alert('Éxito', 'Configuración guardada correctamente');
    };

    return (
        <Layout>

            <Input
                label="Dirección IP del Servidor"
                placeholder="Ej: 192.168.1.100"
                value={ip}
                onChangeText={setIp}
                keyboardType="numeric"
            />

            <Button title="Guardar Configuración" onPress={handleSave} style={styles.saveButton} />
        </Layout>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 24,
    },
    saveButton: {
        marginTop: 16,
    },
});
