import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform
} from 'react-native';
import { COLORS } from '../theme/colors';

export const WebCameraModal = ({ visible, onClose, onCapturePhoto }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (visible && Platform.OS === 'web') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [visible]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError('');
    setCapturedImage(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('Camera access is not supported on this browser/device.');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera permission denied or camera not found.');
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSnap = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (videoRef.current && streamRef.current) {
      videoRef.current.play();
    }
  };

  const handleSendCaptured = () => {
    if (capturedImage && onCapturePhoto) {
      onCapturePhoto(capturedImage);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>📷 Take Photo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewfinder}>
            {isInitializing && (
              <View style={styles.placeholder}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.placeholderText}>Starting laptop camera...</Text>
              </View>
            )}

            {cameraError ? (
              <View style={styles.placeholder}>
                <Text style={styles.errorText}>⚠️ {cameraError}</Text>
              </View>
            ) : null}

            {capturedImage ? (
              // Captured Photo Preview
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }}
              />
            ) : (
              // Live HTML5 Video Feed
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  borderRadius: 12,
                  display: isInitializing || cameraError ? 'none' : 'block'
                }}
                autoPlay
                playsInline
                muted
              />
            )}
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            {capturedImage ? (
              <>
                <TouchableOpacity style={styles.secondaryBtn} onPress={handleRetake}>
                  <Text style={styles.secondaryBtnText}>🔄 Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSendCaptured}>
                  <Text style={styles.primaryBtnText}>Send Photo ➤</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.snapBtn, (isInitializing || !!cameraError) && styles.btnDisabled]}
                onPress={handleSnap}
                disabled={isInitializing || !!cameraError}
              >
                <View style={styles.snapInner} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 20, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#1F2C34',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  viewfinder: {
    width: '100%',
    height: 320,
    backgroundColor: '#111B21',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  snapBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#2A3942',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  secondaryBtnText: {
    color: '#E9EDEF',
    fontWeight: '600',
    fontSize: 14,
  }
});
