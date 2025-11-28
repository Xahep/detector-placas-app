import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    style
}) => {
    const getBgColor = () => {
        if (disabled) return '#cbd5e1'; // slate-300
        switch (variant) {
            case 'primary': return '#4f46e5'; // indigo-600
            case 'secondary': return '#e2e8f0'; // slate-200
            case 'danger': return '#ef4444'; // red-500
            default: return '#4f46e5';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#64748b'; // slate-500
        switch (variant) {
            case 'primary': return '#ffffff';
            case 'secondary': return '#1e293b'; // slate-800
            case 'danger': return '#ffffff';
            default: return '#ffffff';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                { backgroundColor: getBgColor() },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' ? '#1e293b' : 'white'} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 16,
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});
