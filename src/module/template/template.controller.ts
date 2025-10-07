import { Request, Response } from "express";
import { TemplateService } from "./template.service";

const templateService = new TemplateService();

// Get all templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const query = (req as any).validatedQuery || req.query;
    const { page = 1, limit = 10, search, categoryId, sortBy, sortOrder, minPrice, maxPrice } = query;

    const result = await templateService.getAllTemplates({
      page,
      limit,
      search,
      categoryId,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
    });

    return res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: result.templates,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
};

// Get template by ID
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await templateService.getTemplateById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template fetched successfully",
      data: template,
    });
  } catch (error: any) {
    console.error("Error fetching template:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch template",
      error: error.message,
    });
  }
};

// Create template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const data = (req as any).validatedData;

    // Handle file uploads if present
    const { uploadBufferToCloudinary } = await import("../../middleware/cloudinary-upload");
    
    // Handle main image upload
    if (req.files && (req.files as any).image && (req.files as any).image[0]) {
      try {
        const uploadResult = await uploadBufferToCloudinary((req.files as any).image[0], "techfynite/templates");
        data.imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
          error: uploadError,
        });
      }
    }

    // Handle source files upload
    if (req.files && (req.files as any).sourceFiles && (req.files as any).sourceFiles.length > 0) {
      try {
        const sourceFileUrls = [];
        for (const file of (req.files as any).sourceFiles) {
          const fileExtension = file.originalname.toLowerCase().split('.').pop();
          
          // Check if it's an archive file (ZIP, RAR, etc.)
          if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension)) {
            const { uploadArchiveFile } = await import("../../middleware/cloudinary-upload");
            const uploadResult = await uploadArchiveFile(file, "techfynite/source-files");
            sourceFileUrls.push(uploadResult.url);
          } else {
            // For other files, use Cloudinary
            const uploadResult = await uploadBufferToCloudinary(file, "techfynite/templates/source-files");
            sourceFileUrls.push(uploadResult.url);
          }
        }
        data.sourceFiles = sourceFileUrls;
      } catch (uploadError) {
        console.error("Error uploading source files:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload source files",
          error: uploadError,
        });
      }
    }

    const template = await templateService.createTemplate(data);

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error: any) {
    console.error("Error creating template:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create template",
    });
  }
};

// Update template
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = (req as any).validatedData;

    // Handle file uploads if present
    const { uploadBufferToCloudinary } = await import("../../middleware/cloudinary-upload");
    
    // Handle main image upload
    if (req.files && (req.files as any).image && (req.files as any).image[0]) {
      try {
        const uploadResult = await uploadBufferToCloudinary((req.files as any).image[0], "techfynite/templates");
        data.imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
          error: uploadError,
        });
      }
    }

    // Handle source files upload
    if (req.files && (req.files as any).sourceFiles && (req.files as any).sourceFiles.length > 0) {
      try {
        const sourceFileUrls = [];
        for (const file of (req.files as any).sourceFiles) {
          const fileExtension = file.originalname.toLowerCase().split('.').pop();
          
          // Check if it's an archive file (ZIP, RAR, etc.)
          if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExtension)) {
            const { uploadArchiveFile } = await import("../../middleware/cloudinary-upload");
            const uploadResult = await uploadArchiveFile(file, "techfynite/source-files");
            sourceFileUrls.push(uploadResult.url);
          } else {
            // For other files, use Cloudinary
            const uploadResult = await uploadBufferToCloudinary(file, "techfynite/templates/source-files");
            sourceFileUrls.push(uploadResult.url);
          }
        }
        data.sourceFiles = sourceFileUrls;
      } catch (uploadError) {
        console.error("Error uploading source files:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload source files",
          error: uploadError,
        });
      }
    }

    const template = await templateService.updateTemplate(id, data);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  } catch (error: any) {
    console.error("Error updating template:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update template",
    });
  }
};

// Delete template
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await templateService.deleteTemplate(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("Error deleting template:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};

// Download source file
export const downloadSourceFile = async (req: Request, res: Response) => {
  try {
    const { templateId, fileIndex } = req.params;
    
    // Get template to find the source file URL
    const template = await templateService.getTemplateById(templateId);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    const fileIndexNum = parseInt(fileIndex);
    if (fileIndexNum < 0 || fileIndexNum >= template.sourceFiles.length) {
      return res.status(404).json({
        success: false,
        message: "Source file not found",
      });
    }

    const fileUrl = template.sourceFiles[fileIndexNum];
    
    // Check if it's a Cloudinary raw file (ZIP, etc.)
    if (fileUrl.includes('cloudinary.com') && fileUrl.includes('/raw/upload/')) {
      // For Cloudinary raw files, redirect to download URL with proper headers
      const downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
      return res.redirect(downloadUrl);
    } else {
      // For other files, redirect directly
      return res.redirect(fileUrl);
    }
  } catch (error: any) {
    console.error("Error downloading source file:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to download source file",
    });
  }
};

// Get template statistics
export const getTemplateStats = async (req: Request, res: Response) => {
  try {
    const stats = await templateService.getTemplateStats();

    return res.status(200).json({
      success: true,
      message: "Template statistics fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching template statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch template statistics",
      error: error.message,
    });
  }
};

