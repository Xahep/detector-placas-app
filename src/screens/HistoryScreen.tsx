import React, { useCallback, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Layout } from '../components/Layout';
import { VehicleCard } from '../components/VehicleCard';
import { getHistory } from '../utils/storage';
import { ParkingRecord } from '../types';

export const HistoryScreen = () => {
    const [history, setHistory] = useState<ParkingRecord[]>([]);

    useFocusEffect(
        useCallback(() => {
            getHistory().then(setHistory);
        }, [])
    );

    return (
        <Layout>
            <FlatList
                data={history}
                keyExtractor={(item, index) => `${item.plate}-${item.exitTime}-${index}`}
                renderItem={({ item }) => (
                    <VehicleCard item={item} isHistory />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay historial disponible</Text>
                }
            />
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
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 40,
        fontSize: 16,
    },
});
