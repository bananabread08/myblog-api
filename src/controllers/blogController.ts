import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Blog } from '../models/blog';
export const createBlog = [
  body('title', 'Title is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 characters.'),
  body('content', 'Content is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Content must be at least 6 characters.'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const { title, content } = req.body;
    const user = req.user;
    const blog = new Blog({
      title,
      content,
      user: user?._id,
      published: false,
      comments: [],
      tags: [],
    });
    const result = await blog.save();
    res.status(201).json(result);
  },
];

export const getAllBlogs = async (req: Request, res: Response) => {
  const blogs = await Blog.find({}).populate({
    path: 'user',
    select: 'username',
  });
  res.json(blogs);
};

export const getOneBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await Blog.findById(id).populate('user');
  if (!blog) return res.status(400).json({ message: 'Blog post not found' });
  res.json(blog);
};

export const deleteBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const blog = await Blog.findById(id).exec();
  if (!blog) return res.status(400).json({ message: 'Blog post not found' });
  // blog.user.toString() is the _id of user from mongo
  if (blog.user.toString() !== user?._id)
    return res
      .status(403)
      .json({ message: 'Forbidden. You are not the original author.' });
  await blog.deleteOne();
  res.json({ message: `Blog [${blog.title}] has been deleted.` });
};

export const updateBlog = [
  body('title', 'Title is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Title must be at least 6 characters.'),
  body('content', 'Content is required.')
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage('Content must be at least 6 characters.'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const id = req.params.id;
    const user = req.user;
    const blog = await Blog.findById(id).exec();
    if (!blog) return res.status(400).json({ message: 'Blog post not found' });
    if (blog.user.toString() !== user?._id)
      return res
        .status(403)
        .json({ message: 'Forbidden. You are not the original author.' });
    const { title, content } = req.body;
    const update = { title, content };
    await Blog.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    res.status(202).json({ message: `Blog [${blog.title}] has been updated.` });
  },
];
