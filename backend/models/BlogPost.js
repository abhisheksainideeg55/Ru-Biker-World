import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    authorName: {
      type: String,
      default: 'RU Biker World Team',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, isPublished: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
