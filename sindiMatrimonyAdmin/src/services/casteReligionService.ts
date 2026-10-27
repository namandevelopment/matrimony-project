// =========================================================================
// SINDHI MATRIMONY — RELIGION & CASTE/COMMUNITY MASTER SERVICE
// Managed dynamically by Super Admin from Settings -> Admin Config
// =========================================================================

export interface ReligionMaster {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CasteMaster {
  id: string;
  name: string;
  code: string;
  religionId: string;
  religionName: string;
  description?: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_RELIGIONS = 'sm_admin_religions_v1';
const STORAGE_KEY_CASTES = 'sm_admin_castes_v1';

export const INITIAL_RELIGIONS: ReligionMaster[] = [
  {
    id: 'rel_1',
    name: 'Hindu',
    code: 'HINDU',
    description: 'Sanatan Vedic Hindu tradition including Sindhi Sanatani practices.',
    active: true,
    displayOrder: 1,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
  {
    id: 'rel_2',
    name: 'Sikh',
    code: 'SIKH',
    description: 'Sikh traditions and Sindhi Nanakpanthi/Sahajdhari followers of Guru Granth Sahib.',
    active: true,
    displayOrder: 2,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
  {
    id: 'rel_3',
    name: 'Jain',
    code: 'JAIN',
    description: 'Jain traditions (Digambar and Shwetambar).',
    active: true,
    displayOrder: 3,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
  {
    id: 'rel_4',
    name: 'Buddhist',
    code: 'BUDDHIST',
    description: 'Buddhist philosophy and tradition.',
    active: true,
    displayOrder: 4,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
  {
    id: 'rel_5',
    name: 'Christian',
    code: 'CHRISTIAN',
    description: 'Christian faith communities.',
    active: true,
    displayOrder: 5,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
  {
    id: 'rel_6',
    name: 'Other',
    code: 'OTHER',
    description: 'Other cultural or spiritual beliefs.',
    active: true,
    displayOrder: 6,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-13',
  },
];

export const INITIAL_CASTES: CasteMaster[] = [
  { id: 'caste_bhaiband', name: 'Sindhi - Bhaiband', code: 'SINDHI_BHAIBAND', religionId: 'rel_1', religionName: 'Hindu', description: 'Renowned international merchant and trade community.', active: true, displayOrder: 1, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_amil', name: 'Sindhi - Amil', code: 'SINDHI_AMIL', religionId: 'rel_1', religionName: 'Hindu', description: 'Scholarly, administrative and executive community.', active: true, displayOrder: 2, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_lohana', name: 'Sindhi - Lohana', code: 'SINDHI_LOHANA', religionId: 'rel_1', religionName: 'Hindu', description: 'Ancient mercantile and business clan.', active: true, displayOrder: 3, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_sahiti', name: 'Sindhi - Sahiti', code: 'SINDHI_SAHITI', religionId: 'rel_1', religionName: 'Hindu', description: 'Families originating from fertile Sahiti pargana.', active: true, displayOrder: 4, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_larkana', name: 'Sindhi - Larkana', code: 'SINDHI_LARKANA', religionId: 'rel_1', religionName: 'Hindu', description: 'Families hailing from Larkana and northern Sindh.', active: true, displayOrder: 5, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_sakhar', name: 'Sindhi - Sakhar', code: 'SINDHI_SAKHAR', religionId: 'rel_1', religionName: 'Hindu', description: 'Families hailing from Sukkur and Rohri.', active: true, displayOrder: 6, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_dadu', name: 'Sindhi - Dadu', code: 'SINDHI_DADU', religionId: 'rel_1', religionName: 'Hindu', description: 'Families originating from Dadu, Sehwan and Kotri belt.', active: true, displayOrder: 7, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_shikarpuri', name: 'Sindhi - Shikarpuri', code: 'SINDHI_SHIKARPURI', religionId: 'rel_1', religionName: 'Hindu', description: 'Commercial finance and merchant hub families.', active: true, displayOrder: 8, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_thari', name: 'Sindhi - Thari', code: 'SINDHI_THARI', religionId: 'rel_1', religionName: 'Hindu', description: 'Heritage from Thar desert and Mirpurkhas belt.', active: true, displayOrder: 9, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_sehwani', name: 'Sindhi - Sehwani', code: 'SINDHI_SEHWANI', religionId: 'rel_1', religionName: 'Hindu', description: 'Lineage from ancient spiritual city of Sehwan.', active: true, displayOrder: 10, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_hyderabadi', name: 'Sindhi - Hyderabadi', code: 'SINDHI_HYDERABADI', religionId: 'rel_1', religionName: 'Hindu', description: 'Families from historic capital city Hyderabad (Sindh).', active: true, displayOrder: 11, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_bhatia', name: 'Sindhi - Bhatia', code: 'SINDHI_BHATIA', religionId: 'rel_1', religionName: 'Hindu', description: 'Maritime and international trading community.', active: true, displayOrder: 12, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_brahmins', name: 'Sindhi - Brahmins (Pokharna, Saraswat)', code: 'SINDHI_BRAHMINS', religionId: 'rel_1', religionName: 'Hindu', description: 'Pushkarna and Saraswat custodians of Vedic rituals.', active: true, displayOrder: 13, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_chhapru', name: 'Sindhi - Chhapru', code: 'SINDHI_CHHAPRU', religionId: 'rel_1', religionName: 'Hindu', description: 'Lineage from Kohistan and Chhapru regions.', active: true, displayOrder: 14, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_others', name: 'Sindhi - Others', code: 'SINDHI_OTHERS', religionId: 'rel_1', religionName: 'Hindu', description: 'Other Sindhi allied families.', active: true, displayOrder: 15, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
  { id: 'caste_no_bar', name: 'Caste No Bar', code: 'CASTE_NO_BAR', religionId: 'rel_1', religionName: 'Hindu', description: 'Open to all Sindhi and Sanatan communities.', active: true, displayOrder: 16, createdAt: '2026-01-01', updatedAt: '2026-10-13' },
];

class CasteReligionService {
  private religions: ReligionMaster[] = [];
  private castes: CasteMaster[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    if (typeof window === 'undefined') {
      this.religions = [...INITIAL_RELIGIONS];
      this.castes = [...INITIAL_CASTES];
      return;
    }

    try {
      const storedReligions = localStorage.getItem(STORAGE_KEY_RELIGIONS);
      if (storedReligions) {
        this.religions = JSON.parse(storedReligions);
      } else {
        this.religions = [...INITIAL_RELIGIONS];
        this.saveReligions();
      }
    } catch {
      this.religions = [...INITIAL_RELIGIONS];
    }

    try {
      const storedCastes = localStorage.getItem(STORAGE_KEY_CASTES);
      if (storedCastes) {
        this.castes = JSON.parse(storedCastes);
        if (!this.castes.some((c) => c.name.toLowerCase() === 'sindhi')) {
          this.castes.unshift(INITIAL_CASTES[0]);
          this.saveCastes();
        }
      } else {
        this.castes = [...INITIAL_CASTES];
        this.saveCastes();
      }
    } catch {
      this.castes = [...INITIAL_CASTES];
    }
  }

  private saveReligions(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_RELIGIONS, JSON.stringify(this.religions));
      } catch (err) {
        console.error('Failed to save religions to localStorage', err);
      }
    }
    this.notify();
  }

  private saveCastes(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_CASTES, JSON.stringify(this.castes));
      } catch (err) {
        console.error('Failed to save castes to localStorage', err);
      }
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in casteReligionService listener', err);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ==========================================
  // RELIGIONS CRUD
  // ==========================================

  public getReligions(): ReligionMaster[] {
    return [...this.religions].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getActiveReligions(): ReligionMaster[] {
    return this.getReligions().filter((r) => r.active);
  }

  public getReligionById(id: string): ReligionMaster | undefined {
    return this.religions.find((r) => r.id === id);
  }

  public addReligion(data: { name: string; description?: string; active?: boolean }): ReligionMaster {
    const trimmedName = data.name.trim();
    const id = `rel_${Date.now()}`;
    const code = trimmedName.toUpperCase().replace(/\s+/g, '_');
    const newReligion: ReligionMaster = {
      id,
      name: trimmedName,
      code,
      description: data.description?.trim() || '',
      active: data.active !== undefined ? data.active : true,
      displayOrder: this.religions.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    this.religions.push(newReligion);
    this.saveReligions();
    return newReligion;
  }

  public updateReligion(id: string, updates: Partial<Omit<ReligionMaster, 'id' | 'createdAt'>>): boolean {
    const index = this.religions.findIndex((r) => r.id === id);
    if (index === -1) return false;

    const old = this.religions[index];
    const updated: ReligionMaster = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (updates.name && updates.name !== old.name) {
      updated.code = updates.name.trim().toUpperCase().replace(/\s+/g, '_');
      // Also update linked castes' religionName
      this.castes = this.castes.map((c) =>
        c.religionId === id ? { ...c, religionName: updates.name!.trim(), updatedAt: updated.updatedAt } : c
      );
      this.saveCastes();
    }

    this.religions[index] = updated;
    this.saveReligions();
    return true;
  }

  public toggleReligionStatus(id: string): boolean {
    const rel = this.religions.find((r) => r.id === id);
    if (!rel) return false;
    return this.updateReligion(id, { active: !rel.active });
  }

  public deleteReligion(id: string): { success: boolean; error?: string } {
    // Check if any caste is associated
    const associatedCastes = this.castes.filter((c) => c.religionId === id);
    if (associatedCastes.length > 0) {
      return {
        success: false,
        error: `Cannot delete religion. ${associatedCastes.length} caste(s) are currently associated with it. Please reassign or delete them first.`,
      };
    }

    const initialLength = this.religions.length;
    this.religions = this.religions.filter((r) => r.id !== id);
    if (this.religions.length < initialLength) {
      this.saveReligions();
      return { success: true };
    }
    return { success: false, error: 'Religion not found.' };
  }

  // ==========================================
  // CASTES CRUD
  // ==========================================

  public getCastes(religionId?: string): CasteMaster[] {
    let list = [...this.castes].sort((a, b) => a.displayOrder - b.displayOrder);
    if (religionId && religionId !== 'ALL') {
      list = list.filter((c) => c.religionId === religionId);
    }
    return list;
  }

  public getActiveCastes(religionId?: string): CasteMaster[] {
    return this.getCastes(religionId).filter((c) => c.active);
  }

  public getCasteById(id: string): CasteMaster | undefined {
    return this.castes.find((c) => c.id === id);
  }

  public addCaste(data: {
    name: string;
    religionId: string;
    description?: string;
    active?: boolean;
  }): CasteMaster {
    const trimmedName = data.name.trim();
    const id = `caste_${Date.now()}`;
    const code = trimmedName.toUpperCase().replace(/\s+/g, '_');
    const religion = this.getReligionById(data.religionId);

    const newCaste: CasteMaster = {
      id,
      name: trimmedName,
      code,
      religionId: data.religionId,
      religionName: religion ? religion.name : 'Hindu',
      description: data.description?.trim() || '',
      active: data.active !== undefined ? data.active : true,
      displayOrder: this.castes.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    this.castes.push(newCaste);
    this.saveCastes();
    return newCaste;
  }

  public updateCaste(id: string, updates: Partial<Omit<CasteMaster, 'id' | 'createdAt'>>): boolean {
    const index = this.castes.findIndex((c) => c.id === id);
    if (index === -1) return false;

    const old = this.castes[index];
    let updatedReligionName = old.religionName;
    if (updates.religionId && updates.religionId !== old.religionId) {
      const rel = this.getReligionById(updates.religionId);
      if (rel) updatedReligionName = rel.name;
    }

    const updated: CasteMaster = {
      ...old,
      ...updates,
      religionName: updatedReligionName,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (updates.name && updates.name !== old.name) {
      updated.code = updates.name.trim().toUpperCase().replace(/\s+/g, '_');
    }

    this.castes[index] = updated;
    this.saveCastes();
    return true;
  }

  public toggleCasteStatus(id: string): boolean {
    const caste = this.castes.find((c) => c.id === id);
    if (!caste) return false;
    return this.updateCaste(id, { active: !caste.active });
  }

  public deleteCaste(id: string): boolean {
    const initialLength = this.castes.length;
    this.castes = this.castes.filter((c) => c.id !== id);
    if (this.castes.length < initialLength) {
      this.saveCastes();
      return true;
    }
    return false;
  }

  public resetToDefaults(): void {
    this.religions = [...INITIAL_RELIGIONS];
    this.castes = [...INITIAL_CASTES];
    this.saveReligions();
    this.saveCastes();
  }
}

export const casteReligionService = new CasteReligionService();
