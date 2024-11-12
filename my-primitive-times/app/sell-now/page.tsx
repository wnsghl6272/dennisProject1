'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';
import CropModal from './CropModal';
import 'react-image-crop/dist/ReactCrop.css';
import { v4 as uuidv4 } from 'uuid';
import s3 from '../lib/s3Client'; // Ensure you have your S3 client set up
import { useAppSelector } from '../store/store';
import Image from 'next/image';

const SellNow: React.FC = () => {
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const [photos, setPhotos] = useState<File[]>(Array(8).fill(null));
  const [previewUrls, setPreviewUrls] = useState<string[]>(Array(8).fill(''));
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, height: 30, x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isGoogleUser, setIsGoogleUser] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const router = useRouter();
  

  // Timeout ID for user inactivity
  const [inactivityTimeoutId, setInactivityTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const checkResponse = await apiClient.get('/api/auth/check');
        
        if (checkResponse.status === 200 && checkResponse.data.isLogin) {
          const userResponse = await apiClient.get('/api/auth/user');
          if (userResponse.status === 200 && userResponse.data.user) {
            const { google_id, uuid } = userResponse.data.user;
            if (google_id) {
              setUserId(google_id);
              setIsGoogleUser(true);
            } else {
              setUserId(uuid);
              setIsGoogleUser(false);
            }
          } else {
            router.push('/login'); // If user data is not found, redirect to login
          }
        } else {
          router.push('/login'); // If not logged in, redirect to login
        }
      } catch (error: any) {
        console.error('Error during login status check or fetching user data:', error);
        router.push('/login'); // Redirect to login on any error
      }
    };

    checkLoginStatus();
  }, []);

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      description,
      category,
      brand,
      condition,
      location,
      city,
      price: price ? parseFloat(price) : 0,
    };
    localStorage.setItem('draft', JSON.stringify(draft));
    setUploadMessage('Draft saved successfully!');
  };

  // Load draft from localStorage
  const loadDraft = () => {
    const draft = localStorage.getItem('draft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setDescription(parsedDraft.description);
      setCategory(parsedDraft.category);
      setBrand(parsedDraft.brand);
      setCondition(parsedDraft.condition);
      setLocation(parsedDraft.location);
      setCity(parsedDraft.city);
      setPrice(parsedDraft.price.toString());
    }
  };

  // Error condition
  const [errors, setErrors] = useState({
    photos: '',
    description: '',
    category: '',
    brand: '',
    condition: '',
    price: ''
  });

  useEffect(() => {
    loadDraft();
  }, []);

  // Function to handle user activity
  const handleUserActivity = () => {
    if (inactivityTimeoutId) {
      clearTimeout(inactivityTimeoutId); // Clear the existing timeout
    }

    // Set a new timeout for 4 minutes
    const timeoutId = setTimeout(() => {
      saveDraft(); // Save draft after 3 minutes of inactivity
      console.log('Draft saved');
    }, 180000); // 3 minutes

    setInactivityTimeoutId(timeoutId); // Store the timeout ID
  };

  // Set up event listeners for user activity
  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      if (inactivityTimeoutId) {
        clearTimeout(inactivityTimeoutId); // Clear timeout on unmount
      }
    };
  }, [inactivityTimeoutId]);

  // Handle file change and set preview URL
  const handleFileChange = (index: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedPhotos = [...photos];
      const updatedPreviewUrls = [...previewUrls];

      updatedPhotos[index] = file; // Save the selected file at the index
      updatedPreviewUrls[index] = URL.createObjectURL(file); // Create preview URL

      setPhotos(updatedPhotos);
      setPreviewUrls(updatedPreviewUrls);
      setImage(updatedPreviewUrls[index]); // Set image for cropping
    }
  };

    // Open the crop modal
    const openCropModal = (index: number) => {
      setCurrentImageIndex(index);
      setImage(previewUrls[index]); // Set the image to be cropped
      setCrop({ unit: '%', width: 30, height: 30, x: 0, y: 0 }); // Reset crop state
      setShowCropModal(true);
    };

    // Save the cropped image
    const handleSaveCroppedImage = (croppedImage: string) => {
        if (currentImageIndex !== null) {
            const updatedPreviewUrls = [...previewUrls];
            updatedPreviewUrls[currentImageIndex] = croppedImage; // Update the preview with the cropped image
            setPreviewUrls(updatedPreviewUrls);
            setImage(previewUrls[currentImageIndex]); // Reset the image for cropping
            setCrop({ unit: '%', width: 30, height: 30, x: 0, y: 0 }); // Reset crop state
            setShowCropModal(false); // Close the modal
        }
    };

  // Upload file to S3
  const uploadToS3 = async (file: File) => {
    const bucketName = process.env.AWS_BUCKET_NAME as string;
    const fileName = `${uuidv4()}_${file.name}`;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      const data = await s3.upload(params).promise();
      setUploadMessage('Upload successful!');
      console.log('File uploaded successfully:', data.Location);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Error during upload. Please try again.');
    }
  };

  // Handle photo upload click
  const handlePhotoUpload = (index: number) => {
    const input = document.getElementById(`photo-upload-${index}`) as HTMLInputElement; // Get the input element for the index
    if (input) {
      input.click(); // Click to open file selection dialog
    }
  };

  // Remove photo handler
  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    const updatedPreviewUrls = [...previewUrls];

    updatedPhotos.splice(index, 1); // Remove photo at the index
    updatedPreviewUrls.splice(index, 1); // Remove preview URL at the index

    setPhotos(updatedPhotos);
    setPreviewUrls(updatedPreviewUrls);
  };

  // Handle continue button click
  const handleContinue = async () => {
    try {
        // Refresh the authentication token
        await apiClient.post('/api/auth/refresh');
        const bucketName = process.env.AWS_BUCKET_NAME as string;

        // Check if there are photos to upload
        if (photos.length > 0) {
            // Upload each photo
            for (let i = 0; i < photos.length; i++) {
              const file = photos[i];
              if (file) {
                  // Convert the original image to WebP
                  const originalBlob = await fetch(URL.createObjectURL(file)).then(res => res.blob());
                  const webpFile = new File([originalBlob], `${uuidv4()}.webp`, { type: 'image/webp' });

                  const webpFileName = `${uuidv4()}_${webpFile.name}`; // Add UUID to file name
                  const params = {
                      Bucket: bucketName,
                      Key: webpFileName,
                      Body: webpFile,
                      ContentType: webpFile.type,
                  };

                    const data = await s3.upload(params).promise(); // Upload file to S3

                    // Save upload record to database
                    await apiClient.post('/api/auth/uploads', {
                        user_id: userId,
                        is_google_user: isGoogleUser,
                        photo_url: data.Location,
                        description,
                        category,
                        brand,
                        condition,
                        location,
                        city,
                        price: price ? parseFloat(price) : 0,
                    });
                }
            }
        }

        // If there is a cropped image, upload it as WebP
        if (image) {
            const blob = await fetch(image).then(res => res.blob());
            const webpFile = new File([blob], `${uuidv4()}.webp`, { type: 'image/webp' });

            const webpFileName = `${uuidv4()}_${webpFile.name}`; // Add UUID to file name
            const params = {
                Bucket: bucketName,
                Key: webpFileName,
                Body: webpFile,
                ContentType: webpFile.type,
            };

            const data = await s3.upload(params).promise(); // Upload WebP file to S3

            // Save upload record to database for the WebP image
            await apiClient.post('/api/auth/uploads', {
                user_id: userId,
                is_google_user: isGoogleUser,
                photo_url: data.Location,
                description,
                category,
                brand,
                condition,
                location,
                city,
                price: price ? parseFloat(price) : 0,
            });
        }

        setUploadMessage('Upload successful!');

        // Reset fields
        setPhotos(Array(8).fill(null));
        setPreviewUrls(Array(8).fill(''));
        setDescription('');
        setCategory('');
        setBrand('');
        setCondition('');
        setLocation('');
        setCity('');
        setPrice('');

        // Clear the draft from localStorage
        localStorage.removeItem('draft');

        // Redirect to SellNow page
        router.push('/sell-now'); // Replace with the correct route if different

    } catch (error) {
        console.error('Error uploading files:', error);
        setUploadMessage('Error during upload. Please try again.'); 
    }
};

  if (!isLogin) {
    return null; 
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Sell Now</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(8)].map((_, index) => (
                <div key={index} className="relative h-64">
                    <div
                        className="border-2 border-dashed border-gray-400 h-64 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition duration-200"
                        onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
                    >
                        <input
                            type="file"
                            id={`photo-upload-${index}`}
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={handleFileChange(index)}
                        />
                        {previewUrls[index] ? (
                            <Image
                                src={previewUrls[index]}
                                alt={`Uploaded ${index + 1}`}
                                className="h-full w-full object-cover rounded-md"
                                fill
                            />
                        ) : (
                            <span className="text-gray-500 font-medium">Add a photo</span>
                        )}
                    </div>
                    {previewUrls[index] && (
                        <button
                            className="absolute top-0 right-0 bg-red-300 text-white p-1 rounded-full"
                            onClick={() => removePhoto(index)}
                        >
                            X
                        </button>
                    )}        {/* Image Preview and Cropper */}
                    {previewUrls[index] && (
                        <button
                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
                            onClick={() => openCropModal(index)} // Open crop modal
                        >
                            C
                        </button>
                    )}
                </div>
            ))}
        </div>
        {errors.photos && <p className="text-red-500 mb-6">{errors.photos}</p>}

          {/* Crop Modal */}
          <CropModal
            isOpen={showCropModal}
            onClose={() => setShowCropModal(false)}
            image={image || ''}
            crop={crop}
            setCrop={setCrop}
            onCropComplete={setCompletedCrop}
            onSave={handleSaveCroppedImage}
        />

        {/* Description Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Description</h2>
        <textarea
            className="border-2 border-gray-300 rounded-lg w-full h-40 p-4 mb-6 resize-none focus:outline-none focus:border-blue-500"
            placeholder="Enter description"
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 mb-6">{errors.description}</p>}

        {/* Info Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Item Info</h2>
        <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-600">Category</label>
            <input
                type="text"
                className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            {errors.category && <p className="text-red-500 mb-2">{errors.category}</p>}
        </div>

        <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-600">Brand</label>
            <input
                type="text"
                className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
            />
            {errors.brand && <p className="text-red-500 mb-2">{errors.brand}</p>}
        </div>

        <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-600">Condition</label>
            <input
                type="text"
                className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
            />
            {errors.condition && <p className="text-red-500 mb-2">{errors.condition}</p>}
        </div>

        {/* Location Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Location</h2>
        <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-600">Country</label>
            <select
                className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            >
                <option value="">Select a country</option>
                <option value="Australia">Australia</option>
                <option value="Korea">Korea</option>
                <option value="China">China</option>
            </select>
        </div>

        <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-600">City</label>
            <select
                className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            >
                {/* Populate cities based on selected country */}
                {location === 'Australia' && (
                    <>
                        <option value="">Select a city</option>
                        <option value="Sydney">Sydney</option>
                        <option value="Melbourne">Melbourne</option>
                        <option value="Brisbane">Brisbane</option>
                    </>
                )}
                {location === 'Korea' && (
                    <>
                        <option value="">Select a city</option>
                        <option value="Seoul">Seoul</option>
                        <option value="Busan">Busan</option>
                        <option value="Incheon">Incheon</option>
                    </>
                )}
                {location === 'China' && (
                    <>
                        <option value="">Select a city</option>
                        <option value="Beijing">Beijing</option>
                        <option value="Shanghai">Shanghai</option>
                        <option value="Guangzhou">Guangzhou</option>
                    </>
                )}
            </select>
        </div>

        {/* Item Price Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Item Price</h2>
        <div className="border-2 border-gray-300 rounded-lg w-full p-2 mb-6 flex items-center">
            <span className="text-xl">$</span>
            <input
                type="number"
                className="border-none w-full p-2 ml-2 focus:outline-none"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
        </div>
        {errors.price && <p className="text-red-500 mb-6">{errors.price}</p>}

        <button
            className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out"
            onClick={handleContinue}
        >
            Continue
        </button>
        <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
            onClick={saveDraft}
        >
            Save Draft
        </button>

        {uploadMessage && <p className="mt-4 text-red-500">{uploadMessage}</p>}
    </div>
);
}

export default SellNow;