const Form = require('../models/Form');
const Response = require('../models/Response');
const { generateAnalytics } = require('../utils/analytics');

// create a new form
const createForm = async(req, res) => {
    try {
        const { title, fields } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const form = new Form({ title, fields: fields || [] });
        await form.save();
        res.status(201).json(form);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Slug conflict, try a different title' });
        }
        console.error('createForm error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const getAllForms = async(req, res) => {
    try {
        const forms = await Form.find().sort({ createdAt: -1 });
        res.json(forms);
    } catch (err) {
        console.error('getAllForms error:', err);
        res.status(500).json({ error: err.message });
    }
};
const getFormById = async(req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.json(form);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// handles submitting answers to a form
const submitResponse = async(req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });

        const { answers } = req.body;
        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({ error: 'Answers are required' });
        }

        // validate each field
        const errs = [];
        form.fields.forEach(field => {
            const val = answers[field.label];
            const empty = val === undefined || val === null || String(val).trim() === '';

            if (field.required && empty) {
                errs.push(`"${field.label}" is required`);
                return;
            }

            if (!empty) {
                if (field.type === 'number' && isNaN(Number(val))) {
                    errs.push(`"${field.label}" must be a number`);
                }
                if (field.type === 'select' && !field.options.includes(String(val))) {
                    errs.push(`"${field.label}" must be one of: ${field.options.join(', ')}`);
                }
            }
        });

        if (errs.length > 0) {
            return res.status(422).json({ errors: errs });
        }

        const response = new Response({ formId: form._id, answers });
        await response.save();

        res.status(201).json({ message: 'Response submitted!', response });
    } catch (err) {
        console.error('submitResponse:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const getResponses = async(req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });

        // TODO: add pagination at some point
        const responses = await Response.find({ formId: req.params.id }).sort({ submittedAt: -1 });
        res.json({ form, responses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAnalytics = async(req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });

        const responses = await Response.find({ formId: req.params.id });
        const stats = generateAnalytics(form.fields, responses);

        res.json({
            form: { _id: form._id, title: form.title, fields: form.fields },
            ...stats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createForm, getAllForms, getFormById, submitResponse, getResponses, getAnalytics };