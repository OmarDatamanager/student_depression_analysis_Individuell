import createMenu from './libs/createMenu.js';

createMenu('Studenters psykiska hälsa', [
  { name: 'Översikt', script: 'overview.js' },
  { name: 'Studiepress och depression', script: 'academic-pressure.js' },
  { name: 'Sömn och depression', script: 'sleep-depression.js' },
  { name: 'Kostvanor och depression', script: 'diet-depression.js' },
  { name: 'Ekonomisk stress och depression', script: 'financial-stress.js' }
]);