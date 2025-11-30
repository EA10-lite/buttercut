import { View, Image, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { theme } from "../styles/theme";

export default function SplashScreen({ onFinish }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Fade in and scale animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto-hide after 2.5 seconds
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onFinish();
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, onFinish]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <View style={styles.logo}>
                    <Image
                        source={require("../../assets/buttercut-logo.png")}
                        style={styles.logoImage}
                    />
                </View>
            </Animated.View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "primary",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primary,
    },
    logo: {
        width: 96,
        height: 96,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111827",
        borderRadius: 24
    },
    logoImage: {
        width: 64,
        height: 64,
        resizeMode: "contain",
    },
});