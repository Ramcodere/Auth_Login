const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a comment on a post
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId
    });
    
    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();
    
    // Populate author info
    await comment.populate('author', 'username profilePicture');
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = content;
    
    const updatedComment = await comment.save();
    await updatedComment.populate('author', 'username profilePicture');
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Failed to update comment', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });
    
    await comment.deleteOne();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
};

// @desc    Like/unlike a comment
// @route   POST /api/comments/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user already liked the comment
    const alreadyLiked = comment.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Add like
      comment.likes.push(req.user._id);
    }
    
    await comment.save();
    
    res.json({ likes: comment.likes, likeCount: comment.likes.length });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ message: 'Failed to like/unlike comment', error: error.message });
  }
}; 