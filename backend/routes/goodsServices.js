const express = require('express');
const Joi = require('joi');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const goodsServiceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional()
});

// Get goods/services by company
router.get('/company/:companyId', async (req, res, next) => {
  try {
    const { data: goodsServices, error } = await supabase
      .from('goods_services')
      .select('*')
      .eq('company_id', req.params.companyId)
      .order('created_at', { ascending: false });

    if (error) return next(error);

    res.json({ goods_services: goodsServices });
  } catch (error) {
    next(error);
  }
});

// Add goods/services
router.post('/', auth, async (req, res, next) => {
  try {
    const { error, value } = goodsServiceSchema.validate(req.body);
    if (error) return next(error);

    const { title, description } = value;

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'You must have a company profile to add goods/services' });
    }

    const { data: goodsService, error: gsError } = await supabase
      .from('goods_services')
      .insert([{
        company_id: company.id,
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

// Update goods/services
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { error, value } = goodsServiceSchema.validate(req.body);
    if (error) return next(error);

    const { title, description } = value;

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (companyError || !company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check if goods/service belongs to user's company
    const { data: goodsService, error: gsError } = await supabase
      .from('goods_services')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .single();

    if (gsError || !goodsService) {
      return res.status(404).json({ error: 'Goods/service not found or unauthorized' });
    }

    const { data: updatedGoodsService, error: updateError } = await supabase
      .from('goods_services')
      .update({
        title,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) return next(updateError);

    res.json({ goods_service: updatedGoodsService });
  } catch (error) {
    next(error);
  }
});

// Delete goods/services
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

    // Check if goods/service belongs to user's company
    const { data: goodsService, error: gsError } = await supabase
      .from('goods_services')
      .select('*')
      .eq('id', req.params.id)
      .eq('company_id', company.id)
      .single();

    if (gsError || !goodsService) {
      return res.status(404).json({ error: 'Goods/service not found or unauthorized' });
    }

    const { error: deleteError } = await supabase
      .from('goods_services')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) return next(deleteError);

    res.json({ message: 'Goods/service deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;