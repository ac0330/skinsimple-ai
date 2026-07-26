import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';

import { PrimaryButton } from '../../components/Button';
import {
  CameraBackChevron,
  CameraDarkContainer,
  CameraFooter,
  CameraHint,
  ViewfinderWrap,
} from '../../components/CameraViewfinderChrome';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { scanService } from '../../services/scanService';
import { extractBase64AndMimeType } from '../../utils/photo';
import type { RootStackParamList, ScanStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ScanStackParamList, 'PhotoCapture'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FullCameraView = styled(CameraView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const PermissionCenter = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  gap: 16px;
`;

export function PhotoCaptureScreen({ navigation }: Props) {
  const { profile } = useSkinProfile();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraReady) return;
    setCapturing(true);
    setCaptureError(null);
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 0.8,
      });
      if (!photo?.base64) {
        throw new Error('No photo captured.');
      }
      // Freeze the preview on the captured frame so it's visually clear the shot is locked in —
      // the user can lower the phone instead of feeling like they need to keep holding it steady.
      await cameraRef.current?.pausePreview();
      const { base64, mimeType } = extractBase64AndMimeType(photo.base64);
      const result = await scanService.scanProduct(base64, profile, mimeType);
      navigation.navigate('Result', { result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Gemini analysis failed:', error);
      setCaptureError(message);
      await cameraRef.current?.resumePreview();
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return <CameraDarkContainer />;
  }

  if (!permission.granted) {
    return (
      <CameraDarkContainer>
        <CameraBackChevron
          onPress={() => navigation.navigate('ScanMethod')}
          suppressHighlighting
        >
          ‹
        </CameraBackChevron>
        <PermissionCenter>
          <CameraHint>Camera access is needed to take a photo of the product.</CameraHint>
          {permission.canAskAgain ? (
            <PrimaryButton label="Grant Camera Access" variant="muted" onPress={requestPermission} />
          ) : (
            <CameraHint>Enable camera access for SkinSimple AI in Settings.</CameraHint>
          )}
        </PermissionCenter>
      </CameraDarkContainer>
    );
  }

  return (
    <CameraDarkContainer>
      <CameraBackChevron onPress={() => navigation.navigate('ScanMethod')} suppressHighlighting>
        ‹
      </CameraBackChevron>
      <ViewfinderWrap>
        <FullCameraView
          ref={cameraRef}
          facing="back"
          autofocus="on"
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => {
            console.error('Camera failed to start:', event.message);
            setCaptureError(`Camera failed to start: ${event.message}`);
          }}
        />
      </ViewfinderWrap>
      <CameraFooter>
        <CameraHint>
          {captureError
            ? `Analysis failed: ${captureError}`
            : capturing
              ? 'Please wait… loading'
              : !cameraReady
                ? 'Getting camera ready…'
                : 'Position the product label in the frame, and click the button when ready'}
        </CameraHint>
        <PrimaryButton
          label={capturing ? 'Analyzing…' : 'Take Photo'}
          variant="muted"
          disabled={capturing || !cameraReady}
          onPress={handleCapture}
        />
      </CameraFooter>
    </CameraDarkContainer>
  );
}
