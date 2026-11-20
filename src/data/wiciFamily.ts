export interface Person {
  id: string;
  first: string;
  last: string;
  maidenName?: string;
  birth?: string;
  death?: string;
  location?: string;
  occupation?: string;
  parents: string[];
  spouses?: string[];
  photo?: string;
  notes?: string;
}

export interface TreeSettings {
  familyName: string;
  subtitle: string;
  motto: string;
  orientation: 'vertical' | 'horizontal';
  cardStyle: 'editorial' | 'minimal' | 'medallion';
  edgeStyle: 'bezier' | 'orthogonal';
  palette: 'ivory-bronze' | 'porcelain-cypress' | 'alabaster-slate';
  showGenerations: boolean;
  showSpouses: boolean;
  showDates: boolean;
  showInitialsAvatar: boolean;
  showMinimap: boolean;
  compactSpacing: boolean;
}

export const ROOT_FOUNDER_ID = 'guillaume';

export const MAIN_BRANCH_IDS = [
  'serge',
  'genevieve',
  'jean-claude',
  'raymond',
  'pierre',
  'colette',
  'claude',
  'michel',
  'denise',
  'jacqueline',
] as const;

export const DEFAULT_SETTINGS: TreeSettings = {
  familyName: 'L’Arbre de Denise',
  subtitle: 'Famille Tronchet · Archives & Lignée Familiale',
  motto: 'Chaque lien raconte une histoire, de génération en génération.',
  orientation: 'vertical',
  cardStyle: 'editorial',
  edgeStyle: 'bezier',
  palette: 'ivory-bronze',
  showGenerations: true,
  showSpouses: true,
  showDates: true,
  showInitialsAvatar: true,
  showMinimap: true,
  compactSpacing: false,
};

function makePlaceholderChildren(parentId: string, parentLabel: string, count: number): Person[] {
  return Array.from({ length: count }, (_, idx) => ({
    id: `${parentId}-enfant-${idx + 1}`,
    first: `Enfant ${idx + 1}`,
    last: '',
    birth: '',
    parents: [parentId],
    notes: `Prénom, nom et dates à compléter (enfant de ${parentLabel}).`,
  }));
}

export const INITIAL_WICI_PEOPLE: Person[] = [
  // GÉNÉRATION I — LES GRANDS-PARENTS
  {
    id: 'guillaume',
    first: 'Guillaume Théodore',
    last: 'TRONCHET',
    birth: '09/11/1876',
    death: '?',
    parents: [],
    spouses: ['georgette'],
    notes: 'Grand-père. Date de décès à compléter.',
  },
  {
    id: 'georgette',
    first: 'Georgette',
    last: 'MARTIN',
    birth: '15/12/1884',
    death: '1954',
    parents: [],
    spouses: ['guillaume'],
    notes: 'Grand-mère. Jour et mois de décès (1954) à préciser.',
  },

  // GÉNÉRATION II — LES PARENTS
  {
    id: 'charles',
    first: 'Charles, Roger',
    last: 'TRONCHET',
    birth: '10/06/1905',
    death: '19/12/1982',
    parents: ['guillaume', 'georgette'],
    spouses: ['blanche'],
    notes: 'Père des dix enfants Tronchet.',
  },
  {
    id: 'blanche',
    first: 'Blanche, Gabrielle',
    last: 'MEUNIER',
    birth: '16/06/1907',
    death: '05/05/1973',
    parents: [],
    spouses: ['charles'],
    notes: 'Mère des dix enfants Tronchet.',
  },

  // GÉNÉRATION III — LES DIX ENFANTS
  {
    id: 'serge',
    first: 'Serge',
    last: 'TRONCHET',
    birth: '20/05/1928',
    death: '14/03/1979',
    parents: ['charles', 'blanche'],
    notes: '1 enfant (conjoint et nom de l’enfant à compléter).',
  },
  {
    id: 'genevieve',
    first: 'Geneviève',
    last: 'TRONCHET',
    birth: '11/09/1930',
    death: '',
    parents: ['charles', 'blanche'],
    notes: '4 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'jean-claude',
    first: 'Jean-Claude',
    last: 'TRONCHET',
    birth: '08/02/1933',
    death: '26/05/1991',
    parents: ['charles', 'blanche'],
    notes: '2 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'raymond',
    first: 'Raymond',
    last: 'TRONCHET',
    birth: '27/05/1936',
    death: '21/04/2026',
    parents: ['charles', 'blanche'],
    notes: '3 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'pierre',
    first: 'Pierre',
    last: 'TRONCHET',
    birth: '21/11/1937',
    death: '',
    parents: ['charles', 'blanche'],
    notes: '2 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'colette',
    first: 'Colette',
    last: 'TRONCHET',
    birth: '12/01/1939',
    death: '01/12/2022',
    parents: ['charles', 'blanche'],
    notes: '1 enfant (conjoint et nom de l’enfant à compléter).',
  },
  {
    id: 'claude',
    first: 'Claude',
    last: 'TRONCHET',
    birth: '27/02/1940',
    death: '',
    parents: ['charles', 'blanche'],
    notes: '4 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'michel',
    first: 'Michel',
    last: 'TRONCHET',
    birth: '03/11/1941',
    death: '13/02/1990',
    parents: ['charles', 'blanche'],
    notes: 'Sans enfant.',
  },
  {
    id: 'denise',
    first: 'Denise',
    last: 'TRONCHET',
    birth: '05/04/1944',
    death: '',
    parents: ['charles', 'blanche'],
    notes: '2 enfants (conjoint et noms des enfants à compléter).',
  },
  {
    id: 'jacqueline',
    first: 'Jacqueline',
    last: 'TRONCHET',
    birth: '11/10/1946',
    death: '14/04/1974',
    parents: ['charles', 'blanche'],
    notes: '1 enfant (conjoint et nom de l’enfant à compléter).',
  },

  // GÉNÉRATION IV — LES PETITS-ENFANTS (prénoms et noms à compléter)
  ...makePlaceholderChildren('serge', 'Serge', 1),
  ...makePlaceholderChildren('genevieve', 'Geneviève', 4),
  ...makePlaceholderChildren('jean-claude', 'Jean-Claude', 2),
  ...makePlaceholderChildren('raymond', 'Raymond', 3),
  ...makePlaceholderChildren('pierre', 'Pierre', 2),
  ...makePlaceholderChildren('colette', 'Colette', 1),
  ...makePlaceholderChildren('claude', 'Claude', 4),
  ...makePlaceholderChildren('denise', 'Denise', 2),
  ...makePlaceholderChildren('jacqueline', 'Jacqueline', 1),
];

export const BRANCH_DEFINITIONS = [
  { id: 'all', label: 'Toute la lignée', founderId: ROOT_FOUNDER_ID, subtitle: 'Les 4 générations réunies' },
  { id: 'serge', label: 'Branche Serge', founderId: 'serge', subtitle: '1928 – 1979 · 1 enfant' },
  { id: 'genevieve', label: 'Branche Geneviève', founderId: 'genevieve', subtitle: '1930 · 4 enfants' },
  { id: 'jean-claude', label: 'Branche Jean-Claude', founderId: 'jean-claude', subtitle: '1933 – 1991 · 2 enfants' },
  { id: 'raymond', label: 'Branche Raymond', founderId: 'raymond', subtitle: '1936 – 2026 · 3 enfants' },
  { id: 'pierre', label: 'Branche Pierre', founderId: 'pierre', subtitle: '1937 · 2 enfants' },
  { id: 'colette', label: 'Branche Colette', founderId: 'colette', subtitle: '1939 – 2022 · 1 enfant' },
  { id: 'claude', label: 'Branche Claude', founderId: 'claude', subtitle: '1940 · 4 enfants' },
  { id: 'michel', label: 'Branche Michel', founderId: 'michel', subtitle: '1941 – 1990 · Sans enfant' },
  { id: 'denise', label: 'Branche Denise', founderId: 'denise', subtitle: '1944 · 2 enfants' },
  { id: 'jacqueline', label: 'Branche Jacqueline', founderId: 'jacqueline', subtitle: '1946 – 1974 · 1 enfant' },
];

export const GENERATION_LABELS: Record<number, { roman: string; title: string; era: string }> = {
  0: { roman: 'I', title: 'Les Grands-Parents', era: '1876 – 1954' },
  1: { roman: 'II', title: 'Les Parents', era: '1905 – 1982' },
  2: { roman: 'III', title: 'Les Dix Enfants', era: '1928 – 1946' },
  3: { roman: 'IV', title: 'Les Petits-Enfants', era: 'À compléter' },
  4: { roman: 'V', title: 'Les Arrière-Petits-Enfants', era: 'Futur' },
  5: { roman: 'VI', title: 'Sixième Génération', era: 'Futur' },
};

export function getBirthSortKey(birth?: string): number {
  if (!birth) return 99999999;
  const fullMatch = birth.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (fullMatch) {
    const [, d, m, y] = fullMatch;
    return parseInt(y, 10) * 10000 + parseInt(m, 10) * 100 + parseInt(d, 10);
  }
  const yearMatch = birth.match(/(\d{4})/);
  if (yearMatch) {
    return parseInt(yearMatch[1], 10) * 10000;
  }
  return 99999999;
}

export function getFullName(person?: Person | null): string {
  if (!person) return '';
  return [person.first, person.last].filter(Boolean).join(' ');
}

export function getInitials(person?: Person | null): string {
  if (!person) return '?';
  const f = (person.first || '').trim().charAt(0);
  const l = (person.last || '').trim().charAt(0);
  return (f + l).toUpperCase() || '?';
}

export function getLifeDates(person?: Person | null): string {
  if (!person) return '';
  if (person.birth && person.death) return `${person.birth} – ${person.death}`;
  if (person.birth) return `Né(e) le ${person.birth}`;
  if (person.death) return `Décédé(e) le ${person.death}`;
  return 'Dates à compléter';
}

export function isPersonIncomplete(person: Person): boolean {
  if (
    !person.first ||
    person.first.toLowerCase().includes('confirmer') ||
    person.first.toLowerCase().startsWith('enfant ') ||
    person.first.includes('?')
  ) {
    return true;
  }
  if (!person.birth || person.birth.includes('?')) return true;
  if (person.death && person.death.includes('?')) return true;
  return false;
}
