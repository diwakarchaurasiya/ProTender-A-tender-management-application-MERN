const express = require('express');
const Joi = require('joi');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const tenderSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.date().greater('now').required(),
  budget: Joi.number().min(0).optional()
});

// Get all tenders with pagination and search
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('tenders')
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `, { count: 'exact' })
      .eq('status', 'active')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: tenders, error, count } = await query;

    if (error) return next(error);

    res.json({
      tenders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count
    });
  } catch (error) {
    next(error);
  }
});

// Get tender by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { data: tender, error } = await supabase
      .from('tenders')
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          description,
          logo_url
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.json({ tender });
  } catch (error) {
    next(error);
  }
});

// Create tender
router.post('/', auth, async (req, res, next) => {
  try {
    const { error, value } = tenderSchema.validate(req.body);
    if (error) return next(error);

    const { title, description, deadline, budget } = value;

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'You must have a company profile to create tenders' });
    }

    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .insert([{
        company_id: company.id,
        title,
        description,
        deadline,
        budget,
        status: 'active'
      }])
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .single();

    if (tenderError) return next(tenderError);

    res.status(201).json({ tender });
  } catch (error) {
    next(error);
  }
});

// Update tender
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { error, value } = tenderSchema.validate(req.body);
    if (error) return next(error);

    const { title, description, deadline, budget } = value;

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check if tender belongs to user's company
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .single();

    if (tenderError || !tender) {
      return res.status(404).json({ error: 'Tender not found or unauthorized' });
    }

    const { data: updatedTender, error: updateError } = await supabase
      .from('tenders')
      .update({
        title,
        description,
        deadline,
        budget,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .single();

    if (updateError) return next(updateError);

    res.json({ tender: updatedTender });
  } catch (error) {
    next(error);
  }
});

// Delete tender
router.delete('/:id', auth, async (req, res, next) => {
  try {
    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check if tender belongs to user's company
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .single();

    if (tenderError || !tender) {
      return res.status(404).json({ error: 'Tender not found or unauthorized' });
    }

    const { error: deleteError } = await supabase
      .from('tenders')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) return next(deleteError);

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get tenders by company
router.get('/company/:companyId', async (req, res, next) => {
  try {
    const { data: tenders, error } = await supabase
      .from('tenders')
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .eq('company_id', req.params.companyId)
      .order('created_at', { ascending: false });

    if (error) return next(error);

    res.json({ tenders });
  } catch (error) {
    next(error);
  }
});

module.exports = router;