/**
 * militaryHistoryEvents.js — Database of historic military operations,
 * gallantry award actions, and notable milestones in Indian Military History
 * indexed by month and day (MM-DD).
 */

export const MILITARY_HISTORY_EVENTS = [
  // --- JANUARY ---
  {
    month: 1,
    day: 15,
    year: 1949,
    title: 'Indian Army Day',
    category: 'Milestone',
    service: 'army',
    location: 'New Delhi',
    description:
      'Field Marshal K. M. Cariappa took over as the first Indian Commander-in-Chief of the Indian Army from British General Sir Francis Roy Butcher, marking the birth of independent command.',
  },
  {
    month: 1,
    day: 26,
    year: 1950,
    title: 'Institution of Param Vir Chakra, Maha Vir Chakra & Vir Chakra',
    category: 'Gallantry Milestone',
    service: 'all',
    location: 'New Delhi',
    description:
      'The President of India formally instituted the Param Vir Chakra, Maha Vir Chakra, and Vir Chakra with retrospective effect from 15 August 1947 to honor acts of supreme gallantry in the presence of the enemy.',
  },

  // --- FEBRUARY ---
  {
    month: 2,
    day: 6,
    year: 1948,
    title: 'Naik Jadunath Singh, PVC — Heroic Defence of Taindhar',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Taindhar, Naushera',
    description:
      'Naik Jadunath Singh of 1 Rajput single-handedly defended Post No. 2 at Taindhar against three waves of enemy attackers, fighting to his last breath and turning the tide of the battle of Naushera.',
  },
  {
    month: 2,
    day: 25,
    year: 2019,
    title: 'National War Memorial Dedicated to the Nation',
    category: 'Milestone',
    service: 'all',
    location: 'India Gate Complex, New Delhi',
    description:
      'The National War Memorial (Rashtriya Samar Smarak) was dedicated to the nation with the eternal Amar Jawan Jyoti flame, commemorating over 26,000 fallen soldiers of independent India.',
  },
  {
    month: 2,
    day: 26,
    year: 2019,
    title: 'Balakot Aerial Precision Strike',
    category: 'Air Combat',
    service: 'airforce',
    location: 'Balakot, Khyber Pakhtunkhwa',
    description:
      'Twelve Indian Air Force Mirage 2000 jets crossed the Line of Control and struck the major Jaish-e-Mohammed terror training camp in Balakot using SPICE-2000 precision glide bombs.',
  },
  {
    month: 2,
    day: 27,
    year: 2019,
    title: 'Aerial Dogfight Over Nowshera — Wg Cdr Abhinandan Shoots Down F-16',
    category: 'Vir Chakra',
    service: 'airforce',
    location: 'Nowshera Sector, J&K',
    description:
      'Wing Commander Abhinandan Varthaman, flying a MiG-21 Bison, intercepted invading PAF aircraft and shot down an advanced F-16 fighter jet using an R-73 air-to-air missile.',
  },

  // --- APRIL ---
  {
    month: 4,
    day: 3,
    year: 1984,
    title: 'Squadron Leader Rakesh Sharma Becomes First Indian in Space',
    category: 'Ashoka Chakra',
    service: 'airforce',
    location: 'Salyut 7 Space Station',
    description:
      'IAF Test Pilot Squadron Leader Rakesh Sharma launched aboard Soyuz T-11, famously answering Prime Minister Indira Gandhi that India looked "Saare Jahan Se Achha" from space. Awarded Ashoka Chakra.',
  },
  {
    month: 4,
    day: 8,
    year: 1948,
    title: '2nd Lt Rama Raghoba Rane, PVC — Clearing the Naushera-Rajouri Road',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Naushera-Rajouri Sector',
    description:
      'Second Lieutenant Rama Raghoba Rane of the Bombay Sappers cleared enemy minefields and tank roadblocks under heavy mortar and artillery fire for over 72 continuous hours, enabling Indian tanks to liberate Rajouri.',
  },
  {
    month: 4,
    day: 13,
    year: 1984,
    title: 'Operation Meghdoot — Capture of the Siachen Glacier',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Siachen Glacier, Ladakh',
    description:
      'The Indian Army and Air Force launched Operation Meghdoot, successfully helilanding troops on the world\'s highest battlefield and securing the Saltoro Ridge and Siachen Glacier.',
  },

  // --- MAY ---
  {
    month: 5,
    day: 15,
    year: 1999,
    title: 'Captain Saurabh Kalia Detects Infiltration in Kargil',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Bajrang Post, Kaksar Sector, Kargil',
    description:
      'Captain Saurabh Kalia and five soldiers of 4 Jat engaged heavily armed Pakistani army regulars occupying heights in the Kaksar sector, blowing the whistle on the large-scale Kargil intrusions.',
  },
  {
    month: 5,
    day: 24,
    year: 1948,
    title: 'Air Commodore Mehar Singh, MVC — First High-Altitude Landing at Leh',
    category: 'Maha Vir Chakra',
    service: 'airforce',
    location: 'Leh Airfield (11,500 ft)',
    description:
      'Air Commodore "Baba" Mehar Singh made aviation history by landing a Douglas C-47 Dakota at the unpaved Leh airstrip at 11,500 feet with Major General K.S. Thimayya, saving Ladakh from falling to raiders.',
  },
  {
    month: 5,
    day: 26,
    year: 1999,
    title: 'Operation Safed Sagar Launched by the Indian Air Force',
    category: 'Air Combat',
    service: 'airforce',
    location: 'Kargil, Dras, Batalik Sectors',
    description:
      'The Indian Air Force launched air strikes using MiG-21s, MiG-27s, and Mirage 2000s in support of Army ground operations in Kargil, the first large-scale air combat operations at extreme altitudes.',
  },
  {
    month: 5,
    day: 26,
    year: 2016,
    title: 'Havildar Hangpan Dada, AC — Gallant Stand at Naugam',
    category: 'Ashoka Chakra',
    service: 'army',
    location: 'Naugam Sector, Kupwara, J&K',
    description:
      'Havildar Hangpan Dada of 35 Rashtriya Rifles / Assam Regiment eliminated three heavily armed terrorists in hand-to-hand combat at 12,500 ft, saving his entire patrol before making the supreme sacrifice.',
  },

  // --- JUNE ---
  {
    month: 6,
    day: 13,
    year: 1999,
    title: 'Capture of Tololing Top — Turning Point of the Kargil War',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Tololing Ridge, Dras Sector',
    description:
      '2 Rajputana Rifles, 18 Grenadiers, and 2 Mechanised Infantry stormed and captured the strategic Tololing Peak at 15,000 feet after days of fierce fighting, turning the tide of the Kargil War.',
  },
  {
    month: 6,
    day: 20,
    year: 1999,
    title: 'Captain Vikram Batra Captures Point 5140',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Point 5140, Dras Sector, Kargil',
    description:
      '13 JAK RIF led by Captain Vikram Batra and Captain Sanjeev Jamwal assaulted Point 5140 from opposite directions. Batra killed three enemy soldiers in hand-to-hand combat and transmitted "Yeh Dil Maange More!".',
    slug: 'captain-vikram-batra',
  },
  {
    month: 6,
    day: 23,
    year: 1987,
    title: 'Operation Rajiv — Naib Subedar Bana Singh Captures Bana Post',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Saltoro Ridge, Siachen (21,153 ft)',
    description:
      'Naib Subedar Bana Singh of 8 JAK LI scaled a 1,500 ft sheer ice wall at 21,153 feet in Siachen amidst blizzard conditions and captured the impregnable enemy post, subsequently renamed Bana Post.',
  },

  // --- JULY ---
  {
    month: 7,
    day: 3,
    year: 1999,
    title: 'Lieutenant Manoj Kumar Pandey, PVC — Night Assault on Khalubar',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Khalubar Ridge, Batalik Sector',
    description:
      'Lieutenant Manoj Kumar Pandey of 1/11 Gorkha Rifles spearheaded a daring night assault on Khalubar, clearing multiple enemy bunkers in hand-to-hand combat despite severe wounds to open the Batalik axis.',
  },
  {
    month: 7,
    day: 4,
    year: 1999,
    title: 'Capture of Tiger Hill — Yogendra Singh Yadav & Sanjay Kumar PVC Actions',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Tiger Hill (16,608 ft), Dras Sector',
    description:
      '18 Grenadiers and 8 Sikh captured Tiger Hill summit. Grenadier Yogendra Singh Yadav climbed a vertical ice cliff under heavy fire with 15 bullet wounds, while Rifleman Sanjay Kumar charged enemy bunkers at Flat Top.',
  },
  {
    month: 7,
    day: 7,
    year: 1999,
    title: 'Captain Vikram Batra, PVC — Supreme Sacrifice at Point 4875',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Point 4875 (Batra Top), Mushkoh Valley',
    description:
      'Captain Vikram Batra led the assault on narrow cliffside ledge at Point 4875. While dragging a wounded sub-officer to safety under heavy sniper fire, he was hit and attained martyrdom. Point 4875 is now called Batra Top.',
    slug: 'captain-vikram-batra',
  },
  {
    month: 7,
    day: 18,
    year: 1948,
    title: 'CHM Piru Singh Shekhawat, PVC — Attack on Darapari',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Tithwal Sector, J&K',
    description:
      'Company Havildar Major Piru Singh of 6 Rajputana Rifles single-handedly charged across a narrow ridge under devastating MMG fire at Darapari, silencing two enemy bunkers before falling.',
  },
  {
    month: 7,
    day: 26,
    year: 1999,
    title: 'Kargil Vijay Diwas — Complete Eviction of Enemy Forces',
    category: 'Victory Day',
    service: 'all',
    location: 'Kargil, Jammu & Kashmir',
    description:
      'Operation Vijay was officially declared a complete success as Indian Armed Forces successfully recaptured every single peak and pushed Pakistani regulars and infiltrators back across the Line of Control.',
  },

  // --- AUGUST ---
  {
    month: 8,
    day: 8,
    year: 1947,
    title: 'Indian Army Regiments Stand Ready at Independence',
    category: 'Milestone',
    service: 'army',
    location: 'Across India',
    description:
      'Historic regiments of the Indian Army transitioned to the independent Union of India, guarding borders and maintaining civil order during partition.',
  },
  {
    month: 8,
    day: 26,
    year: 1965,
    title: 'Major Ranjit Singh Dayal, MVC — Assault on Haji Pir Pass',
    category: 'Maha Vir Chakra',
    service: 'army',
    location: 'Haji Pir Pass, Pir Panjal Range',
    description:
      'Major (later Lt Gen) Ranjit Singh Dayal led 1 Para in a legendary uphill night assault in heavy rain and treacherous terrain, outmaneuvering Pakistani defences to capture the strategic Haji Pir Pass at 8,650 ft.',
  },
  {
    month: 8,
    day: 27,
    year: 1965,
    title: '1 Para Consolidates Control Over the Strategic Haji Pir Sector',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Haji Pir Sector, J&K',
    description:
      'Indian Army paratroopers under Major Ranjit Singh Dayal repulsed fierce Pakistani counter-attacks and secured the heights overlooking the Haji Pir Pass, neutralizing the primary infiltration route into the Kashmir Valley.',
  },
  {
    month: 8,
    day: 28,
    year: 1965,
    title: 'Indian Tricolour Hoisted on the Summit of Haji Pir Pass',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Haji Pir Pass (8,650 ft)',
    description:
      'Indian paratroopers reached the crest of Haji Pir Pass, hoisting the National Flag and cutting off the Pakistani infiltration corridor connecting Uri and Poonch.',
  },

  // --- SEPTEMBER ---
  {
    month: 9,
    day: 3,
    year: 1965,
    title: 'Squadron Leader Trevor Keelor — First Air Kill of the 1965 War',
    category: 'Vir Chakra',
    service: 'airforce',
    location: 'Chhamb Sector, J&K',
    description:
      'Squadron Leader Trevor Keelor flying a lightweight Folland Gnat shot down a superior PAF F-86 Sabre over Chhamb, earning the Gnat its historic moniker "The Sabre Slayer".',
  },
  {
    month: 9,
    day: 6,
    year: 1965,
    title: 'Indian Army Crosses the International Border Toward Lahore & Sialkot',
    category: 'Battle / Operation',
    service: 'army',
    location: 'Punjab Frontier / Lahore Sector',
    description:
      'In response to Pakistan\'s Operation Grand Slam offensive in Akhnoor, Indian XI Corps launched a massive counter-offensive across the International Border along the Wagah, Burki, and Khemkaran axes.',
  },
  {
    month: 9,
    day: 7,
    year: 1965,
    title: 'Sqn Ldr A. B. Devaiah, MVC — Air Duel Over Sargodha Airfield',
    category: 'Maha Vir Chakra',
    service: 'airforce',
    location: 'Sargodha Airfield, Pakistan',
    description:
      'Squadron Leader Ajjamada B. Devaiah, flying a Mystère IV during a strike on Sargodha airfield, was intercepted by an advanced supersonic F-104 Starfighter and shot it down in a dogfight.',
  },
  {
    month: 9,
    day: 10,
    year: 1965,
    title: 'Battle of Asal Uttar — CQMH Abdul Hamid Destroys Patton Tanks',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Asal Uttar / Khemkaran, Punjab',
    description:
      'CQMH Abdul Hamid of 4 Grenadiers destroyed eight Pakistani Patton tanks with his jeep-mounted Recoilless Rifle at the Battle of Asal Uttar (Patton Nagar), breaking the back of Pakistan\'s 1st Armoured Division.',
  },
  {
    month: 9,
    day: 16,
    year: 1965,
    title: 'Lt Col Ardeshir Tarapore, PVC — Armoured Battle of Chawinda & Phillora',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Chawinda-Phillora, Sialkot Sector',
    description:
      'Lieutenant Colonel Ardeshir Tarapore led 17 Poona Horse in the biggest tank battle since World War II, destroying 60 enemy tanks while continuously directing operations from his tank turret under fire.',
  },

  // --- OCTOBER ---
  {
    month: 10,
    day: 8,
    year: 1932,
    title: 'Indian Air Force Day',
    category: 'Milestone',
    service: 'airforce',
    location: 'New Delhi',
    description:
      'The Indian Air Force was formally established as an auxiliary air arm, beginning with just four Westland Wapiti biplanes and six RAF-trained officers, growing into the world\'s fourth largest air force.',
  },
  {
    month: 10,
    day: 13,
    year: 1948,
    title: 'Lance Naik Karam Singh, PVC — Defence of Richhmar Gali',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Tithwal Sector, J&K',
    description:
      'Lance Naik Karam Singh of 1 Sikh held out against eight heavy enemy artillery bombardments and infantry assaults at Richhmar Gali, engaging enemy soldiers in hand-to-hand combat.',
  },
  {
    month: 10,
    day: 20,
    year: 1962,
    title: '1962 Sino-Indian War Begins — Major Dhan Singh Thapa PVC at Sirijap',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Sirijap 1 Post, Pangong Tso, Ladakh',
    description:
      'Major Dhan Singh Thapa of 1/8 Gorkha Rifles held the isolated Sirijap 1 post on Pangong Tso Lake against three waves of enemy infantry backed by heavy artillery and tanks.',
  },
  {
    month: 10,
    day: 23,
    year: 1962,
    title: 'Subedar Joginder Singh, PVC — Heroic Stand at Tongpen La',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Tongpen La / Bum La, NEFA (Arunachal Pradesh)',
    description:
      'Subedar Joginder Singh of 1 Sikh led 20 soldiers holding the IB Ridge at Tongpen La. When ammunition ran out, he led his remaining men in a fierce bayonet charge against overwhelming forces.',
  },
  {
    month: 10,
    day: 27,
    year: 1947,
    title: 'Infantry Day — 1 Sikh Lands at Srinagar Airfield',
    category: 'Milestone',
    service: 'army',
    location: 'Srinagar Airfield, Kashmir',
    description:
      'Troops of 1st Battalion, The Sikh Regiment under Lt Col D.R. Rai were air-transported to Srinagar airfield, becoming the first Indian troops to engage tribal invaders and save the valley.',
  },

  // --- NOVEMBER ---
  {
    month: 11,
    day: 3,
    year: 1947,
    title: 'Major Somnath Sharma, PVC — Immortal Battle of Badgam',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Badgam, near Srinagar Airfield',
    description:
      'Major Somnath Sharma of 4 Kumaon and his 50 brave men held off 700 heavily armed tribal raiders at Badgam. With his left hand in plaster, he filled magazine belts until an enemy mortar shell struck his position.',
    slug: 'major-somnath-sharma',
  },
  {
    month: 11,
    day: 18,
    year: 1962,
    title: 'Battle of Rezang La — Major Shaitan Singh & 13 Kumaon Last Stand',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Rezang La Pass (17,000 ft), Chushul, Ladakh',
    description:
      'Charlie Company of 13 Kumaon, comprising 120 Ahir soldiers led by Major Shaitan Singh, fought to the last man and last round at freezing sub-zero temperatures, repelling massive Chinese assaults.',
  },
  {
    month: 11,
    day: 18,
    year: 2017,
    title: 'Corporal Jyoti Prakash Nirala, AC — Garud Commando Action in Bandipora',
    category: 'Ashoka Chakra',
    service: 'airforce',
    location: 'Chanderger Village, Bandipora, J&K',
    description:
      'Garud Commando Corporal Jyoti Prakash Nirala laid down heavy fire with his Galil sniper and assault rifle at point-blank range, eliminating two top terror commanders before succumbing to injuries.',
  },
  {
    month: 11,
    day: 22,
    year: 1971,
    title: 'Air Battle of Boyra — IAF Gnats Shoot Down 3 PAF Sabres',
    category: 'Air Combat',
    service: 'airforce',
    location: 'Boyra Sector, East Pakistan Border',
    description:
      'Four Folland Gnat fighters of No. 22 Squadron intercepted four PAF Sabres over Boyra, shooting down three enemy jets in under three minutes in India\'s first air-to-air combat victory of 1971.',
  },
  {
    month: 11,
    day: 25,
    year: 1987,
    title: 'Major Ramaswamy Parameswaran, PVC — Operation Pawan Counter-Ambush',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Kantharodai, Jaffna, Sri Lanka',
    description:
      'Major Ramaswamy Parameswaran of 8 Mahar was ambushed at night by militants in Sri Lanka. Displaying superhuman resolve, he charged the enemy, snatched a rifle and cleared the position.',
  },
  {
    month: 11,
    day: 27,
    year: 2008,
    title: 'Major Sandeep Unnikrishnan, AC — Operation Black Tornado 26/11 Mumbai',
    category: 'Ashoka Chakra',
    service: 'army',
    location: 'Taj Mahal Palace Hotel, Mumbai',
    description:
      'Major Sandeep Unnikrishnan led the 51 Special Action Group (NSG) commando team inside the Taj Mahal Palace Hotel, rescuing 14 hostages and single-handedly engaging terrorists with his famous words "Do not come up, I will handle them".',
  },

  // --- DECEMBER ---
  {
    month: 12,
    day: 3,
    year: 1971,
    title: '1971 Indo-Pak War Begins — Lance Naik Albert Ekka PVC at Gangasagar',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Gangasagar / Akhaura Sector, East Pakistan',
    description:
      'Lance Naik Albert Ekka of 14 Guards charged and neutralized heavily fortified enemy machine gun bunkers at the Battle of Gangasagar, enabling the Indian advance toward Dacca.',
  },
  {
    month: 12,
    day: 4,
    year: 1971,
    title: 'Navy Day & Operation Trident — Indian Navy Strikes Karachi Harbour',
    category: 'Maha Vir Chakra',
    service: 'navy',
    location: 'Off Karachi Port, Arabian Sea',
    description:
      'The 25th Missile Boat Squadron (INS Nipat, INS Nirghat, INS Veer) under Commander Babru Bhan Yadav launched Operation Trident, sinking destroyer PNS Khaibar and minesweeper PNS Muhafiz and setting Karachi oil storage tanks ablaze.',
    slug: 'operation-trident-1971',
  },
  {
    month: 12,
    day: 5,
    year: 1961,
    title: 'Captain Gurbachan Singh Salaria, PVC — UN Mission in Congo',
    category: 'Param Vir Chakra',
    service: 'army',
    location: 'Elisabethville, Katanga, Congo',
    description:
      'Captain Gurbachan Singh Salaria of 3/1 Gorkha Rifles led a daring bayonet charge against 150 Katangese rebels near the UN headquarters in Congo, killing 40 enemy troops and saving the UN force.',
  },
  {
    month: 12,
    day: 8,
    year: 1971,
    title: 'Operation Python — Indian Navy Strikes Karachi for the Second Time',
    category: 'Vir Chakra',
    service: 'navy',
    location: 'Karachi Port Approaches',
    description:
      'Missile boat INS Vinash and escorts INS Trishul and INS Talwar struck Karachi harbour in Operation Python, firing 4 Styx missiles that sank fleet tanker SS Harmattan and destroyed key fuel storage complexes.',
  },
  {
    month: 12,
    day: 9,
    year: 1971,
    title: 'Captain Mahendra Nath Mulla, MVC — The Captain Who Went Down With His Ship',
    category: 'Maha Vir Chakra',
    service: 'navy',
    location: 'Arabian Sea, off Diu',
    description:
      'Captain M.N. Mulla of INS Khukri ensured maximum crew members escaped the torpedoed frigate, gave his lifejacket to a sailor and went down with his ship in the finest naval tradition.',
  },
  {
    month: 12,
    day: 14,
    year: 1971,
    title: 'Flying Officer Nirmal Jit Singh Sekhon, PVC — Air Defence of Srinagar',
    category: 'Param Vir Chakra',
    service: 'airforce',
    location: 'Srinagar Airfield, Kashmir Valley',
    description:
      'Flying Officer Nirmal Jit Singh Sekhon of No. 18 Squadron scrambled his Folland Gnat in heavy smoke and single-handedly took on six attacking PAF Sabre jets, hitting two and saving Srinagar airfield.',
    slug: 'nirmal-jit-singh-sekhon',
  },
  {
    month: 12,
    day: 16,
    year: 1971,
    title: 'Vijay Diwas 1971 & Battle of Basantar — 2nd Lt Arun Khetarpal PVC',
    category: 'Victory Day',
    service: 'army',
    location: 'Battle of Basantar / Dhaka, Bangladesh',
    description:
      '93,000 Pakistani soldiers surrendered unconditionally to the Indian Armed Forces under Lt Gen J.S. Aurora. At the Battle of Basantar, 21-year-old 2nd Lt Arun Khetarpal of Poona Horse destroyed 10 enemy tanks in close combat.',
    slug: 'arun-khetarpal-basantar',
  },
];

/**
 * Get all military events matching a specific month and day.
 */
export function getEventsForDate(month, day) {
  return MILITARY_HISTORY_EVENTS.filter(
    (e) => e.month === Number(month) && e.day === Number(day)
  );
}

/**
 * Get all military events matching a specific month.
 */
export function getEventsForMonth(month) {
  return MILITARY_HISTORY_EVENTS.filter((e) => e.month === Number(month)).sort(
    (a, b) => a.day - b.day
  );
}
