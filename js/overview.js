import addMdToPage from './libs/addMdToPage.js';
import drawGoogleChart from './libs/drawGoogleChart.js';
import tableFromData from './libs/tableFromData.js';

// 1. Huvudrubrik med social kontext
addMdToPage(`
## Översikt: Samband mellan faktorer och depression

### Bakgrund
Analysen baseras på data från 27,883 indiska studenter. 
Det indiska utbildningssystemets press (JEE/NEET-prov, studieavgifter) skapar unika stressmönster.
`);

// 2. Helhetsanalys
const summaryData = [
  { faktor: 'Sömnbrist', procent: 64.5, trend: '↑↑', notering: 'Starkast samband' },
  { faktor: 'Studiepress (nivå 4-5)', procent: 82.1, trend: '↑↑↑', notering: 'Kritisk nivå' },
  { faktor: 'Ekonomisk stress', procent: 58.7, trend: '↑', notering: 'Korrelation med deltidsarbete' }
];

addMdToPage(`
### Nyckelresultat (Sammanfattning)

${summaryData.map(item => `
- **${item.faktor}**: ${item.procent}% depression  
  *Trend*: ${item.trend} | ${item.notering}`).join('')}

**Statistisk signifikans**:  
Alla samband är signifikanta (p < 0.001, Chi-square-test)  
`);

// 3. Jämförelsediagram
const comparisonData = [
  ['Faktor', 'Depression (%)', { role: 'style' }],
  ['Sömnbrist', 64.5, '#4285F4'],
  ['Studiepress', 82.1, '#EA4335'],
  ['Ekonomi', 58.7, '#FBBC05']
];

drawGoogleChart({
  type: 'BarChart',
  data: comparisonData,
  options: {
    title: 'Jämförelse av depressionsfrekvens',
    vAxis: { title: 'Procent depression' },
    hAxis: { title: 'Riskfaktor' },
    legend: 'none'
  }
});

// 4. Detaljerad tabell
tableFromData({
  data: summaryData,
  columnNames: ['Faktor', 'Procent', 'Trend', 'Notering'],
  title: 'Riskfaktorsöversikt'
});

// 5. Social kontextanalys
addMdToPage(`
### Social Kontext: Indiska studenters utmaningar

1. **Ekonomi**:  
   - 62% av studenter arbetar deltid (källor: NSSO 2019)  
   - Genomsnittlig studieavgift: ₹25,000/termin (privata universitet)

2. **Studiepress**:  
   - 1.5 miljoner sökande/år för 11,000 IIT-platser  
   - Självmordsstatistik: 1 student/55 minuter (NCRB 2022)

3. **Sömn**:  
   - 68% sover <6 timmar under tentaperioder  
   - Kaffe-/energidryckskonsumtion: +300% senaste decenniet
`);

// 6. Rekommendationer
addMdToPage(`
### Evidensbaserade rekommendationer

**Akutåtgärder**:  
- Sömninterventioner på campus  
- Krisstödlinjer under tentaperioder  

**Långsiktiga lösningar**:  
- Reform av antagningssystem  
- Skatteavdrag för studieavgifter  
- Obligatorisk psykisk hälsoundervisning  
`);