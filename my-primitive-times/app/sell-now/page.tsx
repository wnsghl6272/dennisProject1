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

  // Handle image upload on S3
  const handleFileChange = (index: number) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`File change event for index ${index}`, event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log(`File selected for upload at index ${index}:`, file);
      const fileName = `${uuidv4()}_${file.name}`;
      const bucketName = process.env.AWS_BUCKET_NAME as string;
      const params = {
        Bucket:bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      };

      console.log(params);

      try {
        const data = await s3.upload(params).promise();
        console.log('S3 upload response:', data);
  
        // Save the upload record to the database
        const uploadResponse = await apiClient.post('/api/auth/uploads', {
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
  
          console.log('Upload record saved:', uploadResponse.data);
  
          // Update the photos array
          setPhotos((prevPhotos) => {
            const updatedPhotos = [...prevPhotos];
            updatedPhotos[index] = file;
            return updatedPhotos;
          });
      } catch (error) {
        console.error('Error uploading file to S3:', error);
      }
    }
  };
      

  const handlePhotoUpload = (index: number) => {
    const input = document.getElementById(`photo-upload-${index}`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  if (!isLogin) {
    return null; // Optionally render a loading state here
  }

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Sell Now</h1>

      {/* Photos Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Photos</h2>
      <p className="mb-4 text-gray-600">Add up to 8 photos in JPEG or PNG format.</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
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
            {photos[index] ? (
              <img
                src={URL.createObjectURL(photos[index])}
                alt={`Uploaded ${index + 1}`}
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-500 font-medium">Add a photo</span>
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

      <button className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-200 ease-in-out">
        Continue
      </button>
    </div>
  );
};

export default SellNow;
