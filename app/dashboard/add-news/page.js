"use client";
import { useState } from "react";

export default function AddNewsPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    month: "",
    week: "",
    date: "",
    image: "",
    summaryEn: "",
    summaryHi: "",
    highlightsEn: [""],
    highlightsHi: [""],
    contentEn: [""],
    contentHi: [""],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, lang, field, value) => {
    const updated = [...formData[field + lang]];
    updated[index] = value;
    setFormData({ ...formData, [field + lang]: updated });
  };

  const handleAddField = (lang, field) => {
    setFormData({
      ...formData,
      [field + lang]: [...formData[field + lang], ""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      category: formData.category,
      month: formData.month,
      week: formData.week,
      date: formData.date,
      image: formData.image,
      summary: {
        en: formData.summaryEn,
        hi: formData.summaryHi,
      },
      highlights: {
        en: formData.highlightsEn,
        hi: formData.highlightsHi,
      },
      content: {
        en: formData.contentEn,
        hi: formData.contentHi,
      },
    };

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success){
        alert("News article added successfully!");
        setFormData({
          title: "",
          category: "",
          month: "",
          week: "",
          date: "",
          image: "",
          summaryEn: "",
          summaryHi: "",
          highlightsEn: [""],
          highlightsHi: [""],
          contentEn: [""],
          contentHi: [""],
        });
      }
      else alert("Error: " + result.message);
    } catch (error) {
      console.error("Error adding news:", error);
      alert("An error occurred while adding news.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-gray-800 text-center text-2xl font-bold mb-6">
          Add News Article
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Technology">Technology</option>
            <option value="Government">Government</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
          </select>

          <div className="grid grid-cols-3 gap-4">
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            />

            <select
              name="week"
              value={formData.week}
              onChange={handleChange}
              className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Week</option>
              <option value="Week 1">Week 1</option>
              <option value="Week 2">Week 2</option>
              <option value="Week 3">Week 3</option>
              <option value="Week 4">Week 4</option>
            </select>

            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="text-gray-700 w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <input
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
          />

          <textarea
            name="summaryEn"
            placeholder="Summary (English)"
            value={formData.summaryEn}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            name="summaryHi"
            placeholder="Summary (Hindi)"
            value={formData.summaryHi}
            onChange={handleChange}
            className="text-gray-700 w-full border px-3 py-2 rounded-lg"
          />

          <h3 className="font-semibold text-gray-700">Highlights (English)</h3>
          {formData.highlightsEn.map((text, i) => (
            <input
              key={i}
              value={text}
              onChange={(e) =>
                handleArrayChange(i, "En", "highlights", e.target.value)
              }
              className="text-gray-700 w-full border px-3 py-2 rounded-lg mb-2"
              placeholder={`Highlight ${i + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddField("En", "highlights")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <h3 className="font-semibold text-gray-700 mt-4">Highlights (Hindi)</h3>
          {formData.highlightsHi.map((text, i) => (
            <input
              key={i}
              value={text}
              onChange={(e) =>
                handleArrayChange(i, "Hi", "highlights", e.target.value)
              }
              className="text-gray-700 w-full border px-3 py-2 rounded-lg mb-2"
              placeholder={`Highlight (Hindi) ${i + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddField("Hi", "highlights")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <h3 className="font-semibold text-gray-700 mt-4">Content (English)</h3>
          {formData.contentEn.map((text, i) => (
            <textarea
              key={i}
              value={text}
              onChange={(e) =>
                handleArrayChange(i, "En", "content", e.target.value)
              }
              className="text-gray-700 w-full border px-3 py-2 rounded-lg mb-2"
              placeholder={`Content paragraph ${i + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddField("En", "content")}
            className="text-blue-500"
          >
            + Add More
          </button>

          <h3 className="font-semibold text-gray-700 mt-4">Content (Hindi)</h3>
          {formData.contentHi.map((text, i) => (
            <textarea
              key={i}
              value={text}
              onChange={(e) =>
                handleArrayChange(i, "Hi", "content", e.target.value)
              }
              className="text-gray-700 w-full border px-3 py-2 rounded-lg mb-2"
              placeholder={`Content (Hindi) ${i + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => handleAddField("Hi", "content")}
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
