import { db } from "@workspace/db";
import { animeTable, charactersTable, evidenceTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting seed...");

  // --- Anime ---
  const animeData = [
    { name: "Naruto", nameAr: "ناروتو", genre: "أكشن/مغامرة", description: "قصة شاب يحلم بأن يصبح هوكاغي قريته" },
    { name: "One Piece", nameAr: "ون بيس", genre: "مغامرة/فانتازيا", description: "مغامرات لوفي في البحر بحثاً عن كنز الملك القراصنة" },
    { name: "Dragon Ball Z", nameAr: "دراغون بول زد", genre: "أكشن/قتالي", description: "مغامرات غوكو في الدفاع عن الأرض" },
    { name: "Attack on Titan", nameAr: "هجوم العمالقة", genre: "أكشن/دراما", description: "البشرية في مواجهة عمالقة ضخمة" },
    { name: "Jujutsu Kaisen", nameAr: "جوجوتسو كايسن", genre: "أكشن/خارق للطبيعة", description: "مواجهة النفوس الملعونة بقوة اللعنات" },
    { name: "Bleach", nameAr: "بليتش", genre: "أكشن/خارق للطبيعة", description: "مغامرات رياشي كوروساكي محارب الأرواح" },
    { name: "Hunter x Hunter", nameAr: "هانتر × هانتر", genre: "مغامرة/أكشن", description: "رحلة غون فريكس لأن يصبح صياداً" },
    { name: "Demon Slayer", nameAr: "قاتل الشياطين", genre: "أكشن/تاريخي", description: "تانجيرو يبحث عن علاج لتحويل أخته للإنسان" },
    { name: "My Hero Academia", nameAr: "بطلي الأكاديمية", genre: "أكشن/مدرسي", description: "ديكو يسعى ليصبح بطلاً رغم افتقاره للقوى" },
    { name: "Fullmetal Alchemist: Brotherhood", nameAr: "المحوّل المعدني: الأخوّة", genre: "فانتازيا/أكشن", description: "الأخوان إدوارد وألفونس في رحلة استعادة أجسادهم" },
  ];

  const insertedAnime: Record<string, number> = {};

  for (const a of animeData) {
    const [existing] = await db.select().from(animeTable).where(eq(animeTable.name, a.name));
    if (!existing) {
      const [inserted] = await db.insert(animeTable).values(a).returning();
      insertedAnime[a.name] = inserted.id;
      console.log(`  ✓ Anime: ${a.nameAr}`);
    } else {
      insertedAnime[a.name] = existing.id;
      console.log(`  - Anime exists: ${a.nameAr}`);
    }
  }

  // --- Characters ---
  const characters = [
    // NARUTO
    { name: "Naruto Uzumaki", nameAr: "ناروتو أوزوماكي", anime: "Naruto", tier: "S+", powerLevel: 9800, description: "سابع هوكاغي قرية الأوراق، يحمل قوة تاييل الثعلب" },
    { name: "Sasuke Uchiha", nameAr: "ساسوكي أوتشيها", anime: "Naruto", tier: "S+", powerLevel: 9800, description: "أقوى شينوبي أوتشيها، يمتلك الرينيغان والمانغيكيو" },
    { name: "Minato Namikaze", nameAr: "ميناتو ناميكازي", anime: "Naruto", tier: "S", powerLevel: 9200, description: "الهوكاغي الرابع، أسرع شينوبي في التاريخ" },
    { name: "Madara Uchiha", nameAr: "مادارا أوتشيها", anime: "Naruto", tier: "S+", powerLevel: 9700, description: "أسطورة أوتشيها ومشعل الحرب الرابعة" },
    { name: "Hashirama Senju", nameAr: "هاشيراما سنجو", anime: "Naruto", tier: "S+", powerLevel: 9600, description: "مؤسس قرية الأوراق، أقوى مستخدم لتقنية الخشب" },
    { name: "Itachi Uchiha", nameAr: "إيتاتشي أوتشيها", anime: "Naruto", tier: "S", powerLevel: 8900, description: "عبقري جونين وعميل المنظمة في أكاتسوكي" },
    { name: "Obito Uchiha", nameAr: "أوبيتو أوتشيها", anime: "Naruto", tier: "S", powerLevel: 9000, description: "قناع يحمل قوة مادارا ويسيطر على التيلبي" },
    { name: "Nagato Uzumaki", nameAr: "ناغاتو أوزوماكي", anime: "Naruto", tier: "S", powerLevel: 8800, description: "مستخدم الرينيغان وزعيم الأمطار المخفي" },
    { name: "Killer B", nameAr: "كيلر بي", anime: "Naruto", tier: "A+", powerLevel: 8200, description: "حامل ذو الذيول الثمانية والراب" },
    { name: "Rock Lee", nameAr: "روك لي", anime: "Naruto", tier: "A", powerLevel: 7200, description: "يعتمد على تقنيات الجسد دون أي نينجاتسو" },

    // ONE PIECE
    { name: "Monkey D. Luffy", nameAr: "مونكي دي لوفي", anime: "One Piece", tier: "S+", powerLevel: 9700, description: "ملك القراصنة يمتلك قوة الغول الشمسي" },
    { name: "Roronoa Zoro", nameAr: "رورونوا زورو", anime: "One Piece", tier: "S", powerLevel: 9400, description: "أقوى محارب بالسيوف وأول ضابط لوفي" },
    { name: "Shanks", nameAr: "شانكس", anime: "One Piece", tier: "S+", powerLevel: 9600, description: "إمبراطور بحار بالتسليح والملاحظة الخارقين" },
    { name: "Whitebeard", nameAr: "وايت بيرد", anime: "One Piece", tier: "S+", powerLevel: 9700, description: "أقوى رجل في العالم يملك قوة زلزال الأرض" },
    { name: "Kaido", nameAr: "كايدو", anime: "One Piece", tier: "S+", powerLevel: 9650, description: "أقوى كائن حي يملك قوة التنين الأزرق" },
    { name: "Trafalgar Law", nameAr: "ترافالغار لو", anime: "One Piece", tier: "A+", powerLevel: 8600, description: "قوة الأوبا-أوبا تمنحه السيطرة الكاملة على الفضاء" },
    { name: "Boa Hancock", nameAr: "بوا هانكوك", anime: "One Piece", tier: "A+", powerLevel: 8400, description: "ملكة الأمازون تحول أعداءها لحجر بالجمال" },
    { name: "Dracule Mihawk", nameAr: "درا كول ميهوك", anime: "One Piece", tier: "S", powerLevel: 9300, description: "أقوى مبارز بالسيوف في العالم" },
    { name: "Portgas D. Ace", nameAr: "بورتغاس دي إيس", anime: "One Piece", tier: "A+", powerLevel: 8300, description: "ابن ملك القراصنة يسيطر على اللهب" },
    { name: "Charlotte Katakuri", nameAr: "شارلوت كاتاكوري", anime: "One Piece", tier: "S", powerLevel: 9100, description: "أقوى أبناء بيغ مام يمتلك الهاكي المستقبلي" },

    // DRAGON BALL Z
    { name: "Goku", nameAr: "غوكو", anime: "Dragon Ball Z", tier: "S+", powerLevel: 9900, description: "المحارب السايان صاحب قوة Ultra Instinct" },
    { name: "Vegeta", nameAr: "فيغيتا", anime: "Dragon Ball Z", tier: "S+", powerLevel: 9800, description: "أمير السايان يمتلك قوة Ultra Ego" },
    { name: "Gohan", nameAr: "غوهان", anime: "Dragon Ball Z", tier: "S", powerLevel: 9500, description: "ابن غوكو يمتلك إمكانيات تتجاوز والده" },
    { name: "Frieza", nameAr: "فريزا", anime: "Dragon Ball Z", tier: "S+", powerLevel: 9700, description: "إمبراطور الكون يمتلك قوة True Black Frieza" },
    { name: "Cell", nameAr: "سيل", anime: "Dragon Ball Z", tier: "S", powerLevel: 9200, description: "الأندرويد الكامل يمتلك قدرات الجميع" },
    { name: "Broly", nameAr: "برولي", anime: "Dragon Ball Z", tier: "S+", powerLevel: 9850, description: "السايان الأسطوري صاحب القوة اللامحدودة" },
    { name: "Beerus", nameAr: "بيروس", anime: "Dragon Ball Z", tier: "S+", powerLevel: 9950, description: "إله التدمير وحارس الكون السابع" },
    { name: "Piccolo", nameAr: "بيكولو", anime: "Dragon Ball Z", tier: "A+", powerLevel: 8700, description: "سيد المجال المقدس مدرب غوهان" },
    { name: "Trunks", nameAr: "ترانكس", anime: "Dragon Ball Z", tier: "A+", powerLevel: 8500, description: "ابن فيغيتا من المستقبل صاحب سيف النور" },
    { name: "Android 17", nameAr: "أندرويد 17", anime: "Dragon Ball Z", tier: "S", powerLevel: 9300, description: "الأندرويد اللانهائي القوة حارس المحمية" },

    // ATTACK ON TITAN
    { name: "Eren Yeager", nameAr: "إيرين ييغر", anime: "Attack on Titan", tier: "S+", powerLevel: 9500, description: "حامل قوة التأسيس وعمالقة الهجوم والمدرع" },
    { name: "Mikasa Ackerman", nameAr: "ميكاسا آكيرمان", anime: "Attack on Titan", tier: "S", powerLevel: 8800, description: "أقوى جندية في فيلق الاستطلاع" },
    { name: "Levi Ackerman", nameAr: "ليفي آكيرمان", anime: "Attack on Titan", tier: "S", powerLevel: 9000, description: "أقوى جندي في تاريخ البشرية" },
    { name: "Zeke Yeager", nameAr: "زيك ييغر", anime: "Attack on Titan", tier: "S", powerLevel: 8700, description: "حامل قوة العملاق الوحشي" },
    { name: "Reiner Braun", nameAr: "راينر براون", anime: "Attack on Titan", tier: "A+", powerLevel: 8000, description: "حامل قوة العملاق المدرع" },

    // JUJUTSU KAISEN
    { name: "Gojo Satoru", nameAr: "غوجو ساتورو", anime: "Jujutsu Kaisen", tier: "S+", powerLevel: 9800, description: "أقوى ساحر لعنة عبر التاريخ يمتلك اللانهائية" },
    { name: "Ryomen Sukuna", nameAr: "ريومن سوكونا", anime: "Jujutsu Kaisen", tier: "S+", powerLevel: 9900, description: "ملك اللعنات وأقوى كائن في التاريخ" },
    { name: "Yuta Okkotsu", nameAr: "يوتا أوكوتسو", anime: "Jujutsu Kaisen", tier: "S", powerLevel: 9400, description: "الطالب الموهوب الثاني بعد غوجو" },
    { name: "Itadori Yuji", nameAr: "إيتادوري يوجي", anime: "Jujutsu Kaisen", tier: "A+", powerLevel: 8500, description: "حامل إصبع سوكونا يمتلك قوة خارقة" },
    { name: "Megumi Fushiguro", nameAr: "ميغومي فوشيغورو", anime: "Jujutsu Kaisen", tier: "A+", powerLevel: 8200, description: "يستدعي الظلال العشرة للقتال" },
    { name: "Toji Fushiguro", nameAr: "توجي فوشيغورو", anime: "Jujutsu Kaisen", tier: "S", powerLevel: 9000, description: "الخالي من الطاقة يقهر السحرة بالقوة الجسدية" },

    // BLEACH
    { name: "Ichigo Kurosaki", nameAr: "إيتشيغو كوروساكي", anime: "Bleach", tier: "S+", powerLevel: 9700, description: "محارب الأرواح الكامل يمتلك قوة متعددة" },
    { name: "Sosuke Aizen", nameAr: "سوسوكي أيزن", anime: "Bleach", tier: "S+", powerLevel: 9800, description: "القائد السابق لأرواح السيوف المتوهم قوة الكيرنيل" },
    { name: "Kenpachi Zaraki", nameAr: "كينباتشي زاراكي", anime: "Bleach", tier: "S", powerLevel: 9300, description: "أقوى محارب بالسيوف في الجيش الملكي" },
    { name: "Yhwach", nameAr: "يهواخ", anime: "Bleach", tier: "S+", powerLevel: 9900, description: "أب الكوينسيس ومن ينهب القدرات المستقبلية" },

    // HUNTER X HUNTER
    { name: "Meruem", nameAr: "ميروم", anime: "Hunter x Hunter", tier: "S+", powerLevel: 9850, description: "ملك النمل الخيميائي أقوى كائن في العالم" },
    { name: "Gon Freecss", nameAr: "غون فريكس", anime: "Hunter x Hunter", tier: "S", powerLevel: 8800, description: "الصياد الموهوب بإمكانيات لا حدود لها" },
    { name: "Killua Zoldyck", nameAr: "كيلوا زولدايك", anime: "Hunter x Hunter", tier: "S", powerLevel: 8700, description: "وريث عائلة القتل الأكثر إبداعاً" },
    { name: "Netero Isaac", nameAr: "نيتيرو آيزاك", anime: "Hunter x Hunter", tier: "S", powerLevel: 9100, description: "رئيس رابطة الصيادين وأحد أقوى الرجال" },

    // DEMON SLAYER
    { name: "Yoriichi Tsugikuni", nameAr: "يوريتشي تسوغيكوني", anime: "Demon Slayer", tier: "S+", powerLevel: 9700, description: "أقوى قاتل شياطين عبر التاريخ ومبتكر أنفاس الشمس" },
    { name: "Tanjiro Kamado", nameAr: "تانجيرو كامادو", anime: "Demon Slayer", tier: "A+", powerLevel: 8200, description: "قاتل الشياطين يحمل أنفاس الشمس الأصيلة" },
    { name: "Muzan Kibutsuji", nameAr: "موزان كيبوتسوجي", anime: "Demon Slayer", tier: "S+", powerLevel: 9600, description: "ملك الشياطين الأصلي والمصدر لكل الشياطين" },
    { name: "Kokushibo", nameAr: "كوكوشيبو", anime: "Demon Slayer", tier: "S", powerLevel: 9200, description: "القمر الأعلى الأول أقوى شياطين موزان" },

    // MY HERO ACADEMIA
    { name: "All Might", nameAr: "أول مايت", anime: "My Hero Academia", tier: "S+", powerLevel: 9500, description: "رمز السلام ووريث قوة One For All" },
    { name: "Izuku Midoriya", nameAr: "إيزوكو ميدوريا", anime: "My Hero Academia", tier: "S", powerLevel: 9000, description: "الوريث التاسع لـ One For All" },
    { name: "Tomura Shigaraki", nameAr: "توموتو شيغاراكي", anime: "My Hero Academia", tier: "S+", powerLevel: 9400, description: "زعيم الأشرار يملك قدرة التفتت" },
    { name: "All For One", nameAr: "أول فور ون", anime: "My Hero Academia", tier: "S+", powerLevel: 9600, description: "يسرق قدرات الآخرين ويجمعها" },

    // FMA
    { name: "Father", nameAr: "الأب", anime: "Fullmetal Alchemist: Brotherhood", tier: "S+", powerLevel: 9500, description: "الهومنكولوس الأبدي يسعى لامتلاص قوة الإله" },
    { name: "Edward Elric", nameAr: "إدوارد إلريك", anime: "Fullmetal Alchemist: Brotherhood", tier: "A+", powerLevel: 8000, description: "المحول المعدني يحول دون دائرة" },
    { name: "Roy Mustang", nameAr: "روي موستانغ", anime: "Fullmetal Alchemist: Brotherhood", tier: "A+", powerLevel: 8200, description: "الكولونيل اللهب يسيطر على النار" },
    { name: "Greed/Ling", nameAr: "غريد/لينغ", anime: "Fullmetal Alchemist: Brotherhood", tier: "A+", powerLevel: 7800, description: "درع أساسي لا ينكسر" },
    { name: "Pride", nameAr: "برايد", anime: "Fullmetal Alchemist: Brotherhood", tier: "S", powerLevel: 8700, description: "الهومنكولوس الأقوى يسيطر على الظلال" },
  ];

  for (const c of characters) {
    const animeId = insertedAnime[c.anime];
    if (!animeId) { console.log(`  ✗ Anime not found: ${c.anime}`); continue; }

    const [existing] = await db.select().from(charactersTable)
      .where(eq(charactersTable.name, c.name));
    if (!existing) {
      await db.insert(charactersTable).values({
        name: c.name,
        nameAr: c.nameAr,
        animeId,
        tier: c.tier,
        powerLevel: c.powerLevel,
        description: c.description,
      });
      console.log(`  ✓ Character: ${c.nameAr}`);
    } else {
      console.log(`  - Character exists: ${c.nameAr}`);
    }
  }

  // --- Evidence ---
  const evidenceData = [
    // Gojo
    { charName: "Gojo Satoru", metric: "power", content: "غوجو ساتورو يمتلك تقنية اللانهائية (أومويه) التي تخلق مجالاً لا نهائياً يمنع أي شيء من لمسه، مستمدة من تلاعبه بالطاقة الكونية على المستوى الكمي.", sourceType: "manga", seriesName: "Jujutsu Kaisen", chapterEpisode: "فصل 76-80", confidenceLevel: "high", isDirect: true },
    { charName: "Gojo Satoru", metric: "hax", content: "عيون الكرة السماوية الستة (ريكغان) تتيح له رؤية تدفق الطاقة الكامل في الجسم ورسم خريطة أمثل للتدمير في أي كائن.", sourceType: "manga", seriesName: "Jujutsu Kaisen", chapterEpisode: "فصل 75", confidenceLevel: "high", isDirect: true },
    { charName: "Gojo Satoru", metric: "speed", content: "قادر على الانتقال بسرعة تفوق قدرة عين بشرية على المتابعة، أثبت ذلك في معاركه الأولى ضد توجي.", sourceType: "manga", seriesName: "Jujutsu Kaisen", chapterEpisode: "فصل 65-67", confidenceLevel: "high", isDirect: true },

    // Sukuna
    { charName: "Ryomen Sukuna", metric: "attack_potency", content: "تقنية مالِك النار (جوكاي) تمزق المكان الهدف بتقطيعه الخفي، وقادر على تقطيع ما لا يُرى بالعين. استخدمها لتدمير جزء كبير من طوكيو في فصل واحد.", sourceType: "manga", seriesName: "Jujutsu Kaisen", chapterEpisode: "فصل 119", confidenceLevel: "high", isDirect: true },
    { charName: "Ryomen Sukuna", metric: "hax", content: "يمتلك تقنية العكس (هانتن) للشفاء الكامل من أي جرح بتحويل السلبية إلى إيجابية. شفا جسد إيتادوري بشكل كامل بعد تفاقم الجروح.", sourceType: "manga", seriesName: "Jujutsu Kaisen", chapterEpisode: "فصل 10", confidenceLevel: "high", isDirect: true },

    // Goku
    { charName: "Goku", metric: "power", content: "في حالة Ultra Instinct Sign، تجاوز مستوى الآلهة وأصبح قادراً على تحريك جسده دون تفكير واعٍ، مما جعل هجماته ودفاعاته في وقت واحد.", sourceType: "anime", seriesName: "Dragon Ball Super", chapterEpisode: "حلقة 109-110", confidenceLevel: "high", isDirect: true },
    { charName: "Goku", metric: "speed", content: "سرعة الضوء تُعتبر عتبة قديمة تجاوزها منذ زمن. في Ultra Instinct الكامل أصبح أسرع من كل الحاضرين في الملعب.", sourceType: "anime", seriesName: "Dragon Ball Super", chapterEpisode: "حلقة 129", confidenceLevel: "high", isDirect: true },

    // Naruto
    { charName: "Naruto Uzumaki", metric: "power", content: "في وضع Six Paths Sage Mode مع Kurama يمتلك ناروتو قوة تكافئ Six Paths Senjutsu. قادر على إلغاء تشكيلات مادارا في شكله كـ Juubi Jin.", sourceType: "manga", seriesName: "Naruto", chapterEpisode: "فصل 672-673", confidenceLevel: "high", isDirect: true },
    { charName: "Naruto Uzumaki", metric: "stamina", content: "سيل لا ينتهي من طاقة الشاكرا بفضل قدرات تيالبي تسمح له بالقتال لأيام متواصلة دون انهاك.", sourceType: "manga", seriesName: "Naruto", chapterEpisode: "فصل 570", confidenceLevel: "high", isDirect: true },

    // Luffy
    { charName: "Monkey D. Luffy", metric: "power", content: "تقنية Gear Fifth (العتلة الخامسة) تحول لوفي لتجسيد كامل لقوة الغول الشمسي، مما أعطاه قوة الواقع نفسه - قادر على تحريك الجزر وتشكيل المحيط.", sourceType: "manga", seriesName: "One Piece", chapterEpisode: "فصل 1044-1045", confidenceLevel: "high", isDirect: true },
    { charName: "Monkey D. Luffy", metric: "hax", content: "هاكي الملاحظة المتقدم يسمح له برؤية المستقبل القريب، كما طوره كاتاكوري الذي يتوقع الهجمات مسبقاً.", sourceType: "manga", seriesName: "One Piece", chapterEpisode: "فصل 895", confidenceLevel: "high", isDirect: true },

    // Madara
    { charName: "Madara Uchiha", metric: "power", content: "مادارا في وضع Juubi Jin قادر على استخدام Tengai Shinsei لإسقاط كويكبات من السماء بمجرد الإشارة. أسقط كويكبين متتاليين في فصل واحد.", sourceType: "manga", seriesName: "Naruto", chapterEpisode: "فصل 657", confidenceLevel: "high", isDirect: true },

    // Ichigo
    { charName: "Ichigo Kurosaki", metric: "power", content: "في شكله النهائي True Bankai، يمتلك قوة تعادل Royal Guard. سيفه Zangetsu النهائي قادر على قطع الفضاء ذاته.", sourceType: "manga", seriesName: "Bleach", chapterEpisode: "فصل 684-685", confidenceLevel: "high", isDirect: true },

    // Meruem
    { charName: "Meruem", metric: "battle_iq", content: "تمكن من إتقان لعبة شطرنج معقدة بعد 2 ساعة فقط ثم سيطر على جميع ألعاب الأستراتيجية، وهزم أبطال عالميين بعد دراسة دقيقة للمدة الزمنية القصوى.", sourceType: "anime", seriesName: "Hunter x Hunter", chapterEpisode: "حلقة 125-126", confidenceLevel: "high", isDirect: true },
    { charName: "Meruem", metric: "power", content: "بعد إعادة الإحياء يمتلك Meruem طاقة En لا نهائية وقدرة على امتصاص nen الآخرين عند أكلهم، مما جعله يتقوى باستمرار.", sourceType: "manga", seriesName: "Hunter x Hunter", chapterEpisode: "فصل 315-316", confidenceLevel: "high", isDirect: true },

    // Aizen
    { charName: "Sosuke Aizen", metric: "hax", content: "الكيرنيل هوهيو هيتسوغايا يخلق وهماً كاملاً يتحكم بكل الحواس الخمس للضحية، حتى رؤية القتل والموت وهم كامل. لم يتغلب عليه أحد باستثناء إيتشيغو.", sourceType: "manga", seriesName: "Bleach", chapterEpisode: "فصل 392", confidenceLevel: "high", isDirect: true },

    // Yoriichi
    { charName: "Yoriichi Tsugikuni", metric: "power", content: "نجح في تثبيط موزان كيبوتسوجي (ملك الشياطين) بضربة واحدة وجعله يقترب من الموت، وهو ما لم يستطع أحد آخر تحقيقه في التاريخ.", sourceType: "manga", seriesName: "Demon Slayer", chapterEpisode: "فصل 186", confidenceLevel: "high", isDirect: true },
    { charName: "Yoriichi Tsugikuni", metric: "speed", content: "قادر على اختراق دفاعات موزان بأنفاس شمس متعددة قبل أن يدرك الأخير ما يحدث، بالرغم من كون موزان أسرع من أي شيطان آخر.", sourceType: "manga", seriesName: "Demon Slayer", chapterEpisode: "فصل 186-187", confidenceLevel: "high", isDirect: true },

    // Levi
    { charName: "Levi Ackerman", metric: "speed", content: "قادر على التحرك بسرعة لا يرصدها البصر البشري، حقق ذلك في مواجهة مع البيست تايتان الذي قطع ذيله وصاح من الألم.", sourceType: "anime", seriesName: "Attack on Titan", chapterEpisode: "حلقة 54", confidenceLevel: "high", isDirect: true },
    { charName: "Levi Ackerman", metric: "battle_iq", content: "مهاراته القتالية مبنية على تجربة عقود كصياد بشري وقائد. قاد فريقاً صغيراً لإسقاط بيست تايتان في غضون دقيقة واحدة.", sourceType: "manga", seriesName: "Attack on Titan", chapterEpisode: "فصل 77", confidenceLevel: "high", isDirect: true },
  ];

  for (const ev of evidenceData) {
    const [char] = await db.select().from(charactersTable).where(eq(charactersTable.name, ev.charName));
    if (!char) { console.log(`  ✗ Character not found for evidence: ${ev.charName}`); continue; }

    await db.insert(evidenceTable).values({
      characterId: char.id,
      metric: ev.metric,
      content: ev.content,
      sourceType: ev.sourceType,
      seriesName: ev.seriesName,
      chapterEpisode: ev.chapterEpisode,
      confidenceLevel: ev.confidenceLevel,
      isDirect: ev.isDirect,
    });
    console.log(`  ✓ Evidence: ${ev.charName} — ${ev.metric}`);
  }

  // Update character counts
  for (const [animeName, animeId] of Object.entries(insertedAnime)) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(charactersTable).where(eq(charactersTable.animeId, animeId));
    await db.update(animeTable).set({ characterCount: count }).where(eq(animeTable.id, animeId));
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
