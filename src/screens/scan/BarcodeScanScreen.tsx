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
  CornerBottomLeft,
  CornerBottomRight,
  CornerTopLeft,
  CornerTopRight,
  FrameBox,
  ViewfinderWrap,
} from '../../components/CameraViewfinderChrome';
import { useSkinProfile } from '../../context/SkinProfileContext';
import { scanService } from '../../services/scanService';
import { extractBase64AndMimeType } from '../../utils/photo';
import type { RootStackParamList, ScanStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ScanStackParamList, 'BarcodeScan'>,
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

export function BarcodeScanScreen({ navigation, route }: Props) {
  const { returnTo } = route.params ?? {};
  const { profile } = useSkinProfile();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisFailed, setAnalysisFailed] = useState<string | null>(null);
  const handledRef = useRef(false);
  const cameraRef = useRef<CameraView>(null);

  const handleBack = () => {
    if (returnTo) {
      navigation.reset({ index: 0, routes: [{ name: 'ScanMethod' }] });
      navigation.navigate('MainTabs', { screen: returnTo });
    } else {
      navigation.navigate('ScanMethod');
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (handledRef.current) return;
    handledRef.current = true;

    const product = await scanService.lookupByBarcode(data);
    if (product) {
      setAnalyzing(true);
      // Freeze the preview once a barcode is locked in, so it's clear the user can lower the phone
      // instead of continuing to hold it steady while the rating is generated.
      await cameraRef.current?.pausePreview();
      try {
        const result = await scanService.toScanResult(product, profile);
        navigation.navigate('Result', { result });
      } catch (error) {
        console.error('Gemini analysis failed:', error);
        setAnalysisFailed(error instanceof Error ? error.message : String(error));
        await cameraRef.current?.resumePreview();
      } finally {
        setAnalyzing(false);
      }
    } else {
      setNotFoundBarcode(data);
    }
  };

  // Manual fallback for when live barcode detection doesn't fire (e.g. on web, or a barcode
  // that's hard for the scanner to lock onto) — takes a photo and identifies the product visually,
  // the same reliable path the photo-capture screen uses.
  const handleCapturePhoto = async () => {
    if (!cameraReady || analyzing) return;
    setAnalyzing(true);
    setAnalysisFailed(null);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.8 });
      if (!photo?.base64) {
        throw new Error('No photo captured.');
      }
      // Freeze the preview on the captured frame — the shot is locked in, no need to keep holding.
      await cameraRef.current?.pausePreview();
      const { base64, mimeType } = extractBase64AndMimeType(photo.base64);
      const result = await scanService.scanProduct(base64, profile, mimeType);
      navigation.navigate('Result', { result });
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      setAnalysisFailed(error instanceof Error ? error.message : String(error));
      await cameraRef.current?.resumePreview();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTryAgain = () => {
    setNotFoundBarcode(null);
    setAnalysisFailed(null);
    handledRef.current = false;
  };

  if (!permission) {
    return <CameraDarkContainer />;
  }

  if (!permission.granted) {
    return (
      <CameraDarkContainer>
        <CameraBackChevron onPress={handleBack} suppressHighlighting>
          ‹
        </CameraBackChevron>
        <PermissionCenter>
          <CameraHint>Camera access is needed to scan barcodes.</CameraHint>
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
      <CameraBackChevron onPress={handleBack} suppressHighlighting>
        ‹
      </CameraBackChevron>
      <ViewfinderWrap>
        <FullCameraView
          ref={cameraRef}
          facing="back"
          autofocus="on"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'itf14'],
          }}
          onBarcodeScanned={notFoundBarcode || analyzing ? undefined : handleBarcodeScanned}
          onCameraReady={() => setCameraReady(true)}
          onMountError={(event) => {
            console.error('Camera failed to start:', event.message);
            setAnalysisFailed(`Camera failed to start: ${event.message}`);
          }}
        />
        <FrameBox>
          <CornerTopLeft />
          <CornerTopRight />
          <CornerBottomLeft />
          <CornerBottomRight />
        </FrameBox>
      </ViewfinderWrap>
      <CameraFooter>
        {analysisFailed ? (
          <>
            <CameraHint>Analysis failed: {analysisFailed}</CameraHint>
            <PrimaryButton label="Try Again" variant="muted" onPress={handleTryAgain} />
          </>
        ) : notFoundBarcode ? (
          <>
            <CameraHint>Barcode not recognized — try a different product.</CameraHint>
            <PrimaryButton label="Try Again" variant="muted" onPress={handleTryAgain} />
            <PrimaryButton
              label="Search by Name Instead"
              variant="muted"
              onPress={() => navigation.navigate('Search')}
            />
          </>
        ) : (
          <>
            <CameraHint>
              {!cameraReady
                ? 'Getting camera ready…'
                : analyzing
                  ? 'Please wait… loading'
                  : 'Position the barcode in the frame, and click the button when ready'}
            </CameraHint>
            <PrimaryButton
              label={analyzing ? 'Analyzing…' : 'Scan Now'}
              variant="muted"
              disabled={!cameraReady || analyzing}
              onPress={handleCapturePhoto}
            />
          </>
        )}
      </CameraFooter>
    </CameraDarkContainer>
  );
}
