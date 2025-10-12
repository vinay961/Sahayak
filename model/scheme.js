import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  launchDate: {
    type: String, // you can also use Date if you want proper date handling
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  descriptionPoints: [
    {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
  ],
  eligibility: [
    {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
  ],
  benefits: [
    {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
  ],
});

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;
