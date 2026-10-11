// Meslek / kariyer tanımları. Alan açıklamaları: data/README.md
// Maaşlar yıllık brüt oyun tutarıdır; oyun ülke ve ekonomi katsayılarını uygular.
const TEAM_SPORT_POOLS = [
  [
    "Türkiye",
    "Fener Bahçe Basket|Anadolu Efesli|Galata Saray Basket|Beşiktaş Kartalları|Karşıyaka Körfez|Tofaş Bursa|Türk Telekom Başkent|Darüşşafaka Yeşil",
    "Balıkesir Karesi|Ankara Kolejliler|Gaziantep Antep|Konya Selçuk|Mersin Akdeniz|İstanbul Sigorta|Bursa Finalspor|Sakarya Ada Basket",
    "Halk Bank Başkent|Ziraat Başkent|Fener Bahçe Voley|Galata Saray Voley|Arkas İzmir|Bursa Büyükşehir Voley|Spor Toto Başkent|Alanya Sahil Voley",
    "İstanbul Belediye Voley|Konya Büyükşehir Voley|İzmir Saint Joseph|Ankara Maliye Voley|Bursa İnegöl Voley|Kayseri Melikgazi|Hatay Payas Voley|Ordu Akkuş Voley",
  ],
  [
    "ABD",
    "Boston Celts|Los Angeles Lakerside|Chicago Bulls Eye|Golden State Warriors Bay|Miami Flames|New York Knickers|Dallas Mavericks West|Denver Gold",
    "Maine Celts|South Bay Lakerside|Austin Spurside|Santa Cruz Warriors Bay|Rio Grande Viperside|Iowa Wolves North|Long Island Netside|Grand Rapids Gold Rush",
    "Atlanta Vibe City|Omaha Supernovas Sky|Orlando Valkyrie|Columbus Fury City|San Diego Mojo Coast|Vegas Thrill City|Grand Rapids Rise Up|Indy Ignite City",
    "Austin Volley Stars|Houston Volley Stars|Madison Volley Stars|Salt Lake Volley Stars|San Francisco Volley Stars|Los Angeles Volley Stars|Dallas Volley Stars|Chicago Volley Stars",
  ],
  [
    "İngiltere",
    "London Lionhearts|Leicester Riders City|Newcastle Eagle Wings|Sheffield Shark Bay|Manchester Giant Hoops|Bristol Flyers City|Cheshire Phoenix Rise|Surrey Scorchers Heat",
    "Reading Rockets City|Derby Trailblazers Path|Hemel Storm City|Worthing Thunder Coast|Nottingham Hoods City|Bradford Dragons Fire|Essex Rebels City|Solent Kestrels Wing",
    "London Polonias|Durham Palatine|Sheffield Hallam Voley|Newcastle Staffs Voley|Richmond Dock Voley|Leeds Gorse Voley|Essex Rebel Voley|Malory Eagle Voley",
    "Birmingham Volley City|Bristol Volley City|Manchester Volley City|Cambridge Volley City|Oxford Volley City|Southampton Volley City|Nottingham Volley City|Liverpool Volley City",
  ],
  [
    "Almanya",
    "Bayern Munich Hoops|Alba Berlin Blue|Bonn Telekom Hoops|Ulm Orange Hoops|Oldenburg Basket Bay|Ludwigsburg Giants City|Bamberg Basket City|Würzburg Basket City",
    "Jena Science Hoops|Trier Gladiator City|Karlsruhe Lions City|Frankfurt Skyliner City|Tübingen Tiger Hoops|Hagen Phoenix City|Bremerhaven Polar Hoops|Giessen 47 Hoops",
    "Berlin Recycling Volley|Friedrichshafen Lake Volley|Düren Power Volley|Lüneburg Salt Volley|Giesen Grizzly Volley|Herrsching Bay Volley|Bühl Bisons Volley|Karlsruhe Baden Volley",
    "Dresden Volley City|Schüttorf Volley City|Kiel Eagle Volley|Bocholt Volley City|Essen Human Volley|Mainz Gonsenheim Volley|Grafing Volley City|Mühldorf Volley City",
  ],
  [
    "Fransa",
    "Monaco Royal Basket|Lyon Villeurbanne Basket|Paris Capital Basket|Bourg Bresse Basket|Strasbourg Alsace Basket|Limoges Green Basket|Cholet City Basket|Le Mans Sarthe Basket",
    "Blois Loire Basket|Orléans Loiret Basket|Roanne Choir Basket|Nantes Atlantic Basket|Poitiers City Basket|Rouen Métropole Basket|Vichy Thermal Basket|Antibes Shark Basket",
    "Tours Loire Volley|Chaumont Haute Volley|Montpellier Coast Volley|Poitiers Stade Volley|Paris Capital Volley|Saint Nazaire Atlantic|Tourcoing Lille Volley|Toulouse Spacer Volley",
    "Cannes Dragon Volley|Ajaccio Island Volley|Martigues Coast Volley|Nancy Grand Volley|Rennes Breton Volley|Fréjus Coast Volley|Saint Quentin City Volley|Cambrai City Volley",
  ],
  [
    "İtalya",
    "Milano Olimpia City|Bologna Virtus City|Bologna Fortitudo City|Venezia Reyer City|Sassari Dynamo City|Trento Aquila City|Brescia Lion Basket|Reggio Emilia Basket",
    "Cantù Lake Basket|Rimini Riviera Basket|Udine Apu Basket|Verona Scaligera Basket|Forlì Unieuro City|Pesaro Victoria Basket|Torino Royal Basket|Livorno Liberty Basket",
    "Perugia Sir Volley|Trentino Mountain Volley|Civitanova Lube Volley|Modena Yellow Volley|Piacenza Gas Volley|Milano Allianz Volley|Monza Vero Volley|Padova Pallavolo City",
    "Brescia Atlantis Volley|Ravenna Porto Volley|Siena Emma Volley|Cuneo Piemonte Volley|Prata Pordenone Volley|Porto Viro Delta Volley|Aversa Normanna Volley|Cantù Libertas Volley",
  ],
  [
    "İspanya",
    "Madrid Real Basket|Barcelona Blau Basket|Baskonia Vitoria City|Valencia Orange Basket|Málaga Unicaja City|Tenerife Island Basket|Gran Canaria Island|Badalona Joventut City",
    "Estudiantes Madrid City|Burgos San Pablo City|Palencia Purple Basket|Obradoiro Santiago City|Valladolid Purple City|Alicante Lucentum City|Ourense River Basket|Castellón Amics City",
    "Almería Unicaja Volley|Teruel Orange Volley|Las Palmas Guagua Volley|Soria Río Volley|Manacor Island Volley|Melilla Coast Volley|Lugo Emevé Volley|Valencia City Volley",
    "Barcelona Blau Volley|Tarragona Sant Pere Volley|Leganés Madrid Volley|Alcorcón Madrid Volley|Almendralejo Extremadura|Cáceres City Volley|Vigo Atlantic Volley|Gijón Coast Volley",
  ],
  [
    "Hollanda",
    "Leiden Zorg Basket|Den Bosch Hero Basket|Groningen Donar City|Rotterdam City Hoops|Zwolle Landstede City|Leeuwarden Aris City|Den Helder Sailors|Weert Limburg Basket",
    "Amsterdam Apollo Hoops|Utrecht Cangaroo Hoops|Haarlem Triple Hoops|Almere Pioneers City|Nijmegen Matrix City|Leiden Binnentown|Groningen Martini Hoops|Den Haag Royal Hoops",
    "Apeldoorn Dynamo Volley|Doetinchem Orion Star|Groningen Lycurgus City|Barneveld SSS Volley|Sliedrecht Blue Volley|Huizen City Volley|Rotterdam VCN Volley|Zevenhuizen ZVH Volley",
    "Wormer Compaen Volley|Meijel Peel Volley|Utrecht USV Volley|Amsterdam US Volley|Eindhoven PSV Volley|Capelle City Volley|Zwolle City Volley|Nijmegen City Volley",
  ],
  [
    "Japonya",
    "Chiba Jet Wings|Alvark Tokyo City|Ryukyu Golden Crown|Utsunomiya Brex City|Kawasaki Brave Storm|Osaka Evessa City|Nagoya Diamond Dolphin|Hiroshima Dragon Fly",
    "Altiri Chiba City|Toyama Grouse Wings|Fukushima Fire Bond|Aomori Wat Blue|Yamagata Wyvern City|Ehime Orange Viking|Kumamoto Volter City|Kobe Stork Wings",
    "Osaka Bluteon Blue|Suntory Sun Wings|JTEKT Sting Wing|Nagoya Wolf Dog|Tokyo Great Bear|Hiroshima Thunder Volley|Toray Arrow Volley|Sakai Blaze Volley",
    "Hokkaido Yellow Star|Nagano Trident Volley|Tsukuba United Sun|Toyota Sun Hawk|Chiba Zelva City|Saitama Azalea City|Fukuoka Winning Spirit|Nara Dream Volley",
  ],
  [
    "BAE",
    "Dubai Ahli Basket|Sharjah King Basket|Abu Dhabi Wahda Basket|Al Nasr Blue Basket|Al Wasl Yellow Basket|Ajman Orange Basket|Bani Yas Sky Basket|Al Bataeh Green Basket",
    "Al Ain Oasis Basket|Fujairah Coast Basket|Ras Al Khaimah Basket|Khor Fakkan Coast Basket|Dibba Coast Basket|Dubai Hatta Basket|Kalba Coast Basket|Masafi Mountain Basket",
    "Dubai Ahli Volley|Al Nasr Blue Volley|Al Wasl Yellow Volley|Al Ain Oasis Volley|Bani Yas Sky Volley|Sharjah King Volley|Ajman Orange Volley|Hatta Mountain Volley",
    "Fujairah Coast Volley|Dibba Coast Volley|Kalba Coast Volley|Khor Fakkan Coast Volley|Ras Al Khaimah Volley|Masafi Mountain Volley|Abu Dhabi City Volley|Dubai Coast Volley",
  ],
];
const TEAM_SPORT_LEAGUES = {};
TEAM_SPORT_POOLS.forEach(([country, b1, b2, v1, v2], i) => {
  [b1, b2, v1, v2].forEach((pool, j) => {
    const sport = j < 2 ? "basketball" : "volleyball",
      tier = (j % 2) + 1,
      id = sport + "_" + i + "_" + tier;
    TEAM_SPORT_LEAGUES[id] = {
      country,
      sport,
      tier,
      name: (sport === "basketball" ? "Basketbol" : "Voleybol") + " · " + tier + ". Lig",
      teams: pool.split("|"),
    };
  });
});
