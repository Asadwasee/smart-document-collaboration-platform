import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

// Add Comment or Reply + @mention logic
export const createComment = async (req, res) => {
  try {
    const { documentId, text, parentCommentId } = req.body;
    const authorId = req.user._id; // Authenticated user ID from auth middleware

    // 1. Extract @mentions (e.g. "@Asad" ko match karna)
    const mentionMatches = text.match(/@([a-zA-Z0-9._-]+)/g) || [];
    const usernames = mentionMatches.map((m) => m.substring(1));

    let mentionedUserIds = [];
    if (usernames.length > 0) {
      // Mentioned users ko database se find karna
      const users = await User.find({ name: { $in: usernames.map(u => new RegExp(`^${u}$`, 'i')) } }).select("_id");
      mentionedUserIds = users.map((u) => u._id);
    }

    // 2. Comment create karna
    const comment = await Comment.create({
      document: documentId,
      author: authorId,
      text,
      parentComment: parentCommentId || null,
      mentions: mentionedUserIds,
    });

    // 3. Mentioned users ke liye Notification create karna
    if (mentionedUserIds.length > 0) {
      const notifications = mentionedUserIds.map((recipientId) => ({
        recipient: recipientId,
        sender: authorId,
        type: "mention",
        document: documentId,
      }));
      await Notification.insertMany(notifications);
    }

    const populatedComment = await comment.populate("author", "name email");
    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Document ke tamam comments get karna
export const getComments = async (req, res) => {
  try {
    const { documentId } = req.params;
    const comments = await Comment.find({ document: documentId })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Comment ko resolve mark karna
export const resolveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      id,
      { isResolved: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Comment aur uske replies delete karna
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    await Comment.deleteMany({ parentComment: id });

    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};