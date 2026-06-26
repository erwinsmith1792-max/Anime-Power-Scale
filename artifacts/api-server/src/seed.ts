import { db } from "@workspace/db";
import { animeTable, charactersTable, evidenceTable, battlesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Clearing existing data...");
  await db.execute(sql`TRUNCATE evidence, battles, characters, anime RESTART IDENTITY CASCADE`);

  console.log("🌱 Seeding anime...");
  const animeData = [
    { name: "Naruto Shippuden", nameAr: "Naruto Shippuden", genre: "Action/Adventure" },
    { name: "Boruto: Naruto Next Generations", nameAr: "Boruto: Naruto Next Generations", genre: "Action/Adventure" },
    { name: "Boruto: Two Blue Vortex", nameAr: "Boruto: Two Blue Vortex", genre: "Action/Adventure" },
    { name: "Bleach", nameAr: "Bleach", genre: "Action/Supernatural" },
    { name: "Bleach: Thousand-Year Blood War", nameAr: "Bleach: Thousand-Year Blood War", genre: "Action/Supernatural" },
    { name: "Hunter x Hunter", nameAr: "Hunter x Hunter", genre: "Adventure/Action" },
    { name: "Dragon Ball Z", nameAr: "Dragon Ball Z", genre: "Action/Fighting" },
    { name: "Dragon Ball Super", nameAr: "Dragon Ball Super", genre: "Action/Fighting" },
    { name: "Attack on Titan", nameAr: "Attack on Titan", genre: "Action/Drama" },
    { name: "Jujutsu Kaisen", nameAr: "Jujutsu Kaisen", genre: "Action/Supernatural" },
    { name: "One Piece", nameAr: "One Piece", genre: "Adventure/Fantasy" },
  ];

  const animeIds: Record<string, number> = {};
  for (const a of animeData) {
    const [r] = await db.insert(animeTable).values(a).returning();
    animeIds[a.name] = r.id;
  }

  type CharDef = { name: string; anime: string; tier: string; pl: number; desc: string; forms: string[] };

  const characters: CharDef[] = [
    // ===== NARUTO SHIPPUDEN (40) =====
    { name: "Naruto Uzumaki", anime: "Naruto Shippuden", tier: "S+", pl: 9800, desc: "The Seventh Hokage and Child of Prophecy, jinchuriki of Kurama.", forms: ["Base", "Sage Mode", "Kurama Chakra Mode (KCM1)", "Nine-Tails Chakra Mode (KCM2)", "Tailed Beast Mode", "Six Paths Sage Mode", "Six Paths Kurama Mode"] },
    { name: "Sasuke Uchiha", anime: "Naruto Shippuden", tier: "S+", pl: 9800, desc: "The last Uchiha, wielder of the Rinnegan and Eternal Mangekyo Sharingan.", forms: ["Base", "Cursed Seal Level 2", "Susanoo (Incomplete)", "Perfect Susanoo", "Rinne-Sharingan Mode", "Six Paths Chakra Mode"] },
    { name: "Madara Uchiha", anime: "Naruto Shippuden", tier: "S+", pl: 9750, desc: "The legendary Uchiha clan leader who instigated the Fourth Shinobi War.", forms: ["Base (Reanimated)", "Edo Tensei (Restored)", "Living Body", "Rinnegan Mode", "Perfect Susanoo", "Ten-Tails Jinchuriki", "Rinne-Sharingan (Infinite Tsukuyomi)"] },
    { name: "Hashirama Senju", anime: "Naruto Shippuden", tier: "S+", pl: 9600, desc: "The First Hokage and God of Shinobi, master of Wood Release.", forms: ["Base", "Sage Mode", "Wood Release: True Several Thousand Hands", "Edo Tensei"] },
    { name: "Obito Uchiha", anime: "Naruto Shippuden", tier: "S+", pl: 9200, desc: "The Masked Man who orchestrated the Fourth Shinobi War as Tobi.", forms: ["Base", "Tobi (Masked)", "Ten-Tails Jinchuriki (Incomplete)", "Ten-Tails Jinchuriki (Complete)"] },
    { name: "Minato Namikaze", anime: "Naruto Shippuden", tier: "S+", pl: 9300, desc: "The Fourth Hokage, fastest shinobi in history, known as the Yellow Flash.", forms: ["Base", "Tailed Beast Mode (KCM)", "Six Paths Chakra Mode", "Edo Tensei"] },
    { name: "Kaguya Otsutsuki", anime: "Naruto Shippuden", tier: "S+", pl: 9900, desc: "The progenitor of chakra and the first person to wield it on Earth.", forms: ["Base", "Byakugan Mode", "Truth-Seeking Ball Mode", "All-Killing Ash Bones Mode"] },
    { name: "Hagoromo Otsutsuki", anime: "Naruto Shippuden", tier: "S+", pl: 9850, desc: "The Sage of Six Paths, son of Kaguya and creator of ninjutsu.", forms: ["Standard"] },
    { name: "Hamura Otsutsuki", anime: "Naruto Shippuden", tier: "S+", pl: 9700, desc: "Son of Kaguya and twin brother of Hagoromo.", forms: ["Standard"] },
    { name: "Indra Otsutsuki", anime: "Naruto Shippuden", tier: "S+", pl: 9500, desc: "Elder son of Hagoromo, progenitor of the Uchiha clan.", forms: ["Standard"] },
    { name: "Asura Otsutsuki", anime: "Naruto Shippuden", tier: "S+", pl: 9400, desc: "Younger son of Hagoromo, progenitor of the Senju/Uzumaki clans.", forms: ["Standard"] },
    { name: "Nagato Uzumaki (Pain)", anime: "Naruto Shippuden", tier: "S", pl: 9000, desc: "Wielder of the Rinnegan and leader of Akatsuki, using the Six Paths of Pain.", forms: ["Six Paths of Pain", "Almighty Push (Chibaku Tensei)", "Reduced (Post-Resurrection)"] },
    { name: "Itachi Uchiha", anime: "Naruto Shippuden", tier: "S", pl: 8900, desc: "ANBU prodigy who sacrificed everything for the village's peace.", forms: ["Base", "Susanoo (Incomplete)", "Perfect Susanoo", "Edo Tensei"] },
    { name: "Might Guy", anime: "Naruto Shippuden", tier: "S", pl: 8800, desc: "Taijutsu master who opened all Eight Inner Gates.", forms: ["Base", "Gates (1-7)", "Eight Gates Released Formation (Night Guy)"] },
    { name: "Kakashi Hatake", anime: "Naruto Shippuden", tier: "S", pl: 8700, desc: "The Copy Ninja and Sixth Hokage, wielder of the Sharingan.", forms: ["Base", "Sharingan Mode", "Mangekyo Sharingan", "Susanoo (Dual Obito Sharingan)"] },
    { name: "Killer B", anime: "Naruto Shippuden", tier: "S", pl: 8600, desc: "Jinchuriki of the Eight-Tails, master rapper and swordsman.", forms: ["Base", "Partial Tailed Beast Mode", "Full Eight-Tails Mode", "Version 2"] },
    { name: "Kabuto Yakushi", anime: "Naruto Shippuden", tier: "S", pl: 8700, desc: "Orochimaru's aide who achieved Sage Mode after absorbing his master's essence.", forms: ["Base", "Orochimaru's Essence Absorbed", "Snake Sage Mode"] },
    { name: "Mu (Second Tsuchikage)", anime: "Naruto Shippuden", tier: "S", pl: 8400, desc: "The Second Tsuchikage, master of Particle Style and invisibility.", forms: ["Base", "Split Body", "Edo Tensei"] },
    { name: "Tobirama Senju", anime: "Naruto Shippuden", tier: "S", pl: 8500, desc: "The Second Hokage, inventor of many forbidden jutsu including Edo Tensei.", forms: ["Base", "Edo Tensei"] },
    { name: "A (Fourth Raikage)", anime: "Naruto Shippuden", tier: "A+", pl: 8000, desc: "The fastest shinobi of his generation before Minato, leader of Kumogakure.", forms: ["Base", "Lightning Armor Mode"] },
    { name: "Hiruzen Sarutobi", anime: "Naruto Shippuden", tier: "A+", pl: 8200, desc: "The Third Hokage, master of all five nature transformations.", forms: ["Base", "Prime", "Edo Tensei"] },
    { name: "Tsunade", anime: "Naruto Shippuden", tier: "A+", pl: 8100, desc: "The Fifth Hokage and greatest medical-nin, with superhuman strength.", forms: ["Base", "Mitotic Regeneration (Byakugo Seal)"] },
    { name: "Jiraiya", anime: "Naruto Shippuden", tier: "A+", pl: 8000, desc: "One of the Legendary Sannin and Naruto's mentor.", forms: ["Base", "Toad Sage Mode"] },
    { name: "Orochimaru", anime: "Naruto Shippuden", tier: "A+", pl: 7900, desc: "The Snake Sannin who sought immortality through forbidden jutsu.", forms: ["Base", "True Form (White Snake)", "Yamata no Orochi", "Synthetic Body"] },
    { name: "Onoki (Third Tsuchikage)", anime: "Naruto Shippuden", tier: "A+", pl: 7900, desc: "Elder Tsuchikage who mastered Particle Style.", forms: ["Base", "Particle Style (Jinton) Mode"] },
    { name: "Kisame Hoshigaki", anime: "Naruto Shippuden", tier: "A+", pl: 7800, desc: "Monster of the Hidden Mist with immense chakra and Samehada.", forms: ["Base", "Samehada Merged Mode", "Full Shark Transformation"] },
    { name: "Konan", anime: "Naruto Shippuden", tier: "A+", pl: 7600, desc: "Akatsuki's sole female member with paper manipulation abilities.", forms: ["Standard", "Dance of the Shikigami (Full Paper Transformation)"] },
    { name: "Kinkaku and Ginkaku", anime: "Naruto Shippuden", tier: "A+", pl: 7600, desc: "The Gold and Silver Brothers who absorbed Kurama's chakra.", forms: ["Standard", "Tailed Beast Chakra Mode"] },
    { name: "Sasori", anime: "Naruto Shippuden", tier: "A+", pl: 7700, desc: "Akatsuki's puppet master who turned himself into a puppet.", forms: ["Base (Puppet Body)", "Hiruko Puppet Mode", "Third Kazekage Puppet", "Full Puppet Army (100 Puppets)"] },
    { name: "Danzo Shimura", anime: "Naruto Shippuden", tier: "A+", pl: 7700, desc: "Leader of ROOT with ten Sharingan eyes embedded in his arm.", forms: ["Base", "Izanagi Mode (Multiple Sharingan)"] },
    { name: "Han (Five-Tails Jinchuriki)", anime: "Naruto Shippuden", tier: "A+", pl: 7900, desc: "Jinchuriki of Kokuo, master of Boil Release martial arts.", forms: ["Base", "Partial Tailed Beast Mode", "Full Tailed Beast Mode"] },
    { name: "Black Zetsu", anime: "Naruto Shippuden", tier: "A+", pl: 7800, desc: "Kaguya's will given form, manipulated shinobi history for millennia.", forms: ["Standard"] },
    { name: "Gaara", anime: "Naruto Shippuden", tier: "A+", pl: 7800, desc: "Kazekage of Suna, former One-Tails jinchuriki with absolute sand defense.", forms: ["Base", "One-Tail Partial Mode", "Full Shukaku Mode"] },
    { name: "Deidara", anime: "Naruto Shippuden", tier: "A", pl: 7300, desc: "Akatsuki bomber who treats explosions as art.", forms: ["Base", "C4 Garuda Mode", "C0 Suicide Explosion Mode"] },
    { name: "Hidan", anime: "Naruto Shippuden", tier: "A", pl: 7000, desc: "Immortal Akatsuki member of the Jashin religion.", forms: ["Standard"] },
    { name: "Kakuzu", anime: "Naruto Shippuden", tier: "A", pl: 7200, desc: "Akatsuki's bounty hunter with five hearts and five elemental masks.", forms: ["Base", "Four Hearts Mode", "Final Heart Mode"] },
    { name: "Neji Hyuga", anime: "Naruto Shippuden", tier: "A", pl: 7200, desc: "Hyuga prodigy and master of the Gentle Fist technique.", forms: ["Standard"] },
    { name: "Rock Lee", anime: "Naruto Shippuden", tier: "A", pl: 7100, desc: "Taijutsu specialist who cannot use ninjutsu or genjutsu.", forms: ["Base", "Gates (1-5)", "Drunken Fist"] },
    { name: "Shikamaru Nara", anime: "Naruto Shippuden", tier: "A", pl: 7000, desc: "Strategic genius with Shadow Possession jutsu.", forms: ["Standard"] },
    { name: "Mei Terumi", anime: "Naruto Shippuden", tier: "A", pl: 7400, desc: "The Fifth Mizukage with dual Kekkei Genkai: Lava and Boil Release.", forms: ["Standard"] },

    // ===== BORUTO: NARUTO NEXT GENERATIONS (20) =====
    { name: "Boruto Uzumaki (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "A+", pl: 8200, desc: "Son of Naruto, possesses the Jougan and vessel for Momoshiki.", forms: ["Base", "Karma Seal (Stage 1)", "Karma Seal (Stage 2)", "Momoshiki Manifestation"] },
    { name: "Kawaki (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "A+", pl: 8000, desc: "Former vessel of Isshiki, raised by Naruto as his adoptive son.", forms: ["Base", "Karma Seal (Stage 1)", "Karma Seal (Stage 2)"] },
    { name: "Isshiki Otsutsuki", anime: "Boruto: Naruto Next Generations", tier: "S+", pl: 9850, desc: "Otsutsuki clan member who took over Jigen's body.", forms: ["Jigen Form", "True Otsutsuki Form", "Sukunahikona/Daikokuten Mode"] },
    { name: "Naruto Uzumaki (Baryon Mode)", anime: "Boruto: Naruto Next Generations", tier: "S+", pl: 9900, desc: "Naruto's ultimate form using his and Kurama's chakra as raw nuclear fuel.", forms: ["Baryon Mode"] },
    { name: "Sasuke Uchiha (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "S+", pl: 9750, desc: "The Shadow Hokage in the new era, investigating Otsutsuki threats.", forms: ["Base", "Rinnegan Mode", "Perfect Susanoo"] },
    { name: "Momoshiki Otsutsuki", anime: "Boruto: Naruto Next Generations", tier: "S+", pl: 9800, desc: "Pure-blooded Otsutsuki who absorbed his partner Kinshiki.", forms: ["Base", "Kinshiki Absorbed (Red Mode)", "Boruto's Body (Manifestation)"] },
    { name: "Kinshiki Otsutsuki", anime: "Boruto: Naruto Next Generations", tier: "S", pl: 9000, desc: "Momoshiki's subordinate and guardian, capable of creating weapons from chakra.", forms: ["Standard"] },
    { name: "Delta", anime: "Boruto: Naruto Next Generations", tier: "S", pl: 8500, desc: "Kara Inner with fully modified body and absorption capabilities.", forms: ["Standard", "Enhanced Combat Mode"] },
    { name: "Koji Kashin", anime: "Boruto: Naruto Next Generations", tier: "S", pl: 8800, desc: "Clone of Jiraiya created by Amado, Kara's field operative.", forms: ["Base", "Sage Mode"] },
    { name: "Code (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "S+", pl: 9400, desc: "Kara's strongest Inner with limitless power hidden by a limiter.", forms: ["Limiter Active", "Limiter Removed"] },
    { name: "Deepa", anime: "Boruto: Naruto Next Generations", tier: "A+", pl: 7800, desc: "Kara Inner with carbon armor and superhuman durability.", forms: ["Standard", "Carbon Steel Mode"] },
    { name: "Mitsuki", anime: "Boruto: Naruto Next Generations", tier: "A+", pl: 7900, desc: "Orochimaru's synthetic son with Sage Mode potential.", forms: ["Base", "Sage Mode (Partial)", "Sage Mode (Complete)"] },
    { name: "Sarada Uchiha (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "A", pl: 7300, desc: "Daughter of Sasuke and Sakura, aspiring Hokage with Sharingan.", forms: ["Base", "One Tomoe Sharingan", "Two Tomoe Sharingan", "Three Tomoe Sharingan"] },
    { name: "Ao (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "A+", pl: 7600, desc: "Former Mist ANBU turned Kara puppet with scientific ninja tools.", forms: ["Standard", "Full Kara Equipment Mode"] },
    { name: "Shinki", anime: "Boruto: Naruto Next Generations", tier: "A", pl: 7400, desc: "Gaara's adopted son, master of Iron Sand techniques.", forms: ["Standard"] },
    { name: "Himawari Uzumaki (BNNSG)", anime: "Boruto: Naruto Next Generations", tier: "A", pl: 7100, desc: "Naruto's daughter with awakened Byakugan.", forms: ["Base", "Byakugan Mode"] },
    { name: "Inojin Yamanaka", anime: "Boruto: Naruto Next Generations", tier: "B+", pl: 6500, desc: "Son of Sai and Ino with drawing-based jutsu.", forms: ["Standard"] },
    { name: "Sumire Kakei", anime: "Boruto: Naruto Next Generations", tier: "A", pl: 7000, desc: "Harbinger of the Ghost Incidents, now a scientific researcher.", forms: ["Base", "Nue Summoning Mode"] },
    { name: "Victor", anime: "Boruto: Naruto Next Generations", tier: "A", pl: 7000, desc: "Kara's scientific researcher who consumed a chakra fruit.", forms: ["Standard", "Chakra Fruit Transformed"] },
    { name: "Kashin Koji (vs Isshiki)", anime: "Boruto: Naruto Next Generations", tier: "S", pl: 8600, desc: "Koji in his decisive battle against Isshiki Otsutsuki.", forms: ["Sage Mode"] },

    // ===== BORUTO: TWO BLUE VORTEX (20) =====
    { name: "Boruto Uzumaki (TBV)", anime: "Boruto: Two Blue Vortex", tier: "S", pl: 9100, desc: "Three years later, Boruto trained under Sasuke and mastered his abilities.", forms: ["Base (Post-Timeskip)", "Karma Seal (Refined)", "Partial Otsutsuki Mode", "Full Otsutsuki Manifestation"] },
    { name: "Kawaki (TBV)", anime: "Boruto: Two Blue Vortex", tier: "S", pl: 9000, desc: "Three years later, Kawaki gained new Otsutsuki powers under Naruto's seal.", forms: ["Base (Post-Timeskip)", "New Karma Mode", "Otsutsuki Transformation"] },
    { name: "Code (TBV)", anime: "Boruto: Two Blue Vortex", tier: "S+", pl: 9600, desc: "Code with limiters removed, pursuing Momoshiki's will.", forms: ["Limiter Removed", "Claw Marks Enhanced Mode"] },
    { name: "Daemon", anime: "Boruto: Two Blue Vortex", tier: "S+", pl: 9700, desc: "Eida's brother with a reflection ability that deflects all killing intent.", forms: ["Standard"] },
    { name: "Eida", anime: "Boruto: Two Blue Vortex", tier: "S+", pl: 9650, desc: "Cyborg who can alter memories of the entire world and see all past/present events.", forms: ["Standard", "Omnipotence Active"] },
    { name: "Hidari", anime: "Boruto: Two Blue Vortex", tier: "S", pl: 9200, desc: "Claw Grimes that consumed Sasuke, wielding his powers and Rinnegan.", forms: ["Standard", "Rinnegan Mode"] },
    { name: "Jura", anime: "Boruto: Two Blue Vortex", tier: "S+", pl: 9800, desc: "Hashirama-consuming Claw Grimes who mastered Wood Release and Sage Mode.", forms: ["Standard", "Sage Mode", "Wood Release Enhanced"] },
    { name: "Sarada Uchiha (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 7900, desc: "Mastered the Sharingan and developed into a formidable Uchiha warrior.", forms: ["Base", "Three Tomoe Sharingan", "Mangekyo Sharingan"] },
    { name: "Mitsuki (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 8000, desc: "Full Sage Mode mastered in the post-timeskip era.", forms: ["Base", "Full Sage Mode"] },
    { name: "Himawari Uzumaki (TBV)", anime: "Boruto: Two Blue Vortex", tier: "S", pl: 9000, desc: "Awakened as Asura's vessel with immense chakra capacity.", forms: ["Base", "Byakugan Mode", "Asura Mode"] },
    { name: "Metal Lee (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 7900, desc: "Son of Rock Lee, mastered taijutsu beyond his father.", forms: ["Base", "Gates (1-5)", "Eight Gates (Partial)"] },
    { name: "Chocho Akimichi (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 7800, desc: "Mastered Akimichi expansion techniques in post-timeskip era.", forms: ["Base", "Butterfly Mode"] },
    { name: "Shikadai Nara (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 7700, desc: "Son of Shikamaru with advanced Shadow techniques.", forms: ["Standard"] },
    { name: "Matsuri", anime: "Boruto: Two Blue Vortex", tier: "S", pl: 9100, desc: "Claw Grimes with unique abilities from its devoured prey.", forms: ["Standard"] },
    { name: "Inojin Yamanaka (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A", pl: 7200, desc: "Grown into a more capable shinobi post-timeskip.", forms: ["Standard"] },
    { name: "Wasabi Izuno (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A", pl: 7100, desc: "Cat summoner and taijutsu specialist.", forms: ["Standard"] },
    { name: "Denki Kaminarimon (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A", pl: 7000, desc: "Scientific ninja tool specialist with advanced gear post-timeskip.", forms: ["Standard"] },
    { name: "Ada (TBV)", anime: "Boruto: Two Blue Vortex", tier: "S+", pl: 9650, desc: "Eida's true form post-Omnipotence memory rewrite.", forms: ["Standard", "Omnipotence Active"] },
    { name: "Shinjiro (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A+", pl: 8100, desc: "New generation shinobi with powerful chakra techniques.", forms: ["Standard"] },
    { name: "Tentou Madoka (TBV)", anime: "Boruto: Two Blue Vortex", tier: "A", pl: 7000, desc: "Son of the Fire Daimyo turned full-fledged ninja.", forms: ["Standard"] },

    // ===== BLEACH (20) =====
    { name: "Ichigo Kurosaki", anime: "Bleach", tier: "S+", pl: 9700, desc: "Substitute Soul Reaper with Hollow, Quincy, and Fullbring powers.", forms: ["Base", "Shikai", "Bankai", "Hollow Mask", "Vasto Lorde", "Fullbring Bankai"] },
    { name: "Sosuke Aizen", anime: "Bleach", tier: "S+", pl: 9800, desc: "Former Captain who merged with the Hogyoku to transcend Soul Reaper limits.", forms: ["Captain Form", "Hogyoku Merged Stage 1", "Hogyoku Merged Stage 2", "Chrysalis Form", "Final Butterfly Form"] },
    { name: "Genryusai Yamamoto", anime: "Bleach", tier: "S+", pl: 9600, desc: "Captain-Commander of the Gotei 13 with the most powerful fire-based Zanpakuto.", forms: ["Base", "Shikai (Ryujin Jakka)", "Bankai (Zanka no Tachi)"] },
    { name: "Yoruichi Shihoin", anime: "Bleach", tier: "S", pl: 8800, desc: "Former Captain and Flash Master, fastest Soul Reaper, masters hand-to-hand combat.", forms: ["Base", "Thunder God Form", "Shunko Mode"] },
    { name: "Kisuke Urahara", anime: "Bleach", tier: "S+", pl: 9300, desc: "Former Captain of Squad 12 and genius inventor of the Hogyoku.", forms: ["Base", "Shikai (Benihime)", "Bankai (Kannonbiraki Benihime Aratame)"] },
    { name: "Kenpachi Zaraki", anime: "Bleach", tier: "S", pl: 9200, desc: "The battle-obsessed Captain who fights purely on instinct and bloodlust.", forms: ["Base (Eye-patch)", "Eye-patch Removed", "Kendo Stance", "Shikai (Nozarashi)"] },
    { name: "Shunsui Kyoraku", anime: "Bleach", tier: "S", pl: 8800, desc: "Captain of Squad 1 who replaced Yamamoto, with dual Zanpakuto.", forms: ["Base", "Shikai (Katen Kyokotsu)", "Bankai (Katen Kyokotsu: Karamatsu Shinju)"] },
    { name: "Byakuya Kuchiki", anime: "Bleach", tier: "S", pl: 8700, desc: "Noble captain known for Senbonzakura's petal-blade attacks.", forms: ["Base", "Shikai", "Bankai", "Bankai (Scatter: Vibrate)"] },
    { name: "Toshiro Hitsugaya", anime: "Bleach", tier: "S", pl: 8600, desc: "Prodigy Captain of Squad 10 with ice-based Zanpakuto Hyorinmaru.", forms: ["Base", "Shikai", "Bankai (Incomplete)", "Bankai (True Form)"] },
    { name: "Ulquiorra Cifer", anime: "Bleach", tier: "S", pl: 9000, desc: "Espada #4 with two Resurrections and the concept of emptiness.", forms: ["Base", "Resurreccion (Murcielago)", "Segunda Etapa (True Form)"] },
    { name: "Grimmjow Jaegerjaquez", anime: "Bleach", tier: "A+", pl: 8200, desc: "Espada #6 with a panther Resurrecion and savage battle style.", forms: ["Base", "Resurreccion (Pantera)"] },
    { name: "Starrk Coyote", anime: "Bleach", tier: "S", pl: 9100, desc: "Primera Espada, the loneliest Hollow who split his soul to create Lilynette.", forms: ["Base", "Resurreccion (Los Lobos)"] },
    { name: "Barragan Louisenbairn", anime: "Bleach", tier: "S", pl: 8900, desc: "Segunda Espada with the power of aging and absolute time-decay.", forms: ["Base", "Resurreccion (Arrogante)"] },
    { name: "Tier Harribel", anime: "Bleach", tier: "S", pl: 8700, desc: "Tercera Espada with shark-based Resurreccion and water control.", forms: ["Base", "Resurreccion (Tiburon)"] },
    { name: "Retsu Unohana", anime: "Bleach", tier: "S", pl: 8800, desc: "Original Kenpachi, first criminal of Soul Society, strongest healer.", forms: ["Base", "Minazuki (Shikai)", "Bankai (Minazuki)"] },
    { name: "Gin Ichimaru", anime: "Bleach", tier: "S", pl: 8700, desc: "Former Captain with lightning-fast extending blade Shinso.", forms: ["Base", "Shikai (Shinso)", "Bankai (Kamishini no Yari)"] },
    { name: "Nnoitra Gilga", anime: "Bleach", tier: "A+", pl: 8100, desc: "Quinto Espada with the hardest Hierro and four-armed Resurrecion.", forms: ["Base", "Resurreccion (Santa Teresa)"] },
    { name: "Rukia Kuchiki", anime: "Bleach", tier: "A+", pl: 7800, desc: "Soul Reaper who gave Ichigo her powers, ice Zanpakuto Sode no Shirayuki.", forms: ["Base", "Shikai", "Bankai (Hakka no Togame)"] },
    { name: "Renji Abarai", anime: "Bleach", tier: "A+", pl: 7700, desc: "Lieutenant of Squad 6 with segmented blade Zabimaru.", forms: ["Base", "Shikai", "Bankai (True Hihio Zabimaru)"] },
    { name: "Szayelaporro Grantz", anime: "Bleach", tier: "A+", pl: 7900, desc: "Octava Espada, mad scientist with regenerative abilities.", forms: ["Base", "Resurreccion (Fornicaras)"] },

    // ===== BLEACH: THOUSAND-YEAR BLOOD WAR (20) =====
    { name: "Yhwach", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9950, desc: "Father of the Quincy who absorbs the future and rewrites reality.", forms: ["Base", "The Almighty Active", "Bach (Soul King Absorbed)"] },
    { name: "Ichigo Kurosaki (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9900, desc: "Ichigo with true Zangetsu acknowledged, final Bankai restored.", forms: ["Base", "New Shikai", "True Bankai", "Merged Quincy/Hollow Bankai"] },
    { name: "Kenpachi Zaraki (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9700, desc: "Kenpachi who finally learned his Zanpakuto's name Nozarashi.", forms: ["Shikai (Nozarashi)", "Bankai (Nozarashi Bankai)"] },
    { name: "Sosuke Aizen (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9850, desc: "Aizen released from Muken to fight Yhwach with Kyoka Suigetsu.", forms: ["Base (Sealed/Restrained)", "Kyoka Suigetsu vs Yhwach"] },
    { name: "Uryu Ishida (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8900, desc: "Last Quincy chosen as Yhwach's successor with the antithesis power.", forms: ["Base Quincy", "Licht Regen", "Antithesis Active"] },
    { name: "Jugram Haschwalth", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 9300, desc: "Yhwach's representative who holds The Balance — shifting misfortune.", forms: ["Base", "The Balance Active (Night)"] },
    { name: "Gerard Valkyrie", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9500, desc: "Heart of the Soul King who grows stronger from wounds received.", forms: ["Base", "The Miracle (Giant Form)", "Ascalon Mode"] },
    { name: "Lille Barro", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9400, desc: "X-Axis ability gives absolute penetration through all defenses.", forms: ["Base", "Vollstandig (Jilliel)", "True Jilliel (Divine Form)"] },
    { name: "Pernida Parnkgjas", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 9000, desc: "Left arm of the Soul King, nerve-controlling Quincy.", forms: ["Standard", "Evolved Clones"] },
    { name: "Askin Nakk le Vaar", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 9100, desc: "Gift Ball Deluxe that adjusts lethal doses of anything.", forms: ["Base", "Gift Bereich Active", "Deathdealing Perfected"] },
    { name: "Urahara (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9500, desc: "Urahara with true Bankai and Hollow transformation deployed.", forms: ["Bankai (Kannonbiraki Benihime Aratame)", "Hollow Form"] },
    { name: "Yoruichi (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 9000, desc: "Yoruichi with Thunder God form versus Gerard Valkyrie.", forms: ["Thunder God Form", "Thunder God + Shunko Combined"] },
    { name: "Rukia Kuchiki (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8700, desc: "Rukia achieved Bankai against As Nodt, ultimate ice absolute zero.", forms: ["Bankai (Hakka no Togame)"] },
    { name: "Renji Abarai (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8600, desc: "Renji's true Bankai form manifesting Zabimaru's original power.", forms: ["True Bankai (Soo Zabimaru)"] },
    { name: "Bazz-B", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8800, desc: "Stern Ritter H: The Heat, able to burn even Yamamoto's flames.", forms: ["Base", "Burner Finger Forms (1-5)"] },
    { name: "Candice Catnipp", anime: "Bleach: Thousand-Year Blood War", tier: "A+", pl: 8100, desc: "The T — Thunderbolt, lightning Quincy with intense offensive power.", forms: ["Base", "Vollstandig"] },
    { name: "As Nodt", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8900, desc: "The F — Fear, who stole Byakuya's Bankai and projects absolute terror.", forms: ["Base", "Vollstandig (Tatarforas)"] },
    { name: "Bambietta Basterbine", anime: "Bleach: Thousand-Year Blood War", tier: "S", pl: 8700, desc: "The E — Explode, detonates anything she touches with reishi.", forms: ["Base", "Vollstandig", "Zombie Form"] },
    { name: "NaNaNa Najahkoop", anime: "Bleach: Thousand-Year Blood War", tier: "A+", pl: 8000, desc: "The U — Understanding, measures and amplifies opponent abilities.", forms: ["Standard"] },
    { name: "Yamamoto (TYBW)", anime: "Bleach: Thousand-Year Blood War", tier: "S+", pl: 9650, desc: "Yamamoto unleashing true Bankai for the first time in a thousand years.", forms: ["Bankai (Zanka no Tachi — All Directions)"] },

    // ===== HUNTER X HUNTER (20) =====
    { name: "Meruem", anime: "Hunter x Hunter", tier: "S+", pl: 9900, desc: "King of the Chimera Ants, the most powerful character born in the series.", forms: ["Base", "Post-Miniature Rose Revival (Enhanced)"] },
    { name: "Gon Freecss", anime: "Hunter x Hunter", tier: "S+", pl: 9500, desc: "Idealistic Hunter with boundless potential and Nen ability Jajanken.", forms: ["Base", "Adult Transformation (Sacrifice Form)"] },
    { name: "Killua Zoldyck", anime: "Hunter x Hunter", tier: "S", pl: 8900, desc: "Trained assassin with Transmutation-type Nen: Godspeed and Lightning.", forms: ["Base", "Godspeed (Kanmuru)", "Godspeed: Speed of Lightning"] },
    { name: "Netero Isaac", anime: "Hunter x Hunter", tier: "S+", pl: 9600, desc: "President of the Hunter Association, one of the fastest and strongest Nen users.", forms: ["Base", "100-Type Guanyin Bodhisattva", "Zero Hand", "Poor Man's Rose (Sacrifice)"] },
    { name: "Neferpitou", anime: "Hunter x Hunter", tier: "S+", pl: 9700, desc: "Royal Guard of the Chimera Ants with Doctor Blythe and Terpsichora.", forms: ["Base", "Terpsichora (Puppeteering Mode)", "En Mode"] },
    { name: "Chrollo Lucilfer", anime: "Hunter x Hunter", tier: "S+", pl: 9400, desc: "Leader of the Phantom Troupe, steals others' Nen abilities.", forms: ["Base", "Single Stolen Ability Mode", "Bandit's Secret: Multiple Abilities"] },
    { name: "Hisoka Morow", anime: "Hunter x Hunter", tier: "S+", pl: 9300, desc: "Twisted magician with Bungee Gum Nen with properties of rubber and gum.", forms: ["Base", "Bungee Gum Combat Mode", "Resurrected (Post-Death)"] },
    { name: "Shaiapouf", anime: "Hunter x Hunter", tier: "S", pl: 9100, desc: "Royal Guard with butterfly Nen, illusions, and cell division.", forms: ["Base", "Spiritual Message Mode", "Cell Division Clone"] },
    { name: "Menthuthuyoupi", anime: "Hunter x Hunter", tier: "S", pl: 9000, desc: "Royal Guard with rage-based transformation and flexibility of shape.", forms: ["Base", "Rage Mode (First Form)", "Second Transformation"] },
    { name: "Zeno Zoldyck", anime: "Hunter x Hunter", tier: "S", pl: 9000, desc: "Killua's grandfather, legendary assassin with Dragon Dive.", forms: ["Standard"] },
    { name: "Silva Zoldyck", anime: "Hunter x Hunter", tier: "S", pl: 8900, desc: "Killua's father, head of the Zoldyck family, master assassin.", forms: ["Standard"] },
    { name: "Illumi Zoldyck", anime: "Hunter x Hunter", tier: "S", pl: 8700, desc: "Killua's eldest brother, manipulation-type Nen user with needle control.", forms: ["Base", "Needle Control Mode"] },
    { name: "Ging Freecss", anime: "Hunter x Hunter", tier: "S+", pl: 9500, desc: "Gon's father, one of the five best Nen users in the world.", forms: ["Standard"] },
    { name: "Feitan Portor", anime: "Hunter x Hunter", tier: "S", pl: 8700, desc: "Phantom Troupe member with Rising Sun heat-based Nen.", forms: ["Base", "Rising Sun (Pain Packer)"] },
    { name: "Phinks Magcub", anime: "Hunter x Hunter", tier: "S", pl: 8600, desc: "Phantom Troupe member whose Ripper Cyclotron amplifies power with rotations.", forms: ["Standard"] },
    { name: "Machi Komacine", anime: "Hunter x Hunter", tier: "A+", pl: 8000, desc: "Phantom Troupe medic with thread-based Transmutation Nen.", forms: ["Standard"] },
    { name: "Morel Mackernasey", anime: "Hunter x Hunter", tier: "A+", pl: 8200, desc: "Hunter with smoke-based Nen, Smoke Troopers and Deep Purple.", forms: ["Standard"] },
    { name: "Knov", anime: "Hunter x Hunter", tier: "A+", pl: 7800, desc: "Hunter with Nen ability Hide and Seek — spatial dimensional doorways.", forms: ["Standard"] },
    { name: "Leorio Paradinight", anime: "Hunter x Hunter", tier: "A", pl: 7200, desc: "Aspiring doctor with emerging Emission-type Nen.", forms: ["Standard"] },
    { name: "Kurapika", anime: "Hunter x Hunter", tier: "S", pl: 8800, desc: "Last surviving Kurta with Scarlet Eyes activated by rage, Chain Jail imprisons any Nen user.", forms: ["Base", "Scarlet Eyes Active (Emperor Time)"] },

    // ===== DRAGON BALL Z (20) =====
    { name: "Goku (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9500, desc: "Saiyan warrior who pushed limits beyond imagining to protect Earth.", forms: ["Base", "Kaioken", "Super Saiyan", "Super Saiyan 2", "Super Saiyan 3"] },
    { name: "Vegeta (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9400, desc: "Prince of all Saiyans who rivals Goku through sheer willpower.", forms: ["Base", "Great Ape", "Super Saiyan", "Super Saiyan 2", "Majin Vegeta"] },
    { name: "Gohan (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9300, desc: "Goku's son with latent power that surpassed his father at age 11.", forms: ["Base", "Super Saiyan", "Super Saiyan 2", "Mystic/Potential Unleashed"] },
    { name: "Frieza (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9200, desc: "Emperor of the universe who ruled through terror for thousands of years.", forms: ["First Form", "Second Form", "Third Form", "Final Form", "100% Full Power"] },
    { name: "Cell (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9100, desc: "Android created from the DNA of the strongest warriors.", forms: ["Imperfect Form", "Semi-Perfect Form", "Perfect Form", "Super Perfect Form"] },
    { name: "Majin Buu (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9400, desc: "Ancient magical entity of destruction, one of the most powerful beings.", forms: ["Fat Buu", "Super Buu", "Super Buu (Gohan Absorbed)", "Kid Buu"] },
    { name: "Broly (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9600, desc: "Legendary Super Saiyan with boundless power that grows without limit.", forms: ["Base", "Super Saiyan A-Type", "Legendary Super Saiyan"] },
    { name: "Piccolo (DBZ)", anime: "Dragon Ball Z", tier: "S", pl: 8500, desc: "Namekian warrior and mentor to Gohan with regenerative abilities.", forms: ["Base", "Fused with Nail", "Fused with Kami"] },
    { name: "Gogeta (DBZ)", anime: "Dragon Ball Z", tier: "S+", pl: 9800, desc: "Fusion of Goku and Vegeta via Fusion Dance.", forms: ["Super Saiyan", "Super Saiyan 4 (alternate)"] },
    { name: "Janemba", anime: "Dragon Ball Z", tier: "S+", pl: 9300, desc: "Pure evil entity who warped reality with incredible power.", forms: ["Fat Janemba", "Super Janemba"] },
    { name: "Future Trunks (DBZ)", anime: "Dragon Ball Z", tier: "S", pl: 8700, desc: "Future timeline Trunks who defeated Frieza and King Cold.", forms: ["Base", "Super Saiyan", "Super Saiyan 2"] },
    { name: "Android 17 (DBZ)", anime: "Dragon Ball Z", tier: "S", pl: 8600, desc: "Infinite energy android with barrier ability.", forms: ["Standard"] },
    { name: "Android 18 (DBZ)", anime: "Dragon Ball Z", tier: "A+", pl: 8200, desc: "Infinite energy android who later married Krillin.", forms: ["Standard"] },
    { name: "Android 16 (DBZ)", anime: "Dragon Ball Z", tier: "A+", pl: 8300, desc: "Peaceful android programmed solely to destroy Goku.", forms: ["Standard", "Hell Flash Mode"] },
    { name: "Ginyu (Captain)", anime: "Dragon Ball Z", tier: "A+", pl: 7800, desc: "Leader of the Ginyu Force with body-swapping ability.", forms: ["Standard", "Body Changed Form"] },
    { name: "Zarbon", anime: "Dragon Ball Z", tier: "A", pl: 7400, desc: "Frieza's elegant commander with a monstrous transformation.", forms: ["Base", "Monster Form"] },
    { name: "Dodoria", anime: "Dragon Ball Z", tier: "A", pl: 7200, desc: "Frieza's brutal enforcer with tremendous physical power.", forms: ["Standard"] },
    { name: "Nappa", anime: "Dragon Ball Z", tier: "A", pl: 7200, desc: "Elite Saiyan who slaughtered the Z-Warriors with ease.", forms: ["Base", "Great Ape"] },
    { name: "Krillin (DBZ)", anime: "Dragon Ball Z", tier: "A", pl: 7200, desc: "Earth's strongest human warrior, master of Destructo Disk.", forms: ["Standard"] },
    { name: "Beerus", anime: "Dragon Ball Z", tier: "S+", pl: 9960, desc: "God of Destruction who appears during the Battle of Gods arc.", forms: ["Standard"] },

    // ===== DRAGON BALL SUPER (20) =====
    { name: "Goku (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9900, desc: "Goku in the era of gods and angels, achieving divine forms.", forms: ["Super Saiyan God", "Super Saiyan Blue", "SSB Kaioken x20", "Ultra Instinct Sign", "Ultra Instinct Mastered", "Ultra Instinct Perfected (Silver)"] },
    { name: "Vegeta (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9850, desc: "Vegeta who achieved his own divine path: Ultra Ego.", forms: ["Super Saiyan God", "Super Saiyan Blue", "SSB Evolved", "Ultra Ego"] },
    { name: "Beerus (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9960, desc: "God of Destruction of Universe 7, one of the most powerful deities.", forms: ["Standard", "Hakai Active"] },
    { name: "Whis", anime: "Dragon Ball Super", tier: "S+", pl: 9990, desc: "Angel attendant to Beerus, strongest in Universe 7.", forms: ["Standard"] },
    { name: "Jiren", anime: "Dragon Ball Super", tier: "S+", pl: 9900, desc: "Mortal who surpassed the Gods of Destruction in the Tournament of Power.", forms: ["Base", "Meditation Mode", "Full Power", "True Power (Eliminated Limiter)"] },
    { name: "Broly (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9950, desc: "Legendary Super Saiyan in the new canon with unmatched raw power.", forms: ["Base", "Wrathful", "Super Saiyan", "Legendary Super Saiyan (Full Power)"] },
    { name: "Gogeta (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 10000, desc: "Goku and Vegeta's Fusion Dance result vs Broly.", forms: ["Super Saiyan Blue"] },
    { name: "Gohan (Beast)", anime: "Dragon Ball Super", tier: "S+", pl: 9800, desc: "Gohan's awakened Beast form from Dragon Ball Super: Super Hero.", forms: ["Base", "Potential Unleashed", "Beast Form"] },
    { name: "Black Frieza", anime: "Dragon Ball Super", tier: "S+", pl: 9900, desc: "Frieza's True Black form after ten years of secret training in a Time Chamber.", forms: ["Final Form", "Golden Frieza", "Black Frieza"] },
    { name: "Granolah", anime: "Dragon Ball Super", tier: "S+", pl: 9850, desc: "Cerealian who wished to become the strongest mortal in the universe.", forms: ["Standard", "True Power (Cerealian Wish Form)"] },
    { name: "Gas", anime: "Dragon Ball Super", tier: "S+", pl: 9850, desc: "Heeter family's ultimate fighter who also wished to be the strongest.", forms: ["Base", "Wish Form", "Aged Final Form"] },
    { name: "Hit", anime: "Dragon Ball Super", tier: "S+", pl: 9400, desc: "Galaxy-class assassin with time-skipping ability.", forms: ["Base", "Time-Skip Enhanced", "Pure Progress"] },
    { name: "Kefla", anime: "Dragon Ball Super", tier: "S+", pl: 9700, desc: "Potara Fusion of Kale and Caulifla from Universe 6.", forms: ["Super Saiyan", "Super Saiyan 2"] },
    { name: "Vegito (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9900, desc: "Goku and Vegeta's Potara Fusion against Fused Zamasu.", forms: ["Super Saiyan Blue"] },
    { name: "Zamasu", anime: "Dragon Ball Super", tier: "S+", pl: 9600, desc: "Corrupt Kaioshin who merged with Goku Black to become immortal.", forms: ["Goku Black", "Rose Form", "Fused Zamasu", "Infinite Zamasu"] },
    { name: "Toppo", anime: "Dragon Ball Super", tier: "S+", pl: 9500, desc: "Pride Trooper leader and God of Destruction candidate.", forms: ["Base", "God of Destruction Mode (Hakaishin)"] },
    { name: "Kale (Berserker)", anime: "Dragon Ball Super", tier: "S", pl: 9100, desc: "Legendary Super Saiyan of Universe 6 in her berserker form.", forms: ["Base", "Berserker Super Saiyan", "Controlled Berserker"] },
    { name: "Android 17 (DBS)", anime: "Dragon Ball Super", tier: "S+", pl: 9400, desc: "Android 17 who won the Tournament of Power single-handedly.", forms: ["Standard", "Barrier Max Mode"] },
    { name: "Dyspo", anime: "Dragon Ball Super", tier: "S", pl: 8800, desc: "Pride Trooper with speed rivaling Ultra Instinct users.", forms: ["Base", "Super Maximum Light Speed Mode"] },
    { name: "Caulifla", anime: "Dragon Ball Super", tier: "S", pl: 8700, desc: "Universe 6 Saiyan with immense natural talent, rapidly achieved SSJ2.", forms: ["Base", "Super Saiyan", "Super Saiyan 2"] },

    // ===== ATTACK ON TITAN (20) =====
    { name: "Eren Yeager", anime: "Attack on Titan", tier: "S+", pl: 9500, desc: "Founding Titan wielder who launched the Rumbling to flatten the world.", forms: ["Human", "Attack Titan", "Warhammer Titan (Absorbed)", "Founding Titan (True Form)"] },
    { name: "Levi Ackerman", anime: "Attack on Titan", tier: "S", pl: 9100, desc: "Humanity's strongest soldier, captain of the Special Operations Squad.", forms: ["Standard", "Thunder Spear Mode", "Post-Injury (Battle-Worn)"] },
    { name: "Zeke Yeager", anime: "Attack on Titan", tier: "S", pl: 8900, desc: "Beast Titan inheritor with royal blood, able to transform Subjects of Ymir.", forms: ["Human", "Beast Titan", "Beast Titan + Founding Power"] },
    { name: "Armin Arlert", anime: "Attack on Titan", tier: "S+", pl: 9400, desc: "Inheritor of the Colossal Titan with strategic genius and steam control.", forms: ["Human", "Colossal Titan"] },
    { name: "Reiner Braun", anime: "Attack on Titan", tier: "S", pl: 8700, desc: "Armored Titan warrior from Marley with trauma-split personality.", forms: ["Human", "Armored Titan", "Battle-Hardened Armored Titan"] },
    { name: "Annie Leonhart", anime: "Attack on Titan", tier: "S", pl: 8600, desc: "Female Titan inheritor with crystallization and titan martial arts.", forms: ["Human", "Female Titan", "Crystallized Female Titan"] },
    { name: "Mikasa Ackerman", anime: "Attack on Titan", tier: "S", pl: 8800, desc: "The greatest warrior of her generation with Ackerman combat instincts.", forms: ["Standard"] },
    { name: "Ymir (Founding)", anime: "Attack on Titan", tier: "S+", pl: 9800, desc: "The first and true Founding Titan who is the source of all Titans.", forms: ["Standard"] },
    { name: "Falco Grice (Jaw)", anime: "Attack on Titan", tier: "S", pl: 8500, desc: "Jaw Titan inheritor with unique bird-like wings from Zeke's spinal fluid.", forms: ["Human", "Jaw Titan", "Winged Jaw Titan"] },
    { name: "Porco Galliard (Jaw)", anime: "Attack on Titan", tier: "S", pl: 8500, desc: "Jaw Titan with enhanced agility, claws and teeth that cut anything.", forms: ["Human", "Jaw Titan"] },
    { name: "War Hammer Titan", anime: "Attack on Titan", tier: "S", pl: 9000, desc: "Tybur family inheritor who can create weapons from hardened Titan flesh.", forms: ["Standard", "Crystallized Operation Mode"] },
    { name: "Pieck Finger (Cart)", anime: "Attack on Titan", tier: "A+", pl: 7800, desc: "Cart Titan inheritor with exceptional endurance and intelligence.", forms: ["Human", "Cart Titan", "Armored Cart Titan"] },
    { name: "Kenny Ackerman", anime: "Attack on Titan", tier: "A+", pl: 8000, desc: "Serial killer known as Kenny the Ripper who trained Levi.", forms: ["Standard"] },
    { name: "Erwin Smith", anime: "Attack on Titan", tier: "A+", pl: 7800, desc: "Commander of the Survey Corps whose charisma could move hearts to death.", forms: ["Standard"] },
    { name: "Hanji Zoe", anime: "Attack on Titan", tier: "A+", pl: 7700, desc: "Survey Corps Commander and titan researcher, exceptional tactician.", forms: ["Standard"] },
    { name: "Historia Reiss", anime: "Attack on Titan", tier: "A", pl: 7100, desc: "True heir of the Fritz family and Queen of the Walls.", forms: ["Standard"] },
    { name: "Floch Forster", anime: "Attack on Titan", tier: "A", pl: 7000, desc: "Surviving member of the 104th Cadet Corps, devoted Yeagerist.", forms: ["Standard"] },
    { name: "Yelena", anime: "Attack on Titan", tier: "A", pl: 7100, desc: "Zeke's devoted follower and leader of the Anti-Marleyan Volunteers.", forms: ["Standard"] },
    { name: "Connie Springer", anime: "Attack on Titan", tier: "A", pl: 7000, desc: "Survey Corps veteran with exceptional mobility using ODM gear.", forms: ["Standard"] },
    { name: "Jean Kirstein", anime: "Attack on Titan", tier: "A", pl: 7000, desc: "Survey Corps veteran who became a reliable soldier despite initial selfishness.", forms: ["Standard"] },

    // ===== JUJUTSU KAISEN (20) =====
    { name: "Gojo Satoru", anime: "Jujutsu Kaisen", tier: "S+", pl: 9900, desc: "The strongest sorcerer in history, bearer of Infinity and Six Eyes.", forms: ["Base (Blindfold)", "Six Eyes Open", "Hollow Purple", "Domain Expansion: Unlimited Void"] },
    { name: "Ryomen Sukuna", anime: "Jujutsu Kaisen", tier: "S+", pl: 9950, desc: "King of Curses, the most powerful Cursed Spirit in history.", forms: ["Yuji's Body (Partial Fingers)", "Yuji's Body (15 Fingers)", "Megumi's Body (All Fingers)"] },
    { name: "Yuta Okkotsu", anime: "Jujutsu Kaisen", tier: "S+", pl: 9600, desc: "Special Grade Sorcerer with the largest cursed energy reserve.", forms: ["Base", "Rika Unleashed Mode", "Copying Technique Mode", "Rika Full Form (Reverse Cursed)"] },
    { name: "Kenjaku", anime: "Jujutsu Kaisen", tier: "S+", pl: 9400, desc: "Ancient sorcerer who transplants his brain into others' bodies to live forever.", forms: ["Geto's Body", "True Brain Form (Manifested)"] },
    { name: "Toji Fushiguro", anime: "Jujutsu Kaisen", tier: "S", pl: 9100, desc: "Zero cursed energy master who overpowers sorcerers with pure physicality.", forms: ["Standard", "Reincarnated Form"] },
    { name: "Yuki Tsukumo", anime: "Jujutsu Kaisen", tier: "S+", pl: 9300, desc: "Special Grade sorcerer with Star Rage technique and Anti-Gravity Body.", forms: ["Base", "Star Rage (Reversed)", "Plasma Shikigami"] },
    { name: "Hakari Kinji", anime: "Jujutsu Kaisen", tier: "S", pl: 9200, desc: "Grade 1 sorcerer with Jackpot infinite regeneration ability.", forms: ["Base", "Idle Death Gamble Jackpot Mode"] },
    { name: "Itadori Yuji", anime: "Jujutsu Kaisen", tier: "S", pl: 8800, desc: "Sukuna's vessel with superhuman physical ability and Black Flash mastery.", forms: ["Base", "Divergent Fist Mode", "Black Flash Mode", "Soul Techniques"] },
    { name: "Megumi Fushiguro", anime: "Jujutsu Kaisen", tier: "S", pl: 8700, desc: "Ten Shadows Technique user, Sukuna's target for his true vessel.", forms: ["Base", "Max Elephant", "Mahoraga Summoned", "Sukuna Possessed Body"] },
    { name: "Maki Zenin", anime: "Jujutsu Kaisen", tier: "S", pl: 9000, desc: "Zero cursed energy like Toji, pure physical power with heavenly restriction.", forms: ["Base (Heavenly Restriction Partial)", "Post-Culling Game (Full Awakening)"] },
    { name: "Choso", anime: "Jujutsu Kaisen", tier: "S", pl: 8900, desc: "Womb Series cursed spirit with blood manipulation techniques.", forms: ["Standard", "Piercing Blood (Full Power)"] },
    { name: "Jogo", anime: "Jujutsu Kaisen", tier: "S", pl: 9000, desc: "Special Grade Cursed Spirit with volcanic fire output.", forms: ["Standard", "Disaster Flames Full Release"] },
    { name: "Mahito", anime: "Jujutsu Kaisen", tier: "S", pl: 8800, desc: "Special Grade Cursed Spirit who reshapes souls and bodies.", forms: ["Base", "Transfiguration Mode", "Idle Transfiguration Full Form", "Polymorphic Soul Isomer"] },
    { name: "Nanami Kento", anime: "Jujutsu Kaisen", tier: "A+", pl: 8200, desc: "Grade 1 Sorcerer with Ratio Technique: Overtime Guaranteed Kill.", forms: ["Standard", "Overtime Mode"] },
    { name: "Aoi Todo", anime: "Jujutsu Kaisen", tier: "A+", pl: 8300, desc: "Boogie Woogie lets him switch positions with anyone he claps for.", forms: ["Base", "Boogie Woogie Active"] },
    { name: "Nobara Kugisaki", anime: "Jujutsu Kaisen", tier: "A+", pl: 7900, desc: "Resonance technique with straw dolls damages anything sharing blood.", forms: ["Standard", "Resonance Mode"] },
    { name: "Angel (Hana Kurusu)", anime: "Jujutsu Kaisen", tier: "S", pl: 8900, desc: "Incarnated sorcerer with Jacob's Ladder that can destroy any Cursed Technique.", forms: ["Standard", "Jacob's Ladder Full Power"] },
    { name: "Hiromi Higuruma", anime: "Jujutsu Kaisen", tier: "S", pl: 8800, desc: "Culling Game player with Domain: Deadly Sentencing.", forms: ["Standard", "Domain Active (Deadly Sentencing)"] },
    { name: "Dagon", anime: "Jujutsu Kaisen", tier: "S", pl: 8600, desc: "Disaster Flood Special Grade that manifests a waterworld domain.", forms: ["Pre-Birth", "Full Form", "Domain: Horizon of the Captivating Skandha"] },
    { name: "Hanami", anime: "Jujutsu Kaisen", tier: "S", pl: 8700, desc: "Special Grade Cursed Spirit who loves nature and hates humanity.", forms: ["Standard", "Disaster Plants Full Release"] },

    // ===== ONE PIECE (20) =====
    { name: "Monkey D. Luffy", anime: "One Piece", tier: "S+", pl: 9800, desc: "King of the Pirates, awakened Nika/Gomu Gomu no Mi user.", forms: ["Base", "Gear 2", "Gear 3", "Gear 4 (Boundman)", "Gear 4 (Tankman)", "Gear 4 (Snakeman)", "Gear 5 (Nika Mode)"] },
    { name: "Roronoa Zoro", anime: "One Piece", tier: "S+", pl: 9500, desc: "World's Greatest Swordsman candidate with Three-Sword Style and Enma.", forms: ["Base", "Santoryu (Demon Aura)", "King of Hell Three-Sword Style"] },
    { name: "Shanks", anime: "One Piece", tier: "S+", pl: 9700, desc: "Emperor of the Sea with the most powerful Conqueror's Haki.", forms: ["Standard"] },
    { name: "Whitebeard", anime: "One Piece", tier: "S+", pl: 9750, desc: "Strongest Man in the World with the Tremor-Tremor Fruit.", forms: ["Prime Form", "Aging/Ill Form"] },
    { name: "Kaido", anime: "One Piece", tier: "S+", pl: 9700, desc: "Strongest Creature Alive with Azure Dragon Mythical Zoan.", forms: ["Base", "Dragon Form", "Hybrid Form", "Drunk Mode", "Sober Mode"] },
    { name: "Big Mom", anime: "One Piece", tier: "S+", pl: 9600, desc: "Emperor with Soul-Soul Fruit and Prometheus/Napoleon/Zeus.", forms: ["Standard", "Rage Mode (Eating)"] },
    { name: "Mihawk", anime: "One Piece", tier: "S+", pl: 9600, desc: "Greatest Swordsman in the World with black blade Yoru.", forms: ["Standard", "Black Blade Mode"] },
    { name: "Blackbeard", anime: "One Piece", tier: "S+", pl: 9700, desc: "Sole dual Devil Fruit user: Darkness and Tremor powers.", forms: ["Darkness Form", "Tremor Darkness Combined"] },
    { name: "Akainu", anime: "One Piece", tier: "S+", pl: 9600, desc: "Fleet Admiral with magma logia that melts fire itself.", forms: ["Standard", "Full Magma Mode"] },
    { name: "Charlotte Katakuri", anime: "One Piece", tier: "S+", pl: 9300, desc: "Big Mom's strongest son with Future Sight Haki and Mochi awakening.", forms: ["Base", "Mochi Awakened Mode"] },
    { name: "Silvers Rayleigh", anime: "One Piece", tier: "S+", pl: 9400, desc: "First Mate of Roger Pirates, Dark King with mastery of all Haki.", forms: ["Prime Form", "Current (Aged) Form"] },
    { name: "Gol D. Roger", anime: "One Piece", tier: "S+", pl: 9900, desc: "King of the Pirates who conquered the Grand Line without any Devil Fruit.", forms: ["Standard"] },
    { name: "Imu", anime: "One Piece", tier: "S+", pl: 9950, desc: "True ruler of the World Government, power still mostly unknown.", forms: ["Humanoid Form", "Transformed (Partially Revealed)"] },
    { name: "Kizaru", anime: "One Piece", tier: "S+", pl: 9500, desc: "Admiral with Light-Light Fruit — speed of light attacks.", forms: ["Standard"] },
    { name: "Aokiji", anime: "One Piece", tier: "S+", pl: 9500, desc: "Former Admiral with Ice-Ice Fruit, froze the ocean around Punk Hazard.", forms: ["Standard", "Full Freeze Mode"] },
    { name: "Yamato", anime: "One Piece", tier: "S", pl: 9200, desc: "Kaido's son with Mythical Zoan Wolf deity fruit and Haki mastery.", forms: ["Base", "Hybrid Form (Wolf Deity)", "Full Beast Form"] },
    { name: "Trafalgar Law", anime: "One Piece", tier: "S", pl: 9000, desc: "Captain of Heart Pirates with Ope-Ope no Mi and ROOM.", forms: ["Standard", "Awakened Room Mode"] },
    { name: "Boa Hancock", anime: "One Piece", tier: "S", pl: 8900, desc: "Pirate Empress who petrifies anyone caught by her beauty.", forms: ["Standard", "Love-Love Petrification Mode"] },
    { name: "Sabo", anime: "One Piece", tier: "S", pl: 9000, desc: "Flame-Flame Fruit user and Revolutionary Army's Chief of Staff.", forms: ["Base", "Flame Mode (Ace's Power)"] },
    { name: "Eustass Kid", anime: "One Piece", tier: "S", pl: 8900, desc: "Captain of Kid Pirates with Mag-Mag Fruit magnetic control.", forms: ["Standard", "Awakened Punk Corna Dio Mode"] },
  ];

  console.log("🌱 Seeding characters...");
  const charIds: Record<string, number> = {};
  for (const c of characters) {
    const animeId = animeIds[c.anime];
    if (!animeId) { console.log(`  ✗ Anime not found: ${c.anime}`); continue; }
    const [r] = await db.insert(charactersTable).values({
      name: c.name, nameAr: c.name, animeId, tier: c.tier, powerLevel: c.pl, description: c.desc, forms: c.forms,
    }).returning();
    charIds[c.name] = r.id;
    process.stdout.write(".");
  }
  console.log(`\n  ✓ ${Object.keys(charIds).length} characters seeded`);

  console.log("🌱 Seeding evidence...");
  type EvidenceDef = { char: string; metric: string; content: string; source: string; series: string; ep: string; conf: string; direct: boolean };
  const evidenceList: EvidenceDef[] = [
    { char: "Gojo Satoru", metric: "power", content: "Gojo's Infinity (Mu) is derived from his mastery of cursed energy at a quantum level, creating an infinite convergent series between himself and any incoming attack. Mathematically impossible to physically touch him without bypassing the Infinity.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 76-80", conf: "high", direct: true },
    { char: "Gojo Satoru", metric: "hax", content: "Six Eyes can see the flow of cursed energy with microscopic precision, allowing Gojo to process and optimize his Infinity in real time to counter any curse technique output perfectly.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 75", conf: "high", direct: true },
    { char: "Gojo Satoru", metric: "attack_potency", content: "Hollow Purple — the collision of Red (repulsion) and Blue (attraction) creates a void that erases everything between two points. Used it to destroy Hanami, a Special Grade Cursed Spirit, instantly.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 119", conf: "high", direct: true },
    { char: "Ryomen Sukuna", metric: "attack_potency", content: "Sukuna's Malevolent Shrine (Domain Expansion) auto-applies disassemble and cleave to everything within range without a barrier, cutting through an entire cityscape of Tokyo in seconds.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 119", conf: "high", direct: true },
    { char: "Ryomen Sukuna", metric: "hax", content: "Sukuna possesses Reverse Cursed Technique to heal any injury by converting negative energy to positive. He healed Yuji's body completely after catastrophic damage multiple times.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 10-11", conf: "high", direct: true },
    { char: "Ryomen Sukuna", metric: "power", content: "In Megumi's body with all 20 fingers, Sukuna defeated Mahoraga — a shikigami never defeated by any sorcerer in history — by adapting his Slash to environment-targeting slashes.", source: "manga", series: "Jujutsu Kaisen", ep: "Ch. 237", conf: "high", direct: true },
    { char: "Goku (DBS)", metric: "power", content: "In Mastered Ultra Instinct form, Goku's body moves independently of conscious thought, allowing simultaneous offense and defense beyond the comprehension of even Gods of Destruction.", source: "anime", series: "Dragon Ball Super", ep: "Ep. 129", conf: "high", direct: true },
    { char: "Goku (DBS)", metric: "speed", content: "Mastered Ultra Instinct Goku's movements exceeded what all twelve Gods of Destruction in attendance could track, moving faster than light-speed reactions of divine beings.", source: "anime", series: "Dragon Ball Super", ep: "Ep. 129-130", conf: "high", direct: true },
    { char: "Naruto Uzumaki", metric: "power", content: "In Six Paths Sage Mode with Kurama, Naruto could cancel Truth-Seeking Balls and survived Madara's Limbo clones while distributing chakra to all Allied Shinobi Forces globally.", source: "manga", series: "Naruto", ep: "Ch. 672-673", conf: "high", direct: true },
    { char: "Naruto Uzumaki", metric: "stamina", content: "Naruto's tailed beast chakra provides effectively unlimited endurance. He fought continuously throughout the entire Fourth Shinobi World War distributing chakra to thousands simultaneously.", source: "manga", series: "Naruto", ep: "Ch. 570-672", conf: "high", direct: true },
    { char: "Monkey D. Luffy", metric: "power", content: "Gear 5 (Nika Mode) transforms Luffy into the Warrior of Liberation, granting reality-bending powers — he turned the ground, sea, and environment into rubber.", source: "manga", series: "One Piece", ep: "Ch. 1044-1045", conf: "high", direct: true },
    { char: "Monkey D. Luffy", metric: "hax", content: "Advanced Observation Haki (Future Sight) allows Luffy to see multiple seconds into the future, dodging attacks before they happen, first used against Katakuri.", source: "manga", series: "One Piece", ep: "Ch. 895", conf: "high", direct: true },
    { char: "Madara Uchiha", metric: "attack_potency", content: "As Ten-Tails Jinchuriki, Madara's Tengai Shinsei called down multiple meteorites from the sky simultaneously. He called two back-to-back when Onoki stopped the first.", source: "manga", series: "Naruto", ep: "Ch. 657", conf: "high", direct: true },
    { char: "Madara Uchiha", metric: "power", content: "Madara single-handedly fought the entire Allied Shinobi Forces of 80,000+ shinobi and overwhelmed them alone using Wood Release, Limbo, and Perfect Susanoo simultaneously.", source: "manga", series: "Naruto", ep: "Ch. 600-620", conf: "high", direct: true },
    { char: "Ichigo Kurosaki (TYBW)", metric: "power", content: "True Bankai form fuses Hollow and Quincy power into a single Zangetsu, vastly exceeding previous forms. Powerful enough to visibly damage Yhwach's Almighty-enhanced form.", source: "manga", series: "Bleach: TYBW", ep: "Ch. 681-682", conf: "high", direct: true },
    { char: "Yhwach", metric: "hax", content: "The Almighty (Sankt Altar) allows Yhwach to see all possible futures and alter them at will, making any attack requiring unforeseen outcomes useless. He modified the future to ensure his survival.", source: "manga", series: "Bleach: TYBW", ep: "Ch. 604-612", conf: "high", direct: true },
    { char: "Meruem", metric: "battle_iq", content: "Meruem mastered board games played worldwide — shogi, chess, go, mahjong — in under two hours each, defeating world champions. Neural processing speed exceeds human comprehension.", source: "manga", series: "Hunter x Hunter", ep: "Ch. 315-316", conf: "high", direct: true },
    { char: "Meruem", metric: "power", content: "Post-Rose revival Meruem absorbed Shaiapouf and Menthuthuyoupi's Nen, gaining infinite En range and exponentially increasing his physical abilities.", source: "manga", series: "Hunter x Hunter", ep: "Ch. 318", conf: "high", direct: true },
    { char: "Levi Ackerman", metric: "speed", content: "Levi moves fast enough to evade Beast Titan's throws, dismember multiple titans simultaneously in a single pass. Battle record shows highest individual titan kill count in Survey Corps history.", source: "manga", series: "Attack on Titan", ep: "Ch. 77", conf: "high", direct: true },
    { char: "Eren Yeager", metric: "power", content: "As Founding Titan wielder, Eren activated the Rumbling — millions of Wall Titans destroying nearly 80% of the world's population. The Founding Titan's body alone rivals entire fortresses in scale.", source: "manga", series: "Attack on Titan", ep: "Ch. 122-123", conf: "high", direct: true },
    { char: "Isshiki Otsutsuki", metric: "power", content: "Isshiki in his true form shrinks and expands objects at will using Sukunahikona and Daikokuten, making him effectively untouchable. He defeated both Naruto and Sasuke simultaneously.", source: "manga", series: "Boruto", ep: "Ch. 51-54", conf: "high", direct: true },
    { char: "Naruto Uzumaki (Baryon Mode)", metric: "power", content: "Baryon Mode uses Naruto's and Kurama's chakra as nuclear fusion fuel, creating energy that drains life-force from anything it contacts — even Isshiki's lifespan was shortened to minutes.", source: "manga", series: "Boruto", ep: "Ch. 52-53", conf: "high", direct: true },
    { char: "Jiren", metric: "power", content: "Jiren's power surpassed the Gods of Destruction level, confirmed by both Belmod and Whis. He broke his own limits and overwhelmed Ultra Instinct Goku temporarily.", source: "anime", series: "Dragon Ball Super", ep: "Ep. 130", conf: "high", direct: true },
    { char: "Sasuke Uchiha", metric: "hax", content: "Rinnegan grants Sasuke the Six Paths abilities: Amenotejikara (instant position switching), Rinne Rebirth, and vision into invisible dimensions (Limbo). He can open dimensional portals anywhere instantly.", source: "manga", series: "Naruto", ep: "Ch. 673", conf: "high", direct: true },
    { char: "Kaguya Otsutsuki", metric: "hax", content: "Kaguya can shift dimensions at will, moving all combatants to different realms including a high-gravity dimension and an endless ice world, making escape virtually impossible.", source: "manga", series: "Naruto", ep: "Ch. 679-692", conf: "high", direct: true },
    { char: "Yhwach", metric: "power", content: "Yhwach absorbed the Soul King — the fundamental lynchpin of the three worlds — and used his power to reshape reality. Without the Soul King alive, the worlds began to collapse.", source: "manga", series: "Bleach: TYBW", ep: "Ch. 611-612", conf: "high", direct: true },
  ];

  for (const ev of evidenceList) {
    const charId = charIds[ev.char];
    if (!charId) { console.log(`\n  ✗ Char not found for evidence: ${ev.char}`); continue; }
    await db.insert(evidenceTable).values({ characterId: charId, metric: ev.metric, content: ev.content, sourceType: ev.source, seriesName: ev.series, chapterEpisode: ev.ep, confidenceLevel: ev.conf, isDirect: ev.direct });
    process.stdout.write(".");
  }
  console.log(`\n  ✓ ${evidenceList.length} evidence records seeded`);
  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
