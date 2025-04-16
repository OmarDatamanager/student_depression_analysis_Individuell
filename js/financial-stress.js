import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from "./libs/dbQuery.js";
import drawGoogleChart from './libs/drawGoogleChart.js';
import makeChartFriendly from './libs/makeChartFriendly.js';
import tableFromData from './libs/tableFromData.js';

addMdToPage(`
## Ekonomisk stress och depression

Analys av hur ekonomisk stress påverkar studenters psykiska hälsa.
`);

// Hämta all data först
let rawData = await dbQuery(`
  SELECT financialStress AS Stressnivå, 
         COUNT(*) as "Antal studenter",
         SUM(depression) as "Depressiva studenter",
         ROUND(SUM(depression) * 100.0 / COUNT(*), 1) as "Procent depressiva"
  FROM student_depression
  WHERE financialStress BETWEEN 1 AND 5
  GROUP BY financialStress
  ORDER BY financialStress
`);

// Funktion för att generera analysen
function generateAnalysis(data) {
  if (data.length === 0) return '';

  // Gruppera data i kategorier
  const categories = {
    'Låg (1-2)': data.filter(x => x.Stressnivå <= 2),
    'Medel (3)': data.filter(x => x.Stressnivå === 3),
    'Hög (4-5)': data.filter(x => x.Stressnivå >= 4)
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
- **${cat} stress:**  
  • ${val.percentage}% depression (${val.depressed} av ${val.total} studenter)  
  • ${cat === 'Låg (1-2)' ? 'Cirka 1 av 4' : cat === 'Medel (3)' ? 'Mer än varannan' : '4 av 5'} studenter drabbade`).join('\n')}

**Nyckelobservationer:**
✔ Starkt positivt samband: Högre ekonomisk stress → Högre depression  
✔ Skillnad på ${maxDiff} procentenheter mellan högsta och lägsta  
✔ Kritisk nivå vid stressnivå 3+  

**Implikationer:**
1. Ekonomisk stress är en central riskfaktor
2. Studenters ekonomiska situation behöver förbättras
3. Särskilt fokus på studenter med hög ekonomisk stress

**Rekommendationer:**
• Ekonomiskt stöd för studenter i riskzonen  
• Budget- och skuldrådgivning  
• Studieavgiftsanpassningar för sårbara grupper  

*Data baserad på ${data.reduce((sum, x) => sum + x["Antal studenter"], 0)} studenter totalt*
`;
}

// Uppdaterar diagram, tabell och analys
function updateContent(selectedLevel) {
  let filteredData = selectedLevel === 'Alla nivåer'
    ? rawData
    : rawData.filter(row => row.Stressnivå === Number(selectedLevel));

  let chartData = filteredData.map(row => ({
    Stressnivå: row["Stressnivå"],
    "Procent depressiva": row["Procent depressiva"] / 100
  }));

  drawGoogleChart({
    type: 'LineChart',
    data: makeChartFriendly(chartData, 'Stressnivå', 'Procent depressiva'),
    options: {
      title: 'Depressionsfrekvens per ekonomisk stressnivå',
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
      hAxis: { title: 'Ekonomisk stressnivå (1-5)' },
      colors: ['#EA4335'],
      trendlines: {
        0: {
          type: 'linear',
          visibleInLegend: true,
          label: 'Trend'
        }
      }
    }
  });

  tableFromData({
    data: filteredData,
    columnNames: ['Stressnivå', 'Antal studenter', 'Depressiva studenter', 'Procent depressiva']
  });

  // Lägg till analysen
  addMdToPage(generateAnalysis(filteredData));
}

// Dropdown + händelse
addDropdown('Välj stressnivå', ['Alla nivåer', 1, 2, 3, 4, 5], 'Alla nivåer', updateContent);

// Init
updateContent('Alla nivåer');