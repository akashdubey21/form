/**
 * seed.js
 * Populates the database with 3 sample forms and 5+ responses.
 * Run: node seed.js  (from the server/ directory)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Form = require('./models/Form');
const Response = require('./models/Response');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Form.deleteMany({});
  await Response.deleteMany({});
  console.log('🗑️  Cleared existing forms and responses.');

  // ── Form 1: Job Application ──────────────────────────────────
  const jobForm = await Form.create({
    title: 'Job Application',
    fields: [
      { label: 'Full Name', type: 'text', required: true },
      { label: 'Email', type: 'text', required: true },
      { label: 'Years of Experience', type: 'number', required: true },
      {
        label: 'Primary Skill',
        type: 'select',
        required: true,
        options: ['React', 'Node.js', 'Python', 'Java', 'DevOps'],
      },
      {
        label: 'Employment Type',
        type: 'select',
        required: true,
        options: ['Full-time', 'Part-time', 'Contract'],
      },
    ],
  });

  // ── Form 2: Event Registration ───────────────────────────────
  const eventForm = await Form.create({
    title: 'Event Registration',
    fields: [
      { label: 'Attendee Name', type: 'text', required: true },
      { label: 'Email', type: 'text', required: true },
      {
        label: 'Session',
        type: 'select',
        required: true,
        options: ['Morning', 'Afternoon', 'Evening'],
      },
      { label: 'Age', type: 'number', required: false },
      {
        label: 'T-Shirt Size',
        type: 'select',
        required: false,
        options: ['S', 'M', 'L', 'XL'],
      },
    ],
  });

  // ── Form 3: Feedback ─────────────────────────────────────────
  const feedbackForm = await Form.create({
    title: 'Feedback',
    fields: [
      { label: 'Your Name', type: 'text', required: false },
      {
        label: 'Rating',
        type: 'select',
        required: true,
        options: ['1', '2', '3', '4', '5'],
      },
      { label: 'Score', type: 'number', required: true },
      {
        label: 'Category',
        type: 'select',
        required: true,
        options: ['Product', 'Support', 'Design', 'Performance'],
      },
      { label: 'Comments', type: 'text', required: false },
    ],
  });

  console.log('✅ Created 3 forms.');

  // ── Responses for Job Application ────────────────────────────
  await Response.insertMany([
    {
      formId: jobForm._id,
      answers: {
        'Full Name': 'Alice Johnson',
        Email: 'alice@example.com',
        'Years of Experience': 5,
        'Primary Skill': 'React',
        'Employment Type': 'Full-time',
      },
    },
    {
      formId: jobForm._id,
      answers: {
        'Full Name': 'Bob Martinez',
        Email: 'bob@example.com',
        'Years of Experience': 3,
        'Primary Skill': 'Node.js',
        'Employment Type': 'Contract',
      },
    },
    {
      formId: jobForm._id,
      answers: {
        'Full Name': 'Carol White',
        Email: 'carol@example.com',
        'Years of Experience': 7,
        'Primary Skill': 'Python',
        'Employment Type': 'Full-time',
      },
    },
  ]);

  // ── Responses for Event Registration ─────────────────────────
  await Response.insertMany([
    {
      formId: eventForm._id,
      answers: {
        'Attendee Name': 'David Kim',
        Email: 'david@example.com',
        Session: 'Morning',
        Age: 28,
        'T-Shirt Size': 'M',
      },
    },
    {
      formId: eventForm._id,
      answers: {
        'Attendee Name': 'Eva Patel',
        Email: 'eva@example.com',
        Session: 'Evening',
        Age: 34,
        'T-Shirt Size': 'L',
      },
    },
  ]);

  // ── Responses for Feedback ────────────────────────────────────
  await Response.insertMany([
    {
      formId: feedbackForm._id,
      answers: {
        'Your Name': 'Frank Lee',
        Rating: '5',
        Score: 92,
        Category: 'Product',
        Comments: 'Excellent platform!',
      },
    },
    {
      formId: feedbackForm._id,
      answers: {
        'Your Name': 'Grace Chen',
        Rating: '4',
        Score: 78,
        Category: 'Design',
        Comments: 'Looks great, a few minor issues.',
      },
    },
    {
      formId: feedbackForm._id,
      answers: {
        'Your Name': '',
        Rating: '3',
        Score: 65,
        Category: 'Support',
        Comments: 'Response time could be improved.',
      },
    },
  ]);

  console.log('✅ Seeded 8 responses across 3 forms.');
  console.log('\n📋 Form IDs:');
  console.log(`  Job Application:    ${jobForm._id}`);
  console.log(`  Event Registration: ${eventForm._id}`);
  console.log(`  Feedback:           ${feedbackForm._id}`);

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB. Seeding complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
