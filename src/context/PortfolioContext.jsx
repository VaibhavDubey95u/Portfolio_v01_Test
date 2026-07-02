/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { portfolioService } from '../services/portfolioService';
import defaultData from '../data/portfolio.json';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch all data from Supabase
  const { data: serverData, isLoading, error } = useQuery({
    queryKey: ['portfolioData'],
    queryFn: portfolioService.fetchAllData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Use Supabase data only — never fall back to demo data in the UI
  // defaultData is kept only for the admin "Reset to Default" mutation
  const state = useMemo(() => {
    if (serverData && Object.keys(serverData.hero).length > 0) {
      return serverData;
    }
    return null;
  }, [serverData]);

  // Define mutations
  const invalidate = () => queryClient.invalidateQueries(['portfolioData']);

  const updateHeroMutation = useMutation({ mutationFn: portfolioService.updateHero, onSuccess: invalidate });
  const updateAboutMutation = useMutation({ mutationFn: portfolioService.updateAbout, onSuccess: invalidate });
  const updateContactMutation = useMutation({ mutationFn: portfolioService.updateContact, onSuccess: invalidate });
  const updateMetaMutation = useMutation({ mutationFn: portfolioService.updateMeta, onSuccess: invalidate });
  const updateSkillsMetaMutation = useMutation({ mutationFn: portfolioService.updateSkillsMeta, onSuccess: invalidate });

  const addItemMutation = useMutation({ mutationFn: ({ table, item }) => portfolioService.addItem(table, item), onSuccess: invalidate });
  const updateItemMutation = useMutation({ mutationFn: ({ table, id, data }) => portfolioService.updateItem(table, id, data), onSuccess: invalidate });
  const deleteItemMutation = useMutation({ mutationFn: ({ table, id }) => portfolioService.deleteItem(table, id), onSuccess: invalidate });
  const reorderItemsMutation = useMutation({
    mutationFn: ({ table, items }) => portfolioService.reorderItems(table, items.map((item, index) => ({ id: item.id, display_order: index }))),
    onSuccess: invalidate
  });

  const addSkillCategoryMutation = useMutation({ mutationFn: portfolioService.addSkillCategory, onSuccess: invalidate });
  const updateSkillCategoryMutation = useMutation({ mutationFn: ({ id, data }) => portfolioService.updateSkillCategory(id, data), onSuccess: invalidate });
  const deleteSkillCategoryMutation = useMutation({ mutationFn: portfolioService.deleteSkillCategory, onSuccess: invalidate });
  
  const reorderCategoriesMutation = useMutation({
    mutationFn: ({ categories }) => portfolioService.reorderItems('skill_categories', categories.map((c, index) => ({ id: c.id, display_order: index }))),
    onSuccess: invalidate
  });

  const addSkillMutation = useMutation({ mutationFn: portfolioService.addSkill, onSuccess: invalidate });
  const updateSkillMutation = useMutation({ mutationFn: ({ id, data }) => portfolioService.updateSkill(id, data), onSuccess: invalidate });
  const deleteSkillMutation = useMutation({ mutationFn: portfolioService.deleteSkill, onSuccess: invalidate });
  
  const reorderSkillsMutation = useMutation({
    mutationFn: ({ categoryId, skills }) => portfolioService.reorderItems('skills', skills.map((s, index) => ({ 
      id: s.id, 
      display_order: index,
      ...(categoryId ? { category_id: categoryId } : {})
    }))),
    onSuccess: invalidate
  });

  const resetToDefaultMutation = useMutation({
    mutationFn: () => portfolioService.resetToDefault(defaultData),
    onSuccess: () => {
      invalidate();
      toast.success('Portfolio reset to default demo data');
    },
    onError: (err) => {
      toast.error(`Reset failed: ${err.message}`);
    }
  });

  // Action creators for UI compatibility
  const actions = {
    updateHero: (data) => updateHeroMutation.mutate(data),
    updateAbout: (data) => updateAboutMutation.mutate(data),
    updateContact: (data) => updateContactMutation.mutate(data),
    updateMeta: (data) => updateMetaMutation.mutate(data),

    addProject: (item) => addItemMutation.mutate({ table: 'projects', item: { ...item, id: `projects-${Date.now()}` } }),
    updateProject: (id, data) => updateItemMutation.mutate({ table: 'projects', id, data }),
    deleteProject: (id) => deleteItemMutation.mutate({ table: 'projects', id }),
    reorderProjects: (items) => reorderItemsMutation.mutate({ table: 'projects', items }),

    addEducation: (item) => addItemMutation.mutate({ table: 'education', item: { ...item, id: `education-${Date.now()}` } }),
    updateEducation: (id, data) => updateItemMutation.mutate({ table: 'education', id, data }),
    deleteEducation: (id) => deleteItemMutation.mutate({ table: 'education', id }),
    reorderEducation: (items) => reorderItemsMutation.mutate({ table: 'education', items }),

    addExperience: (item) => addItemMutation.mutate({ table: 'experience', item: { ...item, id: `experience-${Date.now()}` } }),
    updateExperience: (id, data) => updateItemMutation.mutate({ table: 'experience', id, data }),
    deleteExperience: (id) => deleteItemMutation.mutate({ table: 'experience', id }),
    reorderExperience: (items) => reorderItemsMutation.mutate({ table: 'experience', items }),

    addAchievement: (item) => addItemMutation.mutate({ table: 'achievements', item: { ...item, id: `achievements-${Date.now()}` } }),
    updateAchievement: (id, data) => updateItemMutation.mutate({ table: 'achievements', id, data }),
    deleteAchievement: (id) => deleteItemMutation.mutate({ table: 'achievements', id }),
    reorderAchievements: (items) => reorderItemsMutation.mutate({ table: 'achievements', items }),

    addCertification: (item) => addItemMutation.mutate({ table: 'certifications', item: { ...item, id: `certifications-${Date.now()}` } }),
    updateCertification: (id, data) => updateItemMutation.mutate({ table: 'certifications', id, data }),
    deleteCertification: (id) => deleteItemMutation.mutate({ table: 'certifications', id }),
    reorderCertifications: (items) => reorderItemsMutation.mutate({ table: 'certifications', items }),

    addSkillCategory: (data) => addSkillCategoryMutation.mutate({ ...data, id: `cat-${Date.now()}` }),
    updateSkillCategory: (id, data) => updateSkillCategoryMutation.mutate({ id, data }),
    deleteSkillCategory: (id) => deleteSkillCategoryMutation.mutate(id),
    reorderCategories: (categories) => reorderCategoriesMutation.mutate({ categories }),
    updateSkillsMeta: (data) => updateSkillsMetaMutation.mutate(data),

    addSkill: (categoryId, skill) => addSkillMutation.mutate({ ...skill, categoryId, id: `skill-${Date.now()}` }),
    updateSkill: (categoryId, skillId, data) => updateSkillMutation.mutate({ id: skillId, data }),
    deleteSkill: (categoryId, skillId) => deleteSkillMutation.mutate(skillId),
    reorderSkills: (categoryId, skills) => reorderSkillsMutation.mutate({ categoryId, skills }),

    resetToDefault: () => resetToDefaultMutation.mutate()
  };

  return (
    <PortfolioContext.Provider value={{ data: state, actions, isLoading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
