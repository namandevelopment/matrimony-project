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

export const INITIAL_RELIGIONS: ReligionMaster[] = [];

export const INITIAL_CASTES: CasteMaster[] = [];

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
