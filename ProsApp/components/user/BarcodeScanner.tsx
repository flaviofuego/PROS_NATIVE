import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TextInput } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Button } from '@/components/ui/Button';

interface BarcodeScannerProps {
  onCodeScanned: (code: string) => void;
  enabled?: boolean;
}

// Componente para entrada manual en web
function ManualCodeEntry({ onCodeScanned, enabled }: BarcodeScannerProps) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim() && enabled) {
      onCodeScanned(code.trim());
      setCode('');
    }
  };

  return (
    <View style={styles.webContainer}>
      <View style={styles.webContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📱</Text>
        </View>
        <Text style={styles.webTitle}>Escáner no disponible en web</Text>
        <Text style={styles.webDescription}>
          El escáner de códigos de barras solo funciona en dispositivos móviles.
          {'\n'}Usa la entrada manual para registrar asistencia:
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Código Estudiantil</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Ingresa el código del estudiante"
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
            autoCorrect={false}
            editable={enabled}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>

        <Button
          title="Registrar Asistencia"
          onPress={handleSubmit}
          disabled={!code.trim() || !enabled}
        />

        <Text style={styles.webHint}>
          💡 Presiona Enter o el botón para registrar
        </Text>
      </View>
    </View>
  );
}

// Componente de cámara para móvil
function CameraScanner({ onCodeScanned, enabled = true }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setScanned(false);
    }
  }, [enabled]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (scanned || !enabled) return;

    setScanned(true);
    const code = result.data;

    if (code) {
      onCodeScanned(code);
    }

    // Reset after a short delay to allow continuous scanning
    setTimeout(() => {
      setScanned(false);
    }, 1500);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Permiso de Cámara</Text>
          <Text style={styles.permissionText}>
            Necesitamos acceso a la cámara para escanear los códigos de barras estudiantiles.
          </Text>
          <Button
            title="Permitir acceso a cámara"
            onPress={requestPermission}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            'code128',
            'code39',
            'code93',
            'codabar',
            'ean13',
            'ean8',
            'upc_e',
            'upc_a',
            'itf14',
            'qr',
          ],
        }}
        onBarcodeScanned={enabled ? handleBarCodeScanned : undefined}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.instructionText}>
              Apunta al código de barras del estudiante
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

export function BarcodeScanner({ onCodeScanned, enabled = true }: BarcodeScannerProps) {
  // En web, mostrar entrada manual; en móvil, usar cámara
  if (Platform.OS === 'web') {
    return <ManualCodeEntry onCodeScanned={onCodeScanned} enabled={enabled} />;
  }

  return <CameraScanner onCodeScanned={onCodeScanned} enabled={enabled} />;
}

const SCAN_AREA_SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#2563eb',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  // Estilos para versión web
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  webTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  webDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  webHint: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 16,
    textAlign: 'center',
  },
});
