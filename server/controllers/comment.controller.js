import Comment from "../models/comment.model.js";

export const getComment = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blog: blogId })
      .populate("author")
      .populate("parentComment");

    return res.status(200).json({
      message: "Comments fetched successfully",
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error in fetching comments: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const createComment = async (req, res) => {
  const { content, blogId, parentCommentId } = req.body;
  const author = req.user._id;
  try {
    const newComment = new Comment({
      content,
      author,
      blog: blogId,
      parentComment: parentCommentId,
    });
    await newComment.save();
    return res.status(201).json({
      message: "Comment created successfully",
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Error in creating comment: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    return res.status(200).json({
      message: "Comment updated successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error in updating comment: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleting comment: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const likeComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $push: { likes: userId } },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    return res.status(200).json({
      message: "Comment liked successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error in liking comment: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const dislikeComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }
    return res.status(200).json({
      message: "Comment disliked successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error in disliking comment: ", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
