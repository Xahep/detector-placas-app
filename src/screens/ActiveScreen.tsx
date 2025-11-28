import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Text, View, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Layout } from '../components/Layout';
import { VehicleCard } from '../components/VehicleCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { getActiveVehicles, removeVehicle, saveHistoryRecord } from '../utils/storage';
import { calculateCost, formatCurrency } from '../utils/logic';
import { Vehicle } from '../types';

export const ActiveScreen = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [checkoutData, setCheckoutData] = useState<{ cost: number, totalTimeMinutes: number } | null>(null);

    const loadVehicles = async () => {
        const data = await getActiveVehicles();
        setVehicles(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadVehicles();
        }, [])
    );

    const filteredVehicles = vehicles.filter(v =>
        v.plate.includes(search.toUpperCase())
    );

    const handleSelectVehicle = (vehicle: Vehicle) => {
        const { cost, totalTimeMinutes } = calculateCost(vehicle.entryTime, new Date().toISOString(), vehicle.type);
        setSelectedVehicle(vehicle);
        setCheckoutData({ cost, totalTimeMinutes });
    };

    const handleCheckout = async () => {
        if (!selectedVehicle || !checkoutData) return;

        const record = {
            ...selectedVehicle,
            exitTime: new Date().toISOString(),
            totalTimeMinutes: checkoutData.totalTimeMinutes,
            cost: checkoutData.cost,
        };

        await saveHistoryRecord(record);
        await removeVehicle(selectedVehicle.plate);

        setSelectedVehicle(null);
        setCheckoutData(null);
        loadVehicles();
        Alert.alert('Éxito', 'Servicio finalizado correctamente');
    };

    return (
        <Layout>
            <Input
                placeholder="Buscar placa..."
                value={search}
                onChangeText={setSearch}
                autoCapitalize="characters"
                containerStyle={styles.searchContainer}
            />

            <FlatList
                data={filteredVehicles}
                keyExtractor={item => item.plate}
                renderItem={({ item }) => (
                    <VehicleCard item={item} onPress={() => handleSelectVehicle(item)} />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay vehículos activos</Text>
                }
            />

            <Modal
                visible={!!selectedVehicle}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedVehicle(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Finalizar Servicio</Text>

                        {selectedVehicle && checkoutData && (
                            <View style={styles.summaryContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Placa</Text>
                                    <Text style={styles.value}>{selectedVehicle.plate}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Ingreso</Text>
                                    <Text style={styles.value}>
                                        {new Date(selectedVehicle.entryTime).toLocaleTimeString()}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Tiempo Total</Text>
                                    <Text style={styles.value}>
                                        {Math.floor(checkoutData.totalTimeMinutes / 60)}h {checkoutData.totalTimeMinutes % 60}m
                                    </Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.row}>
                                    <Text style={styles.totalLabel}>Total a Pagar</Text>
                                    <Text style={styles.totalValue}>
                                        {formatCurrency(checkoutData.cost)}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <Button title="Cobrar y Finalizar" onPress={handleCheckout} style={styles.checkoutButton} />
                        <Button title="Cancelar" variant="secondary" onPress={() => setSelectedVehicle(null)} />
                    </View>
                </View>
            </Modal>
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
    searchContainer: {
        marginBottom: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 40,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    summaryContainer: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: '#64748b',
        fontSize: 16,
    },
    value: {
        fontWeight: 'bold',
        color: '#1e293b',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    checkoutButton: {
        marginBottom: 12,
    },
});
