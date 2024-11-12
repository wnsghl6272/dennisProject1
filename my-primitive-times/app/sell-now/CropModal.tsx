import React, { useEffect } from 'react';
import Cropper from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


interface CropModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: string;
    crop: any;
    setCrop: (crop: any) => void;
    onCropComplete: (crop: any) => void;
    onSave: (croppedImage: string) => void;
}

const CropModal: React.FC<CropModalProps> = ({ isOpen, onClose, image, crop, setCrop, onCropComplete, onSave }) => {
    const handleSave = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        const img = new Image();
        img.src = image;

        img.onload = () => {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;

            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedImage = URL.createObjectURL(blob);
                    onSave(croppedImage);
                }
            }, 'image/webp');
        };
    };

    useEffect(() => {
        if (isOpen) {
            setCrop({ unit: '%', width: 30, height: 30, x: 0, y: 0 });
        }
    }, [isOpen, setCrop]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-lg max-h-full overflow-hidden">
                <h2 className="text-lg font-bold mb-4">Crop Image</h2>
                <Cropper
                    crop={crop}
                    onChange={setCrop}
                    onComplete={onCropComplete}
                    aspect={1}
                    style={{
                        maxHeight: '400px',
                    }}
                >
                    <img src={image} alt="To be cropped" className="w-full h-auto" />
                </Cropper>
                <div className="flex justify-between mt-4">
                    <button className="bg-gray-300 p-2 rounded" onClick={onClose}>Cancel</button>
                    <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
