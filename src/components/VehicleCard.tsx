import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Vehicle, ParkingRecord } from '../types';
import { formatCurrency } from '../utils/logic';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VehicleCardProps {
    item: Vehicle | ParkingRecord;
    onPress?: () => void;
    isHistory?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ item, onPress, isHistory = false }) => {
    const [elapsed, setElapsed] = useState<string>('');

    useEffect(() => {
        if (isHistory) return;

        const updateTime = () => {
            const start = new Date(item.entryTime);
            const now = new Date();
            const diffMs = now.getTime() - start.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            setElapsed(`${hours}h ${mins}m`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [item.entryTime, isHistory]);

    const isCar = item.type === 'Carro';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={styles.card}
        >
            <View style={styles.leftContent}>
                <View style={[styles.iconContainer, isCar ? styles.iconCar : styles.iconMoto]}>
                    <MaterialCommunityIcons
                        name={isCar ? 'car' : 'motorbike'}
                        size={24}
                        color={isCar ? '#4f46e5' : '#10b981'}
                    />
                </View>
                <View>
                    <Text style={styles.plate}>{item.plate}</Text>
                    <Text style={styles.time}>
                        {isHistory
                            ? new Date(item.entryTime).toLocaleDateString()
                            : `Ingreso: ${new Date(item.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                    </Text>
                </View>
            </View>

            <View style={styles.rightContent}>
                {isHistory ? (
                    <Text style={styles.cost}>
                        {formatCurrency((item as ParkingRecord).cost)}
                    </Text>
                ) : (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{elapsed}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCar: {
        backgroundColor: '#e0e7ff', // indigo-100
    },
    iconMoto: {
        backgroundColor: '#d1fae5', // emerald-100
    },
    plate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b', // slate-800
    },
    time: {
        color: '#64748b', // slate-500
        fontSize: 14,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    cost: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4f46e5', // indigo-600
    },
    badge: {
        backgroundColor: '#f1f5f9', // slate-100
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: '#475569', // slate-600
        fontWeight: '500',
    },
});
