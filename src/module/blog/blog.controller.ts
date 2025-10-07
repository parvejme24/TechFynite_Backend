import { Request, Response } from "express";
import { blogService } from "./blog.service";
import { uploadBufferToCloudinary, uploadBuffersToCloudinary } from "../../middleware/cloudinary-upload";
import { IBlogQuery } from "./blog.interface";

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const query: IBlogQuery = (req as any).validatedQuery || req.query;
    const result = await blogService.getAllBlogs(query);
    
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const blog = await blogService.getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        data: null,
      });
    }
    
    // Increment view count
    await blogService.incrementViewCount(id);
    
    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new blog
export const addBlog = async (req: Request, res: Response) => {
  try {
    // Handle both JSON and form-data
    let blogData = { ...req.body };
    
    // Parse JSON fields from form data
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      
      // Parse description if it's a string
      if (blogData.description && typeof blogData.description === 'string') {
        try {
          blogData.description = JSON.parse(blogData.description);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid description format. Must be valid JSON.",
            error: "Description field must be a valid JSON string"
          });
        }
      }
      
      // Parse content if it's a string
      if (blogData.content && typeof blogData.content === 'string') {
        try {
          blogData.content = JSON.parse(blogData.content);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid content format. Must be valid JSON.",
            error: "Content field must be a valid JSON string"
          });
        }
      }
      
      // Convert readingTime to number
      if (blogData.readingTime && typeof blogData.readingTime === 'string') {
        blogData.readingTime = parseFloat(blogData.readingTime);
      }
      
      // Convert isPublished to boolean
      if (blogData.isPublished && typeof blogData.isPublished === 'string') {
        blogData.isPublished = blogData.isPublished === 'true';
      }
    }
    
    // Handle multipart/form-data uploads (main image + additional images)
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // Fields upload: image (single), images (array)
      const filesMap = (req as any).files || {};
      const mainImageFile = Array.isArray(filesMap.image) ? filesMap.image[0] : undefined;
      const additionalImageFiles = Array.isArray(filesMap.images) ? filesMap.images : [];

      // Upload main image if provided
      if (mainImageFile) {
        const uploadedMain = await uploadBufferToCloudinary(mainImageFile, "techfynite/blogs");
        blogData.imageUrl = uploadedMain.url;
      }

      // Upload additional images if provided
      if (additionalImageFiles.length > 0) {
        const uploaded = await uploadBuffersToCloudinary(additionalImageFiles, "techfynite/blogs");
        blogData.screenshots = uploaded.map((u: { url: string; publicId: string }) => u.url);
      }
    }
    
    const blog = await blogService.createBlog(blogData);
    
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Handle both JSON and form-data
    let updateData = { ...req.body };
    
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const filesMap = (req as any).files || {};
      const mainImageFile = Array.isArray(filesMap.image) ? filesMap.image[0] : undefined;
      const additionalImageFiles = Array.isArray(filesMap.images) ? filesMap.images : [];

      if (mainImageFile) {
        const uploadedMain = await uploadBufferToCloudinary(mainImageFile, "techfynite/blogs");
        updateData.imageUrl = uploadedMain.url;
      }
      if (additionalImageFiles.length > 0) {
        const uploaded = await uploadBuffersToCloudinary(additionalImageFiles, "techfynite/blogs");
        updateData.screenshots = uploaded.map((u: { url: string; publicId: string }) => u.url);
      }
    }
    
    const blog = await blogService.updateBlog(id, updateData);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await blogService.deleteBlog(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        data: null,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const query: IBlogQuery = (req as any).validatedQuery || req.query;
    
    const result = await blogService.getBlogsByCategory(categoryId, query);
    
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs by category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blogs by author
export const getBlogsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const query: IBlogQuery = (req as any).validatedQuery || req.query;
    
    const result = await blogService.getBlogsByAuthor(authorId, query);
    
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching blogs by author:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs by author",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blog statistics
export const getBlogStats = async (req: Request, res: Response) => {
  try {
    const stats = await blogService.getBlogStats();
    
    return res.status(200).json({
      success: true,
      message: "Blog statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching blog statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Toggle blog like
export const toggleBlogLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }
    
    const result = await blogService.toggleLike(id, userId);
    
    return res.status(200).json({
      success: true,
      message: result.liked ? "Blog liked successfully" : "Blog unliked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error toggling blog like:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle blog like",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



// Toggle publish/unpublish
export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await blogService.togglePublish(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: blog.isPublished ? "Blog published successfully" : "Blog moved to draft successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error toggling blog publish status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle blog publish status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get published blogs
export const getPublishedBlogs = async (req: Request, res: Response) => {
  try {
    const query: IBlogQuery = { ...req.query, isPublished: true };
    const result = await blogService.getAllBlogs(query);
    
    return res.status(200).json({
      success: true,
      message: "Published blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published blogs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get draft blogs
export const getDraftBlogs = async (req: Request, res: Response) => {
  try {
    const query: IBlogQuery = { ...req.query, isPublished: false };
    const result = await blogService.getAllBlogs(query);
    
    return res.status(200).json({
      success: true,
      message: "Draft blogs fetched successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching draft blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch draft blogs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
