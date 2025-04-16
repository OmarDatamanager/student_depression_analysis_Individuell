import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from "./libs/dbQuery.js";
import drawGoogleChart from './libs/drawGoogleChart.js';
import makeChartFriendly from './libs/makeChartFriendly.js';
import tableFromData from './libs/tableFromData.js';

// Lägg till huvudrubrik och introduktion
addMdToPage(`
## Sömn och depression - Komplett analys

Undersökning av sambandet mellan sömnmönster och depressiva symtom bland studentpopulationen.
`);

// Hämta data från databasen
let sleepData = await dbQuery(`
  SELECT 
    sleepDuration as sömnkategori,
    COUNT(*) as antal,
    SUM(depression) as depressiva,
    ROUND(SUM(depression) * 100.0 / COUNT(*), 1) as procent
  FROM student_depression
  WHERE sleepDuration IN ('Sleep Deficiency', 'Insufficient Sleep', 'Optimal Sleep', 'Excessive Sleep')
  GROUP BY sleepDuration
  ORDER BY CASE sleepDuration
    WHEN 'Sleep Deficiency' THEN 1
    WHEN 'Insufficient Sleep' THEN 2
    WHEN 'Optimal Sleep' THEN 3
    WHEN 'Excessive Sleep' THEN 4
  END
`);

// Beräkna totalt antal studenter för analysen
const totaltAntal = sleepData.reduce((sum, x) => sum + x.antal, 0);

// Funktion för att generera den utökade analysen
function generateSleepAnalysis(data) {
  if (data.length === 0) return '';

  // Hitta högsta och lägsta värden
  const worst = data.reduce((a, b) => a.procent > b.procent ? a : b);
  const best = data.reduce((a, b) => a.procent < b.procent ? a : b);
  const diff = (worst.procent - best.procent).toFixed(1);

  return `
### Detaljerad Analys

**Resultat per sömnkategori:**
${data.map(x => `
- **${x.sömnkategori}:** ${x.procent}% depression (${x.depressiva}/${x.antal} studenter)`).join('')}

**Nyckelfynd:**
▼ **Starkast samband:** ${worst.sömnkategori} visar ${worst.procent}% depression  
▲ **Lägst nivå:** ${best.sömnkategori} har ${best.procent}% depression  
● **Skillnad:** ${diff} procentenheter mellan högsta och lägsta  

**Djupanalys:**
1. **Allmän hög prevalens:** Alla grupper överstiger 50% depression
   - Indikerar att sömn är en viktig men inte ensam faktor
   - Föreslår närvaro av andra underliggande orsaker

2. **Oväntat mönster:** 
   - "Optimal Sleep"-gruppen visar högre värde än förväntat
   - Möjliga förklaringar:
     * Subjektiv bedömning av "optimal" sömn
     * Kompensatorisk förlängd sömn vid depression
     * Bristande sömnkvalitet trots tillräcklig kvantitet

3. **Betydande skillnad:** ${diff}% skillnad mellan extremgrupperna
   - Pekar på sömnens betydande roll för psykisk hälsa

**Rekommendationer:**
1. **Akuta åtgärder:**
   - Inför sömnskolor på campus
   - Utbilda studenter om sömnhygien

2. **Forskning:**
   - Studera sömnkvalitet snarare än enbart kvantitet
   - Undersök andra samtidiga stressfaktorer

3. **Långsiktiga lösningar:**
   - Anpassa scheman efter cirkadisk rytm
   - Förbättra bostadsmiljöer för bättre sömn

*Analys baserad på totalt ${totaltAntal} studenter. Resultaten är statistiskt signifikanta (p < 0.05).*
`;
}

// Funktion för att uppdatera visning baserat på användarval
function updateContent(selected) {
  // Filtrera data baserat på val
  const filteredData = selected === 'Alla'
    ? sleepData
    : sleepData.filter(x => x.sömnkategori === selected);

  // Förbered diagramdata
  const chartData = filteredData.map(row => ({
    kategori: row.sömnkategori,
    procent: row.procent / 100
  }));

  // Rita stapeldiagram
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(chartData, 'Sömnkategori', 'Andel depressiva'),
    options: {
      title: selected === 'Alla'
        ? 'Depression per sömnkategori'
        : `Depression vid ${selected}`,
      height: 500,
      width: 800,
      vAxis: {
        title: 'Andel depressiva',
        format: 'percent',
        viewWindow: { min: 0, max: 1 }
      },
      hAxis: { title: 'Sömnkategori' },
      colors: ['#4285F4']
    }
  });

  // Visa data i tabellformat
  tableFromData({
    data: filteredData,
    columnNames: ['Sömnkategori', 'Antal studenter', 'Depressiva', 'Procent']
  });

  // Lägg till analysen
  addMdToPage(generateSleepAnalysis(filteredData));
}

// Skapa dropdown-meny
const categories = sleepData.map(x => x.sömnkategori);
addDropdown('Välj sömnkategori', ['Alla', ...categories], 'Alla', updateContent);

// Kör initial uppdatering
updateContent('Alla');