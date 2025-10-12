import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  week: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  summary: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
  },
  highlights: {
    en: [{ type: String, required: true }],
    hi: [{ type: String, required: true }],
  },
  content: {
    en: [{ type: String, required: true }],
    hi: [{ type: String, required: true }],
  },
});

const News = mongoose.model("News", newsSchema);

export default News;
