import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../services/api";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === "web") {
      // En web el Alert a veces no muestra modal, usamos window.alert
      window.alert(`${title ? title + ": " : ""}${msg}`);
    } else {
      Alert.alert(title || "Aviso", msg);
    }
  };

  const onLogin = async () => {
    if (!nombre || !contrasena) {
      showAlert("Campos requeridos", "Ingresa usuario y contraseña");
      return;
    }
    setLoading(true);
    try {
      const body = { nombre: nombre.trim(), contrasena };
      const { data } = await api.post("/auth/login", body);
      console.log("LOGIN RESPONSE =>", data);

      if (!data?.ok || !data?.token) {
        throw new Error(data?.error || "Credenciales inválidas");
      }

      await AsyncStorage.multiSet([
        ["token", data.token],
        ["user", JSON.stringify(data.user)],
      ]);

      // Navegación más robusta
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || "Error desconocido";
      console.error("LOGIN ERROR =>", msg, e?.response?.data);
      showAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escuela • Acceso</Text>

      <TextInput
        placeholder="Usuario"
        autoCapitalize="none"
        value={nombre}
        onChangeText={setNombre}
        onSubmitEditing={onLogin}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
        onSubmitEditing={onLogin}
        style={styles.input}
      />

      <Button
        title={loading ? "Ingresando..." : "Ingresar"}
        onPress={onLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
});
