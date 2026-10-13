import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  GitBranch,
  X,
  RotateCcw,
  AlertTriangle,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  History,
  CheckCircle,
} from 'lucide-react';
import {
  subcasteGotraService,
  type CommunityMaster,
  type SubcasteMaster,
  type GotraMaster,
  type SurnameMaster,
  type GotraCompatibilityRule,
  type MasterDataAuditLog,
  type MasterEntityType,
  type VerificationStatus,
  type RuleSeverity,
} from '../../../services/subcasteGotraService';
import { toast } from '../../../toastMessage/toast';
import { CustomButton } from '../../../components/CustomButton';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { useInputs } from '../../../customHooks/useInputs';

export interface SubcasteGotraFilterValues {
  searchQuery: string;
  statusFilter: 'ALL' | VerificationStatus;
  activeFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
  selectedCommunityFilter: string;
}

export interface CommunityFormValues {
  name: string;
  category: CommunityMaster['category'];
  aliases: string;
  historicalRegion: string;
  description: string;
  hasGotraSystem: boolean;
  verificationStatus: VerificationStatus;
  sourceReference: string;
  active: boolean;
}

export interface SubcasteFormValues {
  name: string;
  communityId: string;
  region: string;
  description: string;
  aliases: string;
  surnames: string;
  priorityWeight: number;
  verificationStatus: VerificationStatus;
  sourceReference: string;
  active: boolean;
}

export interface GotraFormValues {
  name: string;
  lineage: string;
  description: string;
  alternateSpellings: string;
  prohibitedSameGotra: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: VerificationStatus;
  sourceReference: string;
  active: boolean;
}

export interface SurnameFormValues {
  canonicalSurname: string;
  alternateSpellings: string;
  mappedSubcastes: string[];
  mappedGotras: string[];
  isAmbiguous: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: VerificationStatus;
  sourceReference: string;
  active: boolean;
}

export interface RuleFormValues {
  code: string;
  name: string;
  description: string;
  severity: RuleSeverity;
  explanationMessage: string;
  enabled: boolean;
}

export interface SandboxFormValues {
  clientSub: string;
  clientGotra: string;
  candidateSub: string;
  candidateGotra: string;
}

type ActiveTab =
  | 'communities'
  | 'subcastes'
  | 'gotras'
  | 'surnames'
  | 'rules'
  | 'import_export'
  | 'verification';

export const SubcasteGotraSection: React.FC = () => {
  // Service Data State
  const [communities, setCommunities] = useState<CommunityMaster[]>(() => subcasteGotraService.getCommunities());
  const [subcastes, setSubcastes] = useState<SubcasteMaster[]>(() => subcasteGotraService.getSubcastes());
  const [gotras, setGotras] = useState<GotraMaster[]>(() => subcasteGotraService.getGotras());
  const [surnames, setSurnames] = useState<SurnameMaster[]>(() => subcasteGotraService.getSurnames());
  const [rules, setRules] = useState<GotraCompatibilityRule[]>(() => subcasteGotraService.getCompatibilityRules());
  const [auditLogs, setAuditLogs] = useState<MasterDataAuditLog[]>(() => subcasteGotraService.getAuditLogs());
  const [stats, setStats] = useState(() => subcasteGotraService.getMasterStats());

  // Navigation & Filtering via useInputs
  const [activeTab, setActiveTab] = useState<ActiveTab>('communities');

  const {
    values: filterValues,
    setFieldValue: setFilterField,
  } = useInputs<SubcasteGotraFilterValues>({
    searchQuery: '',
    statusFilter: 'ALL',
    activeFilter: 'ALL',
    selectedCommunityFilter: 'ALL',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when tab or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    filterValues.searchQuery,
    filterValues.statusFilter,
    filterValues.activeFilter,
    filterValues.selectedCommunityFilter,
  ]);

  // Subscribe to service updates
  useEffect(() => {
    const unsub = subcasteGotraService.subscribe(() => {
      setCommunities(subcasteGotraService.getCommunities());
      setSubcastes(subcasteGotraService.getSubcastes());
      setGotras(subcasteGotraService.getGotras());
      setSurnames(subcasteGotraService.getSurnames());
      setRules(subcasteGotraService.getCompatibilityRules());
      setAuditLogs(subcasteGotraService.getAuditLogs());
      setStats(subcasteGotraService.getMasterStats());
    });
    return unsub;
  }, []);

  // ---------------------------------------------------------------------------
  // FILTERING LOGIC
  // ---------------------------------------------------------------------------
  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      if (filterValues.statusFilter !== 'ALL' && c.verificationStatus !== filterValues.statusFilter) return false;
      if (filterValues.activeFilter === 'ACTIVE' && !c.active) return false;
      if (filterValues.activeFilter === 'INACTIVE' && c.active) return false;
      if (filterValues.searchQuery.trim()) {
        const q = filterValues.searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRegion = c.historicalRegion.toLowerCase().includes(q);
        const matchesAlias = c.aliases.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesRegion && !matchesAlias) return false;
      }
      return true;
    });
  }, [communities, filterValues.statusFilter, filterValues.activeFilter, filterValues.searchQuery]);

  const filteredSubcastes = useMemo(() => {
    return subcastes.filter((s) => {
      if (filterValues.statusFilter !== 'ALL' && s.verificationStatus !== filterValues.statusFilter) return false;
      if (filterValues.activeFilter === 'ACTIVE' && !s.active) return false;
      if (filterValues.activeFilter === 'INACTIVE' && s.active) return false;
      if (filterValues.selectedCommunityFilter !== 'ALL' && s.communityId !== filterValues.selectedCommunityFilter) return false;
      if (filterValues.searchQuery.trim()) {
        const q = filterValues.searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesRegion = s.region.toLowerCase().includes(q);
        const matchesSurname = s.surnames.some((sn) => sn.toLowerCase().includes(q));
        const matchesAlias = s.aliases.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesRegion && !matchesSurname && !matchesAlias) return false;
      }
      return true;
    });
  }, [subcastes, filterValues.statusFilter, filterValues.activeFilter, filterValues.selectedCommunityFilter, filterValues.searchQuery]);

  const filteredGotras = useMemo(() => {
    return gotras.filter((g) => {
      if (filterValues.statusFilter !== 'ALL' && g.verificationStatus !== filterValues.statusFilter) return false;
      if (filterValues.activeFilter === 'ACTIVE' && !g.active) return false;
      if (filterValues.activeFilter === 'INACTIVE' && g.active) return false;
      if (filterValues.searchQuery.trim()) {
        const q = filterValues.searchQuery.toLowerCase();
        const matchesName = g.name.toLowerCase().includes(q);
        const matchesLineage = g.lineage.toLowerCase().includes(q);
        const matchesAlt = g.alternateSpellings.some((alt) => alt.toLowerCase().includes(q));
        if (!matchesName && !matchesLineage && !matchesAlt) return false;
      }
      return true;
    });
  }, [gotras, filterValues.statusFilter, filterValues.activeFilter, filterValues.searchQuery]);

  const filteredSurnames = useMemo(() => {
    return surnames.filter((sn) => {
      if (filterValues.statusFilter !== 'ALL' && sn.verificationStatus !== filterValues.statusFilter) return false;
      if (filterValues.activeFilter === 'ACTIVE' && !sn.active) return false;
      if (filterValues.activeFilter === 'INACTIVE' && sn.active) return false;
      if (filterValues.searchQuery.trim()) {
        const q = filterValues.searchQuery.toLowerCase();
        const matchesName = sn.canonicalSurname.toLowerCase().includes(q);
        const matchesAlt = sn.alternateSpellings.some((alt) => alt.toLowerCase().includes(q));
        const matchesSub = sn.mappedSubcasteNames.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesAlt && !matchesSub) return false;
      }
      return true;
    });
  }, [surnames, filterValues.statusFilter, filterValues.activeFilter, filterValues.searchQuery]);

  // Combined Verification Queue (all unverified or disputed items across entities)
  const verificationQueue = useMemo(() => {
    const list: Array<{
      type: MasterEntityType;
      id: string;
      name: string;
      status: VerificationStatus;
      notes?: string;
      source?: string;
      updatedAt: string;
    }> = [];

    communities
      .filter((c) => c.verificationStatus !== 'VERIFIED')
      .forEach((c) =>
        list.push({
          type: 'COMMUNITY',
          id: c.id,
          name: c.name,
          status: c.verificationStatus,
          notes: c.adminNotes,
          source: c.sourceReference,
          updatedAt: c.updatedAt,
        })
      );

    subcastes
      .filter((s) => s.verificationStatus !== 'VERIFIED')
      .forEach((s) =>
        list.push({
          type: 'SUBCASTE',
          id: s.id,
          name: s.name,
          status: s.verificationStatus,
          notes: s.adminNotes,
          source: s.sourceReference,
          updatedAt: s.updatedAt,
        })
      );

    gotras
      .filter((g) => g.verificationStatus !== 'VERIFIED')
      .forEach((g) =>
        list.push({
          type: 'GOTRA',
          id: g.id,
          name: g.name,
          status: g.verificationStatus,
          notes: g.adminNotes,
          source: g.sourceReference,
          updatedAt: g.updatedAt,
        })
      );

    surnames
      .filter((sn) => sn.verificationStatus !== 'VERIFIED')
      .forEach((sn) =>
        list.push({
          type: 'SURNAME',
          id: sn.id,
          name: sn.canonicalSurname,
          status: sn.verificationStatus,
          notes: sn.notes,
          source: sn.sourceReference,
          updatedAt: sn.updatedAt,
        })
      );

    return list;
  }, [communities, subcastes, gotras, surnames]);

  // ---------------------------------------------------------------------------
  // MODALS STATE (POWERED BY useInputs)
  // ---------------------------------------------------------------------------
  // Community Modal
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<CommunityMaster | null>(null);
  const {
    values: communityForm,
    setFieldValue: setCommunityField,
    reset: resetCommunityForm,
    errors: communityErrors,
    touched: communityTouched,
    validateForm: validateCommunityForm,
  } = useInputs<CommunityFormValues>(
    {
      name: '',
      category: 'CASTE_COMMUNITY',
      aliases: '',
      historicalRegion: '',
      description: '',
      hasGotraSystem: true,
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    },
    {
      validate: (vals) => {
        if (!vals.name.trim()) return { name: 'Community name is required.' };
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Subcaste Modal
  const [subcasteModalOpen, setSubcasteModalOpen] = useState(false);
  const [editingSubcaste, setEditingSubcaste] = useState<SubcasteMaster | null>(null);
  const {
    values: subcasteForm,
    setFieldValue: setSubcasteField,
    reset: resetSubcasteForm,
    errors: subcasteErrors,
    touched: subcasteTouched,
    validateForm: validateSubcasteForm,
  } = useInputs<SubcasteFormValues>(
    {
      name: '',
      communityId: '',
      region: '',
      description: '',
      aliases: '',
      surnames: '',
      priorityWeight: 10,
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    },
    {
      validate: (vals) => {
        if (!vals.name.trim()) return { name: 'Subcaste name is required.' };
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Gotra Modal
  const [gotraModalOpen, setGotraModalOpen] = useState(false);
  const [editingGotra, setEditingGotra] = useState<GotraMaster | null>(null);
  const {
    values: gotraForm,
    setFieldValue: setGotraField,
    reset: resetGotraForm,
    errors: gotraErrors,
    touched: gotraTouched,
    validateForm: validateGotraForm,
  } = useInputs<GotraFormValues>(
    {
      name: '',
      lineage: '',
      description: '',
      alternateSpellings: '',
      prohibitedSameGotra: true,
      confidence: 'HIGH',
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    },
    {
      validate: (vals) => {
        const errs: Partial<Record<'name' | 'lineage', string>> = {};
        if (!vals.name.trim()) errs.name = 'Gotra name is required.';
        if (!vals.lineage.trim()) errs.lineage = 'Root seer / lineage is required.';
        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Surname Modal
  const [surnameModalOpen, setSurnameModalOpen] = useState(false);
  const [editingSurname, setEditingSurname] = useState<SurnameMaster | null>(null);
  const {
    values: surnameForm,
    setFieldValue: setSurnameField,
    reset: resetSurnameForm,
    errors: surnameErrors,
    touched: surnameTouched,
    validateForm: validateSurnameForm,
  } = useInputs<SurnameFormValues>(
    {
      canonicalSurname: '',
      alternateSpellings: '',
      mappedSubcastes: [],
      mappedGotras: [],
      isAmbiguous: false,
      confidence: 'HIGH',
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    },
    {
      validate: (vals) => {
        if (!vals.canonicalSurname.trim()) return { canonicalSurname: 'Canonical surname is required.' };
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Rule Modal
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<GotraCompatibilityRule | null>(null);
  const {
    values: ruleForm,
    setFieldValue: setRuleField,
    reset: resetRuleForm,
    errors: ruleErrors,
    touched: ruleTouched,
    validateForm: validateRuleForm,
  } = useInputs<RuleFormValues>(
    {
      code: '',
      name: '',
      description: '',
      severity: 'BLOCKING',
      explanationMessage: '',
      enabled: true,
    },
    {
      validate: (vals) => {
        if (!vals.name.trim()) return { name: 'Rule name is required.' };
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Audit Log Drawer / Modal
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Import / Export State
  const [importEntityType, setImportEntityType] = useState<MasterEntityType>('SUBCASTE');
  const [rawCsvText, setRawCsvText] = useState('');
  const [importSummary, setImportSummary] = useState<{
    totalRows: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  // Matchmaking Compatibility Sandbox State
  const {
    values: sandboxForm,
    setFieldValue: setSandboxField,
  } = useInputs<SandboxFormValues>({
    clientSub: '',
    clientGotra: '',
    candidateSub: '',
    candidateGotra: '',
  });

  const [sandboxResult, setSandboxResult] = useState<{
    isCompatible: boolean;
    scoreModifier: number;
    reasons: string[];
  } | null>(null);

  // ---------------------------------------------------------------------------
  // HANDLERS: COMMUNITY
  // ---------------------------------------------------------------------------
  const handleOpenAddCommunity = () => {
    setEditingCommunity(null);
    resetCommunityForm({
      name: '',
      category: 'CASTE_COMMUNITY',
      aliases: '',
      historicalRegion: 'Sindh & Diaspora',
      description: '',
      hasGotraSystem: true,
      verificationStatus: 'VERIFIED',
      sourceReference: 'Community Ethnography & Gazetteer',
      active: true,
    });
    setCommunityModalOpen(true);
  };

  const handleOpenEditCommunity = (comm: CommunityMaster) => {
    setEditingCommunity(comm);
    resetCommunityForm({
      name: comm.name,
      category: comm.category,
      aliases: comm.aliases.join(', '),
      historicalRegion: comm.historicalRegion,
      description: comm.description,
      hasGotraSystem: comm.hasGotraSystem,
      verificationStatus: comm.verificationStatus,
      sourceReference: comm.sourceReference,
      active: comm.active,
    });
    setCommunityModalOpen(true);
  };

  const handleSaveCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCommunityForm()) {
      return;
    }

    const aliasesList = communityForm.aliases
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      if (editingCommunity) {
        subcasteGotraService.updateCommunity(editingCommunity.id, {
          name: communityForm.name.trim(),
          category: communityForm.category,
          aliases: aliasesList,
          historicalRegion: communityForm.historicalRegion.trim(),
          description: communityForm.description.trim(),
          hasGotraSystem: communityForm.hasGotraSystem,
          verificationStatus: communityForm.verificationStatus,
          sourceReference: communityForm.sourceReference.trim(),
          active: communityForm.active,
        });
        toast.success(`Community "${communityForm.name}" updated successfully.`);
      } else {
        subcasteGotraService.addCommunity({
          name: communityForm.name.trim(),
          category: communityForm.category,
          aliases: aliasesList,
          historicalRegion: communityForm.historicalRegion.trim(),
          description: communityForm.description.trim(),
          hasGotraSystem: communityForm.hasGotraSystem,
          verificationStatus: communityForm.verificationStatus,
          sourceReference: communityForm.sourceReference.trim(),
          active: communityForm.active,
        });
        toast.success(`Community "${communityForm.name}" registered in master database.`);
      }
      setCommunityModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleDeleteCommunity = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Community "${name}"?`)) {
      const res = subcasteGotraService.deleteCommunity(id);
      if (res.success) {
        toast.success(`Community "${name}" removed.`);
      } else {
        toast.error(res.error || 'Cannot delete referenced community');
      }
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: SUBCASTE
  // ---------------------------------------------------------------------------
  const handleOpenAddSubcaste = () => {
    setEditingSubcaste(null);
    resetSubcasteForm({
      name: '',
      communityId: communities[0]?.id || '',
      region: '',
      description: '',
      aliases: '',
      surnames: '',
      priorityWeight: 10,
      verificationStatus: 'VERIFIED',
      sourceReference: 'Gazetteer of Sindh / Amilan Jo Ahwal',
      active: true,
    });
    setSubcasteModalOpen(true);
  };

  const handleOpenEditSubcaste = (sub: SubcasteMaster) => {
    setEditingSubcaste(sub);
    resetSubcasteForm({
      name: sub.name,
      communityId: sub.communityId || '',
      region: sub.region,
      description: sub.description,
      aliases: (sub.aliases || []).join(', '),
      surnames: sub.surnames.join(', '),
      priorityWeight: sub.priorityWeight,
      verificationStatus: sub.verificationStatus,
      sourceReference: sub.sourceReference,
      active: sub.active,
    });
    setSubcasteModalOpen(true);
  };

  const handleSaveSubcaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubcasteForm()) {
      return;
    }

    const surnameList = subcasteForm.surnames
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const aliasList = subcasteForm.aliases
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const parentComm = communities.find((c) => c.id === subcasteForm.communityId);

    try {
      if (editingSubcaste) {
        subcasteGotraService.updateSubcaste(editingSubcaste.id, {
          name: subcasteForm.name.trim(),
          communityId: subcasteForm.communityId || undefined,
          communityName: parentComm?.name,
          region: subcasteForm.region.trim(),
          description: subcasteForm.description.trim(),
          aliases: aliasList,
          surnames: surnameList,
          priorityWeight: Number(subcasteForm.priorityWeight) || 10,
          verificationStatus: subcasteForm.verificationStatus,
          sourceReference: subcasteForm.sourceReference.trim(),
          active: subcasteForm.active,
        });
        toast.success(`Subcaste "${subcasteForm.name}" updated successfully.`);
      } else {
        subcasteGotraService.addSubcaste({
          name: subcasteForm.name.trim(),
          communityId: subcasteForm.communityId || undefined,
          communityName: parentComm?.name,
          region: subcasteForm.region.trim(),
          description: subcasteForm.description.trim(),
          aliases: aliasList,
          surnames: surnameList,
          priorityWeight: Number(subcasteForm.priorityWeight) || 10,
          verificationStatus: subcasteForm.verificationStatus,
          sourceReference: subcasteForm.sourceReference.trim(),
          active: subcasteForm.active,
        });
        toast.success(`Subcaste "${subcasteForm.name}" created successfully.`);
      }
      setSubcasteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleDeleteSubcaste = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Subcaste "${name}"?`)) {
      const res = subcasteGotraService.deleteSubcaste(id);
      if (res.success) {
        toast.success(`Subcaste "${name}" removed.`);
      } else {
        toast.error(res.error || 'Cannot delete referenced subcaste');
      }
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: GOTRA
  // ---------------------------------------------------------------------------
  const handleOpenAddGotra = () => {
    setEditingGotra(null);
    resetGotraForm({
      name: '',
      lineage: '',
      description: '',
      alternateSpellings: '',
      prohibitedSameGotra: true,
      confidence: 'HIGH',
      verificationStatus: 'VERIFIED',
      sourceReference: 'Vedic Genealogical Samhitas',
      active: true,
    });
    setGotraModalOpen(true);
  };

  const handleOpenEditGotra = (got: GotraMaster) => {
    setEditingGotra(got);
    resetGotraForm({
      name: got.name,
      lineage: got.lineage,
      description: got.description,
      alternateSpellings: got.alternateSpellings.join(', '),
      prohibitedSameGotra: got.prohibitedSameGotra,
      confidence: got.confidence,
      verificationStatus: got.verificationStatus,
      sourceReference: got.sourceReference,
      active: got.active,
    });
    setGotraModalOpen(true);
  };

  const handleSaveGotra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGotraForm()) {
      return;
    }

    const altList = gotraForm.alternateSpellings
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingGotra) {
        subcasteGotraService.updateGotra(editingGotra.id, {
          name: gotraForm.name.trim(),
          lineage: gotraForm.lineage.trim(),
          description: gotraForm.description.trim(),
          alternateSpellings: altList,
          prohibitedSameGotra: gotraForm.prohibitedSameGotra,
          confidence: gotraForm.confidence,
          verificationStatus: gotraForm.verificationStatus,
          sourceReference: gotraForm.sourceReference.trim(),
          active: gotraForm.active,
        });
        toast.success(`Gotra "${gotraForm.name}" updated successfully.`);
      } else {
        subcasteGotraService.addGotra({
          name: gotraForm.name.trim(),
          lineage: gotraForm.lineage.trim(),
          description: gotraForm.description.trim(),
          alternateSpellings: altList,
          prohibitedSameGotra: gotraForm.prohibitedSameGotra,
          confidence: gotraForm.confidence,
          verificationStatus: gotraForm.verificationStatus,
          sourceReference: gotraForm.sourceReference.trim(),
          active: gotraForm.active,
        });
        toast.success(`Gotra "${gotraForm.name}" created successfully.`);
      }
      setGotraModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleDeleteGotra = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Gotra "${name}"?`)) {
      const res = subcasteGotraService.deleteGotra(id);
      if (res.success) {
        toast.success(`Gotra "${name}" removed.`);
      } else {
        toast.error(res.error || 'Cannot delete referenced gotra');
      }
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: SURNAME
  // ---------------------------------------------------------------------------
  const handleOpenAddSurname = () => {
    setEditingSurname(null);
    resetSurnameForm({
      canonicalSurname: '',
      alternateSpellings: '',
      mappedSubcastes: [],
      mappedGotras: [],
      isAmbiguous: false,
      confidence: 'HIGH',
      verificationStatus: 'VERIFIED',
      sourceReference: 'All India Sindhi Directory / Community Census',
      active: true,
    });
    setSurnameModalOpen(true);
  };

  const handleOpenEditSurname = (sn: SurnameMaster) => {
    setEditingSurname(sn);
    resetSurnameForm({
      canonicalSurname: sn.canonicalSurname,
      alternateSpellings: sn.alternateSpellings.join(', '),
      mappedSubcastes: sn.mappedSubcasteNames || [],
      mappedGotras: sn.mappedGotraNames || [],
      isAmbiguous: sn.isAmbiguous,
      confidence: sn.confidence,
      verificationStatus: sn.verificationStatus,
      sourceReference: sn.sourceReference,
      active: sn.active,
    });
    setSurnameModalOpen(true);
  };

  const handleSaveSurname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSurnameForm()) {
      return;
    }

    const alts = surnameForm.alternateSpellings
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingSurname) {
        subcasteGotraService.updateSurname(editingSurname.id, {
          canonicalSurname: surnameForm.canonicalSurname.trim(),
          alternateSpellings: alts,
          mappedSubcasteNames: surnameForm.mappedSubcastes,
          mappedGotraNames: surnameForm.mappedGotras,
          isAmbiguous: surnameForm.isAmbiguous || surnameForm.mappedSubcastes.length > 1,
          confidence: surnameForm.confidence,
          verificationStatus: surnameForm.verificationStatus,
          sourceReference: surnameForm.sourceReference.trim(),
          active: surnameForm.active,
        });
        toast.success(`Surname "${surnameForm.canonicalSurname}" updated successfully.`);
      } else {
        subcasteGotraService.addSurname({
          canonicalSurname: surnameForm.canonicalSurname.trim(),
          alternateSpellings: alts,
          mappedSubcasteIds: [],
          mappedSubcasteNames: surnameForm.mappedSubcastes,
          mappedGotraIds: [],
          mappedGotraNames: surnameForm.mappedGotras,
          isAmbiguous: surnameForm.isAmbiguous || surnameForm.mappedSubcastes.length > 1,
          confidence: surnameForm.confidence,
          verificationStatus: surnameForm.verificationStatus,
          sourceReference: surnameForm.sourceReference.trim(),
          active: surnameForm.active,
        });
        toast.success(`Surname "${surnameForm.canonicalSurname}" registered.`);
      }
      setSurnameModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleDeleteSurname = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Surname "${name}"?`)) {
      subcasteGotraService.deleteSurname(id);
      toast.success(`Surname "${name}" removed.`);
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: MATCHING RULES
  // ---------------------------------------------------------------------------
  const handleToggleRule = (ruleId: string, currentEnabled: boolean) => {
    subcasteGotraService.updateCompatibilityRule(ruleId, { enabled: !currentEnabled });
    toast.success('Matrimonial compatibility rule status updated.');
  };

  const handleOpenAddRule = () => {
    setEditingRule(null);
    resetRuleForm({
      code: `RULE_CUSTOM_${Date.now()}`,
      name: '',
      description: '',
      severity: 'ADVISORY',
      explanationMessage: '',
      enabled: true,
    });
    setRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule: GotraCompatibilityRule) => {
    setEditingRule(rule);
    resetRuleForm({
      code: rule.code,
      name: rule.name,
      description: rule.description,
      severity: rule.severity,
      explanationMessage: rule.explanationMessage,
      enabled: rule.enabled,
    });
    setRuleModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRuleForm()) {
      return;
    }

    if (editingRule) {
      subcasteGotraService.updateCompatibilityRule(editingRule.id, {
        name: ruleForm.name.trim(),
        description: ruleForm.description.trim(),
        severity: ruleForm.severity,
        explanationMessage: ruleForm.explanationMessage.trim(),
        enabled: ruleForm.enabled,
      });
      toast.success(`Rule "${ruleForm.name}" updated.`);
    } else {
      subcasteGotraService.addCompatibilityRule({
        code: ruleForm.code.trim(),
        name: ruleForm.name.trim(),
        description: ruleForm.description.trim(),
        severity: ruleForm.severity,
        explanationMessage: ruleForm.explanationMessage.trim(),
        affectedCommunities: ['ALL'],
        exemptCommunities: [],
        enabled: ruleForm.enabled,
      });
      toast.success(`Rule "${ruleForm.name}" created.`);
    }
    setRuleModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: VERIFICATION WORKFLOW
  // ---------------------------------------------------------------------------
  const handleQuickVerify = (type: MasterEntityType, id: string, name: string) => {
    subcasteGotraService.verifyRecord(type, id, 'VERIFIED', 'Verified by Super Admin review');
    toast.success(`${type} record "${name}" verified.`);
  };

  const handleQuickDispute = (type: MasterEntityType, id: string, name: string) => {
    const reason = window.prompt(`Enter reason for disputing "${name}":`, 'Transliteration or community association disputed by lineage council');
    if (reason !== null) {
      subcasteGotraService.verifyRecord(type, id, 'DISPUTED', reason);
      toast.warning(`${type} record "${name}" marked as Disputed.`);
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: IMPORT / EXPORT
  // ---------------------------------------------------------------------------
  const handleExportCSV = (type: MasterEntityType) => {
    const csvData = subcasteGotraService.exportToCSV(type);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sindhi_matrimony_${type.toLowerCase()}_master.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${type} master database to CSV.`);
  };

  const handleProcessImport = () => {
    if (!rawCsvText.trim()) {
      toast.error('Please paste or upload CSV text before importing.');
      return;
    }

    const summary = subcasteGotraService.importFromCSV(rawCsvText, importEntityType);
    setImportSummary(summary);
    if (summary.inserted > 0 || summary.updated > 0) {
      toast.success(`Import completed: ${summary.inserted} added, ${summary.updated} updated.`);
    } else {
      toast.error('No valid records were imported. Check CSV format.');
    }
  };

  // ---------------------------------------------------------------------------
  // HANDLERS: MATCH SIMULATOR SANDBOX
  // ---------------------------------------------------------------------------
  const handleRunSandbox = () => {
    if (!sandboxForm.clientGotra.trim() || !sandboxForm.candidateGotra.trim()) {
      toast.error('Please enter both client and candidate Gotras for simulation');
      return;
    }

    const res = subcasteGotraService.checkMatchCompatibility(
      { subcaste: sandboxForm.clientSub, gotra: sandboxForm.clientGotra },
      { subcaste: sandboxForm.candidateSub, gotra: sandboxForm.candidateGotra }
    );
    setSandboxResult(res);
  };

  // ---------------------------------------------------------------------------
  // PAGINATION HELPER
  // ---------------------------------------------------------------------------
  const getPaginatedList = <T,>(items: T[]): { paginated: T[]; totalPages: number } => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const start = (currentPage - 1) * pageSize;
    return {
      paginated: items.slice(start, start + pageSize),
      totalPages,
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C81E28]" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Community, Caste, Subcaste & Gotra Master
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Comprehensive database of Sindhi communities, verified Vedic Gotra lineages, historical subcastes, surname transliterations, and matrimonial compatibility exogamy rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (window.confirm('Reset all databases to authentic verified Sindhi defaults? This will restore standard communities, subcastes, gotras, and surnames.')) {
                subcasteGotraService.resetToDefaults();
                toast.success('Database restored to default master standards.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset master data to default verified records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => setAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>

          {activeTab === 'communities' && (
            <CustomButton variant="primary" size="sm" onClick={handleOpenAddCommunity}>
              <Plus className="w-4 h-4 mr-1" />
              Add Community
            </CustomButton>
          )}

          {activeTab === 'subcastes' && (
            <CustomButton variant="primary" size="sm" onClick={handleOpenAddSubcaste}>
              <Plus className="w-4 h-4 mr-1" />
              Add Subcaste
            </CustomButton>
          )}

          {activeTab === 'gotras' && (
            <CustomButton variant="primary" size="sm" onClick={handleOpenAddGotra}>
              <Plus className="w-4 h-4 mr-1" />
              Add Vedic Gotra
            </CustomButton>
          )}

          {activeTab === 'surnames' && (
            <CustomButton variant="primary" size="sm" onClick={handleOpenAddSurname}>
              <Plus className="w-4 h-4 mr-1" />
              Add Surname
            </CustomButton>
          )}

          {activeTab === 'rules' && (
            <CustomButton variant="primary" size="sm" onClick={handleOpenAddRule}>
              <Plus className="w-4 h-4 mr-1" />
              New Match Rule
            </CustomButton>
          )}
        </div>
      </div>

      {/* 2. Overview Dynamic Metrics Cards (7 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Metric 1: Communities */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Communities</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#C81E28] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalCommunities}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sindhi & Allied</div>
        </div>

        {/* Metric 2: Subcastes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcastes</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalSubcastes}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Amil, Bhaiband...</div>
        </div>

        {/* Metric 3: Vedic Gotras */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vedic Gotras</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalGotras}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rishi Lineages</div>
        </div>

        {/* Metric 4: Surnames */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surnames</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{stats.totalSurnames}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">With Aliases</div>
        </div>

        {/* Metric 5: Active Records */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-green-600 mt-1">{stats.activeRecords}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">In Matching</div>
        </div>

        {/* Metric 6: Pending Verification */}
        <div
          onClick={() => setActiveTab('verification')}
          className={`bg-white rounded-2xl border p-3.5 shadow-xs cursor-pointer transition-all ${
            stats.pendingVerification > 0
              ? 'border-amber-300 ring-2 ring-amber-100 hover:border-amber-400'
              : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div
            className={`text-xl font-extrabold mt-1 ${
              stats.pendingVerification > 0 ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            {stats.pendingVerification}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Review Needed</div>
        </div>

        {/* Metric 7: Enabled Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rules</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-purple-600 mt-1">{stats.enabledRulesCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Exogamy & Weight</div>
        </div>
      </div>

      {/* 3. Navigation Tabs (7 tabs) */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2">
        {[
          { key: 'communities', label: 'Communities & Castes', icon: Layers, count: communities.length },
          { key: 'subcastes', label: 'Subcastes', icon: Users, count: subcastes.length },
          { key: 'gotras', label: 'Gotras & Lineages', icon: GitBranch, count: gotras.length },
          { key: 'surnames', label: 'Surname Mapping', icon: BookOpen, count: surnames.length },
          { key: 'rules', label: 'Matching Rules', icon: ShieldAlert, count: rules.length },
          { key: 'import_export', label: 'Import / Export', icon: Upload, count: null },
          { key: 'verification', label: 'Verification Queue', icon: AlertTriangle, count: verificationQueue.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ActiveTab)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#C81E28] text-[#C81E28]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-rose-100 text-[#C81E28]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Toolbar: Search & Dynamic Filters (Shown on list tabs) */}
      {['communities', 'subcastes', 'gotras', 'surnames'].includes(activeTab) && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-80">
            <CustomTextInput
              placeholder="Search by name, alias, region, or lineage..."
              value={filterValues.searchQuery}
              onChange={(e) => setFilterField('searchQuery', e.target.value)}
              size="sm"
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Status Filter */}
            <div className="w-44">
              <CustomDropDown
                value={filterValues.statusFilter}
                onChange={(val) => setFilterField('statusFilter', val as any)}
                options={[
                  { value: 'ALL', label: 'All Verification (Any)' },
                  { value: 'VERIFIED', label: 'Verified' },
                  { value: 'NEEDS_REVIEW', label: 'Needs Review' },
                  { value: 'DISPUTED', label: 'Disputed' },
                ]}
                size="sm"
              />
            </div>

            {/* Active Filter */}
            <div className="w-36">
              <CustomDropDown
                value={filterValues.activeFilter}
                onChange={(val) => setFilterField('activeFilter', val as any)}
                options={[
                  { value: 'ALL', label: 'All Status' },
                  { value: 'ACTIVE', label: 'Active Only' },
                  { value: 'INACTIVE', label: 'Inactive Only' },
                ]}
                size="sm"
              />
            </div>

            {/* Community Filter (Subcaste tab only) */}
            {activeTab === 'subcastes' && (
              <div className="w-48">
                <CustomDropDown
                  value={filterValues.selectedCommunityFilter}
                  onChange={(val) => setFilterField('selectedCommunityFilter', String(val))}
                  options={[
                    { value: 'ALL', label: 'All Parent Communities' },
                    ...communities.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  size="sm"
                />
              </div>
            )}

            {/* Quick CSV Export */}
            <button
              onClick={() => {
                const entityMap: Record<string, MasterEntityType> = {
                  communities: 'COMMUNITY',
                  subcastes: 'SUBCASTE',
                  gotras: 'GOTRA',
                  surnames: 'SURNAME',
                };
                handleExportCSV(entityMap[activeTab]);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer ml-auto md:ml-0"
              title="Export current tab to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT PANELS */}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: COMMUNITIES & CASTES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'communities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPaginatedList(filteredCommunities).paginated.map((comm) => {
              const subCount = subcastes.filter((s) => s.communityId === comm.id).length;
              return (
                <div
                  key={comm.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{comm.name}</h3>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              comm.active ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                            title={comm.active ? 'Active' : 'Inactive'}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                          {comm.category.replace('_', ' ')} • {comm.historicalRegion}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          comm.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : comm.verificationStatus === 'DISPUTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {comm.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {comm.description}
                    </p>

                    {/* Aliases */}
                    {comm.aliases && comm.aliases.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {comm.aliases.map((al, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md"
                          >
                            {al}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata Flags */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {subCount} Subcastes Linked
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          comm.hasGotraSystem
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {comm.hasGotraSystem ? 'Vedic Gotras Enforced' : 'Gotra Exempt / Custom'}
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-400 truncate" title={comm.sourceReference}>
                      Ref: {comm.sourceReference}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() =>
                        subcasteGotraService.updateCommunity(comm.id, { active: !comm.active })
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        comm.active
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {comm.active ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCommunity(comm)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Community"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommunity(comm.id, comm.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Community"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredCommunities.length > pageSize && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing {Math.min(filteredCommunities.length, (currentPage - 1) * pageSize + 1)} to{' '}
                {Math.min(filteredCommunities.length, currentPage * pageSize)} of {filteredCommunities.length} communities
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {getPaginatedList(filteredCommunities).totalPages}
                </span>
                <button
                  disabled={currentPage >= getPaginatedList(filteredCommunities).totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: SUBCASTES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'subcastes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPaginatedList(filteredSubcastes).paginated.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{sub.name}</h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sub.active ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                        {sub.communityName || 'Sindhi Community'} • {sub.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Weight: {sub.priorityWeight}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {sub.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>

                  {/* Surnames chips preview */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Sample Surnames ({sub.surnames.length})
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto scrollbar-none">
                      {sub.surnames.slice(0, 10).map((sn, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-rose-50 text-[#C81E28] border border-rose-100 font-medium px-2 py-0.5 rounded-md"
                        >
                          {sn}
                        </span>
                      ))}
                      {sub.surnames.length > 10 && (
                        <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                          +{sub.surnames.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 truncate" title={sub.sourceReference}>
                    Source: {sub.sourceReference}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      subcasteGotraService.updateSubcaste(sub.id, { active: !sub.active })
                    }
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      sub.active
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {sub.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditSubcaste(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Subcaste"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubcaste(sub.id, sub.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Subcaste"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subcastes Pagination */}
          {filteredSubcastes.length > pageSize && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing {Math.min(filteredSubcastes.length, (currentPage - 1) * pageSize + 1)} to{' '}
                {Math.min(filteredSubcastes.length, currentPage * pageSize)} of {filteredSubcastes.length} subcastes
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {getPaginatedList(filteredSubcastes).totalPages}
                </span>
                <button
                  disabled={currentPage >= getPaginatedList(filteredSubcastes).totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: GOTRAS & LINEAGES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'gotras' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPaginatedList(filteredGotras).paginated.map((got) => (
              <div
                key={got.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{got.name}</h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            got.active ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                        {got.lineage}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        got.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {got.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {got.description}
                  </p>

                  {/* Alternate Spellings */}
                  {got.alternateSpellings && got.alternateSpellings.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Alternate Spellings / Aliases
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {got.alternateSpellings.map((alt, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-medium px-2 py-0.5 rounded-md"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        got.prohibitedSameGotra
                          ? 'bg-rose-50 text-[#C81E28]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {got.prohibitedSameGotra ? 'Sagotra Exogamy Enforced' : 'Exogamy Advisory'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Confidence: {got.confidence}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 truncate" title={got.sourceReference}>
                    Source: {got.sourceReference}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      subcasteGotraService.updateGotra(got.id, { active: !got.active })
                    }
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      got.active
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {got.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditGotra(got)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Gotra"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGotra(got.id, got.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Gotra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gotras Pagination */}
          {filteredGotras.length > pageSize && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing {Math.min(filteredGotras.length, (currentPage - 1) * pageSize + 1)} to{' '}
                {Math.min(filteredGotras.length, currentPage * pageSize)} of {filteredGotras.length} Vedic Gotras
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {getPaginatedList(filteredGotras).totalPages}
                </span>
                <button
                  disabled={currentPage >= getPaginatedList(filteredGotras).totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: SURNAME MAPPING */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'surnames' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPaginatedList(filteredSurnames).paginated.map((sn) => (
              <div
                key={sn.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{sn.canonicalSurname}</h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sn.active ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                        Transliterations: {sn.alternateSpellings.join(', ') || 'Standard only'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sn.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {sn.verificationStatus}
                    </span>
                  </div>

                  {/* Subcastes mapped */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Mapped Subcastes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sn.mappedSubcasteNames.map((subName, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-semibold px-2 py-0.5 rounded-md"
                        >
                          {subName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gotras mapped */}
                  {sn.mappedGotraNames && sn.mappedGotraNames.length > 0 && (
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Associated Gotras
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sn.mappedGotraNames.map((gName, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 font-semibold px-2 py-0.5 rounded-md"
                          >
                            {gName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ambiguity Flag */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sn.isAmbiguous
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {sn.isAmbiguous ? 'Ambiguous (Multi-Community)' : 'Specific Lineage'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Conf: {sn.confidence}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 truncate" title={sn.sourceReference}>
                    Source: {sn.sourceReference}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      subcasteGotraService.updateSurname(sn.id, { active: !sn.active })
                    }
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      sn.active
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {sn.active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditSurname(sn)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Surname"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSurname(sn.id, sn.canonicalSurname)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Surname"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Surnames Pagination */}
          {filteredSurnames.length > pageSize && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing {Math.min(filteredSurnames.length, (currentPage - 1) * pageSize + 1)} to{' '}
                {Math.min(filteredSurnames.length, currentPage * pageSize)} of {filteredSurnames.length} Surnames
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {getPaginatedList(filteredSurnames).totalPages}
                </span>
                <button
                  disabled={currentPage >= getPaginatedList(filteredSurnames).totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: MATCHING RULES & COMPATIBILITY SANDBOX */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Rules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{rule.name}</h3>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            rule.severity === 'BLOCKING'
                              ? 'bg-rose-100 text-[#C81E28]'
                              : rule.severity === 'BOOST'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rule.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        Code: {rule.code}
                      </span>
                    </div>

                    {/* Enable Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule.id, rule.enabled)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C81E28]"></div>
                    </label>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">Explanation on match block:</span>
                    <span className="italic">"{rule.explanationMessage}"</span>
                  </div>

                  {rule.exemptCommunities && rule.exemptCommunities.length > 0 && (
                    <div className="mt-3 text-[10px] text-slate-500">
                      <span className="font-bold uppercase text-slate-400 block mb-1">Exempt Communities:</span>
                      <div className="flex flex-wrap gap-1">
                        {rule.exemptCommunities.map((id, idx) => {
                          const comm = communities.find((c) => c.id === id);
                          return (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                            >
                              {comm ? comm.name : id}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Status: <strong className={rule.enabled ? 'text-emerald-600' : 'text-slate-500'}>{rule.enabled ? 'Enabled in Engine' : 'Disabled'}</strong>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditRule(rule)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!['SAME_GOTRA_EXOGAMY', 'SUBCASTE_PREFERENCE'].includes(rule.code) && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete rule "${rule.name}"?`)) {
                            subcasteGotraService.deleteCompatibilityRule(rule.id);
                            toast.success(`Rule "${rule.name}" removed.`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Compatibility Sandbox Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#C81E28]" />
              <h3 className="font-bold text-slate-900 text-sm">Interactive Matrimonial Rule Simulator</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Test how current database rules and community exemptions evaluate matrimonial pairing compatibility in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile A */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Client Profile (Partner A)</span>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Subcaste</label>
                  <CustomDropDown
                    value={sandboxForm.clientSub}
                    onChange={(val) => setSandboxField('clientSub', String(val))}
                    placeholder="Select Subcaste..."
                    options={[
                      { value: '', label: 'Select Subcaste...' },
                      ...subcastes.map((s) => ({ value: s.name, label: s.name })),
                    ]}
                    size="sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gotra</label>
                  <CustomDropDown
                    value={sandboxForm.clientGotra}
                    onChange={(val) => setSandboxField('clientGotra', String(val))}
                    placeholder="Select Gotra..."
                    options={[
                      { value: '', label: 'Select Gotra...' },
                      ...gotras.map((g) => ({ value: g.name, label: `${g.name} (${g.lineage})` })),
                    ]}
                    size="sm"
                  />
                </div>
              </div>

              {/* Profile B */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Candidate Profile (Partner B)</span>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Subcaste</label>
                  <CustomDropDown
                    value={sandboxForm.candidateSub}
                    onChange={(val) => setSandboxField('candidateSub', String(val))}
                    placeholder="Select Subcaste..."
                    options={[
                      { value: '', label: 'Select Subcaste...' },
                      ...subcastes.map((s) => ({ value: s.name, label: s.name })),
                    ]}
                    size="sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gotra</label>
                  <CustomDropDown
                    value={sandboxForm.candidateGotra}
                    onChange={(val) => setSandboxField('candidateGotra', String(val))}
                    placeholder="Select Gotra..."
                    options={[
                      { value: '', label: 'Select Gotra...' },
                      ...gotras.map((g) => ({ value: g.name, label: `${g.name} (${g.lineage})` })),
                    ]}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleRunSandbox}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] text-white hover:bg-[#a81820] transition-colors cursor-pointer"
              >
                Run Rule Engine Simulation
              </button>

              {sandboxResult && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    sandboxResult.isCompatible
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {sandboxResult.isCompatible ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {sandboxResult.isCompatible
                      ? `Permitted (Score Modifier: ${sandboxResult.scoreModifier > 0 ? '+' : ''}${sandboxResult.scoreModifier} pts)`
                      : 'Blocked by Rule Policy'}
                  </span>
                </div>
              )}
            </div>

            {sandboxResult && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-800 block mb-1">Engine Evaluation Reasons:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {sandboxResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: IMPORT / EXPORT */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'import_export' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Bulk CSV Import & Export Management</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Import large collections of verified castes, subcastes, Vedic Gotras, or surnames with row-level validation and duplicate detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Section */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#C81E28]" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Export Master Data</h4>
              </div>
              <p className="text-xs text-slate-500">
                Download verified production master datasets in standard CSV format without sensitive client credentials.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExportCSV('COMMUNITY')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Communities CSV
                </button>
                <button
                  onClick={() => handleExportCSV('SUBCASTE')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Subcastes CSV
                </button>
                <button
                  onClick={() => handleExportCSV('GOTRA')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Gotras CSV
                </button>
                <button
                  onClick={() => handleExportCSV('SURNAME')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Surnames CSV
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#C81E28]" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bulk CSV Import</h4>
              </div>
              <p className="text-xs text-slate-500">
                Select target master entity and paste CSV rows with header row included. Existing records will be safely updated without duplicates.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Master</label>
                  <CustomDropDown
                    value={importEntityType}
                    onChange={(val) => setImportEntityType(val as MasterEntityType)}
                    options={[
                      { value: 'SUBCASTE', label: 'Subcastes Master' },
                      { value: 'GOTRA', label: 'Gotras Master' },
                      { value: 'SURNAME', label: 'Surnames Master' },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CSV Text Data</label>
                  <textarea
                    rows={5}
                    value={rawCsvText}
                    onChange={(e) => setRawCsvText(e.target.value)}
                    placeholder={`ID,Name,Region,Surnames\n1,Amil,Hyderabad,"Advani; Gidwani; Kripalani"\n2,Bhaiband,Karachi,"Mulchandani; Vaswani"`}
                    className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (importEntityType === 'SUBCASTE') {
                        setRawCsvText(`ID,Name,Community,Region,Surnames\n1,Amil,Sindhi Lohana,Hyderabad,"Advani; Gidwani; Kripalani"\n2,Bhaiband,Sindhi Lohana,Karachi,"Mulchandani; Vaswani"`);
                      } else if (importEntityType === 'GOTRA') {
                        setRawCsvText(`ID,Name,Lineage,AlternateSpellings\n1,Kashyap,Saptarishi Kashyapa,"Kashyapa; Kaashyap"\n2,Shandilya,Devala Seer Lineage,"Sandilya; Shandilya"`);
                      } else {
                        setRawCsvText(`ID,Surname,AlternateSpellings,MappedSubcastes\n1,Advani,Aadwani; Advanee,Amil\n2,Mulchandani,Moolchandani,Bhaiband; Sahiti`);
                      }
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Load Sample CSV
                  </button>

                  <button
                    onClick={handleProcessImport}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] text-white hover:bg-[#a81820] transition-colors cursor-pointer"
                  >
                    Process CSV Import
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Import Summary Report */}
          {importSummary && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Import Processing Report</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Total Rows</span>
                  <span className="font-bold text-slate-800">{importSummary.totalRows}</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 block text-[10px]">Inserted</span>
                  <span className="font-bold text-emerald-800">{importSummary.inserted}</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-blue-700 block text-[10px]">Updated</span>
                  <span className="font-bold text-blue-800">{importSummary.updated}</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="text-rose-700 block text-[10px]">Skipped</span>
                  <span className="font-bold text-rose-800">{importSummary.skipped}</span>
                </div>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="mt-2 text-[11px] text-rose-700 space-y-1">
                  <span className="font-bold">Errors encountered:</span>
                  {importSummary.errors.map((err, i) => (
                    <p key={i} className="font-mono">{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 7: DATA VERIFICATION QUEUE */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Data Verification & Review Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Records imported or flagged as <span className="font-bold text-amber-700">Needs Review</span> or <span className="font-bold text-rose-700">Disputed</span> pending administrative ethnographical approval.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {verificationQueue.length} Pending Actions
              </span>
            </div>

            {verificationQueue.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="font-bold text-slate-700 text-sm">All Master Records Verified</p>
                <p className="text-xs mt-1">No items currently require ethnographical verification review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Entity Type</th>
                      <th className="py-2.5 px-3">Name / Title</th>
                      <th className="py-2.5 px-3">Verification Status</th>
                      <th className="py-2.5 px-3">Source / Review Notes</th>
                      <th className="py-2.5 px-3">Last Modified</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {verificationQueue.map((item) => (
                      <tr key={`${item.type}_${item.id}`} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.status === 'DISPUTED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={item.notes || item.source}>
                          {item.notes || item.source || 'Pending administrative review'}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{item.updatedAt}</td>
                        <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleQuickVerify(item.type, item.id, item.name)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleQuickDispute(item.type, item.id, item.name)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                          >
                            Dispute
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 6. MODALS: ADD / EDIT DIALOGS */}
      {/* --------------------------------------------------------------------- */}

      {/* Modal 1: Community */}
      {communityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingCommunity ? `Edit Community: ${editingCommunity.name}` : 'Register New Community'}
              </h3>
              <button
                onClick={() => setCommunityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCommunity} className="space-y-3.5">
              <CustomTextInput
                label="Community Name *"
                required
                value={communityForm.name}
                onChange={(e) => setCommunityField('name', e.target.value)}
                error={communityTouched.name ? communityErrors.name : undefined}
                placeholder="e.g. Sindhi Lohana"
                size="sm"
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Category
                </label>
                <CustomDropDown
                  value={communityForm.category}
                  onChange={(val) => setCommunityField('category', val as any)}
                  options={[
                    { value: 'CASTE_COMMUNITY', label: 'Caste / Community' },
                    { value: 'RELIGIOUS_SOCIAL', label: 'Religious / Social Group' },
                    { value: 'REGIONAL_GROUP', label: 'Regional Group' },
                  ]}
                  size="sm"
                />
              </div>

              <CustomTextInput
                label="Historical Region"
                value={communityForm.historicalRegion}
                onChange={(e) => setCommunityField('historicalRegion', e.target.value)}
                placeholder="e.g. Central Sindh, Kutch, Global Diaspora"
                size="sm"
              />

              <CustomTextInput
                label="Aliases (comma separated)"
                value={communityForm.aliases}
                onChange={(e) => setCommunityField('aliases', e.target.value)}
                placeholder="e.g. Luwana, Luv Vanshi"
                size="sm"
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Description & Ethnography
                </label>
                <textarea
                  rows={2}
                  value={communityForm.description}
                  onChange={(e) => setCommunityField('description', e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <CustomTextInput
                label="Source Reference"
                value={communityForm.sourceReference}
                onChange={(e) => setCommunityField('sourceReference', e.target.value)}
                placeholder="e.g. Sindh Gazetteer 1907 / Anthropological Survey of India"
                size="sm"
              />

              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={communityForm.hasGotraSystem}
                    onChange={(e) => setCommunityField('hasGotraSystem', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Follows Vedic Gotra System (Enforce Gotra Rules)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={communityForm.active}
                    onChange={(e) => setCommunityField('active', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Active in Matching Engine</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCommunityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <CustomButton variant="primary" size="md">
                  {editingCommunity ? 'Save Changes' : 'Create Community'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Subcaste */}
      {subcasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSubcaste ? `Edit Subcaste: ${editingSubcaste.name}` : 'Create Subcaste Master'}
              </h3>
              <button
                onClick={() => setSubcasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcaste} className="space-y-3.5">
              <CustomTextInput
                label="Subcaste Name *"
                required
                value={subcasteForm.name}
                onChange={(e) => setSubcasteField('name', e.target.value)}
                error={subcasteTouched.name ? subcasteErrors.name : undefined}
                placeholder="e.g. Amil"
                size="sm"
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Parent Community
                </label>
                <CustomDropDown
                  value={subcasteForm.communityId}
                  onChange={(val) => setSubcasteField('communityId', String(val))}
                  options={[
                    { value: '', label: 'None / Independent' },
                    ...communities.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomTextInput
                  label="Region Origin"
                  value={subcasteForm.region}
                  onChange={(e) => setSubcasteField('region', e.target.value)}
                  placeholder="e.g. Hyderabad / Central Sindh"
                  size="sm"
                />
                <CustomTextInput
                  label="Priority Weight (0-20)"
                  type="number"
                  min="0"
                  max="20"
                  value={subcasteForm.priorityWeight}
                  onChange={(e) => setSubcasteField('priorityWeight', Number(e.target.value))}
                  size="sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Surnames (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={subcasteForm.surnames}
                  onChange={(e) => setSubcasteField('surnames', e.target.value)}
                  placeholder="Advani, Gidwani, Kripalani, Mansukhani, Thadhani"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>

              <CustomTextInput
                label="Source Reference"
                value={subcasteForm.sourceReference}
                onChange={(e) => setSubcasteField('sourceReference', e.target.value)}
                placeholder="e.g. Amilan Jo Ahwal (1919)"
                size="sm"
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="subActiveCheck"
                  checked={subcasteForm.active}
                  onChange={(e) => setSubcasteField('active', e.target.checked)}
                  className="rounded text-[#C81E28]"
                />
                <label htmlFor="subActiveCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Active in Matching Engine
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubcasteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <CustomButton variant="primary" size="md">
                  {editingSubcaste ? 'Save Changes' : 'Create Subcaste'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Gotra */}
      {gotraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingGotra ? `Edit Gotra: ${editingGotra.name}` : 'Register Vedic Gotra Master'}
              </h3>
              <button
                onClick={() => setGotraModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGotra} className="space-y-3.5">
              <CustomTextInput
                label="Gotra Name *"
                required
                value={gotraForm.name}
                onChange={(e) => setGotraField('name', e.target.value)}
                error={gotraTouched.name ? gotraErrors.name : undefined}
                placeholder="e.g. Shandilya"
                size="sm"
              />

              <CustomTextInput
                label="Root Seer / Lineage *"
                required
                value={gotraForm.lineage}
                onChange={(e) => setGotraField('lineage', e.target.value)}
                error={gotraTouched.lineage ? gotraErrors.lineage : undefined}
                placeholder="e.g. Saptarishi Kashyapa / Devala Lineage"
                size="sm"
              />

              <CustomTextInput
                label="Alternate Spellings (comma-separated)"
                value={gotraForm.alternateSpellings}
                onChange={(e) => setGotraField('alternateSpellings', e.target.value)}
                placeholder="e.g. Sandilya, Shandilya, Shandil"
                size="sm"
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Description & Genealogical Notes
                </label>
                <textarea
                  rows={2}
                  value={gotraForm.description}
                  onChange={(e) => setGotraField('description', e.target.value)}
                  placeholder="Historical and Vedic lineage notes"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <CustomTextInput
                label="Source Reference"
                value={gotraForm.sourceReference}
                onChange={(e) => setGotraField('sourceReference', e.target.value)}
                placeholder="e.g. Rigvedic Gotra-Pravara Nibandha"
                size="sm"
              />

              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gotraForm.prohibitedSameGotra}
                    onChange={(e) => setGotraField('prohibitedSameGotra', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Enforce Strict Sagotra Exogamy (Block Same-Gotra Matches)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gotraForm.active}
                    onChange={(e) => setGotraField('active', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Active in Matching Engine</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGotraModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <CustomButton variant="primary" size="md">
                  {editingGotra ? 'Save Changes' : 'Create Gotra'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Surname */}
      {surnameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSurname ? `Edit Surname: ${editingSurname.canonicalSurname}` : 'Add Surname Mapping'}
              </h3>
              <button
                onClick={() => setSurnameModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSurname} className="space-y-3.5">
              <CustomTextInput
                label="Canonical Surname *"
                required
                value={surnameForm.canonicalSurname}
                onChange={(e) => setSurnameField('canonicalSurname', e.target.value)}
                error={surnameTouched.canonicalSurname ? surnameErrors.canonicalSurname : undefined}
                placeholder="e.g. Advani"
                size="sm"
              />

              <CustomTextInput
                label="Alternate Spellings & Transliterations (comma-separated)"
                value={surnameForm.alternateSpellings}
                onChange={(e) => setSurnameField('alternateSpellings', e.target.value)}
                placeholder="e.g. Aadwani, Advanee"
                size="sm"
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Mapped Subcastes (multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-28 overflow-y-auto">
                  {subcastes.map((s) => {
                    const isSelected = surnameForm.mappedSubcastes.includes(s.name);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          const updated = isSelected
                            ? surnameForm.mappedSubcastes.filter((x) => x !== s.name)
                            : [...surnameForm.mappedSubcastes, s.name];
                          setSurnameField('mappedSubcastes', updated);
                          setSurnameField('isAmbiguous', updated.length > 1);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#C81E28] text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Associated Gotras (multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-28 overflow-y-auto">
                  {gotras.map((g) => {
                    const isSelected = surnameForm.mappedGotras.includes(g.name);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => {
                          const updated = isSelected
                            ? surnameForm.mappedGotras.filter((x) => x !== g.name)
                            : [...surnameForm.mappedGotras, g.name];
                          setSurnameField('mappedGotras', updated);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={surnameForm.isAmbiguous}
                    onChange={(e) => setSurnameField('isAmbiguous', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Mark as Ambiguous (Shared by multiple communities / subcastes)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={surnameForm.active}
                    onChange={(e) => setSurnameField('active', e.target.checked)}
                    className="rounded text-[#C81E28]"
                  />
                  <span>Active in Matching Engine</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSurnameModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <CustomButton variant="primary" size="md">
                  {editingSurname ? 'Save Changes' : 'Create Surname'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Rule */}
      {ruleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingRule ? `Edit Rule: ${editingRule.name}` : 'Configure Matchmaking Rule'}
              </h3>
              <button
                onClick={() => setRuleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3.5">
              <CustomTextInput
                label="Rule Name *"
                type="text"
                required
                value={ruleForm.name}
                onChange={(e) => setRuleField('name', e.target.value)}
                error={ruleTouched.name ? ruleErrors.name : undefined}
                placeholder="e.g. Strict Same-Gotra Exogamy"
                size="sm"
              />

              <CustomDropDown
                label="Severity"
                value={ruleForm.severity}
                onChange={(val) => setRuleField('severity', val as RuleSeverity)}
                size="sm"
                options={[
                  { label: 'BLOCKING (Blocks Match recommendation)', value: 'BLOCKING' },
                  { label: 'ADVISORY (Deducts score but permits review)', value: 'ADVISORY' },
                  { label: 'BOOST (Adds bonus compatibility points)', value: 'BOOST' },
                ]}
              />

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={ruleForm.description}
                  onChange={(e) => setRuleField('description', e.target.value)}
                  placeholder="Explanation of the matrimonial rationale"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <CustomTextInput
                label="Explanation Message shown to Admin"
                type="text"
                value={ruleForm.explanationMessage}
                onChange={(e) => setRuleField('explanationMessage', e.target.value)}
                placeholder="e.g. Match blocked: Both candidate and client share the same Gotra."
                size="sm"
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ruleActiveCheck"
                  checked={ruleForm.enabled}
                  onChange={(e) => setRuleField('enabled', e.target.checked)}
                  className="rounded text-[#C81E28]"
                />
                <label htmlFor="ruleActiveCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Rule Enabled in Matching Engine
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <CustomButton variant="primary" size="md">
                  {editingRule ? 'Save Changes' : 'Create Rule'}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Audit Log Drawer */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Administrative Audit Trail</h3>
                <p className="text-xs text-slate-500">Record of changes across community, subcaste, gotra, and surname masters.</p>
              </div>
              <button
                onClick={() => setAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {auditLogs.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">No audit entries yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                          {log.entityType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            log.action === 'CREATE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'DELETE'
                              ? 'bg-rose-100 text-rose-800'
                              : log.action === 'RESET'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700">{log.performedBy}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
