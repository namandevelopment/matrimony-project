import React, { useState, useMemo, useCallback } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Sparkles, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Trophy, 
  Filter 
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { SuccessStory } from '../../types/crm.types';
import { toast } from '../../toastMessage/toast';
import { memoWithDeepEqual } from '../../utils/memoUtils';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useInputs } from '../../customHooks/useInputs';

export interface SuccessStoryFilterValues {
  searchQuery: string;
  statusFilter: 'ALL' | 'PUBLISHED' | 'DRAFT';
}

export interface SuccessStoryFormValues {
  groomName: string;
  groomId: string;
  brideName: string;
  brideId: string;
  couplePhoto: string;
  weddingDate: string;
  engagementDate: string;
  city: string;
  subcaste: string;
  storyTitle: string;
  storyDescription: string;
  attributedEmployeeName: string;
  status: 'PUBLISHED' | 'DRAFT';
  featuredOnHome: boolean;
  profilesArchived: boolean;
}

const getInitialStoryValues = (): SuccessStoryFormValues => ({
  groomName: '',
  groomId: '',
  brideName: '',
  brideId: '',
  couplePhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
  weddingDate: new Date().toISOString().split('T')[0],
  engagementDate: '',
  city: 'Mumbai',
  subcaste: 'Amil',
  storyTitle: '',
  storyDescription: '',
  attributedEmployeeName: 'Priya Sharma',
  status: 'PUBLISHED',
  featuredOnHome: true,
  profilesArchived: true,
});

export const SuccessStoriesScreen: React.FC = memoWithDeepEqual(() => {
  const [stories, setStories] = useState<SuccessStory[]>(() => crmDataService.getSuccessStories());
  
  // Filter state via useInputs
  const { values: filters, setFieldValue: setFilterField } = useInputs<SuccessStoryFilterValues>({
    searchQuery: '',
    statusFilter: 'ALL',
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state via useInputs
  const {
    values: formData,
    setFieldValue: setFormField,
    reset: resetStoryForm,
    validateForm: validateStoryForm,
  } = useInputs<SuccessStoryFormValues>(getInitialStoryValues, {
    validate: (vals) => {
      const errs: Partial<Record<keyof SuccessStoryFormValues, string>> = {};
      if (!vals.groomName.trim()) errs.groomName = 'Groom name is required';
      if (!vals.brideName.trim()) errs.brideName = 'Bride name is required';
      if (!vals.storyTitle.trim()) errs.storyTitle = 'Story title is required';
      return errs;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const refreshStories = useCallback(() => {
    setStories(crmDataService.getSuccessStories());
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((s) => {
      const matchesSearch = 
        s.groomName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        s.brideName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        s.subcaste.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesStatus = filters.statusFilter === 'ALL' || s.status === filters.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [stories, filters.searchQuery, filters.statusFilter]);

  const kpis = useMemo(() => {
    const total = stories.length;
    const published = stories.filter((s) => s.status === 'PUBLISHED').length;
    const featured = stories.filter((s) => s.featuredOnHome).length;
    const archived = stories.filter((s) => s.profilesArchived).length;
    return { total, published, featured, archived };
  }, [stories]);

  const handleTogglePublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    crmDataService.togglePublishSuccessStory(id);
    refreshStories();
    toast.success('Story status updated successfully');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this success story?')) {
      crmDataService.deleteSuccessStory(id);
      refreshStories();
      toast.success('Success story removed');
    }
  };

  const handleOpenAddModal = () => {
    resetStoryForm({
      groomName: '',
      groomId: `cl_${Date.now().toString().slice(-3)}`,
      brideName: '',
      brideId: `cl_${(Date.now() + 1).toString().slice(-3)}`,
      couplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      weddingDate: new Date().toISOString().split('T')[0],
      engagementDate: '',
      city: 'Mumbai',
      subcaste: 'Amil',
      storyTitle: '',
      storyDescription: '',
      attributedEmployeeName: 'Priya Sharma',
      status: 'PUBLISHED',
      featuredOnHome: true,
      profilesArchived: true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStoryForm()) return;
    if (!formData.groomName || !formData.brideName || !formData.storyTitle) {
      toast.error('Please enter Groom, Bride names and Story Title.');
      return;
    }

    crmDataService.addSuccessStory({
      groomId: formData.groomId || `SIND_${Date.now()}`,
      groomName: formData.groomName,
      brideId: formData.brideId || `SIND_${Date.now() + 1}`,
      brideName: formData.brideName,
      couplePhoto: formData.couplePhoto,
      weddingDate: formData.weddingDate,
      engagementDate: formData.engagementDate,
      city: formData.city,
      subcaste: formData.subcaste,
      storyTitle: formData.storyTitle,
      storyDescription: formData.storyDescription,
      attributedEmployeeName: formData.attributedEmployeeName,
      status: formData.status,
      featuredOnHome: formData.featuredOnHome,
      profilesArchived: formData.profilesArchived,
    });

    setIsModalOpen(false);
    refreshStories();
    toast.success('💍 New Success Story added and published successfully!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-rose-500/20 border border-rose-500/30 rounded-xl">
              <HeartHandshake className="w-6 h-6 text-rose-300" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Success Stories & Marriage Registry</h1>
          </div>
          <p className="text-rose-200/80 text-sm max-w-2xl">
            Track couples married through Sindhi Matrimony, publish authentic testimonials to the website, and manage married profile offboarding.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Success Story</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Marriages</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.total}</p>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">100% Verified Unions</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published on Web</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{kpis.published}</p>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Live on Landing Page</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured on Home</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.featured}</p>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Hero Testimonial Cards</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profiles Archived</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpis.archived}</p>
            <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Zero Match Clutter</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1">
          <CustomTextInput
            placeholder="Search by Groom, Bride, City or Subcaste..."
            value={filters.searchQuery}
            onChange={(e) => setFilterField('searchQuery', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            size="sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterField('statusFilter', 'ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filters.statusFilter === 'ALL' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({stories.length})
            </button>
            <button
              onClick={() => setFilterField('statusFilter', 'PUBLISHED')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filters.statusFilter === 'PUBLISHED' ? 'bg-white shadow text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Published ({kpis.published})
            </button>
            <button
              onClick={() => setFilterField('statusFilter', 'DRAFT')}
              className={`px-3 py-1.5 rounded-md transition-colors ${filters.statusFilter === 'DRAFT' ? 'bg-white shadow text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Drafts ({kpis.total - kpis.published})
            </button>
          </div>
        </div>
      </div>

      {/* 4. Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={story.couplePhoto}
                  alt={`${story.groomName} & ${story.brideName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow backdrop-blur-md ${
                    story.status === 'PUBLISHED' 
                      ? 'bg-emerald-600/90 text-white' 
                      : 'bg-amber-600/90 text-white'
                  }`}>
                    {story.status}
                  </span>
                  {story.featuredOnHome && (
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/90 text-white rounded-full shadow backdrop-blur-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {story.weddingDate}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">
                  {story.groomName} & {story.brideName}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {story.city}
                  </span>
                  <span>•</span>
                  <span>Subcaste: <strong className="text-slate-700">{story.subcaste}</strong></span>
                </div>

                <h4 className="font-semibold text-rose-900 text-sm mb-1.5 line-clamp-1">
                  "{story.storyTitle}"
                </h4>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {story.storyDescription}
                </p>

                {/* Attribution pill */}
                <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Matchmaker (RM):</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    {story.attributedEmployeeName || 'Self Matched'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <button
                onClick={(e) => handleTogglePublish(story.id, e)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  story.status === 'PUBLISHED'
                    ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                }`}
              >
                {story.status === 'PUBLISHED' ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Unpublish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Publish to Web</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => handleDelete(story.id, e)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No Success Stories Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or add a new verified marriage through the button above.
          </p>
        </div>
      )}

      {/* 5. Add Success Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Success Story</h3>
                  <p className="text-xs text-slate-500">Record a confirmed union and publish testimonial</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomTextInput
                  label="Groom Full Name *"
                  required
                  placeholder="e.g. Rahul Jagtiani"
                  value={formData.groomName}
                  onChange={(e) => setFormField('groomName', e.target.value)}
                  size="sm"
                />
                <CustomTextInput
                  label="Bride Full Name *"
                  required
                  placeholder="e.g. Priya Mansukhani"
                  value={formData.brideName}
                  onChange={(e) => setFormField('brideName', e.target.value)}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CustomTextInput
                  label="Wedding Date *"
                  type="date"
                  required
                  value={formData.weddingDate}
                  onChange={(e) => setFormField('weddingDate', e.target.value)}
                  size="sm"
                />
                <CustomTextInput
                  label="City"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormField('city', e.target.value)}
                  size="sm"
                />
                <div>
                  <CustomDropDown
                    label="Subcaste"
                    value={formData.subcaste}
                    onChange={(val) => setFormField('subcaste', String(val))}
                    options={[
                      { value: 'Amil', label: 'Amil' },
                      { value: 'Bhaiband', label: 'Bhaiband' },
                      { value: 'Sahiti', label: 'Sahiti' },
                      { value: 'Larkana', label: 'Larkana' },
                      { value: 'Shikarpuri', label: 'Shikarpuri' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              <CustomTextInput
                label="Couple Photo URL"
                type="url"
                placeholder="https://..."
                value={formData.couplePhoto}
                onChange={(e) => setFormField('couplePhoto', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="Story Catchy Title *"
                required
                placeholder="e.g. From Assisted Matchmaking to Royal Vivah"
                value={formData.storyTitle}
                onChange={(e) => setFormField('storyTitle', e.target.value)}
                size="sm"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Testimonial / Story</label>
                <textarea
                  rows={3}
                  placeholder="Describe how the couple connected, family response, RM assistance..."
                  value={formData.storyDescription}
                  onChange={(e) => setFormField('storyDescription', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomDropDown
                    label="Attributed Matchmaker (RM)"
                    value={formData.attributedEmployeeName}
                    onChange={(val) => setFormField('attributedEmployeeName', String(val))}
                    options={[
                      { value: 'Priya Sharma', label: 'Priya Sharma' },
                      { value: 'Amit Bajaj', label: 'Amit Bajaj' },
                      { value: 'Neha Lulla', label: 'Neha Lulla' },
                      { value: 'Self Matched', label: 'Self Matched / Organic' },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <CustomDropDown
                    label="Initial Status"
                    value={formData.status}
                    onChange={(val) => setFormField('status', val as any)}
                    options={[
                      { value: 'PUBLISHED', label: 'Published (Live on Website)' },
                      { value: 'DRAFT', label: 'Draft (Internal Review)' },
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featuredOnHome}
                    onChange={(e) => setFormField('featuredOnHome', e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Feature on Homepage Testimonials Carousel</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.profilesArchived}
                    onChange={(e) => setFormField('profilesArchived', e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Auto-Archive both profiles as <strong>MARRIED</strong> to prevent further match recommendations</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold shadow cursor-pointer"
                >
                  Save & Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

SuccessStoriesScreen.displayName = 'SuccessStoriesScreen';
export default SuccessStoriesScreen;
