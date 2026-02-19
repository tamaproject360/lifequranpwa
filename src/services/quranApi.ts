import { SurahDetail, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

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

const cache = new Map<string, SurahDetail>();

export async function fetchSurahWithTranslation(surahNumber: number): Promise<SurahDetail> {
  const cacheKey = `surah_${surahNumber}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

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

  cache.set(cacheKey, result);
  return result;
}

export async function fetchJuzSurahs(juzNumber: number): Promise<{ surahNumber: number; ayahStart: number; ayahEnd: number }[]> {
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

  return Array.from(surahMap.entries()).map(([surahNum, range]) => ({
    surahNumber: surahNum,
    ayahStart: range.start,
    ayahEnd: range.end,
  }));
}
