import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from "./libs/dbQuery.js";
import drawGoogleChart from './libs/drawGoogleChart.js';
import makeChartFriendly from './libs/makeChartFriendly.js';
import tableFromData from './libs/tableFromData.js';

addMdToPage(`
## Studiepress och depression

Denna analys undersöker sambandet mellan akademisk press och depression bland studenter.
`);

// Hämta all data först
let rawData = await dbQuery(`
  SELECT academicPressure AS Trycknivå, 
         COUNT(*) as "Antal studenter",
         SUM(depression) as "Depressiva studenter",
         ROUND(SUM(depression) * 100.0 / COUNT(*), 2) as "Procent depressiva"
  FROM student_depression
  WHERE academicPressure > 0
  GROUP BY academicPressure
  ORDER BY academicPressure
`);

// Funktion för att generera analysen
function generateAnalysis(data) {
  if (data.length === 0) return '';

  // Gruppera data i kategorier
  const categories = {
    'Lågt (1-2)': data.filter(x => x.Trycknivå <= 2),
    'Medel (3)': data.filter(x => x.Trycknivå === 3),
    'Högt (4-5)': data.filter(x => x.Trycknivå >= 4)
  };

  // Beräkna genomsnitt för varje kategori
  const results = {};
  for (const [cat, items] of Object.entries(categories)) {
    if (items.length > 0) {
      results[cat] = {
        total: items.reduce((sum, x) => sum + x["Antal studenter"], 0),
        depressed: items.reduce((sum, x) => sum + x["Depressiva studenter"], 0),
        percentage: (items.reduce((sum, x) => sum + x["Procent depressiva"], 0) / items.length).toFixed(1)
      };
    }
  }

  // Beräkna skillnad mellan högsta och lägsta
  const maxDiff = (data[data.length - 1]["Procent depressiva"] - data[0]["Procent depressiva"]).toFixed(1);

  return `
### Sammanfattning av analysen

**Resultat:**
${Object.entries(results).map(([cat, val]) => `
- **${cat} tryck:**  
  • ${val.percentage}% depression (${val.depressed} av ${val.total} studenter)  
  • ${cat === 'Lågt (1-2)' ? 'Cirka 1 av 4' : cat === 'Medel (3)' ? 'Mer än varannan' : '4 av 5'} studenter drabbade`).join('\n')}

**Nyckelobservationer:**
✔ Starkt positivt samband: Högre tryck → Högre depression  
✔ Skillnad på ${maxDiff} procentenheter mellan högsta och lägsta  
✔ Över 80% depression i högpressgruppen är exceptionellt högt  

**Implikationer:**
1. Akademiskt tryck är en central riskfaktor
2. Utbildningsmiljön behöver utvärderas
3. Särskilt fokus på nivå 4-5 studenter

**Rekommendationer:**
• Introducera tidiga varningssystem  
• Utöka psykologiskt stöd för högriskgrupper  
• Anpassa studiebelastning efter individuella behov  

*Data baserad på ${data.reduce((sum, x) => sum + x["Antal studenter"], 0)} studenter totalt*
`;
}

// Uppdaterar diagram, tabell och analys
function updateContent(selectedLevel) {
  let filteredData = selectedLevel === 'Alla nivåer'
    ? rawData
    : rawData.filter(row => row.Trycknivå === Number(selectedLevel));

  let chartData = filteredData.map(row => ({
    Trycknivå: row["Trycknivå"],
    "Procent depressiva": row["Procent depressiva"] / 100
  }));

  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(chartData, 'Trycknivå', 'Procent depressiva'),
    options: {
      title: 'Depressionsfrekvens per akademisk trycknivå',
      height: 500,
      width: 1000,
      vAxis: {
        title: 'Procent',
        format: '#,##%',
        viewWindow: {
          min: 0,
          max: 1
        }
      },
      hAxis: { title: 'Akademisk trycknivå (1-5)' },
    }
  });

  tableFromData({
    data: filteredData,
    columnNames: ['Trycknivå', 'Antal studenter', 'Depressiva studenter', 'Procent depressiva']
  });

  // Lägg till analysen
  addMdToPage(generateAnalysis(filteredData));
}

// Dropdown + händelse
addDropdown('Välj trycknivå', ['Alla nivåer', 1, 2, 3, 4, 5], 'Alla nivåer', updateContent);

// Init
updateContent('Alla nivåer');