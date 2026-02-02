import { router } from "expo-router";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
        <Pressable
                style={styles.button}
                onPress={() => router.push("/")}
              >
                <Text style={styles.buttonText}>Revenir</Text>
              </Pressable>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
