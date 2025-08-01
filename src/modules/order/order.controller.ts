import { Request, Response } from 'express';
import { OrderService } from './order.service';

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    const orders = await OrderService.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    const order = await OrderService.getOrderById(req.params.id, userId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const getTemplateDownload = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    const { templateId } = req.params;
    const downloadData = await OrderService.getTemplateDownload(templateId, userId);
    
    if (!downloadData) {
      return res.status(404).json({ error: 'Template not found or not purchased' });
    }

    res.json(downloadData);
  } catch (error) {
    console.error('Get template download error:', error);
    res.status(500).json({ error: 'Failed to get template download' });
  }
}; 