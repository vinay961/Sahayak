"use client";
import { useState } from "react";

export default function AddSchemePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    launchDate: "",
    image: "",
    descriptionPoints: [{ en: "", hi: "" }],
    eligibility: [{ en: "", hi: "" }],
    benefits: [{ en: "", hi: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, lang, value) => {
    const updated = [...formData[field]];
    updated[index][lang] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleAddField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], { en: "", hi: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      category: formData.category,
      launchDate: formData.launchDate,
      image: formData.image,
      descriptionPoints: formData.descriptionPoints,
      eligibility: formData.eligibility,
      benefits: formData.benefits,
    };
    console.log("Submitting Scheme:", payload);

    try {
      const response = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) alert("Scheme added successfully!");
      else alert("Error: " + result.message);
    } catch (error) {
      console.error("Error adding scheme:", error);
      alert("An error occurred while adding scheme.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-gray-800 text-center text-2xl font-bold mb-6">Add New Scheme</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Scheme Title"
            value={formData.title}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            required
          />
          <input
            name="launchDate"
            placeholder="Launch Date"
            value={formData.launchDate}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
          />

          <h3 className="font-semibold text-gray-700">Description Points</h3>
          {formData.descriptionPoints.map((point, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 mb-2">
              <input
                placeholder={`Description (English) ${i + 1}`}
                value={point.en}
                onChange={(e) => handleArrayChange("descriptionPoints", i, "en", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
              <input
                placeholder={`विवरण (Hindi) ${i + 1}`}
                value={point.hi}
                onChange={(e) => handleArrayChange("descriptionPoints", i, "hi", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("descriptionPoints")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <h3 className="font-semibold text-gray-700 mt-4">Eligibility</h3>
          {formData.eligibility.map((point, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 mb-2">
              <input
                placeholder={`Eligibility (English) ${i + 1}`}
                value={point.en}
                onChange={(e) => handleArrayChange("eligibility", i, "en", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
              <input
                placeholder={`पात्रता (Hindi) ${i + 1}`}
                value={point.hi}
                onChange={(e) => handleArrayChange("eligibility", i, "hi", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("eligibility")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <h3 className="font-semibold text-gray-700 mt-4">Benefits</h3>
          {formData.benefits.map((point, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 mb-2">
              <input
                placeholder={`Benefit (English) ${i + 1}`}
                value={point.en}
                onChange={(e) => handleArrayChange("benefits", i, "en", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
              <input
                placeholder={`लाभ (Hindi) ${i + 1}`}
                value={point.hi}
                onChange={(e) => handleArrayChange("benefits", i, "hi", e.target.value)}
                className="text-gray-700 w-full border px-3 py-2 rounded-lg"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("benefits")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
