'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../utils/apiClient';
import { useAppSelector } from '../store/store';
import s3 from '../lib/s3Client';
import { v4 as uuidv4 } from 'uuid';


const SellNow: React.FC = () => {
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [user_id, setUserId] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const router = useRouter();

  // Timeout ID for user inactivity
  const [inactivityTimeoutId, setInactivityTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if the user is logged in
        const checkResponse = await apiClient.get('/api/auth/check');
        
        if (checkResponse.status === 200 && checkResponse.data.isLogin) {
          // If logged in, fetch user details
          const userResponse = await apiClient.get('/api/auth/user');
          if (userResponse.status === 200 && userResponse.data.user) {
            const { google_id, uuid } = userResponse.data.user;
            setUserId(google_id || uuid);
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

  // Handle image upload on S3
  const handleFileChange = (index: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`File change event for index ${index}`, event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      const updatedPhotos = [...photos];
      const updatedPreviewUrls = [...previewUrls];

      updatedPhotos[index] = file; // 선택한 파일을 해당 인덱스에 저장
      updatedPreviewUrls[index] = URL.createObjectURL(file); // 미리보기 URL 생성

      setPhotos(updatedPhotos);
      setPreviewUrls(updatedPreviewUrls);
        }
    };

      // 사진 업로드 클릭 핸들러
  const handlePhotoUpload = (index: number) => {
    const input = document.getElementById(`photo-upload-${index}`) as HTMLInputElement; // 해당 인덱스의 input 요소 가져오기
    if (input) {
      input.click(); // 클릭하여 파일 선택 다이얼로그 열기
    }
  };

    // 사진 삭제 핸들러
    const removePhoto = (index: number) => {
      const updatedPhotos = [...photos];
      const updatedPreviewUrls = [...previewUrls];
  
      updatedPhotos.splice(index, 1); // 해당 인덱스의 사진 삭제
      updatedPreviewUrls.splice(index, 1); // 해당 인덱스의 미리보기 URL 삭제
  
      setPhotos(updatedPhotos);
      setPreviewUrls(updatedPreviewUrls);
    };

      // 업로드 핸들러
  const handleContinue = async () => {
    if (photos.length === 0) {
      setUploadMessage('Please upload at least one photo.'); // 사진이 없을 경우 경고 메시지 표시
      return;
    }

    try {
      await apiClient.post('/api/auth/refresh');
      const bucketName = process.env.AWS_BUCKET_NAME as string;

      // 각 사진을 반복하면서 업로드 진행
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileName = `${uuidv4()}_${file.name}`; // 파일 이름에 UUID 추가
        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: file,
          ContentType: file.type,
        };

        const data = await s3.upload(params).promise(); // S3에 파일 업로드

        // 데이터베이스에 업로드 기록 저장
        await apiClient.post('/api/auth/uploads', {
          user_id,
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

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Photos</h2>
      <p className="mb-4 text-gray-600">Add up to 8 photos in JPEG or PNG format.</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="relative">
            <div
              className="border-2 border-dashed border-gray-400 h-32 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 transition duration-200"
              onClick={() => handlePhotoUpload(index)}
            >
              <input
                type="file"
                id={`photo-upload-${index}`}
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange(index)}
              />
              {previewUrls[index] ? (
                <img
                  src={previewUrls[index]}
                  alt={`Uploaded ${index + 1}`}
                  className="h-full w-full object-cover rounded-md"
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
            )}
          </div>
        ))}
      </div>

      {/* Description Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Description</h2>
      <textarea
        className="border-2 border-gray-300 rounded-lg w-full h-40 p-4 mb-6 resize-none focus:outline-none focus:border-blue-500"
        placeholder="Enter description"
        maxLength={1000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Info Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Info</h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-600">Category</label>
        <input
          type="text"
          className="border-2 border-gray-300 rounded-lg w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
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
};

export default SellNow;