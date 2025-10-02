import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { api } from "../services/api";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Materia = {
  idMateria: number;
  nombre: string;
  calificacion: number | null;
  estado: string | null;
};

export default function HomeScreen({ navigation }: Props) {
  const [materias, setMaterias] = useState<Materia[]>([]);

  const cargar = async () => {
    try {
      const { data } = await api.get("/materias");
      if (data?.ok) setMaterias(data.data);
      else Alert.alert("Error", data?.error || "No se pudieron obtener materias");
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || e.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    navigation.replace("Login");
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Materias</Text>
        <Button title="Salir" onPress={logout} />
      </View>
      <FlatList
        data={materias}
        keyExtractor={(item) => String(item.idMateria)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>Calificación: {item.calificacion ?? "—"}</Text>
            <Text>Estatus: {item.estado ?? "—"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay materias</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  card: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
});
