import React, { useState, useRef, useEffect } from "react";
import { AppState } from "react-native";

import {
  BarcodeCapture,
  BarcodeCaptureFeedback,
  BarcodeCaptureOverlay,
  BarcodeCaptureSettings,
  Symbology,
} from "scandit-react-native-datacapture-barcode";
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  Feedback,
  FrameSourceState,
  VideoResolution,
  RadiusLocationSelection,
  NumberWithUnit,
  MeasureUnit,
} from "scandit-react-native-datacapture-core";

import { requestCameraPermissionsIfNeeded } from "../camera-permission-handler";

import { styles } from "../styles";

import licenseKey from "../license";

export const FullScreenView = ({ navigation, route }) => {
  const viewRef = useRef(null);

  const [dataCaptureContext, setDataCaptureContext] = useState(
    DataCaptureContext.forLicenseKey(licenseKey)
  );
  const [camera, setCamera] = useState(null);
  const [barcodeCaptureMode, setBarcodeCaptureMode] = useState(null);
  const [isBarcodeCaptureEnabled, setIsBarcodeCaptureEnabled] = useState(false);

  const [cameraState, setCameraState] = useState(FrameSourceState.Off);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    setupScanning();
    startCapture();
    return () => {
      subscription.remove();
      dataCaptureContext.dispose();
    };
  }, []);

  useEffect(() => {
    if (camera) {
      camera.switchToDesiredState(cameraState);
    }
    return () => {
      // Turn of the camera only when the component is unmounting, which means
      // the current view is no longer available.
      if (camera && !viewRef.current) {
        camera.switchToDesiredState(FrameSourceState.Off);
      }
    };
  }, [cameraState, camera]);

  useEffect(() => {
    if (barcodeCaptureMode) {
      barcodeCaptureMode.isEnabled = isBarcodeCaptureEnabled;
    }
    return () => {
      // Disable barcodeCaptureMode only when the component is unmounting, which means
      // the current view is no longer available.
      if (barcodeCaptureMode && !viewRef.current) {
        barcodeCaptureMode.isEnabled = false;
      }
    };
  }, [isBarcodeCaptureEnabled]);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture();
    } else {
      startCapture();
    }
  };

  const setupScanning = () => {
    // Barcode capture is configured through barcode capture settings which are then
    // applied to the barcode capture instance that manages barcode capture.
    const settings = new BarcodeCaptureSettings();

    // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
    // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
    // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
    settings.enableSymbologies([
      Symbology.EAN13UPCA,
      Symbology.EAN8,
      Symbology.UPCE,
      Symbology.QR,
      Symbology.DataMatrix,
      Symbology.Code39,
      Symbology.Code128,
      Symbology.InterleavedTwoOfFive,
    ]);

    // Restrict barcodes so that they only scan when they enter the center of the screen
    settings.locationSelection = new RadiusLocationSelection(
      new NumberWithUnit(0, MeasureUnit.Fraction)
    );

    // Some linear/1d barcode symbologies allow you to encode variable-length data. By default, the Scandit
    // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
    // of these symbologies, and the length is falling outside the default range, you may need to adjust the
    // 'active symbol counts' for this symbology. This is shown in the following few lines of code for one of the
    // variable-length symbologies.
    const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
    symbologySettings.activeSymbolCounts = [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];

    // Create new barcode capture mode with the settings from above.
    const barcodeCaptureMode = BarcodeCapture.forContext(
      dataCaptureContext,
      settings
    );

    // Register a listener to get informed whenever a new barcode is tracked.
    const barcodeCaptureListener = {
      didScan: (_, session) => {
        const barcode = session.newlyRecognizedBarcodes[0];

        setIsBarcodeCaptureEnabled(false);

        route.params.getScanCode(barcode.data);
      },
    };

    // Add the listener to the barcode capture context.
    barcodeCaptureMode.addListener(barcodeCaptureListener);

    // Remove feedback so we can create custom feedback later on.
    const feedback = BarcodeCaptureFeedback.default;
    feedback.success = new Feedback(null, null);
    barcodeCaptureMode.feedback = feedback;

    // Add an overlay for the scanned barcodes.
    const barcodeCaptureOverlay =
      BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCaptureMode, null);

    // Add cross hair
    barcodeCaptureOverlay.shouldShowScanAreaGuides = true;

    viewRef.current.addOverlay(barcodeCaptureOverlay);
    setBarcodeCaptureMode(barcodeCaptureMode);
  };

  const startCapture = () => {
    startCamera();
    setIsBarcodeCaptureEnabled(true);
  };

  const stopCapture = () => {
    stopCamera();
    setIsBarcodeCaptureEnabled(false);
  };

  const startCamera = () => {
    if (!camera) {
      // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
      // default and must be turned on to start streaming frames to the data capture context for recognition.
      const camera = Camera.default;
      dataCaptureContext.setFrameSource(camera);

      const cameraSettings = new CameraSettings();
      cameraSettings.preferredResolution = VideoResolution.UHD4K;
      camera.applySettings(cameraSettings);
      setCamera(camera);
    }

    // Switch camera on to start streaming frames and enable the barcode capture mode.
    // The camera is started asynchronously and will take some time to completely turn on.
    requestCameraPermissionsIfNeeded()
      .then(() => setCameraState(FrameSourceState.On))
      .catch(() => setCameraState(FrameSourceState.Off));
  };

  const stopCamera = () => {
    if (camera) {
      setCameraState(FrameSourceState.Off);
    }
  };

  return (
    <DataCaptureView
      style={styles.fullScreenView}
      context={dataCaptureContext}
      ref={viewRef}
    />
  );
};
