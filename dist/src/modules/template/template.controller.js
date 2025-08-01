"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncWithLemonSqueezy = exports.getTemplatesByCategory = exports.getTemplateBySlug = exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getAllTemplates = void 0;
const template_service_1 = require("./template.service");
function parseArrayField(field) {
    if (Array.isArray(field))
        return field;
    if (typeof field === 'string') {
        try {
            const parsed = JSON.parse(field);
            if (Array.isArray(parsed))
                return parsed;
            return [field];
        }
        catch {
            return [field];
        }
    }
    if (field == null)
        return [];
    return [String(field)];
}
function getUploadedScreenshots(files) {
    if (!files || !files.screenshots)
        return [];
    return files.screenshots.map((file) => `/uploads/templateScreenshots/${file.filename}`);
}
function getUploadedImage(files, fieldName) {
    if (!files || !files[fieldName])
        return undefined;
    return `/uploads/templateImage/${files[fieldName][0].filename}`;
}
function getUploadedFiles(files, fieldName) {
    if (!files || !files[fieldName])
        return [];
    return files[fieldName].map((file) => `/uploads/${file.filename}`);
}
const getAllTemplates = async (req, res) => {
    try {
        const templates = await template_service_1.TemplateService.getAll();
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};
exports.getAllTemplates = getAllTemplates;
const getTemplateById = async (req, res) => {
    try {
        const template = await template_service_1.TemplateService.getById(req.params.id);
        if (!template)
            return res.status(404).json({ error: 'Template not found' });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template' });
    }
};
exports.getTemplateById = getTemplateById;
const createTemplate = async (req, res) => {
    try {
        const imageUrl = getUploadedImage(req.files, 'image');
        const sourceFiles = getUploadedFiles(req.files, 'templateFile');
        const screenshots = getUploadedScreenshots(req.files);
        const { title, price, categoryId, version, publishedDate, downloads, pages, views, totalPurchase, previewLink, shortDescription, description, whatsIncluded, keyFeatures } = req.body;
        const template = await template_service_1.TemplateService.create({
            title,
            price: Number(price),
            imageUrl,
            sourceFiles,
            categoryId,
            version: Number(version),
            publishedDate,
            downloads: downloads ? Number(downloads) : undefined,
            pages: pages ? Number(pages) : undefined,
            views: views ? Number(views) : undefined,
            totalPurchase: totalPurchase ? Number(totalPurchase) : undefined,
            previewLink,
            shortDescription: Array.isArray(shortDescription) ? shortDescription[0] : shortDescription,
            description: parseArrayField(description),
            whatsIncluded: parseArrayField(whatsIncluded),
            keyFeatures: parseArrayField(keyFeatures),
            screenshots,
        });
        res.status(201).json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create template', details: error instanceof Error ? error.message : error });
    }
};
exports.createTemplate = createTemplate;
const updateTemplate = async (req, res) => {
    try {
        const imageUrl = getUploadedImage(req.files, 'image') || req.body.imageUrl;
        const sourceFiles = getUploadedFiles(req.files, 'templateFile') || req.body.sourceFiles;
        let screenshots = getUploadedScreenshots(req.files);
        // If no new screenshots uploaded, use the ones from the body (if any)
        if (!screenshots.length && req.body.screenshots) {
            screenshots = parseArrayField(req.body.screenshots);
        }
        const { title, price, categoryId, version, publishedDate, downloads, pages, views, totalPurchase, previewLink, shortDescription, description, whatsIncluded, keyFeatures } = req.body;
        const template = await template_service_1.TemplateService.update(req.params.id, {
            ...(title !== undefined && { title }),
            ...(price !== undefined && { price: Number(price) }),
            ...(imageUrl !== undefined && { imageUrl }),
            ...(sourceFiles !== undefined && { sourceFiles }),
            ...(categoryId !== undefined && { categoryId }),
            ...(version !== undefined && { version: Number(version) }),
            ...(publishedDate !== undefined && { publishedDate }),
            ...(downloads !== undefined && { downloads: Number(downloads) }),
            ...(pages !== undefined && { pages: Number(pages) }),
            ...(views !== undefined && { views: Number(views) }),
            ...(totalPurchase !== undefined && { totalPurchase: Number(totalPurchase) }),
            ...(previewLink !== undefined && { previewLink }),
            ...(shortDescription !== undefined && { shortDescription: Array.isArray(shortDescription) ? shortDescription[0] : shortDescription }),
            ...(description !== undefined && { description: parseArrayField(description) }),
            ...(whatsIncluded !== undefined && { whatsIncluded: parseArrayField(whatsIncluded) }),
            ...(keyFeatures !== undefined && { keyFeatures: parseArrayField(keyFeatures) }),
            ...(screenshots !== undefined && { screenshots }),
        });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update template', details: error instanceof Error ? error.message : error });
    }
};
exports.updateTemplate = updateTemplate;
const deleteTemplate = async (req, res) => {
    try {
        await template_service_1.TemplateService.delete(req.params.id);
        res.status(200).json({ message: 'Template deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
};
exports.deleteTemplate = deleteTemplate;
const getTemplateBySlug = async (req, res) => {
    try {
        const template = await template_service_1.TemplateService.getBySlug(req.params.slug);
        if (!template)
            return res.status(404).json({ error: 'Template not found' });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template' });
    }
};
exports.getTemplateBySlug = getTemplateBySlug;
const getTemplatesByCategory = async (req, res) => {
    try {
        const templates = await template_service_1.TemplateService.getByCategory(req.params.id);
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates by category' });
    }
};
exports.getTemplatesByCategory = getTemplatesByCategory;
const syncWithLemonSqueezy = async (req, res) => {
    try {
        const { lemonsqueezyProductId, lemonsqueezyVariantId, lemonsqueezyPermalink } = req.body;
        if (!lemonsqueezyProductId || !lemonsqueezyVariantId || !lemonsqueezyPermalink) {
            return res.status(400).json({
                error: 'Missing required LemonSqueezy fields: lemonsqueezyProductId, lemonsqueezyVariantId, lemonsqueezyPermalink'
            });
        }
        const template = await template_service_1.TemplateService.update(req.params.id, {
            lemonsqueezyProductId,
            lemonsqueezyVariantId,
            lemonsqueezyPermalink,
        });
        res.json({
            message: 'Template synced with LemonSqueezy successfully',
            template
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to sync template with LemonSqueezy' });
    }
};
exports.syncWithLemonSqueezy = syncWithLemonSqueezy;
