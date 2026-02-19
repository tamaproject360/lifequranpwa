import { SurahDetail, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';
const CACHE_PREFIX = 'lifequran_surahcache_v1_';

interface ApiAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: ApiAyah[];
}

// Memory cache untuk session yang sedang berjalan
const memCache = new Map<string, SurahDetail>();

function loadSurahFromStorage(surahNumber: number): SurahDetail | null {
  try {
    const stored = localStorage.getItem(`${CACHE_PREFIX}surah_${surahNumber}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveSurahToStorage(surahNumber: number, data: SurahDetail): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}surah_${surahNumber}`, JSON.stringify(data));
  } catch {
    // localStorage penuh - coba hapus entry lama
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
      if (keys.length > 0) {
        localStorage.removeItem(keys[0]);
        localStorage.setItem(`${CACHE_PREFIX}surah_${surahNumber}`, JSON.stringify(data));
      }
    } catch { /* ignore */ }
  }
}

export async function fetchSurahWithTranslation(surahNumber: number): Promise<SurahDetail> {
  const memKey = `surah_${surahNumber}`;

  // 1. Memory cache dulu (paling cepat)
  if (memCache.has(memKey)) {
    return memCache.get(memKey)!;
  }

  // 2. localStorage cache (offline fallback)
  const localData = loadSurahFromStorage(surahNumber);
  if (localData) {
    memCache.set(memKey, localData);
    return localData;
  }

  // 3. Fetch dari network
  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${BASE_URL}/surah/${surahNumber}`),
      fetch(`${BASE_URL}/surah/${surahNumber}/id.indonesian`),
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error('Failed to fetch surah data');
    }

    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();

    const arabicSurah: ApiSurah = arabicData.data;
    const translationSurah: ApiSurah = translationData.data;

    const ayahs: Ayah[] = arabicSurah.ayahs.map((ayah, index) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translationSurah.ayahs[index]?.text || '',
      juz: ayah.juz,
      page: ayah.page,
      hizbQuarter: ayah.hizbQuarter,
      sajda: ayah.sajda,
    }));

    const result: SurahDetail = {
      number: arabicSurah.number,
      name: arabicSurah.name,
      englishName: arabicSurah.englishName,
      englishNameTranslation: arabicSurah.englishNameTranslation,
      numberOfAyahs: arabicSurah.numberOfAyahs,
      revelationType: arabicSurah.revelationType,
      ayahs,
    };

    // Simpan ke kedua cache
    memCache.set(memKey, result);
    saveSurahToStorage(surahNumber, result);

    return result;
  } catch (error) {
    // Jika offline dan tidak ada cache
    throw new Error(
      `Tidak ada koneksi internet. Buka surah ini saat online terlebih dahulu agar tersimpan offline.`
    );
  }
}

export async function fetchJuzSurahs(juzNumber: number): Promise<{ surahNumber: number; ayahStart: number; ayahEnd: number }[]> {
  const storageKey = `${CACHE_PREFIX}juz_${juzNumber}`;

  // Cek localStorage dulu
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }

  // Fetch dari network
  const res = await fetch(`${BASE_URL}/juz/${juzNumber}/quran-uthmani`);
  if (!res.ok) throw new Error('Failed to fetch juz data');
  const data = await res.json();

  const surahMap = new Map<number, { start: number; end: number }>();
  data.data.ayahs.forEach((ayah: { surah: { number: number }; numberInSurah: number }) => {
    const surahNum = ayah.surah.number;
    const existing = surahMap.get(surahNum);
    if (!existing) {
      surahMap.set(surahNum, { start: ayah.numberInSurah, end: ayah.numberInSurah });
    } else {
      surahMap.set(surahNum, { start: existing.start, end: ayah.numberInSurah });
    }
  });

  const result = Array.from(surahMap.entries()).map(([surahNum, range]) => ({
    surahNumber: surahNum,
    ayahStart: range.start,
    ayahEnd: range.end,
  }));

  try {
    localStorage.setItem(storageKey, JSON.stringify(result));
  } catch { /* ignore */ }

  return result;
}

/** Cek apakah surah sudah tersimpan di cache (siap offline) */
export function isSurahCached(surahNumber: number): boolean {
  return memCache.has(`surah_${surahNumber}`) || loadSurahFromStorage(surahNumber) !== null;
}

/** Hapus cache surah tertentu */
export function clearSurahCache(surahNumber?: number): void {
  if (surahNumber !== undefined) {
    memCache.delete(`surah_${surahNumber}`);
    localStorage.removeItem(`${CACHE_PREFIX}surah_${surahNumber}`);
  } else {
    memCache.clear();
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
}
