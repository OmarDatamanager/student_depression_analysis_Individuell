import addMdToPage from './libs/addMdToPage.js';
import addDropdown from './libs/addDropdown.js';
import dbQuery from "./libs/dbQuery.js";
import drawGoogleChart from './libs/drawGoogleChart.js';
import makeChartFriendly from './libs/makeChartFriendly.js';
import tableFromData from './libs/tableFromData.js';

// Lägg till en inledande rubrik på sidan
addMdToPage(`
  ## Kostvanor och depression

  Denna analys undersöker sambandet mellan matvanor och psykisk hälsa bland studenter.
`);

// Hämta data från databasen
let dietData = await dbQuery(`
  SELECT 
    CASE dietaryHabits
      WHEN 0 THEN 'Ohälsosam'
      WHEN 1 THEN 'Måttlig'
      WHEN 2 THEN 'Hälsosam'
    END as kosttyp,
    COUNT(*) as antal,
    SUM(depression) as depressiva,
    ROUND(SUM(depression) * 100.0 / COUNT(*), 1) as procent
  FROM student_depression
  WHERE dietaryHabits IN (0, 1, 2)
  GROUP BY dietaryHabits
  ORDER BY dietaryHabits
`);

// Funktion för att generera analysen baserat på datan
function generateDietAnalysis(data) {
  if (data.length === 0) return '';

  // Bestäm den bästa och sämsta kosten
  const worst = data.reduce((a, b) => a.procent > b.procent ? a : b);
  const best = data.reduce((a, b) => a.procent < b.procent ? a : b);
  const diff = (worst.procent - best.procent).toFixed(1);

  return `
  ### Resultat och analys

  **Fördelning per kosttyp:**
  ${data.map(x => `
  - **${x.kosttyp} kost:** ${x.procent}% depression (${x.depressiva} av ${x.antal} studenter)`
  ).join('')}

  **Viktiga fynd:**
  ▼ ${worst.kosttyp} kost visar ${worst.procent}% depression  
  ▲ ${best.kosttyp} kost visar ${best.procent}% depression  
  ● Skillnad på ${diff} procentenheter  

  **Implikationer:**
  1. Kostkvalitet påverkar psykisk hälsa signifikant
  2. Studenters matvanor kan vara en viktig riskfaktor
  3. Hälsosam kost kan fungera som skyddande faktor

  **Rekommendationer:**
  • Förbättra tillgång till nyttig mat på campus  
  • Kostrådgivning som del av studenthälsa  
  • Uppmärksamma sambandet kost-psykisk hälsa  
  `;
}

// Funktion för att uppdatera innehållet på sidan baserat på användarens val
function updateContent(selectedDiet) {
  let filteredData = selectedDiet === 'Alla'
    ? dietData
    : dietData.filter(row => row.kosttyp === selectedDiet);

  let chartData = filteredData.map(row => ({
    kosttyp: row.kosttyp,
    "Procent depressiva": row.procent / 100
  }));

  // Rita diagrammet
  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(chartData, 'Kosttyp', 'Procent depressiva'),
    options: {
      title: 'Depressionsfrekvens per kosttyp',
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
      hAxis: { title: 'Kosttyp' },
    }
  });

  // Visa data i tabellformat
  tableFromData({
    data: filteredData,
    columnNames: ['Kosttyp', 'Antal studenter', 'Depressiva studenter', 'Procent depressiva']
  });

  // Lägg till analysen på sidan
  addMdToPage(generateDietAnalysis(filteredData));
}

// Skapa en dropdown med alternativ för kosttyp
addDropdown('Välj kosttyp', ['Alla', 'Ohälsosam', 'Måttlig', 'Hälsosam'], 'Alla', updateContent);

// Anropa funktionen för att initialt visa alla data
updateContent('Alla');
