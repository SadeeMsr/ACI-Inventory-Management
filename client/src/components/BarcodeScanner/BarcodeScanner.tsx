'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '@/graphql/mutations';
import { toast } from 'react-hot-toast';
import { FaCamera, FaStop } from 'react-icons/fa';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { IScannerControls } from '@zxing/browser';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const [scannedNumber, setScannedNumber] = useState<string | null>(null);
  
  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: ['GetProducts', 'GetAnalytics']
  });

  useEffect(() => {
    if (!isOpen) {
      setScannedNumber(null);
      stopScanning();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const stopScanning = () => {
    if (codeReaderRef.current) {
      try {
        scannerControlsRef.current?.stop();
        codeReaderRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setIsScanning(false);
  };

  const handleScan = async (barcode: string) => {
    stopScanning();
    if (scannedNumber === barcode) return;
    
    setScannedNumber(barcode);
    
    try {
      const { data } = await addProduct({
        variables: { barcode }
      });

      if (data.addProduct.status) {
        toast.success('Product added successfully');
        onClose();
      } else {
        setError(data.addProduct.error || 'Failed to add product');
        toast.error(data.addProduct.error || 'Failed to add product');
      }
    } catch (error) {
      setError('Failed to add product');
      toast.error('Failed to add product');
    } finally {
      setError(null);
      setScannedNumber(null);
    }
  };

  const startScanning = async () => {
    setError(null);
    
    try {
     
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      
  
      codeReaderRef.current = new BrowserMultiFormatReader();
      codeReaderRef.current.hints.set(2, []); 
      codeReaderRef.current.hints.set(3, []); 
      codeReaderRef.current.hints.set(4, []); 
      
      setIsScanning(true);
      
      if (videoRef.current) {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        
        if (!videoInputDevices.length) {
          throw new Error('No camera found');
        }
        
        // Prefer back camera if available
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        const selectedDeviceId = backCamera?.deviceId || videoInputDevices[0].deviceId;
        
        scannerControlsRef.current = await codeReaderRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          async (result) => {
            if (result?.getText()) {
              const barcodeText = result.getText();
              console.log("Scanned barcode:", barcodeText);
              await handleScan(barcodeText);
            }
          }
        );
      }
    } catch (error: any) {
      console.error('Scanner error:', error);
      setError(error.message || 'Failed to start camera');
      toast.error(error.message || 'Failed to start camera');
      setIsScanning(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Scan Barcode
                </DialogTitle>

                <div className="mt-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                  </div>
                  {scannedNumber && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Scanned: {scannedNumber}
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={isScanning ? stopScanning : startScanning}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <FaStop className="w-4 h-4" />
                          Stop Scanning
                        </>
                      ) : (
                        <>
                          <FaCamera className="w-4 h-4" />
                          Start Scanning
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 