import { Request, Response } from 'express';
import { OrderService } from './order.service';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.update(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await OrderService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllByUserId(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by user' });
  }
}; 