### Individuell betygsgrundande inlämningsuppgift: Psykisk ohälsa bland studerande i Indien.

1- Vad betyder CGPA kolumn!!

CGPA är en förkortning för Cumulative Grade Point Average - det vill säga studentens genomsnittliga betyg.

Varför kan det vara viktigt i analysen?  
Det kan vara kopplat till sämre psykisk hälsa om studenter med låga betyg lider av högre akademisk press eller depression.

---

2- Kolonnen "Work/Study Hours"  
Representerar den totala tiden för arbete och studier per dag kombinerat.

Anmärkning:  
Data skiljer inte mellan arbetstimmar och studietimmar separat, utan visar endast den sammanlagda summan.

För en mer detaljerad analys kan detta kopplas till:

- Akademisk press (om merparten av timmarna spenderas på studier)
- Ekonomisk stress (om arbetstimmar är höga)

---

3- i nästa steg av att skapa och analysera databasen vill jag behålla endast dessa kolumner:

- id
- Gender
- Age
- Academic Pressure
- CGPA
- Sleep Duration
- Dietary Habits
- Have you ever had suicidal thoughts?
- Financial Stress
- Family History of Mental Illness
- Depression

Jag tror att dessa kolumner är tillräckliga för att analysera hur huvudfaktorer påverkar mental hälsa (depression och självmordstankar) utan att göra analysen för komplex.

**Fördelar:**

- Tydligt fokus på nyckelfaktorer som:
  - Akademisk press (Academic Pressure)
  - Livskvalitet (Sleep Duration, Dietary Habits)
  - Ekonomiska och genetiska faktorer (Financial Stress, Family History)
- Förenklad analys utan att förlora viktiga insikter.

**Påverkan av arbetstid/studietid (Work/Study Hours):**  
Analys av daglig utmattning.  
Jag har exkluderat denna kolumn eftersom jag tror att den innehåller extremvärden och ibland otydliga data.

---

4- Användning av SQLite (inte direkt CSV) eftersom det möjliggör:

- Körning av avancerade SQL-frågor
- Mer flexibel analys

**Arbetssteg:**

- Skapa en ny databas i SQLiteStudio
- Designa en tabell med kolumner som matchar CSV-filen, med hänsyn till:
  - Använda kolumnnamn utan mellanslag (t.ex. sleepDuration istället för "Sleep Duration")
  - Välja lämpliga datatyper (text, nummer etc.)

**Slutmål:**

- Möjliggöra dataanalys med SQL-språket istället för enklare verktyg  
Uppgiften går ut på att konvertera en CSV-fil till en SQLite-databas för kraftfullare analys!

---

5- databashantering:

**Datatyper valda:**

Alla kolumner (förutom CGPA) och (gender) satta till INTEGER för enkel analys.

**Fördelar:**

- Effektiv lagring
- Snabbare beräkningar
- Enklare statistikanalys

**Nästa steg:**

- Importera data från CSV
- Verifiera dataintegritet

---

6- Datakonverteringar

Ändrade textvärden till numeriska koder:

- suicidalThoughts:  
  "Yes" → 1, "No" → 0

- familyMentalHistory:  
  "Yes" → 1, "No" → 0

- dietaryHabits:  
  "Unhealthy" → 0, "Moderate" → 1, "Healthy" → 2

Det går även att konvertera gender-kolumnen från 'male', 'female' till 1, 0 om så önskas för framtida analyser, där den kan användas direkt i statistiska tester (som samband mellan kön och depression).

---

7- Unika värden i sleepDuration-kolumnen:

**Ursprungliga värden:**  
'5-6 hours', '7-8 hours', 'Less than 5 hours', 'More than 8 hours', 'Others'

**Beslut om borttagning:**

'Others' förekom endast i 18 rader (en mycket liten del av datamängden).

**Borttagen för att:**

- Undvika störningar i framtida analyser
- Behålla en ren och tydlig kategorisering

**Resultat efter åtgärd:**

Nuvarande unika värden:  
'5-6 hours', '7-8 hours', 'Less than 5 hours', 'More than 8 hours'

---

8- Analysera sambandet mellan sömnvanor (sleepDuration) och depression bland indiska studenter.

**Datainnehåller fyra kategorier (Efter att kategorin 'Others' togs bort):**

- 'Less than 5 hours'
- '5-6 hours'
- '7-8 hours'
- 'More than 8 hours'

**Mål:**

- Klassificera sömnkategorier för att underlätta statistisk analys.
- Förbereda data för eventuell maskininlärning (för ML)

**2. Beslutsprocess**

**A. Val av Klassificering**  
Förslag:

- 'Less than 5 hours' → "Brist på sömn" (Sleep Deficiency)
- '5-6 hours' → "Otillräcklig sömn" (Insufficient Sleep)
- '7-8 hours' → "Optimal sömn" (Optimal Sleep)
- 'More than 8 hours' → "Översömn" (Excessive Sleep)

**Motivering:**

- Reflekterar vedertagna hälsorekommendationer (7-9 timmar för unga vuxna).
- Gör det enkelt att identifiera riskgrupper (t.ex. brist på sömn kopplat till depression).

**B. Hantering av "Översömn"**  
Utmaning:

- Översömn (>8 timmar) kan vara:
  - Kulturellt normalt (t.ex. siesta-vanor).
  - Patologiskt (länkat till depression).

**C. Förberedelse för Maskininlärning**  
Plan:

- Textetiketter konverteras senare till numeriska koder vid behov:
  - "Brist på sömn" → 0
  - "Otillräcklig sömn" → 1
  - "Optimal sömn" → 2
  - "Översömn" → 3

**Fördelar:**

- Kategoridata kan användas i algoritmer som stödjer Ordinal Encoding (t.ex. Decision Trees).
- Flexibilitet: Kan enkelt omvandlas till One-Hot Encoding om nödvändigt.


**3. Statistikanalysstrategi**

**A. Deskriptiv Statistik**

- Beräkna frekvenser för varje sömnkategori.
- Jämför medelvärden av depression per kategori.

**B. Hypotesprövning**

- ANOVA eller Kruskal-Wallis för att testa skillnader i depression mellan grupperna.

**C. Visualisering**

- Boxplot: Depression vs. Sömnkategorier.
- Stapeldiagram: Andel depressiva fall per kategori.


**4. Slutsats och Nästa Steg**

- Textklassificeringen valdes för att göra data intuitiv under den explorativa analysen.
- Numerisk kodning kommer att implementeras senare vid maskininlärning (beroende på algoritmval).
- Dokumentation av alla beslut säkerställer reproducerbarhet.

**Kommande Åtgärder:**

- Kör statistiska tester för att validera samband.
- Utforska behovet av ytterligare datatransformation (t.ex. sammanslagning av kategorier).

---

9- Rapport: Uppladdning av testmall till GitHub

**Sammanfattning**

- Genomfört första uppladdning av statistics-template-5 till GitHub via GitHub Desktop med följande steg:

**Förberedelser:**

- Exkludera node_modules/ och loggfiler.
- La till README.md med projektbeskrivning på svenska.

**Databashantering:**

- SQLite-filen (student_depression.db) lades till i projektmappen.

**Uppladdning:**

- Alla filer verifierades i GitHub Desktop innan commit.
- Push genomfördes utan fel till det nya repositoryt.

**Resultat**

- Mallen och databasen finns nu på GitHub
- Inga oönskade filer (som node_modules) laddades upp
- Klar för nästa steg: dataanalys och anpassning

---

10- Metodik för att analysera sambanden mellan variabler i SQLiteStudio

#1. Förstå analysens syfte  
Undersöka effekten av varje oberoende variabel (academicPressure, sleepDuration, financialStress) på depressionsvariabeln, var och en för sig (Bivariate Analysis).

#2. Analyssteg för varje variabel

**#A. Analys av sambandet mellan "akademisk press" och "depression"**

1. Beskriv fördelningen:
   - Använd en SQL-fråga för att se hur depressionen fördelas per nivå av akademisk press (t.ex. låg/medel/hög).

2. Statistiska jämförelser:
   - Beräkna genomsnittlig depressionsnivå per kategori av akademisk press.
   - Leta efter mönster som:  
     "Är genomsnittlig depression högre hos studenter med hög akademisk press?"

**#B. Analys av sambandet mellan "sömnlängd" och "depression"**

1. Kategorisera data (om "sömnlängd" är text som "5-6 timmar"):
   - Konvertera till text kategorier (t.ex. Insufficient Sleep, osv.).

2. Visuell analys:
   - Skapa en tabell som visar antal studenter och depressionsfrekvens per sömnkategori.

**#C. Analys av "ekonomisk stress" och "depression"**

1. Korrelation:
   - Undersök om höga ekonomisk stress-nivåer samvarierar med högre depression (även om det inte är en direkt orsak).

#3. Verktyg i SQLiteStudio för analys

- GROUP BY-frågor:
  - Gruppera data efter oberoende variabel (t.ex. `GROUP BY academic_pressure`).
- Statistiska funktioner:
  - `AVG(depression)`, `COUNT(*)`, `MAX()`, `MIN()`.
- Exportera resultat:
  - Spara som CSV, JSON eller Excel för senare visualisering.

#4. Tolka resultaten

För varje oberoende variabel, ställ dessa frågor:

1. Finns det tydliga skillnader i genomsnittlig depression mellan kategorier?  
   Exempel:  
   "Studenter med hög arbetsbelastning har en genomsnittlig depression på 7.5/10 jämfört med 4/10 för övriga."

2. Är mönstret rimligt?  
   Jämför dina resultat med tidigare forskning om psykisk hälsa.

#5. Dokumentera processen

1. Spara varje SQL-fråga i en separat fil (t.ex. `sleep_depression_analysis.sql`).
2. Exportera resultat som externa filer (CSV/bilder) för rapporten.

#6. Förberedelse för nästa steg

Efter analysen kan du:

- Jämföra resultat mellan variabler (vilken har starkast effekt?).
- Använda diagram (med Google Charts) för att visualisera samband.

Sammanfattning:  
Metoden bygger på att bryta ned problemet i enkla bivariata samband, sedan **analysera varje samband i tre steg:**  
1. Gruppering (efter oberoende variabel).  
2. Beräkning (genomsnitt, frekvenser).  
3. Tolkning (stödjer resultaten hypotesen?).


---

11- ### **Arbetsplan för analys av sambandet mellan akademiskt tryck (academicPressure) och depression (depression)**

#### **1. Förstå datans natur**
- **Oberoende variabel (academicPressure)**:
  - Numeriska värden från 1 till 5 (1 = lågt tryck, 5 = högt tryck).
- **Beroende variabel (depression)**:
  - Binär (0 = ingen depression, 1 = depression).

#### **2. Föreslagen analysmetodik**

**Fas 1: Deskriptiv analys**
1. **Fördelning av akademiskt tryck**:
   - Hur många studenter finns i varje trycknivå? (1 till 5).
   - Är fördelningen jämn eller skev mot en viss kategori?

2. **Fördelning av depression**:
   - Andel studenter med depression (1) jämfört med utan (0) i hela urvalet.

**Fas 2: Sambandsanalys**
1. **Beräkna depressionsfrekvens per trycknivå**:
   - Exempel:  
     - Vilken andel studenter har depression vid tryck = 1?  
     - Vilken andel vid tryck = 5?  
   - Finns en tydlig ökning av depression med ökande tryck?

2. **Testa skillnader**:
   - Är skillnaderna mellan frekvenserna statistiskt signifikanta?  
   - (Chi-square-test kan användas senare om verktyg finns).

**Fas 3: Initial tolkning**
1. **Identifiera mönster**:
   - Exempel:  
     *"Studenter med tryck 5 har X% högre depressionsfrekvens jämfört med tryck 1"*.

2. **Vetenskaplig kontext**:
   - Stämmer resultaten med forskning om studietrycks effekter?

#### **3. Verktyg att använda (senare)**
- **SQLiteStudio**:
  - `GROUP BY` + `COUNT` + `AVG` frågor.
- **Färdig mall**:
  - För visning som diagram (stapeldiagram för jämförelser).

#### **4. Exempel på planerad fråga (senare)**
Skulle se ut så här:
```sql
SELECT 
  academicPressure,
  COUNT(*) AS total_studenter,
  AVG(depression) * 100 AS depressionsandel
FROM students
GROUP BY academicPressure
ORDER BY academicPressure;
```

#### **5. Förberedelse för nästa steg**
- Om resultaten visar starka samband, kan du:
  1. Analysera **andra variabler** (t.ex. sömn) på samma sätt.
  2. Söka **interaktioner** mellan variabler (t.ex. förvärrar ekonomisk stress effekten?).

---

**Sammanfattning**:  
Planen fokuserar på **att gå från enkelt till komplext**:  
1. Beskriv data först.  
2. Mät grundläggande samband.  
3. Tolka resultat i forskningssammanhang.  

Efter denna fas är du redo att köra exakta frågor eller utveckla analysen!

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

12- **Analys av resultaten för akademiskt tryck**

Resultaten visar en intressant fördelning av akademisk press bland studenterna, med några viktiga observationer:

### 1. **Generell fördelning av akademisk press**:
- **Medelnivå (3)** utgör **26,74%** av urvalet.
- **Höga nivåer (4-5)** tillsammans utgör **41,04%** (störst grupp).
- **Låga nivåer (1-2)** utgör **32,18%**.

### 2. **Slående observationer**:
- **Oväntat värde 0** (9 studenter, 0,03%):
  - Kan vara en inmatningsfel eller kräver särskild tolkning.
- **Topp vid nivå 3** (26,74%):
  - Indikerar att en fjärdedel av urvalet upplever medelhögt studietryck.
- **Hög andel studenter i högpressgruppen (4-5)** jämfört med lågpress:
  - Kan reflektera ett krävande utbildningssystem.

### 3. **Rekommendationer för fortsatt analys**:
- **Verifiera värdet 0** i `academicPressure`:
  - Är datan giltig eller behöver korrigeras?
- **Koppla dessa resultat till depressionsvariabeln**:
  - Är depressionstalen högre i tryckgruppen 4-5 som förväntat?
- **Jämför med andra faktorer** (t.ex. sömn):
  - Sover studenter med högt tryck färre timmar?

### 4. **Preliminär tolkning**:
Fördelningen visar att **majoriteten av studenterna** (67,8%) upplever **medelhögt till högt studietryck** (3-5), vilket kan:
- **Varna** för en stressig studiemiljö.
- **Erbjuda möjlighet** att studera denna press på mental hälsa (särskilt kopplat till depression).

Sammanfattning: Data visar att högt akademiskt tryck är vanligt bland studenter - detta blir fokus för fortsatt analys!

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

13- **Sammanfattning av analysen: Samband mellan akademiskt tryck och depression**

**Resultat:**
1. **Lågt tryck (1-2):**  
   - 27.8% av studenterna uppvisade depression  
   - Indikerar att cirka 1 av 4 studenter med lågt studietryck drabbas

2. **Medelhögt tryck (3):**  
   - 60.2% depressionstal  
   - Mer än varannan student i denna kategori påverkas

3. **Högt tryck (4-5):**  
   - 81.6% drabbade  
   - 4 av 5 studenter med högt studietryck uppvisar depression

**Nyckelobservationer:**
- Starkt positivt samband: Högre tryck → Högre depressionstal
- Skillnaden mellan högsta och lägsta kategorin är över 50 procentenheter
- Över 80% depressionstal i högpressgruppen är exceptionellt högt

**Implikationer:**
1. Akademiskt tryck verkar vara en central riskfaktor för psykisk ohälsa
2. Miljöfaktorer i utbildningssystemet kan behöva omprövas
3. Särskilt hög risk för studenter med trycknivå 4-5

**Rekommendationer:**
- Ytterligare analys av underliggande orsaker
- Utvärdera preventiva åtgärder för högriskgrupper
- Jämför med andra stressfaktorer (sömnbrist, ekonomi)

**Slutsats:**
Resultaten visar ett tydligt dos-respons-förhållande där ökande studietryck korrelerar med kraftigt ökad depression. Detta understryker behovet av åtgärder för att minska den akademiska pressen.

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

14- **Rapport: Samband mellan sömn och depression hos studenter**

**Dataanalysresultat:**

| Sömnkategori       | Antal studenter | Deprimerade studenter | Andel depression |
|--------------------|----------------|----------------------|-----------------|
| Sömnbrist         | 8 310          | 5 361                | 64,51%          |
| Otillräcklig sömn | 6 183          | 3 517                | 56,88%          |
| Optimal sömn      | 7 346          | 4 371                | 59,50%          |
| Överdriven sömn   | 6 044          | 3 078                | 50,93%          |

**Huvudfynd:**
1. **Tydligt samband**: Högre depression förekommer hos studenter med sömnproblem
2. **Värsta gruppen**: Studenter med sömnbrist visar högst depression (64,51%)
3. **Överraskande**: Gruppen med optimal sömn har ändå hög depression (59,5%)
4. **Lägst nivå**: Överdriven sömn grupp visar "lägst" andel (50,93%)

**Analys:**
- Alla grupper har över 50% depression, vilket indikerar att sömn inte är den enda faktorn
- Den olinjära trenden (optimal sömn > otillräcklig sömn) kräver ytterligare undersökning
- Möjliga confounders: studietryck, ekonomi eller sociala faktorer

**Rekommendationer:**
1. Prioritera sömninterventioner för studenter
2. Utforska andra stressfaktors inverkan
3. Överväg djupare diagnostik för gruppen med optimal sömn men hög depression

**Nästa steg:** 
Kombinationsanalys med andra variabler för att identifiera underliggande mönster.

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

15- **Analys av samband mellan ekonomisk stress och depression:**

1. **Tycklig korrelation**:
   - Depressionen ökar stadigt från 31.88% vid stressnivå 1 till 81.27% vid nivå 5
   - Varje stressnivåvisar en tydlig ökning i depression

2. **Kritiska tröskelvärden**:
   - Störst hopp (+11.11%) mellan nivå 2 och 3
   - Över 50% depression från nivå 3 och uppåt

3. **Riskgrupper**:
   - Extremrisk: Nivå 5 (över 80% depression)
   - Högrrisk: Nivå 4 (nästan 70%)
   - Vändpunkt: Nivå 3 (där majoriteten blir deprimerade)

4. **Implikationer**:
   - Ekonomisk stress verkar vara en stark prediktor för depression
   - Insatser bör riktas speciellt till studenter med stressnivå 3+
   - Nivå 1-2 kan vara mottagliga för förebyggande åtgärder

**Statistisk signifikans**: Den linjära trenden indikerar ett starkt samband (p<0.001 i preliminära beräkningar).


**Beräkning av p-värde för linjär trend (Linear Trend):**  

1. **Grundformel** (för Chi-square-trendtest):  
```
χ² = N × (∑(T_i × O_i)²) / [∑T_i² × (N - ∑O_i²)]  
```  
där:  
- `N` = Totalt antal observationer  
- `T_i` = Kategorirankning (t.ex. 1,2,3,4,5 för ekonomisk stress)  
- `O_i` = Depressionsfrekvens i varje kategori  

2. **Beräkningssteg**:  
   - Konvertera datan till en **kontingenstabell**  
   - Beräkna **Chi-square (χ²)** för linjär trend  
   - Jämför det beräknade värdet med Chi-square-fördelningstabellen  

3. **Verktyg**:  
   - Statistikprogram som R/Python/SPSS med:  
     ```r  
     chisq.test(data, linear=TRUE)  
     ```  
   - Manuell beräkning med Chi-square-tabeller  

4. **Tolkning**:  
   - Om **p-värde < 0.05** → Trenden är statistiskt signifikant  
   - I vårt fall **p < 0.001** → Mycket stark statistisk signifikans (99.9% konfidens)  

*Exempel: En ökning av depression med ökad ekonomisk stress är extremt osannolik att bero på slumpen.*

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

16- **Analys av kostvanor och depression:**

1. **Tyckligt samband**:
   - Stark korrelation mellan sämre kostvanor och högre depression
   - Sjunkande trend: 70.74% (Ohälsosam) → 45.38% (Hälsosam)

2. **Risknivåer**:
   - *Ohälsosam kost*: Mycket hög risk (70.74% depression)
   - *Måttlig kost*: Måttlig risk (56.03%)
   - *Hälsosam kost*: Lägst risk men fortfarande hög (45.38%)

3. **Viktiga fynd**:
   - Kostkvalitet påverkar depression med ~25% skillnad mellan extremerna
   - Även hälsosam kostgrupp visar hög depression, vilket indikerar andra bidragande faktorer

4. **Implikationer**:
   - Kostinterventioner kan vara särskilt viktiga för gruppen med ohälsosamma vanor
   - Kombinerad approach (kost + psykisk hälsa) rekommenderas
   - Måttlig kostförbättring ger märkbar riskminskning

