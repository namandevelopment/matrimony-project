import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Star, 
  Search, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  MessageCircle, 
  ShieldCheck, 
  Send,
  Edit3,
  RefreshCw,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { ReviewItem } from '../../types/crm.types';
import { toast } from '../../toastMessage/toast';
import { memoWithDeepEqual } from '../../utils/memoUtils';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useInputs } from '../../customHooks/useInputs';
import { apiFetch, ApiURL } from '../../redux/apiService';

export interface ReviewsFilterValues {
  searchQuery: string;
  ratingFilter: 'ALL' | '5' | '4' | '3' | '2' | '1';
  statusFilter: 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED';
  sourceFilter: 'ALL' | 'GOOGLE' | 'IN_APP' | 'WEBSITE' | 'RELATIONSHIP_MANAGER';
}

export interface NewReviewFormValues {
  memberName: string;
  memberId: string;
  rating: number;
  title: string;
  comment: string;
  source: 'GOOGLE' | 'IN_APP' | 'WEBSITE' | 'RELATIONSHIP_MANAGER';
  category: 'MATCHMAKING' | 'CUSTOMER_SUPPORT' | 'HOROSCOPE' | 'OVERALL';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface ReviewReplyFormValues {
  replyText: string;
}

export const ReviewsScreen: React.FC = memoWithDeepEqual(() => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => crmDataService.getReviews());
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    values: filters,
    setFieldValue: setFilterField,
  } = useInputs<ReviewsFilterValues>({
    searchQuery: '',
    ratingFilter: 'ALL',
    statusFilter: 'ALL',
    sourceFilter: 'ALL',
  });

  // Reply drawer / modal state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const {
    values: replyForm,
    setFieldValue: setReplyFormField,
    setValues: setReplyFormValues,
    reset: resetReplyForm,
  } = useInputs<ReviewReplyFormValues>({
    replyText: '',
  });

  // Add review modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    values: newReview,
    setFieldValue: setNewReviewField,
    reset: resetNewReviewForm,
  } = useInputs<NewReviewFormValues>({
    memberName: '',
    memberId: `cl_${Date.now().toString().slice(-3)}`,
    rating: 5,
    title: '',
    comment: '',
    source: 'GOOGLE',
    category: 'MATCHMAKING',
    status: 'APPROVED',
  });

  // Edit review modal state
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ReviewItem>>({});

  // 1. Dynamic fetch from Backend API
  const fetchReviewsFromBackend = useCallback(async (showNotification = false) => {
    setIsSyncing(true);
    try {
      const res = await apiFetch.get<any>(ApiURL.adminReviews, undefined, {
        isToken: true,
        showErrorToast: false,
      });

      if (res?.data?.reviews && Array.isArray(res.data.reviews) && res.data.reviews.length > 0) {
        const backendItems: ReviewItem[] = res.data.reviews.map((r: any) => ({
          id: r.id || r._id || r.reviewId,
          reviewId: r.reviewId || r.id,
          memberId: r.memberId || 'cl_001',
          memberName: r.memberName || 'Member',
          memberRole: r.memberRole,
          subcaste: r.subcaste,
          city: r.city,
          memberPhoto: r.memberPhoto,
          rating: Number(r.rating) || 5,
          title: r.title || '',
          comment: r.comment || '',
          source: r.source || 'WEBSITE',
          category: r.category || 'MATCHMAKING',
          status: (r.status as 'APPROVED' | 'PENDING' | 'REJECTED') || 'PENDING',
          adminResponse: r.adminResponse || '',
          adminRespondedAt: r.adminRespondedAt || '',
          createdAt: r.createdAt || new Date().toISOString().slice(0, 10),
          helpfulCount: Number(r.helpfulCount) || 0,
        }));

        setReviews(backendItems);
        // Sync local storage / memory so CRM is consistent
        backendItems.forEach((item) => {
          crmDataService.updateReview(item.id, item);
        });

        if (showNotification) {
          toast.success('Reviews synced dynamically with live database');
        }
      }
    } catch {
      // Fallback seamlessly to local CRM data
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewsFromBackend();
  }, [fetchReviewsFromBackend]);

  const handleOpenEdit = (review: ReviewItem) => {
    setEditingReview(review);
    setEditFormData({
      memberName: review.memberName,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      source: review.source,
      category: review.category,
      adminResponse: review.adminResponse || '',
    });
  };

  const handleSaveEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editFormData.memberName || !editFormData.title || !editFormData.comment) {
      toast.error('Member name, title and comment cannot be empty');
      return;
    }

    const targetId = editingReview.id || editingReview.reviewId;
    crmDataService.updateReview(targetId, editFormData);
    setReviews((prev) =>
      prev.map((r) => (r.id === targetId || r.reviewId === targetId ? { ...r, ...editFormData } : r))
    );
    setEditingReview(null);
    toast.success('Review updated and changes saved successfully');

    // Sync directly to Backend MongoDB API
    try {
      await apiFetch.put(ApiURL.adminReviewDetail(targetId), editFormData, {
        isToken: true,
        showErrorToast: false,
      });
    } catch {
      // Handled locally
    }
  };

  const refreshReviews = useCallback(() => {
    fetchReviewsFromBackend();
  }, [fetchReviewsFromBackend]);

  const stats = useMemo(() => {
    return crmDataService.getReviewStats();
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch = 
        r.memberName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesRating = filters.ratingFilter === 'ALL' || r.rating.toString() === filters.ratingFilter;
      const matchesStatus = filters.statusFilter === 'ALL' || r.status === filters.statusFilter;
      const matchesSource = filters.sourceFilter === 'ALL' || r.source === filters.sourceFilter;

      return matchesSearch && matchesRating && matchesStatus && matchesSource;
    });
  }, [reviews, filters.searchQuery, filters.ratingFilter, filters.statusFilter, filters.sourceFilter]);

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    crmDataService.updateReviewStatus(id, status);
    setReviews((prev) => prev.map((r) => (r.id === id || r.reviewId === id ? { ...r, status } : r)));
    toast.success(`Review status changed to ${status}`);

    // Sync to Backend MongoDB API
    try {
      await apiFetch.put(ApiURL.adminReviewDetail(id), { status }, {
        isToken: true,
        showErrorToast: false,
      });
    } catch {
      // Handled locally
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      crmDataService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id && r.reviewId !== id));
      toast.success('Review deleted');

      // Sync deletion to Backend MongoDB API
      try {
        await apiFetch.delete(ApiURL.adminReviewDetail(id), undefined, {
          isToken: true,
          showErrorToast: false,
        });
      } catch {
        // Handled locally
      }
    }
  };

  const handleOpenReply = (review: ReviewItem) => {
    setReplyingReviewId(review.id);
    setReplyFormValues({ replyText: review.adminResponse || '' });
  };

  const handleSaveReply = async (id: string) => {
    const replyText = replyForm.replyText.trim();
    if (!replyText) {
      toast.error('Reply text cannot be empty');
      return;
    }
    crmDataService.addAdminReviewResponse(id, replyText);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id || r.reviewId === id
          ? { ...r, adminResponse: replyText, adminRespondedAt: new Date().toISOString().slice(0, 10) }
          : r
      )
    );
    setReplyingReviewId(null);
    resetReplyForm();
    toast.success('Official reply saved & published');

    // Sync to Backend MongoDB API
    try {
      await apiFetch.put(ApiURL.adminReviewDetail(id), { adminResponse: replyText }, {
        isToken: true,
        showErrorToast: false,
      });
    } catch {
      // Handled locally
    }
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.memberName || !newReview.title || !newReview.comment) {
      toast.error('Please fill in Member Name, Title and Comment');
      return;
    }

    const payload = {
      memberId: newReview.memberId,
      memberName: newReview.memberName,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      source: newReview.source,
      category: newReview.category,
      status: newReview.status,
    };

    crmDataService.addReview(payload);
    setIsAddModalOpen(false);
    resetNewReviewForm();
    refreshReviews();
    toast.success('New review added successfully');

    // Post to Backend MongoDB API
    try {
      await apiFetch.post(ApiURL.adminReviews, payload, {
        isToken: true,
        showErrorToast: false,
      });
    } catch {
      // Handled locally
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-amber-500/20 border border-amber-500/30 rounded-xl">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Reviews & Ratings Moderation Desk</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Monitor client feedback, manage multi-channel reviews (Google, In-App, Website), moderate testimonials, and publish official responses.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => fetchReviewsFromBackend(true)}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium px-4 py-2.5 rounded-xl border border-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Sync with live database"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-rose-400' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Review</span>
          </button>
        </div>
      </div>

      {/* 2. Rating Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Platform Rating</p>
          <div className="text-5xl font-black text-slate-900 tracking-tight">
            {stats.averageRating}
            <span className="text-2xl font-medium text-slate-400"> / 5.0</span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`w-5 h-5 ${s <= Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} 
              />
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Based on <strong className="text-slate-800">{stats.totalReviews} verified member reviews</strong> across channels
          </p>
        </div>

        {/* 5-Star Breakdown Bars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2 flex flex-col justify-between">
          <h4 className="font-bold text-slate-800 text-sm mb-4">Rating Breakdown by Star Level</h4>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = (stats.breakdown as any)[star] || 0;
              const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 font-semibold text-slate-700">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-amber-400' : star === 3 ? 'bg-amber-300' : 'bg-rose-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-slate-500 font-medium">
                    {count} ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Approved for Website: <strong className="text-emerald-700">{stats.approvedCount}</strong></span>
            <span>Pending Review: <strong className="text-amber-700">{stats.pendingCount}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1">
          <CustomTextInput
            type="text"
            placeholder="Search reviews by member, title, comment keywords..."
            value={filters.searchQuery}
            onChange={(e) => setFilterField('searchQuery', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            size="sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Star Filter */}
          <div className="w-36">
            <CustomDropDown
              value={filters.ratingFilter}
              onChange={(val) => setFilterField('ratingFilter', val as any)}
              size="sm"
              options={[
                { label: 'All Stars', value: 'ALL' },
                { label: '5 Stars only', value: '5' },
                { label: '4 Stars', value: '4' },
                { label: '3 Stars', value: '3' },
                { label: '2 Stars', value: '2' },
                { label: '1 Star', value: '1' },
              ]}
            />
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <CustomDropDown
              value={filters.statusFilter}
              onChange={(val) => setFilterField('statusFilter', val as any)}
              size="sm"
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Approved / Live', value: 'APPROVED' },
                { label: 'Pending Moderation', value: 'PENDING' },
                { label: 'Rejected', value: 'REJECTED' },
              ]}
            />
          </div>

          {/* Source Filter */}
          <div className="w-44">
            <CustomDropDown
              value={filters.sourceFilter}
              onChange={(val) => setFilterField('sourceFilter', val as any)}
              size="sm"
              options={[
                { label: 'All Channels', value: 'ALL' },
                { label: 'Google Reviews', value: 'GOOGLE' },
                { label: 'In-App Feedback', value: 'IN_APP' },
                { label: 'Website Form', value: 'WEBSITE' },
                { label: 'Relationship Manager', value: 'RELATIONSHIP_MANAGER' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 4. Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-700 border border-slate-200 shrink-0">
                  {review.memberPhoto ? (
                    <img src={review.memberPhoto} alt={review.memberName} className="w-full h-full object-cover" />
                  ) : (
                    review.memberName.charAt(0)
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{review.memberName}</h3>
                    <span className="text-xs text-slate-400">({review.memberId})</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{review.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 self-start">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  review.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  review.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {review.status}
                </span>

                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                  {review.source}
                </span>

                <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                  {review.category}
                </span>
              </div>
            </div>

            {/* Comment Body */}
            <div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{review.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                "{review.comment}"
              </p>
            </div>

            {/* Admin Response Block */}
            {review.adminResponse && (
              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between text-rose-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                    Official Administrator Response
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">{review.adminRespondedAt}</span>
                </div>
                <p className="text-slate-700 pl-5 leading-relaxed">{review.adminResponse}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenReply(review)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-rose-700" />
                  <span>{review.adminResponse ? 'Edit Response' : 'Reply to Member'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(review)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/70 font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit Review</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {review.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleStatusChange(review.id, 'APPROVED')}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve for Web</span>
                  </button>
                )}

                {review.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleStatusChange(review.id, 'REJECTED')}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject / Hide</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline reply editor */}
            {replyingReviewId === review.id && (
              <div className="mt-3 pt-3 border-t border-rose-100 bg-rose-50/40 p-3 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-rose-950">
                  Write Official Response on behalf of Sindhi Matrimony:
                </label>
                <textarea
                  rows={2}
                  value={replyForm.replyText}
                  onChange={(e) => setReplyFormField('replyText', e.target.value)}
                  placeholder="Thank you for sharing your feedback..."
                  className="w-full text-xs p-2.5 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setReplyingReviewId(null);
                      resetReplyForm();
                    }}
                    className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveReply(review.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg shadow cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish Response</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No Reviews Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your star rating or status filters, or add a new client testimonial.
          </p>
        </div>
      )}

      {/* 5. Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add Member Review</h3>
                  <p className="text-xs text-slate-500">Record a rating and testimonial from client</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetNewReviewForm();
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <CustomTextInput
                label="Member Full Name *"
                type="text"
                required
                placeholder="e.g. Ramesh Vazirani"
                value={newReview.memberName}
                onChange={(e) => setNewReviewField('memberName', e.target.value)}
                size="sm"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1 to 5 Stars) *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewReviewField('rating', s)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${s <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{newReview.rating} Stars</span>
                </div>
              </div>

              <CustomTextInput
                label="Review Title / Headline *"
                type="text"
                required
                placeholder="e.g. Exceptional Gotra Matching & Support"
                value={newReview.title}
                onChange={(e) => setNewReviewField('title', e.target.value)}
                size="sm"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the review statement..."
                  value={newReview.comment}
                  onChange={(e) => setNewReviewField('comment', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomDropDown
                  label="Source / Channel"
                  value={newReview.source}
                  onChange={(val) => setNewReviewField('source', val as any)}
                  size="sm"
                  options={[
                    { label: 'Google Review', value: 'GOOGLE' },
                    { label: 'In-App Feedback', value: 'IN_APP' },
                    { label: 'Website Form', value: 'WEBSITE' },
                    { label: 'Relationship Manager', value: 'RELATIONSHIP_MANAGER' },
                  ]}
                />

                <CustomDropDown
                  label="Category"
                  value={newReview.category}
                  onChange={(val) => setNewReviewField('category', val as any)}
                  size="sm"
                  options={[
                    { label: 'Matchmaking', value: 'MATCHMAKING' },
                    { label: 'Customer Support', value: 'CUSTOMER_SUPPORT' },
                    { label: 'Horoscope / Kundli', value: 'HOROSCOPE' },
                    { label: 'Overall Experience', value: 'OVERALL' },
                  ]}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetNewReviewForm();
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold shadow cursor-pointer"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Review Modal Dialog */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  <span>Edit Member Review</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review ID: <strong className="text-slate-800">{editingReview.reviewId}</strong> • Member: {editingReview.memberName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CustomTextInput
                  label="Member / Couple Name"
                  value={editFormData.memberName || ''}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, memberName: e.target.value }))}
                  size="sm"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Star Rating (1 - 5)</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEditFormData((prev) => ({ ...prev, rating: star }))}
                        className="p-1 rounded-md hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (editFormData.rating || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">
                      {editFormData.rating || 5} Stars
                    </span>
                  </div>
                </div>
              </div>

              <CustomTextInput
                label="Review Headline / Title"
                value={editFormData.title || ''}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                size="sm"
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Review Message / Feedback</label>
                <textarea
                  rows={4}
                  value={editFormData.comment || ''}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-slate-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <CustomDropDown
                  label="Moderation Status"
                  value={editFormData.status || 'PENDING'}
                  onChange={(val) => setEditFormData((prev) => ({ ...prev, status: val as any }))}
                  size="sm"
                  options={[
                    { label: 'Approved (Visible on Web)', value: 'APPROVED' },
                    { label: 'Pending Moderation', value: 'PENDING' },
                    { label: 'Rejected / Hidden', value: 'REJECTED' },
                  ]}
                />

                <CustomDropDown
                  label="Channel / Source"
                  value={editFormData.source || 'WEBSITE'}
                  onChange={(val) => setEditFormData((prev) => ({ ...prev, source: val as any }))}
                  size="sm"
                  options={[
                    { label: 'Website Form', value: 'WEBSITE' },
                    { label: 'In-App Feedback', value: 'IN_APP' },
                    { label: 'Google Review', value: 'GOOGLE' },
                    { label: 'Relationship Manager', value: 'RELATIONSHIP_MANAGER' },
                  ]}
                />

                <CustomDropDown
                  label="Category"
                  value={editFormData.category || 'MATCHMAKING'}
                  onChange={(val) => setEditFormData((prev) => ({ ...prev, category: val as any }))}
                  size="sm"
                  options={[
                    { label: 'Matchmaking', value: 'MATCHMAKING' },
                    { label: 'Customer Support', value: 'CUSTOMER_SUPPORT' },
                    { label: 'Horoscope / Kundli', value: 'HOROSCOPE' },
                    { label: 'Overall Experience', value: 'OVERALL' },
                  ]}
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700">
                  Official Administrator Response (Shown under review on website)
                </label>
                <textarea
                  rows={2}
                  value={editFormData.adminResponse || ''}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, adminResponse: e.target.value }))}
                  placeholder="Thank you for sharing your wonderful experience..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow cursor-pointer"
                >
                  Save &amp; Update Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

ReviewsScreen.displayName = 'ReviewsScreen';
export default ReviewsScreen;
