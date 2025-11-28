import React from 'react';
import { TextInput, View, Text, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : styles.inputNormal,
                    style
                ]}
                placeholderTextColor="#94a3b8"
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: '#334155', // slate-700
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        padding: 16,
        borderRadius: 12, // rounded-xl
        fontSize: 18,
        color: '#1e293b', // slate-800
    },
    inputNormal: {
        borderColor: '#e2e8f0', // slate-200
    },
    inputError: {
        borderColor: '#ef4444', // red-500
    },
    errorText: {
        color: '#ef4444', // red-500
        fontSize: 14,
        marginTop: 4,
        marginLeft: 4,
    },
});
