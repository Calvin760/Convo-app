import { supabase } from '../lib/supabase'
import * as FileSystem from 'expo-file-system'; // Ensure this import
import { v4 as uuidv4 } from 'uuid'; // To generate unique file names

// Helper function to decode Base64 to Uint8Array
const decodeBase64 = (base64String) => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Function to get the file path for uploads
export const getFilePath = (folderName, isImage = true) => {
    const fileExtension = isImage ? '.png' : '.mp4';
    return `/${folderName}/${uuidv4()}${fileExtension}`;
}

// Function to upload a file (image or video)
export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        // Generate file path
        let fileName = getFilePath(folderName, isImage);

        // Read the file as Base64
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Decode Base64 into Uint8Array
        let imageData = decodeBase64(fileBase64);

        // Upload to Supabase
        const { data, error } = await supabase
            .storage
            .from('upload') // Ensure the 'upload' bucket exists in your Supabase project
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false, // Prevent overwriting existing files
                contentType: isImage ? 'image/png' : 'video/mp4', // Set correct content type
            });

        if (error) {
            console.log('File upload error: ', error.message); // Log detailed error message
            return { success: false, msg: error.message || 'Could not upload file' };
        }

        console.log('File uploaded successfully: ', data);
        return { success: true, data: data.path }; // Return file path in the storage bucket

    } catch (error) {
        console.log('File upload error: ', error);
        return { success: false, msg: 'An error occurred during file upload.' };
    }
}

// Function to get the default user image or return a default placeholder image
export const getUserImageSrc = (imagePath) => {
    if (imagePath) {
        return { uri: imagePath };
    } else {
        return require('../assets/images/defaultuser.png');
    }
}
