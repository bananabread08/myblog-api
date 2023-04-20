import mongoose from 'mongoose';
import { IBlog } from '../types';

const { Schema } = mongoose;

const BlogSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  published: { type: Boolean, default: false },
  tags: [{ type: String }],
  comments: [{ type: [Schema.Types.ObjectId], ref: 'Comment' }],
});

BlogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    // delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
