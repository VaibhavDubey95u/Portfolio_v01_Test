import { supabase } from './supabaseClient';

// Utility to map object keys between camelCase and snake_case
const toCamel = (str) => {
  if (str === 'is_current') return 'current';
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

const toSnake = (str) => {
  if (str === 'current') return 'is_current';
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const mapKeys = (obj, converter) => {
  if (Array.isArray(obj)) return obj.map(v => mapKeys(v, converter));
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      result[converter(key)] = mapKeys(obj[key], converter);
      return result;
    }, {});
  }
  return obj;
};

const objToCamel = (obj) => obj ? mapKeys(obj, toCamel) : obj;
const objToSnake = (obj) => obj ? mapKeys(obj, toSnake) : obj;

// Helper to handle single row tables (hero, about, contact, site_settings)
const getSingleRow = async (table) => {
  const { data, error } = await supabase.from(table).select('*').eq('id', 1).single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
  return objToCamel(data);
};

const updateSingleRow = async (table, payload) => {
  const { data, error } = await supabase
    .from(table)
    .upsert({ id: 1, ...objToSnake(payload) })
    .select()
    .single();
  if (error) throw error;
  return objToCamel(data);
};

// Helper for collection tables
const getCollection = async (table, orderBy = 'display_order') => {
  const { data, error } = await supabase.from(table).select('*').order(orderBy);
  if (error) throw error;
  return objToCamel(data);
};

export const portfolioService = {
  // GETTERS
  async fetchAllData() {
    const [
      site_settings,
      hero,
      about,
      contact,
      projects,
      education,
      experience,
      achievements,
      certifications,
      skillCategories,
      skills
    ] = await Promise.all([
      getSingleRow('site_settings'),
      getSingleRow('hero'),
      getSingleRow('about'),
      getSingleRow('contact'),
      getCollection('projects'),
      getCollection('education'),
      getCollection('experience'),
      getCollection('achievements'),
      getCollection('certifications'),
      getCollection('skill_categories'),
      getCollection('skills')
    ]);

    // Construct the data shape expected by the frontend
    return {
      meta: site_settings || {},
      hero: hero || {},
      about: about || {},
      contact: contact || {},
      projects: projects || [],
      education: education || [],
      experience: experience || [],
      achievements: achievements || [],
      certifications: certifications || [],
      skills: {
        title: site_settings?.skillsTitle || 'Skills & Expertise',
        subtitle: site_settings?.skillsSubtitle || 'A comprehensive overview of my technical skills across various domains.',
        categories: (skillCategories || []).map(cat => ({
          ...cat,
          skills: (skills || []).filter(s => s.categoryId === cat.id)
        }))
      }
    };
  },

  // SETTERS for single row
  async updateHero(data) { return updateSingleRow('hero', data); },
  async updateAbout(data) { return updateSingleRow('about', data); },
  async updateContact(data) { return updateSingleRow('contact', data); },
  async updateMeta(data) { return updateSingleRow('site_settings', data); },
  
  async updateSkillsMeta(data) {
    const { data: result, error } = await supabase
      .from('site_settings')
      .update({ skills_title: data.title, skills_subtitle: data.subtitle })
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return objToCamel(result);
  },

  // GENERIC SETTERS for collections
  async addItem(table, item) {
    const { data, error } = await supabase.from(table).insert(objToSnake(item)).select().single();
    if (error) throw error;
    return objToCamel(data);
  },
  
  async updateItem(table, id, payload) {
    const { data, error } = await supabase.from(table).update(objToSnake(payload)).eq('id', id).select().single();
    if (error) throw error;
    return objToCamel(data);
  },
  
  async deleteItem(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  async reorderItems(table, items) {
    // Expects array of { id, display_order }
    const promises = items.map((item) => {
      const { id, ...updateData } = objToSnake(item);
      return supabase.from(table).update(updateData).eq('id', id);
    });
    const results = await Promise.all(promises);
    const errorResult = results.find(r => r.error);
    if (errorResult) throw errorResult.error;
  },

  // SKILLS specific
  async addSkillCategory(data) {
    const { data: result, error } = await supabase.from('skill_categories').insert(objToSnake(data)).select().single();
    if (error) throw error;
    return objToCamel(result);
  },

  async updateSkillCategory(id, data) {
    const { data: result, error } = await supabase.from('skill_categories').update(objToSnake(data)).eq('id', id).select().single();
    if (error) throw error;
    return objToCamel(result);
  },

  async deleteSkillCategory(id) {
    const { error } = await supabase.from('skill_categories').delete().eq('id', id);
    if (error) throw error;
  },

  async addSkill(skill) {
    const { data: result, error } = await supabase.from('skills').insert(objToSnake(skill)).select().single();
    if (error) throw error;
    return objToCamel(result);
  },

  async updateSkill(id, data) {
    const { data: result, error } = await supabase.from('skills').update(objToSnake(data)).eq('id', id).select().single();
    if (error) throw error;
    return objToCamel(result);
  },

  async deleteSkill(id) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  // MESSAGES specific
  async addMessage(data) {
    const { error } = await supabase.from('messages').insert(objToSnake(data));
    if (error) throw error;
    return true;
  },

  async getMessages(page = 1, pageSize = 20) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return {
      messages: objToCamel(data),
      count
    };
  },

  async markMessageRead(id) {
    const { data: result, error } = await supabase.from('messages').update({ is_read: true }).eq('id', id).select().single();
    if (error) throw error;
    return objToCamel(result);
  },

  async deleteMessage(id) {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  },

  async resetToDefault(defaultData) {
    // 1. Single row tables
    const { adminPassword, ...metaWithoutPassword } = defaultData.meta || {};
    
    await updateSingleRow('site_settings', {
      ...metaWithoutPassword,
      skills_title: defaultData.skills?.title || 'Skills & Expertise',
      skills_subtitle: defaultData.skills?.subtitle || 'A comprehensive overview of my technical skills across various domains.'
    });
    await updateSingleRow('hero', defaultData.hero);
    await updateSingleRow('about', defaultData.about);
    await updateSingleRow('contact', defaultData.contact);

    const replaceCollection = async (table, items) => {
      await supabase.from(table).delete().not('id', 'is', null);
      if (items && items.length > 0) {
        const { error } = await supabase.from(table).insert(items.map((item, index) => ({
          ...objToSnake(item),
          display_order: index
        })));
        if (error) throw error;
      }
    };

    await replaceCollection('projects', defaultData.projects);
    await replaceCollection('education', defaultData.education);
    await replaceCollection('experience', defaultData.experience);
    await replaceCollection('achievements', defaultData.achievements);
    await replaceCollection('certifications', defaultData.certifications);

    // Skills are nested inside categories
    await supabase.from('skills').delete().not('id', 'is', null);
    await supabase.from('skill_categories').delete().not('id', 'is', null);

    if (defaultData.skills && defaultData.skills.categories) {
      for (const [catIndex, category] of defaultData.skills.categories.entries()) {
        const { skills, ...catData } = category;
        const { error: catError } = await supabase.from('skill_categories').insert({
          ...objToSnake(catData),
          display_order: catIndex
        });
        if (catError) throw catError;

        if (skills && skills.length > 0) {
          const { error: skillError } = await supabase.from('skills').insert(skills.map((skill, skillIndex) => ({
            ...objToSnake(skill),
            category_id: category.id,
            display_order: skillIndex
          })));
          if (skillError) throw skillError;
        }
      }
    }
  }
};

