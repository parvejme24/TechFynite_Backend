"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDraftBlogs = exports.getPublishedBlogs = exports.togglePublish = exports.toggleBlogLike = exports.getBlogStats = exports.getBlogsByAuthor = exports.getBlogsByCategory = exports.deleteBlog = exports.updateBlog = exports.addBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const blog_service_1 = require("./blog.service");
const cloudinary_upload_1 = require("../../middleware/cloudinary-upload");
const getAllBlogs = async (req, res) => {
    try {
        const query = req.validatedQuery || req.query;
        const result = await blog_service_1.blogService.getAllBlogs(query);
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: result.blogs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllBlogs = getAllBlogs;
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blog_service_1.blogService.getBlogById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null,
            });
        }
        await blog_service_1.blogService.incrementViewCount(id);
        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
        });
    }
    catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogById = getBlogById;
const addBlog = async (req, res) => {
    try {
        let blogData = { ...req.body };
        if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            if (blogData.description && typeof blogData.description === 'string') {
                try {
                    blogData.description = JSON.parse(blogData.description);
                }
                catch (e) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid description format. Must be valid JSON.",
                        error: "Description field must be a valid JSON string"
                    });
                }
            }
            if (blogData.content && typeof blogData.content === 'string') {
                try {
                    blogData.content = JSON.parse(blogData.content);
                }
                catch (e) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid content format. Must be valid JSON.",
                        error: "Content field must be a valid JSON string"
                    });
                }
            }
            if (blogData.readingTime && typeof blogData.readingTime === 'string') {
                blogData.readingTime = parseFloat(blogData.readingTime);
            }
            if (blogData.isPublished && typeof blogData.isPublished === 'string') {
                blogData.isPublished = blogData.isPublished === 'true';
            }
        }
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            const filesMap = req.files || {};
            const mainImageFile = Array.isArray(filesMap.image) ? filesMap.image[0] : undefined;
            const additionalImageFiles = Array.isArray(filesMap.images) ? filesMap.images : [];
            if (mainImageFile) {
                const uploadedMain = await (0, cloudinary_upload_1.uploadBufferToCloudinary)(mainImageFile, "techfynite/blogs");
                blogData.imageUrl = uploadedMain.url;
            }
            if (additionalImageFiles.length > 0) {
                const uploaded = await (0, cloudinary_upload_1.uploadBuffersToCloudinary)(additionalImageFiles, "techfynite/blogs");
                blogData.screenshots = uploaded.map((u) => u.url);
            }
        }
        const blog = await blog_service_1.blogService.createBlog(blogData);
        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    }
    catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.addBlog = addBlog;
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };
        if (req.headers['content-type']?.includes('multipart/form-data')) {
            const filesMap = req.files || {};
            const mainImageFile = Array.isArray(filesMap.image) ? filesMap.image[0] : undefined;
            const additionalImageFiles = Array.isArray(filesMap.images) ? filesMap.images : [];
            if (mainImageFile) {
                const uploadedMain = await (0, cloudinary_upload_1.uploadBufferToCloudinary)(mainImageFile, "techfynite/blogs");
                updateData.imageUrl = uploadedMain.url;
            }
            if (additionalImageFiles.length > 0) {
                const uploaded = await (0, cloudinary_upload_1.uploadBuffersToCloudinary)(additionalImageFiles, "techfynite/blogs");
                updateData.screenshots = uploaded.map((u) => u.url);
            }
        }
        const blog = await blog_service_1.blogService.updateBlog(id, updateData);
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
    }
    catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update blog",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await blog_service_1.blogService.deleteBlog(id);
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
    }
    catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteBlog = deleteBlog;
const getBlogsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const query = req.validatedQuery || req.query;
        const result = await blog_service_1.blogService.getBlogsByCategory(categoryId, query);
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: result.blogs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching blogs by category:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs by category",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogsByCategory = getBlogsByCategory;
const getBlogsByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const query = req.validatedQuery || req.query;
        const result = await blog_service_1.blogService.getBlogsByAuthor(authorId, query);
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: result.blogs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching blogs by author:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs by author",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogsByAuthor = getBlogsByAuthor;
const getBlogStats = async (req, res) => {
    try {
        const stats = await blog_service_1.blogService.getBlogStats();
        return res.status(200).json({
            success: true,
            message: "Blog statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        console.error("Error fetching blog statistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog statistics",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogStats = getBlogStats;
const toggleBlogLike = async (req, res) => {
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
        const result = await blog_service_1.blogService.toggleLike(id, userId);
        return res.status(200).json({
            success: true,
            message: result.liked ? "Blog liked successfully" : "Blog unliked successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error toggling blog like:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle blog like",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.toggleBlogLike = toggleBlogLike;
const togglePublish = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blog_service_1.blogService.togglePublish(id);
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
    }
    catch (error) {
        console.error("Error toggling blog publish status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle blog publish status",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.togglePublish = togglePublish;
const getPublishedBlogs = async (req, res) => {
    try {
        const query = { ...req.query, isPublished: true };
        const result = await blog_service_1.blogService.getAllBlogs(query);
        return res.status(200).json({
            success: true,
            message: "Published blogs fetched successfully",
            data: result.blogs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching published blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch published blogs",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getPublishedBlogs = getPublishedBlogs;
const getDraftBlogs = async (req, res) => {
    try {
        const query = { ...req.query, isPublished: false };
        const result = await blog_service_1.blogService.getAllBlogs(query);
        return res.status(200).json({
            success: true,
            message: "Draft blogs fetched successfully",
            data: result.blogs,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching draft blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch draft blogs",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getDraftBlogs = getDraftBlogs;
//# sourceMappingURL=blog.controller.js.map