"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePublishStatus = exports.searchBlogs = exports.getPopularBlogs = exports.getBlogsByAuthor = exports.getBlogsByCategory = exports.unlikeBlog = exports.likeBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogBySlug = exports.getBlogById = exports.getAllBlogs = void 0;
const blog_model_1 = require("./blog.model");
function ensureArray(val) {
    if (Array.isArray(val))
        return val;
    if (typeof val === 'string') {
        try {
            // Try to parse as JSON array
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed))
                return parsed;
            // If not an array, treat as single paragraph
            return [val];
        }
        catch {
            // If not JSON, treat as single paragraph
            return [val];
        }
    }
    if (val == null)
        return [];
    return [String(val)];
}
const getAllBlogs = async (req, res) => {
    try {
        const includeDrafts = req.query.includeDrafts === 'true';
        const blogs = await blog_model_1.BlogModel.getAll(includeDrafts);
        res.json(blogs);
    }
    catch (error) {
        console.error('Fetch blogs error:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};
exports.getAllBlogs = getAllBlogs;
const getBlogById = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const includeDrafts = req.query.includeDrafts === 'true';
        const blog = await blog_model_1.BlogModel.getByIdWithLikeStatus(req.params.id, userId, includeDrafts);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        // Increment view count for published blogs
        if (blog.isPublished) {
            await blog_model_1.BlogModel.incrementViewCount(req.params.id);
        }
        res.json(blog);
    }
    catch (error) {
        console.error('Fetch blog by id error:', error);
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};
exports.getBlogById = getBlogById;
const getBlogBySlug = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const includeDrafts = req.query.includeDrafts === 'true';
        const blog = await blog_model_1.BlogModel.getBySlug(req.params.slug);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        // Check if user can view draft
        if (!blog.isPublished && !includeDrafts) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        // Add like status for authenticated users
        if (userId) {
            const hasLiked = await blog_model_1.BlogModel.hasUserLiked(blog.id, userId);
            blog.hasLiked = hasLiked;
        }
        // Increment view count for published blogs
        if (blog.isPublished) {
            await blog_model_1.BlogModel.incrementViewCount(blog.id);
        }
        res.json(blog);
    }
    catch (error) {
        console.error('Fetch blog by slug error:', error);
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};
exports.getBlogBySlug = getBlogBySlug;
const createBlog = async (req, res) => {
    try {
        const authorId = req.user?.userId;
        if (!authorId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        let imageUrl = req.body.imageUrl;
        if (req.files && req.files.image && req.files.image[0]) {
            imageUrl = `/uploads/blogThumbnail/${req.files.image[0].filename}`;
        }
        const { title, categoryId, description, readingTime, content, slug, isPublished } = req.body;
        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!categoryId) {
            return res.status(400).json({ error: 'Category ID is required' });
        }
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!readingTime) {
            return res.status(400).json({ error: 'Reading time is required' });
        }
        // Handle description as multiple paragraphs
        const parsedDescription = ensureArray(description);
        let parsedContent = [];
        let contentImages = req.files?.contentImages || [];
        if (content) {
            let rawContent;
            try {
                rawContent = Array.isArray(content) ? content : JSON.parse(content);
            }
            catch (e) {
                return res.status(400).json({ error: 'Invalid content format. Must be a JSON array.' });
            }
            parsedContent = rawContent.map((item, idx) => ({
                ...item,
                imageUrl: contentImages[idx] ? `/uploads/blogContentImage/${contentImages[idx].filename}` : item.imageUrl,
                description: ensureArray(item.description), // Handle content description as multiple paragraphs
                order: item.order || idx
            }));
        }
        const blog = await blog_model_1.BlogModel.create({
            title,
            categoryId,
            imageUrl,
            description: parsedDescription,
            readingTime: Number(readingTime),
            content: parsedContent, // This can be empty array if no content provided
            authorId,
            slug,
            isPublished: isPublished !== undefined ? Boolean(isPublished) : true
        });
        res.status(201).json(blog);
    }
    catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            error: 'Failed to create blog',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const authorId = req.user?.userId;
        if (!authorId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        let imageUrl = req.body.imageUrl;
        if (req.files && req.files.image && req.files.image[0]) {
            imageUrl = `/uploads/blogThumbnail/${req.files.image[0].filename}`;
        }
        const { title, categoryId, description, readingTime, content, slug, isPublished } = req.body;
        // Handle description as multiple paragraphs
        const parsedDescription = description !== undefined ? ensureArray(description) : undefined;
        let parsedContent = undefined;
        let contentImages = req.files?.contentImages || [];
        if (content !== undefined) {
            let rawContent;
            try {
                rawContent = Array.isArray(content) ? content : JSON.parse(content);
            }
            catch (e) {
                return res.status(400).json({ error: 'Invalid content format. Must be a JSON array.' });
            }
            parsedContent = rawContent.map((item, idx) => ({
                ...item,
                imageUrl: contentImages[idx] ? `/uploads/blogContentImage/${contentImages[idx].filename}` : item.imageUrl,
                description: ensureArray(item.description), // Handle content description as multiple paragraphs
                order: item.order || idx
            }));
        }
        const updateData = {
            ...(title !== undefined && { title }),
            ...(categoryId !== undefined && { categoryId }),
            ...(imageUrl !== undefined && { imageUrl }),
            ...(parsedDescription !== undefined && { description: parsedDescription }),
            ...(readingTime !== undefined && { readingTime: Number(readingTime) }),
            ...(parsedContent !== undefined && { content: parsedContent }),
            ...(slug !== undefined && { slug }),
            ...(isPublished !== undefined && { isPublished: Boolean(isPublished) })
        };
        const blog = await blog_model_1.BlogModel.update(req.params.id, updateData);
        res.json(blog);
    }
    catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            error: 'Failed to update blog',
            details: error instanceof Error ? error.message : error
        });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const authorId = req.user?.userId;
        if (!authorId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        await blog_model_1.BlogModel.delete(req.params.id);
        res.status(200).json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};
exports.deleteBlog = deleteBlog;
const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const blog = await blog_model_1.BlogModel.likeBlog(blogId, userId);
        res.json({
            message: 'Blog liked successfully',
            blog,
            hasLiked: true
        });
    }
    catch (error) {
        console.error('Like blog error:', error);
        res.status(500).json({ error: 'Failed to like blog' });
    }
};
exports.likeBlog = likeBlog;
const unlikeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const blog = await blog_model_1.BlogModel.unlikeBlog(blogId, userId);
        res.json({
            message: 'Blog unliked successfully',
            blog,
            hasLiked: false
        });
    }
    catch (error) {
        console.error('Unlike blog error:', error);
        res.status(500).json({ error: 'Failed to unlike blog' });
    }
};
exports.unlikeBlog = unlikeBlog;
// Get blogs by category
const getBlogsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const includeDrafts = req.query.includeDrafts === 'true';
        const blogs = await blog_model_1.BlogModel.getAll(includeDrafts);
        const filteredBlogs = blogs.filter(blog => blog.categoryId === categoryId);
        res.json(filteredBlogs);
    }
    catch (error) {
        console.error('Fetch blogs by category error:', error);
        res.status(500).json({ error: 'Failed to fetch blogs by category' });
    }
};
exports.getBlogsByCategory = getBlogsByCategory;
// Get blogs by author
const getBlogsByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const includeDrafts = req.query.includeDrafts === 'true';
        const blogs = await blog_model_1.BlogModel.getAll(includeDrafts);
        const filteredBlogs = blogs.filter(blog => blog.authorId === authorId);
        res.json(filteredBlogs);
    }
    catch (error) {
        console.error('Fetch blogs by author error:', error);
        res.status(500).json({ error: 'Failed to fetch blogs by author' });
    }
};
exports.getBlogsByAuthor = getBlogsByAuthor;
// Get popular blogs
const getPopularBlogs = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const blogs = await blog_model_1.BlogModel.getPopularBlogs(limit);
        res.json(blogs);
    }
    catch (error) {
        console.error('Fetch popular blogs error:', error);
        res.status(500).json({ error: 'Failed to fetch popular blogs' });
    }
};
exports.getPopularBlogs = getPopularBlogs;
// Search blogs
const searchBlogs = async (req, res) => {
    try {
        const { q } = req.query;
        const includeDrafts = req.query.includeDrafts === 'true';
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const blogs = await blog_model_1.BlogModel.searchBlogs(q, includeDrafts);
        res.json(blogs);
    }
    catch (error) {
        console.error('Search blogs error:', error);
        res.status(500).json({ error: 'Failed to search blogs' });
    }
};
exports.searchBlogs = searchBlogs;
// Toggle blog publish status
const togglePublishStatus = async (req, res) => {
    try {
        const authorId = req.user?.userId;
        if (!authorId) {
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }
        const blog = await blog_model_1.BlogModel.getById(req.params.id, true);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        const newStatus = !blog.isPublished;
        const updatedBlog = await blog_model_1.BlogModel.update(req.params.id, { isPublished: newStatus });
        res.json({
            message: `Blog ${newStatus ? 'published' : 'unpublished'} successfully`,
            blog: updatedBlog
        });
    }
    catch (error) {
        console.error('Toggle publish status error:', error);
        res.status(500).json({ error: 'Failed to toggle publish status' });
    }
};
exports.togglePublishStatus = togglePublishStatus;
