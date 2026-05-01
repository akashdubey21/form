const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'number', 'select'], required: true },
  required: { type: Boolean, default: false },
  options: [String],
}, { _id: false });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  fields: { type: [fieldSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

formSchema.pre('save', function(next) {
  if (!this.slug) {
    const slugify = require('slugify');
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Form', formSchema);
