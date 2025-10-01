// app/(auth)/login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Asegúrate de tener expo-router instalado
import axios from 'axios'; // Instalar axios si no lo tienes

export default function LoginScreen() {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();  // Usamos el router de Expo para la navegación

  const handleLogin = async () => {
    try {
      // Hacemos la petición al backend
      const response = await axios.post('http://localhost:3306/login', {
        nombre,
        contrasena,
      });

      if (response.status === 200) {
        // Redirigir al usuario a la pantalla principal si el login es exitoso
        router.replace('/(tabs)');  // Redirige a la pantalla principal
      }
    } catch (error) {
      // Manejo de errores
      Alert.alert('Error', error.response ? error.response.data.message : 'Error en la conexión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        value={contrasena}
        onChangeText={setContrasena}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
