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
    type: String,
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

// const Scheme = mongoose.model("Scheme", schemeSchema);
const Scheme = mongoose.models.Scheme || mongoose.model("Scheme", schemeSchema);
// models is used to find existing models to avoid OverwriteModelError wheareas model creates a new model every time the code is run.

export default Scheme;
