import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageServices";

export const createOrUpdatePost = async (post) => {
    try {
        // If post has a file (image or video), upload it
        if (post.file && typeof post.file === 'object') {
            let isImage = post?.file?.type === 'image';
            let folderName = isImage ? 'postImages' : 'postVideos';

            // Assuming you have an uploadFile function for file upload to storage
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);

            if (fileResult.success) {
                post.file = fileResult.data; // Set the uploaded file URL or data
            } else {
                return fileResult; // If the upload fails, return the error result
            }
        }

        // Now proceed to create or update the post in the database
        // Check if the post already exists (for updating) or create a new one
        const { data, error } = await supabase
            .from('posts')
            .upsert(post)
            .select()
            .single();

        if (error) {
            console.log('Error creating/updating post:', error);
            return { success: false, msg: "Could not create or update post" };
        }

        return { success: true, data: data }; // Return the success result with post data
    } catch (error) {
        console.log('createOrUpdatePost error', error);
        return { success: false, msg: "An error occurred while creating the post" };
    }
};
