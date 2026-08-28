import { Document } from "../models/Document.js";
import { Folder } from "../models/Folder.js";
import { User } from "../models/User.js";

export const globalSearch = async (req, res) => {
  try {
    const { q, type = "all", workspaceId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query required" });
    }

    // Partial search regex pattern (case-insensitive)
    const searchRegex = new RegExp(q.trim(), "i");
    const results = {};

    // 1. Search Documents
    if (type === "all" || type === "documents") {
      const docQuery = { title: searchRegex };
      if (workspaceId) docQuery.workspace = workspaceId;

      const documents = await Document.find(docQuery)
        .select("title workspace folder updatedAt")
        .populate("owner", "name email")
        .skip(skip)
        .limit(limit);

      const totalDocs = await Document.countDocuments(docQuery);
      results.documents = { data: documents, total: totalDocs };
    }

    // 2. Search Folders
    if (type === "all" || type === "folders") {
      const folderQuery = { name: searchRegex };
      if (workspaceId) folderQuery.workspace = workspaceId;

      const folders = await Folder.find(folderQuery)
        .select("name workspace parentFolder createdAt")
        .populate("owner", "name email")
        .skip(skip)
        .limit(limit);

      const totalFolders = await Folder.countDocuments(folderQuery);
      results.folders = { data: folders, total: totalFolders };
    }

    // 3. Search Users (Mentions ya sharing search ke liye)
    if (type === "all" || type === "users") {
      const userQuery = {
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };

      const users = await User.find(userQuery)
        .select("name email")
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments(userQuery);
      results.users = { data: users, total: totalUsers };
    }

    res.status(200).json({
      success: true,
      page,
      limit,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};