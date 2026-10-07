import re, uuid
from datetime import datetime, timezone
from db import db

def slugify(text):
    text=re.sub(r"[^\w\s-]","",text.lower()).strip(); return re.sub(r"[-\s]+","-",text)
def now_iso(): return datetime.now(timezone.utc).isoformat()

# Real KEM Enterprises catalogue seed. Source: company Jhula, Ducting and Signage catalogues.
# Black catalogue headings are represented as categories; catalogue items/variants are products.
JHULA = [
('B1','U Kada','U KADA','10/12 inch; S.S/Antic/Gold/Black','Rates ₹1,800–₹2,250'),
('B2','Bearing Kada','U KADA','C.P./A.B/R.G/Black','₹750/₹950/₹960/₹950'),
('B3','T Type Bearing Kada','U KADA','C.P./A.B/R.G/Black','₹750/₹1,080/₹1,100/₹1,080'),
('B4','Revolving Bearing Kada','U KADA','C.P./A.B/R.G/Black','₹1,080/₹1,250/₹1,280/₹1,250'),
('B5','Premium Bottom Kada','PREMIUM BOTTOM KADA','12mm/16mm; S.S/Antic/R.G/Black','₹320–₹650'),
('B6','Super Deluxe Bearing Kada','PREMIUM BOTTOM KADA','S.S/Antic','₹750/₹900'),
('B7','Super Circle Bearing Kada','PREMIUM BOTTOM KADA','C.P/Antic','₹1,250/₹1,650; per-inch rates also listed'),
('B8','Super Square Bearing Kada','SUPER SQUARE BEARING KADA','C.P/Antic','₹1,250/₹1,650; per-inch rates also listed'),
('B9','Premium Round Bearing Kada','SUPER SQUARE BEARING KADA','4–12 inch; S.S/Antic','₹2,400–₹5,400'),
('B10','Premium Sq. Bearing Kada','SUPER SQUARE BEARING KADA','2–12 inch; S.S/Antic','₹3,200–₹8,000'),
('B11','Rassi Zulla Saliya','RASSI ZULLA SALIYA','16mm; C.P/Antic','₹460/₹500'),
('B12','Damru Zulla Saliya','RASSI ZULLA SALIYA','20mm; C.P/Antic','₹600/₹660'),
('B13','Matka Zulla Saliya','RASSI ZULLA SALIYA','25mm; C.P/Antic','₹800/₹860'),
('B14','Zulla Saliya','ZULLA SALIYA','9mm/12mm; SS/Antic','₹50–₹160'),
('B15','Regular Zulla Saliya','ZULLA SALIYA','12/16/20/25mm; SS/Antic','₹110–₹380'),
('B16','Conceal Zulla Saliya','CONCEAL ZULLA SALIYA','12mm; SS/Antic','₹140/₹180'),
('B17','S Hook Zulla Chain','CONCEAL ZULLA SALIYA','5.5mm/7mm','₹70/₹120'),
('B18','S.S Hook','CONCEAL ZULLA SALIYA','8mm/12mm; S.S/Antic','₹45–₹140'),
('B19','W - Kada','W - KADA','10mm/12mm; S.S/Antic','₹90–₹200'),
('B20','Single / Double Hinges','W - KADA','10/12 inch; S.S/Antic','₹1,450–₹2,200'),
('B21','Jhula Chain','W - KADA','6mm/8mm; S.S','Rate not listed in catalogue'),
('B22','Eye Bolt','EYE BOLT','', 'MRP ₹39'),
('B23','Eye Nut','EYE BOLT','', 'MRP ₹37'),
('B24','Jhula Side Corner (Set of 4 pcs)','EYE BOLT','S.S/Antic','MRP ₹1,200/₹1,500'),
('B25','Sneb Hook','EYE BOLT','6mm/8mm','₹70/₹85'),
('B26','Jula Springs','EYE BOLT','S.S/M.S','₹300/₹180'),
('B27','Top Bottom','EYE BOLT','3mm–10mm','MRP as per size'),
('B28','Wire Rope Cable Jula Fitting','WIRE ROPE CABLE JULA FITTING','20mm/25mm; 5–8 ft; S.S; multiple colours','₹2,800–₹4,000'),
]

A_NAMES = {
1:'Rope Wire Fitting - One Top & One Bottom',2:'Rope Wire Fitting - One Top & One Bottom with Wire GI M.S.',3:'Rope Wire Fitting - One Top & One Bottom with Wire S.S. 304',4:'Heavy Top',5:'J M Top',6:'Push Top',7:'2 Screw Top',8:'3 Screw Top',9:'4mm Wire Bottom',10:'Hanging Set',11:'M4 Gripper',12:'M5 Gripper',13:'1.5mm Wire Rope',14:'1.5mm Wire Rope',15:'1mm PVC Coated',16:'Wire Rope Suspension Kit',17:'Wire Rope Suspension Kit',18:'Wire Rope Suspension Kit',19:'6mm Wire Bottom',20:'8mm Wire Bottom',21:'8mm Wire Rope Hanging',22:'10mm Wire Rope Hanging',23:'12mm Wire Rope Hanging',24:'Wire Rope Y Hanging',25:'All Type of Hinges',26:'Exit Lights - All Type of Hanging',27:'Cam Lock - All Type of Lock',28:'Wire Rope Cleam',29:'Wire Rope Lugs',30:'Wire Rope Fitting',31:'Display Mount Fitting Set',32:'Multiple Signage Hanging Set',33:'Acrylic Wall Mount Stud (All Size)',34:'M.S. Wire Rope - All Size'}
A_RATES={1:'₹50',2:'₹60',3:'₹70',4:'₹30',5:'₹25',6:'₹30',7:'₹47',8:'₹45',9:'₹35',10:'₹65',11:'₹15',12:'₹16',13:'₹10',14:'₹15',15:'₹15',16:'Rate as per need',17:'Rate as per need',18:'Rate as per need',19:'₹30',20:'₹40',21:'₹70',22:'₹75',23:'₹95',24:'₹85',25:'Rate as per quantity',26:'₹60',27:'₹15',28:'MRP ₹4',29:'MRP ₹2',30:'Rate as per need',31:'Rate as per need',32:'Rate as per need',33:'Rate as per need',34:'Rate as per need'}
SIGNAGE=[]
for i,n in A_NAMES.items(): SIGNAGE.append((f'A{i}',n,'SINAGE HANGING','',A_RATES[i]))
SIGNAGE += [
('A35','S.S. Stud','S.S. STUD','13–25mm; multiple lengths','₹7–₹65 per pcs'),('A36','All Type of Color Stud','S.S. STUD','13–25mm; multiple lengths','₹17–₹75 per pcs'),('A37','Power Supply','POWER SUPPLY','12V; Waterproof/Super/Premium Series; 36W–400W','₹45–₹460; 1–2 year warranty'),('A38','S.S. Mirror Cap','S.S. MIRROR CAP','13–50mm','₹3.50–₹19 per pcs; colour ₹10–₹29'),('A39','Mirror Screw','S.S. MIRROR CAP','12–75mm','₹1.17–₹2 per pcs; all type ₹6.17–₹7'),('A40','Drywall Screw (China Screw)','DRYWALL SCREW (CHINA SCREW)','6/8 x 13–75mm; pack 250–1000 pcs','₹130–₹187'),('A41','G.I M.S. Screw','DRYWALL SCREW (CHINA SCREW)','6/8 x 13–75mm; pack 250–1000 pcs','₹180–₹237'),('A42','Self Thread Screw (S.S.)','SELF THREAD SCREW (S.S.)','6/8 x 13–75mm; pack 250–1000 pcs','₹210–₹267'),('A43','LED Strip Light (with driver)','LED STRIP LIGHT','12V; 5 meter; White/Warm White/Multi Color','₹225–₹235; 1 year warranty'),('A44','LED Strip Light','LED STRIP LIGHT','12V; 5 meter; White/Warm White/Multi Color','₹65–₹75; no warranty'),('A45','LED Strip Light (without driver)','LED STRIP LIGHT','12V; 5 meter; White/Warm White/Multi Color','₹440–₹450; no warranty'),('A46','Speaker Transparant Wire / LED Neon Clear Transparant Wire','SPEAKER TRANSPARANT WIRE','14/38,14/40,7/38,7/40; 90m; Transparant','₹350–₹750'),('A47','LED Wire 7 Series','SPEAKER TRANSPARANT WIRE','7/38,7/40,7/52; 2 Core; 92m; Red & Black','₹450–₹530'),('A48','LED Wire 14 Series','SPEAKER TRANSPARANT WIRE','14/38,14/40,14/52; 2 Core; 92m; Red & Black','₹450–₹530'),('A49','L Corner','L CORNER','1x1 to 4x4','₹1.50–₹3.50 per pcs'),('A50','Tubelight','L CORNER','','Rate as per quantity'),('A51','Ceiling Mounted Chain','L CORNER','12–36 inch / 1–3 feet','₹12–₹24')]

C_NAMES=['Eye Ball 2 Way Fitting','Wire Rope Gripper Fitting','Loop J Hook','Pannel Hanging','Light Hanging All Type','2 Way Fitting','All Type Wire Rope Fitting','2 Way Lock (All Size)','Signage Hanging','Claimp (All Size)','Eye Nut (All Size)','Eye Bolt (All Size)','Snab Hook (All Size)','Snab Ring (All Size)','Snab Hook Round (All Size)','3 Screw Gripper Top Bottom J Hook Set','3 Screw Top','2 Screw Top','12mm Push Bottom','Anchor Fastner 2 Way Fitting','2 Side Ceiling Attachment','Track Light Hanging','Suspention Kit','Light Hanging','All Size Board Hanging','Top-Bottom (All Size)','1.5mm Wire Rope 2 Way Lock Fitting','Ducting Hanging','Duct Hanging 2 Way Lock','Duct Hanging Anchor Fastner 2 Way Lock','Clip','2 Way Lock Rod Fitting','Wire Rope Fitting','Gripple Normal Size','Linear Fitting','Gripple Rod Fitting','Square Pannel Hanging Fitting','2 Way Circle Fitting','12mm Bottom Fitting','Wire Rope Fitting (4mm,6mm,8mm,10mm)','Wire Rope (All Size)','1.5mm Gripper','Gripper Fitting','Wire Rope Attachment Fitting','Wire Rope Top-Bottom All Size','Eye Bolt (M6,M8,M10)','Wire Rope Claimp','Anchor Fastner','All Type Aluminium Lugs','Wire Rope Goti (All Size)','Star Wire Rope Claimp','Wire Rope Claimp 2 Screw','All Type Anchor Fastner','Nut Bolt Wiser','All Type Machinery Screw','All Type Screw','Beam Pipe Claimp','Beam Claimp','Beam Claimp','All Type Thread Rod','Wire Rope Swage','Relling Stud','Eye Fitting']
DUCTING=[]
DUCTING_CATEGORY_MAP = {
    **{i:'ALL TYPE WIRE ROPE FITTING' for i in range(1,28)},
    **{i:'DUCTING HANGING' for i in range(28,37)},
    **{i:'SQUARE PANNEL HANGING FITTING' for i in range(37,46)},
    **{i:'ALL TYPE ALUMINIUM LUGS' for i in range(46,55)},
    **{i:'ALL TYPE MACHINERY SCREW' for i in range(55,64)},
}
for i,n in enumerate(C_NAMES,1):
    DUCTING.append((f'C{i}',n,DUCTING_CATEGORY_MAP[i],'','Rate as per order'))


DETAILED_SPECS = {
'B1':[('10 INCH · S.S','₹1,800'),('12 INCH · S.S','₹1,900'),('10 INCH · ANTIC','₹2,100'),('12 INCH · ANTIC','₹2,200'),('10 INCH · GOLD','₹2,150'),('12 INCH · GOLD','₹2,250'),('10 INCH · BLACK','₹2,100'),('12 INCH · BLACK','₹2,200')],
'B2':[('C.P','₹750'),('A.B','₹950'),('R.G','₹960'),('BLACK','₹950')],
'B3':[('C.P','₹750'),('A.B','₹1,080'),('R.G','₹1,100'),('BLACK','₹1,080'),('Catalogue Note','Square Plate, Round Plate has a different rate')],
'B4':[('C.P','₹1,080'),('A.B','₹1,250'),('R.G','₹1,280'),('BLACK','₹1,250'),('Catalogue Note','Square Plate, Round Plate has a different rate')],
'B5':[('12mm · S.S','₹320'),('16mm · S.S','₹480'),('12mm · ANTIC','₹490'),('16mm · ANTIC','₹650'),('12mm · R.G','₹490'),('16mm · R.G','₹650'),('12mm · BLACK','₹490'),('16mm · BLACK','₹650')],
'B6':[('S.S','₹750'),('ANTIC','₹900')],
'B7':[('C.P','₹1,250'),('ANTIC','₹1,650'),('C.P per inch','₹150'),('ANTIC per inch','₹180')],
'B8':[('C.P','₹1,250'),('ANTIC','₹1,650'),('C.P per inch','₹150'),('ANTIC per inch','₹180')],
'B9':[('4 inch · S.S','₹2,400'),('4 inch · ANTIC','₹3,000'),('6 inch · S.S','₹2,800'),('6 inch · ANTIC','₹3,600'),('8 inch · S.S','₹3,200'),('8 inch · ANTIC','₹4,200'),('10 inch · S.S','₹3,600'),('10 inch · ANTIC','₹4,800'),('12 inch · S.S','₹4,000'),('12 inch · ANTIC','₹5,400')],
'B10':[('2 inch · S.S','₹3,200'),('2 inch · ANTIC','₹3,800'),('4 inch · S.S','₹3,600'),('4 inch · ANTIC','₹4,600'),('6 inch · S.S','₹4,000'),('6 inch · ANTIC','₹5,800'),('8 inch · S.S','₹4,400'),('8 inch · ANTIC','₹6,200'),('10 inch · S.S','₹4,800'),('10 inch · ANTIC','₹7,000'),('12 inch · S.S','₹5,200'),('12 inch · ANTIC','₹8,000')],
'B11':[('16mm · C.P','₹460'),('16mm · ANTIC','₹500')],
'B12':[('20mm · C.P','₹600'),('20mm · ANTIC','₹660')],
'B13':[('25mm · C.P','₹800'),('25mm · ANTIC','₹860')],
'B14':[('9mm · S.S','₹50'),('9mm · ANTIC','₹90'),('12mm · S.S','₹110'),('12mm · ANTIC','₹160')],
'B15':[('12mm · S.S','₹110'),('12mm · ANTIC','₹140'),('16mm · S.S','₹210'),('16mm · ANTIC','₹240'),('20mm · S.S','₹240'),('20mm · ANTIC','₹280'),('25mm · S.S','₹340'),('25mm · ANTIC','₹380')],
'B16':[('12mm · S.S','₹140'),('12mm · ANTIC','₹180')],
'B17':[('5.5mm','₹70'),('7mm','₹120')],
'B18':[('8mm · S.S/ANTIC','₹45 / ₹85'),('12mm · S.S/ANTIC','₹80 / ₹140')],
'B19':[('10mm · S.S/ANTIC','₹90 / ₹150'),('12mm · S.S/ANTIC','₹150 / ₹200')],
'B20':[('10 INCH · S.S/ANTIC','₹1,450 / ₹2,100'),('12 INCH · S.S/ANTIC','₹1,650 / ₹2,200')],
'B21':[('6mm · S.S','Rate not printed in catalogue'),('8mm · S.S','Rate not printed in catalogue')],
'B22':[('MRP','₹39')], 'B23':[('MRP','₹37')],
'B24':[('S.S Finish · set of 4 pcs','₹1,200'),('Antic Finish · set of 4 pcs','₹1,500')],
'B25':[('6mm','₹70'),('8mm','₹85')], 'B26':[('S.S','₹300'),('M.S','₹180')], 'B27':[('3mm–10mm','MRP as per size')],
'B28':[('5 ft · S.S','₹2,800'),('6 ft · S.S','₹3,000'),('7 ft · S.S','₹3,200'),('8 ft · S.S','₹3,400'),('5 ft · Colour','₹3,400'),('6 ft · Colour','₹3,600'),('7 ft · Colour','₹3,800'),('8 ft · Colour','₹4,000'),('Available colours','Antic, Rosegold, Gold, Black & All Color'),('Pack sizes','20mm / 25mm · 4 pcs in one packet'),('Catalogue Note','Amount changes as per colour; Top to Bottom without S Hook; customized as per customer requirement')],
'A35':[('1/2 x 1/2 · 13 x 13mm','₹7/pc'),('1/2 x 3/4 · 13 x 19mm','₹8/pc'),('1/2 x 1 · 13 x 25mm','₹9/pc'),('3/4 x 3/4 · 19 x 19mm','₹12/pc'),('3/4 x 1 · 19 x 25mm','₹13/pc'),('3/4 x 1.5 · 19 x 38mm','₹20/pc'),('3/4 x 2 · 19 x 50mm','₹22/pc'),('3/4 x 3 · 19 x 75mm','₹30/pc'),('3/4 x 4 · 19 x 100mm','₹40/pc'),('1 x 1 · 25 x 25mm','₹22/pc'),('1 x 2 · 25 x 50mm','₹34/pc'),('1 x 3 · 25 x 75mm','₹45/pc'),('1 x 4 · 25 x 100mm','₹65/pc'),('Catalogue Note','Customized STUD and manufacturing available as per customer requirement')],
'A36':[('1/2 x 1/2 · 13 x 13mm','₹17/pc'),('1/2 x 3/4 · 13 x 19mm','₹18/pc'),('1/2 x 1 · 13 x 25mm','₹19/pc'),('3/4 x 3/4 · 19 x 19mm','₹22/pc'),('3/4 x 1 · 19 x 25mm','₹23/pc'),('3/4 x 1.5 · 19 x 38mm','₹30/pc'),('3/4 x 2 · 19 x 50mm','₹32/pc'),('3/4 x 3 · 19 x 75mm','₹40/pc'),('3/4 x 4 · 19 x 100mm','₹50/pc'),('1 x 1 · 25 x 25mm','₹32/pc'),('1 x 2 · 25 x 50mm','₹44/pc'),('1 x 3 · 25 x 75mm','₹55/pc'),('1 x 4 · 25 x 100mm','₹75/pc')],
'A37':[('SUPER · 12V · 5A · 60W','₹130 · 2 Year'),('SUPER · 12V · 10A · 120W','₹195 · 2 Year'),('SUPER · 12V · 12.5A · 150W','₹230 · 2 Year'),('SUPER · 12V · 16.5A · 200W','₹285 · 2 Year'),('SUPER · 12V · 33A · 400W','₹360 · 2 Year'),('PREMIUM · 12V · 3A · 36W','₹45 · 1 Year'),('PREMIUM · 12V · 5A · 60W','₹70 · 1 Year'),('PREMIUM · 12V · 10A · 120W','₹115 · 1 Year'),('PREMIUM · 12V · 15A · 180W','₹165 · 1 Year'),('WATERPROOF · 12V · 5A · 60W','₹220 · 2 Year'),('WATERPROOF · 12V · 10A · 120W','₹260 · 2 Year'),('WATERPROOF · 12V · 12.5A · 150W','₹330 · 2 Year'),('WATERPROOF · 12V · 16.5A · 200W','₹380 · 2 Year'),('WATERPROOF · 12V · 33A · 400W','₹460 · 2 Year')],
'A38':[('S.S Mirror Cap · 1/2 · 13mm','₹3.50/pc'),('S.S Mirror Cap · 3/4 · 19mm','₹3.90/pc'),('S.S Mirror Cap · 1 · 25mm','₹4.30/pc'),('S.S Mirror Cap · 1 x 1/2 · 38mm','₹12/pc'),('S.S Mirror Cap · 1 x 2 · 50mm','₹19/pc'),('Colour Mirror Cap · 1/2 · 13mm','₹10/pc'),('Colour Mirror Cap · 3/4 · 19mm','₹11/pc'),('Colour Mirror Cap · 1 · 25mm','₹12/pc'),('Colour Mirror Cap · 1 x 1/2 · 38mm','₹22/pc'),('Colour Mirror Cap · 1 x 2 · 50mm','₹29/pc')],
'A39':[('Mirror Screw · 1/2 · 12mm','₹1.17/pc'),('Mirror Screw · 3/4 · 19mm','₹1.17/pc'),('Mirror Screw · 1 · 25mm','₹1.22/pc'),('Mirror Screw · 1 x 1/4 · 32mm','₹1.26/pc'),('Mirror Screw · 1 x 1/2 · 38mm','₹1.30/pc'),('Mirror Screw · 2 · 50mm','₹1.50/pc'),('Mirror Screw · 2 x 1/2 · 60mm','₹1.71/pc'),('Mirror Screw · 3 · 75mm','₹2/pc'),('All Type Mirror Screw · 1/2 · 12mm','₹6.17/pc'),('All Type Mirror Screw · 3/4 · 19mm','₹6.17/pc'),('All Type Mirror Screw · 1 · 25mm','₹6.22/pc'),('All Type Mirror Screw · 1 x 1/4 · 32mm','₹6.26/pc'),('All Type Mirror Screw · 1 x 1/2 · 38mm','₹6.30/pc'),('All Type Mirror Screw · 2 · 50mm','₹6.50/pc'),('All Type Mirror Screw · 2 x 1/2 · 60mm','₹6.71/pc'),('All Type Mirror Screw · 3 · 75mm','₹7/pc')],
'A43':[('12V · 5 meter · White','₹225'),('12V · 5 meter · Warm White','₹230'),('12V · 5 meter · Multi Color','₹235'),('Warranty','1 Year')],
'A44':[('12V · 5 meter · White','₹65'),('12V · 5 meter · Warm White','₹70'),('12V · 5 meter · Multi Color','₹75'),('Warranty','No Warranty')],
'A45':[('12V · 5 meter · White','₹440'),('12V · 5 meter · Warm White','₹445'),('12V · 5 meter · Multi Color','₹450'),('Warranty','No Warranty')],
'A46':[('14/38 · 90m · Transparant · 2 Core','₹750'),('14/40 · 90m · Transparant · 2 Core','₹680'),('7/38 · 90m · Transparant · 1 Core','₹480'),('7/40 · 90m · Transparant · 1 Core','₹350')],
'A47':[('7/38 · 92m · Red & Black · 2 Core','₹530'),('7/40 · 92m · Red & Black · 2 Core','₹490'),('7/52 · 92m · Red & Black · 2 Core','₹450')],
'A48':[('14/38 · 92m · Red & Black · 2 Core','₹530'),('14/40 · 92m · Red & Black · 2 Core','₹490'),('14/52 · 92m · Red & Black · 2 Core','₹450')],
'A49':[('1 x 1','₹1.50/pc'),('1 x 1/2','₹2.00/pc'),('2 x 2','₹2.50/pc'),('3 x 3','₹3.00/pc'),('4 x 4','₹3.50/pc')],
'A50':[('Rate','As per quantity')],
'A51':[('12 inch · 1 feet','₹12'),('18 inch · 1.5 feet','₹15'),('24 inch · 2 feet','₹18'),('30 inch · 2.5 feet','₹21'),('36 inch · 3 feet','₹24')],
}

# Screw tables are kept exact instead of collapsing them to a price range.
def _screw_rows(prefix, rates6, rates8):
    sizes=['13','19','25','32','38','50','60','75']; packs=['1000','800','600','500','500','400','250','250']
    return [(f'6 x {z}mm · {pk}pcs',f'₹{r}') for z,pk,r in zip(sizes,packs,rates6)] + [(f'8 x {z}mm · {pk}pcs',f'₹{r}') for z,pk,r in zip(sizes,packs,rates8)]
DETAILED_SPECS['A40']=_screw_rows('A40',['149','177','130','150','165','175','159','175'],['159','187','140','160','175','185','169','185'])
DETAILED_SPECS['A41']=_screw_rows('A41',['199','227','180','200','215','225','209','225'],['209','237','190','210','225','235','219','235'])
DETAILED_SPECS['A42']=_screw_rows('A42',['229','257','210','230','245','255','239','255'],['239','267','220','240','255','265','249','265'])

def image_for(code):
    if code.startswith('A'):
        n=int(code[1:]); return f'/catalogue/A{n}.jpg' if n<=34 else f'/catalogue/signage_page{min(13, max(6, {35:6,36:6,37:8,38:7,39:7,40:9,41:9,42:10,43:11,44:11,45:11,46:12,47:12,48:12,49:13,50:13,51:13}.get(n,6)))}.jpg'
    if code.startswith('C'):
        n=int(code[1:]); return f'/catalogue/C{n}.jpg'
    if code.startswith('B'):
        n=int(code[1:]); page=2 if n<=4 else 3 if n<=7 else 4 if n<=10 else 5 if n<=13 else 6 if n<=15 else 7 if n<=18 else 8 if n<=21 else 9 if n<=27 else 10; return f'/catalogue/jhula_page{page}.jpg'
    return ''

async def seed_data():
    # Seed only when empty. Existing live data can be cleared using the admin/API migration endpoint or DB operation.
    if await db.categories.count_documents({})==0 and await db.products.count_documents({})==0:
        rows=JHULA+SIGNAGE+DUCTING
        cat_names=[]
        for _,_,cat,_,_ in rows:
            if cat not in cat_names: cat_names.append(cat)
        cat_first_img = {}
        for code, _, cat, _, _ in rows:
            if cat not in cat_first_img:
                cat_first_img[cat] = image_for(code)
        cats=[]
        for order,name in enumerate(cat_names):
            img = cat_first_img.get(name, '')
            c={'id':str(uuid.uuid4()),'name':name,'slug':slugify(name),'description':f'{name} from the official KEM Enterprises product catalogue.','image':img,'parent_id':None,'order':order,'active':True,'seo_title':f'{name} | KEM Enterprises','seo_description':f'Explore {name} products from KEM Enterprises.','seo_keywords':name.lower(),'created_at':now_iso()}; cats.append(c)
        await db.categories.insert_many(cats); by={c['name']:c for c in cats}
        docs=[]
        for code,name,cat,spec,rate in rows:
            c=by[cat]; specs=[]
            if code in DETAILED_SPECS:
                specs=[{'label':label,'value':value} for label,value in DETAILED_SPECS[code]]
            else:
                if spec: specs.append({'label':'Catalogue Specification','value':spec})
                specs.append({'label':'Catalogue Rate','value':rate})
            docs.append({'id':str(uuid.uuid4()),'name':name,'slug':slugify(f'{code}-{name}'),'sku':code,'category_id':c['id'],'category_name':cat,'subcategory':'','images':[image_for(code)],'video':'','short_description':f'{name} ({code}) from the KEM Enterprises catalogue.','description':f'{name}, catalogue code {code}. Specifications and rates are preserved from the supplied KEM Enterprises catalogue.','specifications':specs,'material':'','finish':'','size':spec,'dimensions':'','wire_diameter':'','load_capacity':'','thread_size':'','application':'','variants':[],'packaging':'','moq':'','brand':'KEM Enterprises','tags':[cat.lower(),code.lower()],'related_ids':[],'downloads':[],'price':0,'show_price':False,'featured':False,'is_new':False,'best_seller':False,'popular':False,'active':True,'views':0,'enquiry_count':0,'seo_title':f'{name} | KEM Enterprises','seo_description':f'{name} ({code}) - KEM Enterprises {cat}.','seo_keywords':f'{name}, {cat}, KEM Enterprises','created_at':now_iso()})
        await db.products.insert_many(docs)
    if await db.settings.count_documents({})==0:
        await db.settings.insert_one({'id':'global','company':{'name':'KEM Enterprises','logo':'','favicon':'','about':'Manufacturer, wholesaler and dealer of hardware and tool accessories.','address':'Shop 34/R1, Asmi Complex, Ram Mandir Road, Goregaon (W), Near Mrinal Tai Gore Flyover, Mumbai - 400104','gstin':'27HTHPK1096M1Z1'},'contact':{'phone':'+91 8003224406','alt_phone':'+91 7742379326','whatsapp':'+91 8003224406','email':'info@kementerprise.com','hours':'Mon - Sat'},'social':{'instagram':'','facebook':'','linkedin':'','youtube':''},'whatsapp':{'number':'918003224406','default_message':'Hello KEM Enterprises, I would like to know more about your products.','product_template':'Hello KEM Enterprises, I am interested in {product}. Please share price, availability and specifications.'},'homepage':{'hero_title':'Affordable Solution for Your Need','hero_subtitle':'All type of hardware and tool accessories available. Manufacturer, wholesaler and dealer.','hero_image':''},'invoice':{'prefix':'INV','start':1001,'gst':18,'terms':'Terms as agreed.'},'created_at':now_iso()})
