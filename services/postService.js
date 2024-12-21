import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageServices";

export const getPosts = async () => {
      try {
        // setLoading(true); // Show loading spinner
        const { data, error } = await supabase
          .from('posts')
          .select('*, users(name, image, id , email, phoneNumber, bio)')  // Fetching the user name and image as well
          .order('created_at', { ascending: false })
          .limit(10);  // Limit posts to 10

        if (error) throw error;
        // setPosts(data || []);
      } catch (error) {
        // console.error('Error fetching posts:', error);
      } finally {
        // setLoading(false); // Hide loading spinner after fetching data
      }
    };
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

export const createPostLike = async (postLike) => {
    try {
        const { data, error } = await supabase
            .from('postsLikes')
            .upsert(postLike)
            .select()
            .single();

        if (error) {
            console.log('Error liking post:', error);
            return { success: false, msg: "Could not like post" };
        }

        return { success: true, data: data }; // Return the success result with post data
        }catch (error) {
        console.log('createPostLike error', error);
        return { success: false, msg: "An error occurred while liking the post" };
    }
};

export const removePostLike = async (postLike) => {
    try {
        const { data, error } = await supabase
            .from('postsLikes')
            .delete()
            .eq('userId', userId)
            .eq('postId', postId)

        if (error) {
            console.log('Error liking post:', error);
            return { success: false, msg: "Could not remove like post" };
        }

        return { success: true, data: data }; // Return the success result with post data
    } catch (error) {
        console.log('removePostLike error', error);
        return { success: false, msg: "An error occurred while removing like the post" };
    }
};