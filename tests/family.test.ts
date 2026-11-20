import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, INITIAL_WICI_PEOPLE, type Person } from '../src/data/wiciFamily';
import { computeTreeLayout } from '../src/utils/treeLayout';
import { validatePeople } from '../src/utils/validateFamily';
import { buildPosterSvg } from '../src/utils/posterExport';

test('les dix enfants de Charles et Blanche ont les bons parents', () => {
  const children = INITIAL_WICI_PEOPLE.filter(p => p.parents.includes('charles'));
  assert.equal(children.length, 10);
  for (const child of children) {
    assert.deepEqual(new Set(child.parents), new Set(['charles', 'blanche']));
  }
  const charles = INITIAL_WICI_PEOPLE.find(p => p.id === 'charles');
  assert.deepEqual(new Set(charles?.parents), new Set(['guillaume', 'georgette']));
  assert.equal(validatePeople(INITIAL_WICI_PEOPLE), null);
});

test('les cycles, doublons et parents inexistants sont refusés', () => {
  const cycle = structuredClone(INITIAL_WICI_PEOPLE);
  cycle.find(p => p.id === 'guillaume')!.parents = ['denise'];
  assert.match(validatePeople(cycle) || '', /boucle/);
  assert.match(validatePeople([...INITIAL_WICI_PEOPLE, INITIAL_WICI_PEOPLE[0]]) || '', /identifiant/);
  const invalid = structuredClone(INITIAL_WICI_PEOPLE);
  invalid[0].parents = ['inconnu'];
  assert.match(validatePeople(invalid) || '', /Parents invalides/);
});

test('affiche complète avec les co-parents et les portraits intégrés', () => {
  const people = structuredClone(INITIAL_WICI_PEOPLE);
  people[0].photo = 'data:image/png;base64,iVBORw0KGgo=';
  const layout = computeTreeLayout(people, 'all', new Set(), DEFAULT_SETTINGS);
  assert.equal(new Set([...layout.nodes.map(n => n.id), ...layout.partners.map(n => n.person.id)]).size, people.length);
  const { svg } = buildPosterSvg(people, DEFAULT_SETTINGS);
  for (const name of ['Guillaume Théodore TRONCHET', 'Georgette MARTIN', 'Charles, Roger TRONCHET', 'Blanche, Gabrielle MEUNIER', 'Denise']) {
    assert.ok(svg.includes(name), name);
  }
  assert.ok(svg.includes('data:image/png;base64,'));
  people[0].photo = 'https://example.com/photo.png';
  assert.throws(() => buildPosterSvg(people, DEFAULT_SETTINGS), /portraits externes/);
});

test('les nouvelles générations ne sont pas limitées', () => {
  const extra: Person = { id: 'generation-cinq', first: 'Test', last: '', parents: ['denise-enfant-1'] };
  const people = [...INITIAL_WICI_PEOPLE, extra];
  assert.equal(validatePeople(people), null);
  assert.ok(computeTreeLayout(people, 'all', new Set(), DEFAULT_SETTINGS).nodes.some(n => n.id === extra.id));
});

test('un conjoint sans enfants ne disparaît pas de l’arbre exporté', () => {
  const people = structuredClone(INITIAL_WICI_PEOPLE);
  people.push({ id: 'conjoint-test', first: 'Conjoint', last: 'Test', parents: [], spouses: ['michel'] });
  people.find(p => p.id === 'michel')!.spouses = ['conjoint-test'];
  const layout = computeTreeLayout(people, 'all', new Set(), DEFAULT_SETTINGS);
  assert.ok([...layout.nodes.map(n => n.id), ...layout.partners.map(n => n.person.id)].includes('conjoint-test'));
  assert.ok(buildPosterSvg(people, DEFAULT_SETTINGS).svg.includes('Conjoint Test'));
});

test('l’arbre vertical empile les fratries terminales pour rester compact et lisible en entier', () => {
  const layout = computeTreeLayout(INITIAL_WICI_PEOPLE, 'all', new Set(), DEFAULT_SETTINGS);
  assert.ok(layout.width < 3400, `La largeur de l'arbre (${layout.width}px) doit être compacte (< 3400px)`);
  const e1 = layout.nodes.find(n => n.id === 'denise-enfant-1')!;
  const e2 = layout.nodes.find(n => n.id === 'denise-enfant-2')!;
  assert.equal(e1.x, e2.x);
  assert.ok(e2.y > e1.y);
});

test('les portraits au format data URL s’intègrent parfaitement sur les cartes de l’arbre', () => {
  const people = structuredClone(INITIAL_WICI_PEOPLE);
  people.find(p => p.id === 'denise')!.photo = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
  const { svg } = buildPosterSvg(people, DEFAULT_SETTINGS);
  assert.ok(svg.includes('data:image/jpeg;base64,'));
  assert.ok(svg.includes('Denise'));
});

test('la planche photo A3 génère les bonnes dimensions et inclut tous les membres par branche', async () => {
  const { buildPhotoPosterSvg } = await import('../src/utils/photoPosterGenerator');
  const landscape = buildPhotoPosterSvg(INITIAL_WICI_PEOPLE, DEFAULT_SETTINGS, { orientation: 'landscape' });
  assert.equal(landscape.width, 4960);
  assert.equal(landscape.height, 3508);
  assert.ok(landscape.svg.includes('Guillaume'));
  assert.ok(landscape.svg.includes('Denise'));
  assert.ok(landscape.svg.includes('bt-trunk'));
  assert.ok(landscape.svg.includes('bt-leaf'));
  for (const person of INITIAL_WICI_PEOPLE) {
    assert.ok(landscape.svg.includes(person.first), `Membre manquant sur l'arbre A3: ${person.first}`);
  }

  const portrait = buildPhotoPosterSvg(INITIAL_WICI_PEOPLE, DEFAULT_SETTINGS, { orientation: 'portrait' });
  assert.equal(portrait.width, 3508);
  assert.equal(portrait.height, 4960);
  assert.ok(portrait.svg.includes('Denise'));

  const gallery = buildPhotoPosterSvg(INITIAL_WICI_PEOPLE, DEFAULT_SETTINGS, { orientation: 'landscape', style: 'gallery' });
  assert.equal(gallery.width, 4960);
  assert.equal(gallery.height, 3508);
  assert.ok(gallery.svg.includes('BRANCHE DENISE'));
  assert.ok(gallery.svg.includes('BRANCHE SERGE'));
});
