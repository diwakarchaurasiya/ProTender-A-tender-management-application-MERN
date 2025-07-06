const express = require('express');
const Joi = require('joi');
const multer = require('multer');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation schemas
const companySchema = Joi.object({
  name: Joi.string().required(),
  industry: Joi.string().required(),
  description: Joi.string().allow('').optional()
});

const goodsServiceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional()
});

// Get all companies with pagination and search
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('companies')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,industry.ilike.%${search}%`);
    }

    const { data: companies, error, count } = await query;

    if (error) return next(error);

    res.json({
      companies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalCount: count
    });
  } catch (error) {
    next(error);
  }
});

// Get company by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get goods and services
    const { data: goodsServices } = await supabase
      .from('goods_services')
      .select('*')
      .eq('company_id', req.params.id);

    res.json({
      company,
      goods_services: goodsServices || []
    });
  } catch (error) {
    next(error);
  }
});

// Create company profile
router.post('/', auth, async (req, res, next) => {
  try {
    const { error, value } = companySchema.validate(req.body);
    if (error) return next(error);

    const { name, industry, description } = value;

    // Check if user already has a company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (existingCompany) {
      return res.status(400).json({ error: 'User already has a company profile' });
    }

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert([{
        user_id: req.user.id,
        name,
        industry,
        description
      }])
      .select()
      .single();

    if (companyError) return next(companyError);

    res.status(201).json({ company });
  } catch (error) {
    next(error);
  }
});

// Update company profile
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { error, value } = companySchema.validate(req.body);
    if (error) return next(error);

    const { name, industry, description } = value;

    // Check if user owns this company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(404).json({ error: 'Company not found or unauthorized' });
    }

    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        name,
        industry,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) return next(updateError);

    res.json({ company: updatedCompany });
  } catch (error) {
    next(error);
  }
});

// Upload company logo
router.post('/:id/logo', auth, upload.single('logo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if user owns this company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(404).json({ error: 'Company not found or unauthorized' });
    }

    // Upload to Supabase storage
    const fileName = `${req.params.id}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) return next(uploadError);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    const logoUrl = urlData.publicUrl;

    // Update company with logo URL
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) return next(updateError);

    res.json({ logoUrl, company: updatedCompany });
  } catch (error) {
    next(error);
  }
});

// Add goods/services to company
router.post('/:id/goods-services', auth, async (req, res, next) => {
  try {
    const { error, value } = goodsServiceSchema.validate(req.body);
    if (error) return next(error);

    const { title, description } = value;

    // Check if user owns this company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(404).json({ error: 'Company not found or unauthorized' });
    }

    const { data: goodsService, error: gsError } = await supabase
      .from('goods_services')
      .insert([{
        company_id: req.params.id,
        title,
        description
      }])
      .select()
      .single();

    if (gsError) return next(gsError);

    res.status(201).json({ goods_service: goodsService });
  } catch (error) {
    next(error);
  }
});

module.exports = router;