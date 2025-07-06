const express = require('express');
const Joi = require('joi');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const applicationSchema = Joi.object({
  tenderId: Joi.string().uuid().required(),
  proposal: Joi.string().required()
});

// Apply to tender
router.post('/', auth, async (req, res, next) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) return next(error);

    const { tenderId, proposal } = value;

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'You must have a company profile to apply to tenders' });
    }

    // Check if tender exists and is active
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', tenderId)
      .eq('status', 'active')
      .single();

    if (tenderError || !tender) {
      return res.status(404).json({ error: 'Tender not found or inactive' });
    }

    // Check if company has already applied
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('tender_id', tenderId)
      .eq('applicant_company_id', company.id)
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this tender' });
    }

    // Create application
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert([{
        tender_id: tenderId,
        applicant_company_id: company.id,
        proposal,
        status: 'pending'
      }])
      .select(`
        *,
        tenders (
          id,
          title,
          deadline,
          budget
        ),
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .single();

    if (applicationError) return next(applicationError);

    res.status(201).json({ application });
  } catch (error) {
    next(error);
  }
});

// Get applications for a tender (tender owner only)
router.get('/tender/:tenderId', auth, async (req, res, next) => {
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
      .eq('id', req.params.tenderId)
      .eq('company_id', company.id)
      .single();

    if (tenderError || !tender) {
      return res.status(404).json({ error: 'Tender not found or unauthorized' });
    }

    // Get applications
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .eq('tender_id', req.params.tenderId)
      .order('created_at', { ascending: false });

    if (error) return next(error);

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

// Get applications by company (company's own applications)
router.get('/company/:companyId', auth, async (req, res, next) => {
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

    // Check if requesting own company's applications
    if (company.id !== req.params.companyId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        tenders (
          id,
          title,
          deadline,
          budget,
          status,
          companies (
            id,
            name,
            industry
          )
        )
      `)
      .eq('applicant_company_id', req.params.companyId)
      .order('created_at', { ascending: false });

    if (error) return next(error);

    res.json({ applications });
  } catch (error) {
    next(error);
  }
});

// Update application status (tender owner only)
router.patch('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Get application with tender info
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select(`
        *,
        tenders (
          id,
          company_id
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (applicationError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if tender belongs to user's company
    if (application.tenders.company_id !== company.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update application status
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select(`
        *,
        tenders (
          id,
          title,
          deadline,
          budget
        ),
        companies (
          id,
          name,
          industry,
          logo_url
        )
      `)
      .single();

    if (updateError) return next(updateError);

    res.json({ application: updatedApplication });
  } catch (error) {
    next(error);
  }
});

module.exports = router;