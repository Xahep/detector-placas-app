import React from 'react';
import { View, SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';

interface LayoutProps {
    children: React.ReactNode;
    style?: any;
}

export const Layout: React.FC<LayoutProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // slate-50
    },
    container: {
        flex: 1,
        padding: 16, // p-4
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 16,
    },
});
