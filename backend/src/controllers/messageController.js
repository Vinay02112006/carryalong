import Message from '../models/Message.js';
import Parcel from '../models/Parcel.js';

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, parcelId, message } = req.body;

    // Verify parcel exists and user is involved
    const parcel = await Parcel.findById(parcelId);
    
    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Check if user is sender or traveler of this parcel
    const isSender = parcel.sender.toString() === req.user._id.toString();
    const isTraveler = parcel.traveler && parcel.traveler.toString() === req.user._id.toString();

    if (!isSender && !isTraveler) {
      res.status(403);
      throw new Error('Not authorized to message about this parcel');
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      parcel: parcelId,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name')
      .populate('receiver', 'name');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get messages for a parcel
 * @route   GET /api/messages/parcel/:parcelId
 * @access  Private
 */
export const getMessagesByParcel = async (req, res, next) => {
  try {
    const parcelId = req.params.parcelId;

    // Verify user is involved in this parcel
    const parcel = await Parcel.findById(parcelId);
    
    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    const isSender = parcel.sender.toString() === req.user._id.toString();
    const isTraveler = parcel.traveler && parcel.traveler.toString() === req.user._id.toString();

    if (!isSender && !isTraveler) {
      res.status(403);
      throw new Error('Not authorized to view these messages');
    }

    const messages = await Message.find({ parcel: parcelId })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
export const getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('parcel', 'pickupCity dropCity status')
      .sort({ createdAt: -1 });

    // Group by parcel
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const parcelId = msg.parcel._id.toString();
      if (!conversationsMap.has(parcelId)) {
        conversationsMap.set(parcelId, {
          parcel: msg.parcel,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      
      // Count unread messages
      if (msg.receiver._id.toString() === req.user._id.toString() && !msg.isRead) {
        conversationsMap.get(parcelId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    // Only receiver can mark as read
    if (message.receiver.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    next(error);
  }
};
