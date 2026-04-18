import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import { getAuthHeaders } from '../../utils/helpers';
import jsQR from 'jsqr';
import { CheckCircle, XCircle, Search, Camera, Upload } from 'lucide-react';

const AdminVerification = () => {
  const [qrContent, setQrContent] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualBookingId, setManualBookingId] = useState('');
  const [scanError, setScanError] = useState('');
  const [scannedImage, setScannedImage] = useState(null);

  const handleVerify = async (content) => {
    if (!content.trim()) {
      alert('Please enter QR content or booking ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings/verify`, content, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'text/plain'
        }
      });
      setVerificationResult(response.data);
    } catch (err) {
      setVerificationResult({
        valid: false,
        message: 'Verification failed: ' + (err.response?.data?.message || err.message)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQrSubmit = (e) => {
    e.preventDefault();
    handleVerify(qrContent);
  };

  const handleManualVerify = () => {
    // For manual entry, we need to construct the QR content format
    const mockQrContent = `BOOKING_ID:${manualBookingId}|RESOURCE:Mock|START:2024-01-01T10:00:00|END:2024-01-01T11:00:00|USER:mock|STATUS:APPROVED`;
    handleVerify(mockQrContent);
  };

  const handleImageUpload = async (event) => {
    setScanError('');
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageSrc = reader.result;
      setScannedImage(imageSrc);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        if (!context) {
          setScanError('Failed to get canvas context');
          return;
        }
        context.drawImage(img, 0, 0, img.width, img.height);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code?.data) {
          setQrContent(code.data);
          handleVerify(code.data);
        } else {
          setScanError('No QR code found in the selected image. Please try another image.');
        }
      };
      img.onerror = () => setScanError('Unable to load the selected image.');
      img.src = imageSrc;
    };
    reader.onerror = () => setScanError('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setQrContent('');
    setManualBookingId('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Admin - Booking Verification</h1>

      {!verificationResult ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Verify Booking</h2>
            <p className="text-gray-600 mb-4">
              Scan a QR code or manually enter a booking ID to verify a booking for check-in.
            </p>
          </div>

          {/* QR Code Scanner Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="text-blue-600" size={20} />
              <h3 className="text-lg font-medium">Scan QR Code</h3>
            </div>
            <form onSubmit={handleQrSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload QR Code Image
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 hover:border-blue-500 hover:text-blue-600">
                  <Upload size={20} className="mr-2" />
                  <span>Choose an image file containing a QR code</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {scanError && (
                  <p className="mt-2 text-sm text-red-600">{scanError}</p>
                )}
                {scannedImage && (
                  <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                    <img src={scannedImage} alt="Uploaded QR" className="w-full object-contain" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Content
                </label>
                <textarea
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  placeholder="Paste QR code content here or use a QR scanner..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    <Search size={16} />
                    Verify QR Code
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="text-gray-600" size={20} />
              <h3 className="text-lg font-medium">Manual Entry</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  value={manualBookingId}
                  onChange={(e) => setManualBookingId(e.target.value)}
                  placeholder="Enter booking ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleManualVerify}
                disabled={loading || !manualBookingId.trim()}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    <Search size={16} />
                    Verify Booking ID
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Verification Result */}
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            verificationResult.valid
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {verificationResult.valid ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              <div>
                <h3 className={`text-lg font-semibold ${
                  verificationResult.valid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult.valid ? 'Valid Booking' : 'Invalid Booking'}
                </h3>
                <p className={`text-sm ${
                  verificationResult.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {verificationResult.message}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          {verificationResult.bookingId && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Booking ID</p>
                  <p className="text-sm text-gray-900">{verificationResult.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Resource</p>
                  <p className="text-sm text-gray-900">{verificationResult.resourceName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User</p>
                  <p className="text-sm text-gray-900">{verificationResult.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="text-sm text-gray-900">{verificationResult.dateTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={resetVerification}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Verify Another Booking
            </button>
            {verificationResult.valid && (
              <button
                onClick={() => alert('Check-in successful!')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Confirm Check-in
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;