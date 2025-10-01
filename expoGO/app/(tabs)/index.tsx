import { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Enviar la solicitud al backend para validar el login
      const response = await axios.post('http://localhost:5000/login', {
        nombre,
        contrasena,
      });

      if (response.status === 200) {
        // Redirigir al usuario a la página principal si el login es exitoso
        router.replace('/(tabs)');  // Cambiar a la pantalla principal
      }
    } catch (error) {
      // Mostrar un error si algo sale mal
      const errorMessage = (error as any)?.response?.data?.message || 'Error en la conexión';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>

      {/* Campo para el nombre de usuario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Campo para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      {/* Botón para realizar el login */}
      <Button title="Entrar" onPress={handleLogin} />

      {/* Imagen (opcional, puedes dejarla o cambiarla) */}
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // Fondo blanco o el color que prefieras
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    marginTop: 20,
    alignSelf: 'center',
  },
});
