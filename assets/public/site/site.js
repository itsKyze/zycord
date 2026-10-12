"use strict";
(() => {
  // assets/public/jsx/runtime.jsx
  var SVG_TAGS = /* @__PURE__ */ new Set([
    "svg",
    "path",
    "circle",
    "rect",
    "line",
    "polyline",
    "polygon",
    "g",
    "defs",
    "linearGradient",
    "radialGradient",
    "stop",
    "clipPath",
    "mask",
    "text",
    "tspan"
  ]);
  function Fragment(props) {
    return props.children;
  }
  function h(tag, props, ...children) {
    if (typeof tag === "function") {
      return tag({ ...props || {}, children });
    }
    const isSvg = SVG_TAGS.has(tag);
    const el = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    if (props) {
      for (const [key, val] of Object.entries(props)) {
        if (val === void 0 || val === null || val === false || key === "children" || key === "key") {
          continue;
        }
        if (key === "className" || key === "class") {
          if (isSvg) el.setAttribute("class", String(val));
          else el.className = String(val);
        } else if (key === "dangerouslySetInnerHTML" && val && typeof val.__html === "string") {
          el.innerHTML = val.__html;
        } else if (key === "style" && typeof val === "object") {
          Object.assign(el.style, val);
        } else if (key.startsWith("on") && typeof val === "function") {
          const evt = key.slice(2).toLowerCase();
          el.addEventListener(evt, val);
        } else if (key === "ref" && typeof val === "function") {
          val(el);
        } else if (val === true) {
          el.setAttribute(key, "");
          if (key in el && !isSvg) {
            try {
              el[key] = true;
            } catch (_e) {
            }
          }
        } else {
          el.setAttribute(key, String(val));
        }
      }
    }
    const appendChild = (child) => {
      if (child === null || child === void 0 || child === false || child === true) return;
      if (Array.isArray(child)) {
        child.forEach(appendChild);
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else {
        el.appendChild(document.createTextNode(String(child)));
      }
    };
    children.forEach(appendChild);
    return el;
  }
  function mountJSX(target, node) {
    if (!target) return null;
    target.innerHTML = "";
    if (Array.isArray(node)) {
      node.forEach((n) => {
        if (n instanceof Node) target.appendChild(n);
      });
    } else if (node instanceof Node) {
      target.appendChild(node);
    }
    return target;
  }
  function replaceJSX(target, node) {
    if (!target || !target.parentNode) return null;
    const parent = target.parentNode;
    if (Array.isArray(node)) {
      const frag = document.createDocumentFragment();
      node.forEach((n) => {
        if (n instanceof Node) frag.appendChild(n);
      });
      parent.replaceChild(frag, target);
    } else if (node instanceof Node) {
      parent.replaceChild(node, target);
    }
    return node;
  }

  // assets/public/jsx/Icons.jsx
  var ZYCORD_MASCOT_PATH = "M6.25 4.42L6.8 4.51L6.8 4.6L7.16 4.7L7.25 4.88L7.43 4.88L7.62 5.15L7.8 5.15L9.08 6.61L9.53 6.52L9.53 6.43L9.9 6.43L9.9 6.34L10.27 6.34L10.27 6.25L10.81 6.25L10.81 6.16L13.19 6.16L13.19 6.25L13.73 6.25L13.73 6.34L14.1 6.34L14.1 6.43L14.47 6.43L14.47 6.52L14.92 6.61L16.11 5.24L16.29 5.24L16.57 4.88L16.75 4.88L16.84 4.7L17.02 4.7L17.2 4.51L17.48 4.51L17.48 4.42L18.03 4.51L18.39 4.88L18.39 5.06L18.57 5.15L18.57 5.43L18.76 5.61L18.94 6.52L19.21 6.52L19.21 6.43L19.4 6.43L19.76 6.16L20.03 6.16L20.13 5.97L20.67 5.79L21.04 5.43L21.22 5.43L22.13 4.51L22.5 4.6L22.5 5.43L22.41 5.43L22.41 5.79L22.32 5.79L22.32 6.07L22.23 6.07L22.13 6.43L21.95 6.52L21.77 6.98L21.22 7.53L20.95 7.62L20.95 7.71L21.22 7.71L21.22 7.62L21.5 7.62L21.5 7.53L21.68 7.53L21.68 7.43L22.32 7.16L22.41 7.25L22.32 7.98L22.23 7.98L22.04 8.53L21.13 9.44L20.77 9.53L20.67 9.72L20.4 9.72L20.4 9.9L20.49 9.81L21.22 9.81L21.22 9.72L21.59 9.72L21.68 9.9L21.59 9.9L21.5 10.27L21.31 10.36L21.31 10.54L20.77 11.09L20.58 11.09L20.22 11.45L19.85 11.54L19.94 12.09L20.03 12.09L20.03 12.37L20.13 12.37L20.13 12.73L20.22 12.73L20.22 13.1L20.31 13.1L20.31 13.46L20.4 13.46L20.4 13.92L20.49 13.92L20.49 14.37L20.58 14.37L20.58 15.01L20.67 15.01L20.67 15.65L20.77 15.65L20.77 17.75L20.67 17.75L20.67 18.12L20.58 18.12L20.49 18.57L20.31 18.67L20.31 18.85L19.94 19.21L19.76 19.21L19.4 19.49L18.94 19.49L18.94 19.58L18.57 19.58L18.57 19.49L17.84 19.3L16.57 18.03L16.57 17.84L16.11 17.39L16.11 17.2L15.83 17.02L15.83 16.84L15.56 16.75L15.47 16.57L15.1 16.47L15.1 16.38L8.9 16.38L8.9 16.47L8.71 16.47L8.44 16.75L8.17 16.84L8.17 17.02L7.71 17.48L7.71 17.66L7.43 17.84L7.43 18.03L7.07 18.3L7.07 18.48L6.52 19.03L6.34 19.03L5.97 19.4L5.06 19.58L5.06 19.49L4.7 19.49L4.7 19.4L4.42 19.4L4.15 19.12L3.97 19.12L3.69 18.85L3.69 18.67L3.51 18.57L3.42 18.03L3.33 18.03L3.33 17.75L3.23 17.75L3.23 15.74L3.33 15.74L3.42 14.37L3.51 14.37L3.6 13.46L3.69 13.46L3.69 13.1L3.78 13.1L3.78 12.73L3.87 12.73L3.87 12.37L3.97 12.37L3.97 12.09L4.06 12.09L4.15 11.54L3.97 11.54L3.69 11.27L3.51 11.27L3.42 11.09L3.23 11.09L2.69 10.54L2.69 10.36L2.5 10.27L2.5 10.08L2.32 9.9L2.41 9.72L2.87 9.72L2.87 9.81L3.6 9.81L3.6 9.72L3.33 9.72L3.23 9.53L2.78 9.35L2.05 8.62L2.05 8.44L1.77 8.17L1.68 7.62L1.59 7.62L1.68 7.16L2.32 7.43L2.32 7.53L2.5 7.53L2.5 7.62L3.05 7.71L3.05 7.8L3.14 7.71L2.96 7.53L2.78 7.53L2.23 6.98L2.05 6.52L1.87 6.43L1.77 5.97L1.59 5.79L1.59 5.33L1.5 5.33L1.5 4.6L1.87 4.51L2.32 5.06L2.5 5.06L2.69 5.33L2.87 5.33L3.33 5.79L3.51 5.79L3.51 5.88L3.87 5.97L3.97 6.16L4.24 6.16L4.24 6.25L4.42 6.25L4.79 6.52L5.06 6.52L5.15 5.88L5.24 5.88L5.24 5.61L5.43 5.43L5.43 5.15L5.61 5.06L5.61 4.88L5.97 4.51L6.25 4.51ZM8.17 10.17L8.07 10.17L8.07 10.27L7.89 10.27L7.89 10.36L7.71 10.36L7.71 10.45L7.53 10.45L7.53 10.54L7.43 10.54L7.43 10.63L7.34 10.63L7.25 10.81L7.16 10.81L7.16 11.0L6.98 11.09L6.98 11.27L6.89 11.27L6.89 11.54L6.8 11.54L6.8 12.46L6.89 12.46L6.89 12.73L6.98 12.73L6.98 12.91L7.16 13.0L7.16 13.19L7.25 13.19L7.25 13.28L7.34 13.28L7.43 13.46L7.62 13.46L7.71 13.64L7.89 13.64L7.89 13.73L8.17 13.73L8.17 13.83L9.17 13.83L9.17 13.73L9.44 13.73L9.44 13.64L9.63 13.64L9.63 13.55L9.72 13.55L9.72 13.46L9.9 13.46L9.9 13.37L10.08 13.28L10.08 13.1L10.27 13.0L10.27 12.82L10.36 12.82L10.36 12.64L10.45 12.64L10.45 12.27L10.54 12.27L10.54 11.73L10.45 11.73L10.45 11.36L10.36 11.36L10.36 11.09L10.17 11.0L10.17 10.81L10.08 10.81L10.08 10.72L9.99 10.72L9.9 10.54L9.72 10.54L9.63 10.36L9.44 10.36L9.44 10.27L9.17 10.27L9.17 10.17L8.26 10.17ZM14.92 10.17L14.83 10.17L14.83 10.27L14.56 10.27L14.56 10.36L14.37 10.36L14.28 10.54L14.1 10.54L14.1 10.63L14.01 10.63L14.01 10.72L13.83 10.81L13.83 11.0L13.73 11.0L13.73 11.18L13.64 11.18L13.64 11.36L13.55 11.36L13.55 11.73L13.46 11.73L13.46 12.27L13.55 12.27L13.55 12.64L13.64 12.64L13.73 13.0L13.92 13.1L13.92 13.28L14.01 13.28L14.1 13.46L14.28 13.46L14.37 13.64L14.56 13.64L14.56 13.73L14.83 13.73L14.83 13.83L15.83 13.83L15.83 13.73L16.11 13.73L16.11 13.64L16.29 13.64L16.38 13.46L16.57 13.46L16.57 13.37L16.66 13.37L16.66 13.28L16.84 13.19L16.84 13.0L17.02 12.91L17.02 12.73L17.11 12.73L17.11 12.46L17.2 12.46L17.2 11.54L17.11 11.54L17.11 11.27L17.02 11.27L16.93 10.9L16.84 10.9L16.84 10.81L16.75 10.81L16.75 10.72L16.66 10.72L16.66 10.63L16.47 10.54L16.47 10.45L16.29 10.45L16.29 10.36L16.11 10.36L16.11 10.27L15.93 10.27L15.93 10.17L15.01 10.17Z";
  function ZycordMark({ size = 28, color = "currentColor" }) {
    return /* @__PURE__ */ h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ h("path", { fill: color, "fill-rule": "evenodd", d: ZYCORD_MASCOT_PATH })
    );
  }

  // assets/public/jsx/i18n.js
  var TRANSLATIONS = {
    ar: {
      // Navbar & Global CTA
      "Download": "تحميل",
      "Nitro": "نيترو",
      "Discover": "اكتشف",
      "Safety": "الأمان",
      "Quests": "المهام",
      "Support": "الدعم",
      "Blog": "المدونة",
      "Developers": "المطورون",
      "Careers": "الوظائف",
      "Log In": "تسجيل الدخول",
      "Open Zycord": "افتح Zycord",
      "Open Zycord in your browser": "افتح Zycord في المتصفح",
      "Open Zycord in Browser": "افتح Zycord في المتصفح",
      "Download for Windows": "تحميل لنظام Windows",
      "Download for Mac": "تحميل لنظام Mac",
      "Language": "اللغة",
      "Product": "المنتج",
      "Company": "الشركة",
      "Resources": "الموارد",
      "Policies": "السياسات",
      "Status": "حالة النظام",
      "App Directory": "دليل التطبيقات",
      "Gift Cards": "بطاقات الهدايا",
      "About": "عن Zycord",
      "Jobs": "الوظائف",
      "Brand": "العلامة التجارية",
      "Newsroom": "غرفة الأخبار",
      "Creators": "صناع المحتوى",
      "Community": "المجتمع",
      "Official 3rd Party Merch": "المتجر الرسمي",
      "Feedback": "الملاحظات",
      "Terms": "الشروط",
      "Privacy": "الخصوصية",
      "Cookie Settings": "إعدادات ملفات الارتباط",
      "Guidelines": "إرشادات المجتمع",
      "Acknowledgements": "شكر وتقدير",
      "Licenses": "التراخيص",
      "Company Information": "معلومات الشركة",
      // Dropdown items
      "Server Directory": "دليل الخوادم",
      "Trending Games": "الألعاب الرائجة",
      "Family Center": "مركز العائلة",
      "Safety Library": "مكتبة الأمان",
      "Safety News": "أخبار الأمان",
      "Teen Charter": "ميثاق المراهقين",
      "Zycord Player's Guide": "دليل لاعبي Zycord",
      "Community Guidelines": "إرشادات المجتمع",
      "Hubs": "المراكز",
      "Parent Hub": "مركز الوالدين",
      "Policy Hub": "مركز السياسات",
      "Privacy Hub": "مركز الخصوصية",
      "Transparency Hub": "مركز الشفافية",
      "Wellbeing Hub": "مركز الرفاهية",
      "Advertising": "الإعلانات",
      "Success Stories": "قصص النجاح",
      "Quests FAQ": "الأسئلة الشائعة للمهام",
      "Help Center": "مركز المساعدة",
      "Submit a Request": "تقديم طلب دعم",
      "System Status": "حالة النظام",
      "Collections": "المجموعات",
      "Featured": "المميزة",
      "Zycord HQ": "مقر Zycord",
      "Engineering & Developers": "الهندسة والمطورون",
      "How to Zycord": "كيف تستخدم Zycord",
      "Policy & Safety": "السياسة والأمان",
      "Product & Features": "المنتجات والمميزات",
      "Learn": "تعلّم",
      "Zycord for Game Developers": "Zycord لمطوري الألعاب",
      "Integration": "التكامل البرمجي",
      "Social Commerce": "التجارة الاجتماعية",
      "Apps & Activities": "التطبيقات والأنشطة",
      "Developer Newsletter": "نشرة المطورين",
      "Developer Case Studies": "دراسات حالة المطورين",
      "Build": "ابنِ",
      "Official Game Communities": "مجتمعات الألعاب الرسمية",
      "Developer Portal": "بوابة المطورين",
      "Documentation": "التوثيق البرمجي",
      "Developer Help Center": "مركز مساعدة المطورين",
      // Home Page
      "GROUP CHAT THAT’S ALL FUN & GAMES": "دردشة جماعية مليئة بالمرح والألعاب",
      "Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.": "يُعد Zycord المكان المثالي للعب الألعاب والاسترخاء مع الأصدقاء، أو حتى بناء مجتمع عالمي. خصص مساحتك الخاصة للتحدث واللعب وقضاء أمتع الأوقات.",
      "MAKE YOUR GROUP CHATS MORE FUN": "اجعل دردشاتك الجماعية أكثر متعة",
      "Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or text chat. Set your avatar and a custom status, and write your own profile to show up in chat your way.": "استخدم الرموز التعبيرية المخصصة والملصقات ومؤثرات لوحة الصوت لإضفاء شخصيتك على محادثاتك الصوتية أو المرئية أو النصية. عيّن صورتك الرمزية وحالتك المخصصة بطريقتك الخاصة.",
      "STREAM LIKE YOU’RE IN THE SAME ROOM": "بث مباشر وكأنكم في نفس الغرفة",
      "High quality and low latency streaming makes it feel like you're hanging out on the couch with friends while playing a game, watching shows, looking at photos, or idk doing homework or something.": "بث عالي الجودة وبأقل زمن استجابة يجعلك تشعر وكأنك تجلس مع أصدقائك في نفس الغرفة أثناء لعب الألعاب أو مشاهدة العروض أو مشاركة اللحظات.",
      "HOP IN WHEN YOU’RE FREE, NO NEED TO CALL": "انضم متى شئت، دون الحاجة للاتصال",
      "Easily hop in and out of voice or text chats without having to call or invite anyone, so your party chat lasts before, during, and after your game session.": "ادخل واخرج بسهولة من القنوات الصوتية أو النصية دون الحاجة للاتصال بأي شخص، لتستمر محادثاتكم قبل وأثناء وبعد جلسة اللعب.",
      "SEE WHO’S AROUND TO CHILL": "شاهد من المتصل الآن للاستمتاع معاً",
      "See who's around, playing games, or just hanging out. For supported games, you can see what modes or characters your friends are playing and directly join up.": "اعرف من المتواجد حالياً أو من يلعب، وفي الألعاب المدعومة يمكنك رؤية أطوار اللعب والانضمام إلى أصدقائك مباشرةً بنقرة واحدة.",
      "ALWAYS HAVE SOMETHING TO DO TOGETHER": "دائماً هناك أنشطة ممتعة للقيام بها معاً",
      "Watch videos, play built-in games, listen to music, or just scroll together and spam memes. Seamlessly text, call, video chat, and play games, all in one group chat.": "شاهد الفيديوهات، العب الألعاب المدمجة، استمع للموسيقى، وتحدث بالصوت والفيديو والنص بسلاسة تامة داخل مجموعة واحدة.",
      "WHEREVER YOU GAME, HANG OUT HERE": "أينما كنت تلعب، اجتمع مع أصدقائك هنا",
      "On your PC, phone, or console, you can still hang out on Zycord. Easily switch between devices and use tools to manage multiple group chats with friends.": "سواء كنت على الكمبيوتر أو الهاتف أو جهاز الألعاب، يمكنك دائماً التواصل عبر Zycord والتنقل بسهولة بين جميع أجهزتك.",
      "YOU CAN'T SCROLL ANYMORE. BETTER GO CHAT.": "وصلت لنهاية الصفحة! حان وقت الدردشة.",
      // Download Page (/download)
      "Download Zycord wherever you hang out": "حمّل Zycord أينما كنت تجتمع مع أصدقائك",
      "Talk, play, and hang out with friends around the world over voice, video, or text. Available on Windows, macOS, Linux, iOS, Android, and consoles.": "تحدث والعب واقضِ وقتاً ممتعاً مع أصدقائك حول العالم عبر الصوت والفيديو والنص. متاح على Windows و macOS و Linux و iOS و Android وأجهزة الكونسول.",
      "Download for desktop": "التحميل لسطح المكتب",
      "Use Zycord to easily talk while playing your favorite PC games, show what you’re playing as your status, and stream your games to your friends.": "استخدم Zycord للتحدث بسهولة أثناء لعب ألعاب الكمبيوتر المفضلة لديك، واعرض اللعبة التي تلعبها كحالة مباشرة، وشارك البث مع أصدقائك.",
      "Download for mobile": "التحميل للهواتف المحمولة",
      "Out and about? Sunk in a massive beanbag? Bring Zycord with you and chat whenever, have fun with friends, or just see what’s up.": "هل أنت خارج المنزل؟ خذ Zycord معك أينما ذهبت وتحدث في أي وقت واستمتع مع أصدقائك.",
      "Link your console": "اربط جهاز الكونسول الخاص بك",
      "Coordinate from the couch and talk with your Zycord friends across PC, mobile, and your fellow console users — supported platforms even let you stream your game directly from your console.": "تحدث مع أصدقائك على Zycord عبر الكمبيوتر والهاتف وأجهزة الألعاب، وشارك بث ألعابك مباشرةً من جهاز الكونسول.",
      "Download for VR": "التحميل للواقع الافتراضي VR",
      "Connect with your Zycord communities and DMs from wherever the virtual world takes you. On supported platforms, you’ll be able to join video calls with a digital avatar.": "تواصل مع مجتمعاتك ورسائلك الخاصة في Zycord من أي مكان في العالم الافتراضي مع دعم المكالمات المرئية.",
      "Feeling experimental?": "هل تحب تجربة المميزات الجديدة؟",
      "Try out the newest features before they launch by using our Public Test Build.": "جرّب أحدث المميزات قبل إطلاقها رسمياً عبر تحميل نسخة الاختبار العامة (Public Test Build).",
      "Download Test Build": "تحميل نسخة الاختبار",
      // Nitro Page (/nitro)
      "UNLOCK A WORLD OF PERKS WITH NITRO": "افتح عالماً من المزايا الحصرية مع نيترو",
      "Tired of living the default life? We get it. Subscribe to Nitro, and unlock the supercharged side of Zycord.": "اشترك في نيترو وافتح الإمكانيات القصوى لتخصيص ملفك الشخصي والبث فائق الدقة على Zycord.",
      "Subscribe": "اشترك الآن",
      "Nitro Basic": "نيترو الأساسي (Nitro Basic)",
      "Supercharge your chats with some of Nitro’s most-loved perks.": "عزز محادثاتك بأشهر مزايا نيترو المفضلة.",
      "Get Nitro Basic": "احصل على نيترو الأساسي",
      "Custom emoji anywhere": "رموز تعبيرية مخصصة في كل مكان",
      "50MB uploads": "رفع ملفات حتى 50 ميجابايت",
      "Custom app icons": "أيقونات تطبيق مخصصة",
      "All the perks, all the power. The best way to supercharge your world on Zycord.": "جميع المزايا وكامل القوة. أفضل طريقة لتعزيز تجربتك بالكامل على Zycord.",
      "Get Nitro": "احصل على نيترو",
      "Everything in Basic, plus": "كل ما في الباقة الأساسية، بالإضافة إلى:",
      "Xbox Game Pass*": "اشتراك Xbox Game Pass*",
      "Custom profiles": "ملفات شخصية مخصصة بالكامل",
      "1 GB uploads": "رفع ملفات حتى 1 جيجابايت",
      "HD video streaming": "بث فيديو فائق الدقة HD",
      "Color app themes and more!": "سمات ألوان للتطبيق والمزيد!",
      "WHAT’S NEW": "ما الجديد في نيترو",
      "Save on Gear": "خصومات حصرية على المعدات",
      "Build your dream setup with exclusive discount codes every month. Only with Nitro.": "ابنِ إعداد أحلامك مع أكواد خصم حصرية كل شهر لمشتركي نيترو فقط.",
      "Unlock More Orbs": "احصل على المزيد من كرات Orbs",
      "Grow your stash with monthly Orb drops and a 1.2x multiplier on Quest rewards.": "ضاعف مكافآتك مع مضاعف 1.2x على جوائز المهام وكرات Orbs الشهرية.",
      "EXPLORE THE BEST OF NITRO": "استكشف أفضل مزايا نيترو",
      "TURN HEADS IN EVERY CHAT": "الفت الأنظار في كل محادثة",
      "Take your look to the next level with animated avatars, banner images, profile themes, and more!": "ارتقِ بمظهرك مع الصور الرمزية المتحركة واللافتات وسمات الملف الشخصي والمقتنيات الحصرية!",
      "MAKE THIS PLACE YOUR SPACE": "اجعل هذا المكان مساحتك الخاصة",
      "Add a little you to your Zycord with custom color themes, app icons, and more.": "أضف لمستك الخاصة إلى Zycord مع سمات الألوان المخصصة وأيقونات التطبيق وأصوات الدخول.",
      "HYPE AND MEME WITH BETTER EMOJIS": "تفاعل بمرح مع رموز تعبيرية أفضل",
      "LIVE LIFE WITHOUT LIMITS": "عش التجربة بلا حدود",
      "From crystal-clear streams to chunky memes, send it all.": "من البث فائق الوضوح إلى الملفات الضخمة، شارك كل شيء بلا قيود.",
      "PICK YOUR PLAN": "اختر باقتك",
      "Features": "المميزات",
      "POPULAR": "الأكثر شعبية",
      "QUESTIONS?": "هل لديك أسئلة؟",
      "Questions about Nitro? Check out our FAQ.": "هل لديك استفسارات حول نيترو؟ تصفح الأسئلة الشائعة أدناه.",
      "General": "عام",
      "Payments": "المدفوعات",
      "Gifting and Promotions": "الهدايا والعروض",
      "Other": "أخرى",
      "WHAT ARE YOU WAITING FOR?": "ماذا تنتظر؟",
      // Careers Page (/careers)
      "Work at Zycord": "العمل في Zycord",
      "See All Jobs": "عرض جميع الوظائف",
      "BE A PART OF THE FUTURE OF GAMING": "كن جزءاً من مستقبل الألعاب والتواصل",
      "Work with people just as passionate as you": "اعمل مع أشخاص يشاركونك نفس الشغف",
      "Where every idea is heard and valued": "حيث تُسمع كل فكرة وتُقدّر",
      "DON’T JUST IMAGINE THE FUTURE OF GAMING — BUILD IT WITH US.": "لا تتخيل مستقبل الألعاب فحسب — بل ابنهِ معنا.",
      "EXPERIENCE LIFE AT ZYCORD": "عش تجربة العمل في Zycord",
      "WHEN IT’S TIME FOR FUN, FIND YOUR PARTY HERE": "عندما يحين وقت المرح، ستجد مجموعتك هنا",
      "Hungry for more?": "هل تتطلع لمعرفة المزيد؟",
      "Learn More": "اعرف المزيد"
    },
    fr: {
      "Download": "Télécharger",
      "Nitro": "Nitro",
      "Discover": "Découvrir",
      "Safety": "Sécurité",
      "Quests": "Quêtes",
      "Support": "Assistance",
      "Blog": "Blog",
      "Developers": "Développeurs",
      "Careers": "Carrières",
      "Log In": "Se connecter",
      "Open Zycord": "Ouvrir Zycord",
      "Open Zycord in your browser": "Ouvrir Zycord dans votre navigateur",
      "Download for Windows": "Télécharger pour Windows",
      "Language": "Langue",
      "Product": "Produit",
      "Company": "Entreprise",
      "Resources": "Ressources",
      "Policies": "Politiques",
      "GROUP CHAT THAT’S ALL FUN & GAMES": "LE CHAT DE GROUPE 100 % FUN & JEUX",
      "Download Zycord wherever you hang out": "Téléchargez Zycord où que vous soyez",
      "Download for desktop": "Télécharger pour ordinateur",
      "Download for mobile": "Télécharger pour mobile",
      "Link your console": "Associez votre console",
      "Download for VR": "Télécharger pour la VR",
      "Feeling experimental?": "Envie d'expérimenter ?",
      "Download Test Build": "Télécharger la version de test",
      "UNLOCK A WORLD OF PERKS WITH NITRO": "DÉBLOQUEZ UN MONDE D'AVANTAGES AVEC NITRO",
      "Subscribe": "S'abonner",
      "Get Nitro Basic": "Obtenir Nitro Basic",
      "Get Nitro": "Obtenir Nitro",
      "WHAT’S NEW": "NOUVEAUTÉS",
      "EXPLORE THE BEST OF NITRO": "DÉCOUVREZ LE MEILLEUR DE NITRO",
      "PICK YOUR PLAN": "CHOISISSEZ VOTRE FORFAIT",
      "QUESTIONS?": "DES QUESTIONS ?",
      "WHAT ARE YOU WAITING FOR?": "QU'ATTENDEZ-VOUS ?",
      "Work at Zycord": "Travailler chez Zycord",
      "See All Jobs": "Voir toutes les offres"
    },
    "es-ES": {
      "Download": "Descargar",
      "Nitro": "Nitro",
      "Discover": "Descubrir",
      "Safety": "Seguridad",
      "Quests": "Misiones",
      "Support": "Soporte",
      "Blog": "Blog",
      "Developers": "Desarrolladores",
      "Careers": "Empleos",
      "Log In": "Iniciar sesión",
      "Open Zycord": "Abrir Zycord",
      "Download for Windows": "Descargar para Windows",
      "Language": "Idioma",
      "GROUP CHAT THAT’S ALL FUN & GAMES": "CHAT GRUPAL LLENO DE DIVERSIÓN Y JUEGOS",
      "Download Zycord wherever you hang out": "Descarga Zycord dondequiera que estés",
      "Download for desktop": "Descargar para escritorio",
      "Download for mobile": "Descargar para móvil",
      "Link your console": "Vincula tu consola",
      "Download for VR": "Descargar para RV",
      "Feeling experimental?": "¿Te sientes experimental?",
      "Download Test Build": "Descargar versión de prueba",
      "UNLOCK A WORLD OF PERKS WITH NITRO": "DESBLOQUEA UN MUNDO DE VENTAJAS CON NITRO",
      "Subscribe": "Suscribirse",
      "Get Nitro Basic": "Obtener Nitro Basic",
      "Get Nitro": "Obtener Nitro",
      "WHAT’S NEW": "NOVEDADES",
      "EXPLORE THE BEST OF NITRO": "EXPLORA LO MEJOR DE NITRO",
      "PICK YOUR PLAN": "ELIGE TU PLAN",
      "QUESTIONS?": "¿PREGUNTAS?",
      "WHAT ARE YOU WAITING FOR?": "¿A QUÉ ESTÁS ESPERANDO?",
      "Work at Zycord": "Trabaja en Zycord",
      "See All Jobs": "Ver todos los empleos"
    },
    de: {
      "Download": "Herunterladen",
      "Nitro": "Nitro",
      "Discover": "Entdecken",
      "Safety": "Sicherheit",
      "Quests": "Quests",
      "Support": "Support",
      "Blog": "Blog",
      "Developers": "Entwickler",
      "Careers": "Karriere",
      "Log In": "Anmelden",
      "Open Zycord": "Zycord öffnen",
      "Download for Windows": "Für Windows herunterladen",
      "Language": "Sprache",
      "Download Zycord wherever you hang out": "Lade Zycord überall dort herunter, wo du abhängst",
      "Download for desktop": "Für Desktop herunterladen",
      "Download for mobile": "Für Mobilgeräte herunterladen",
      "Link your console": "Verknüpfe deine Konsole",
      "Download for VR": "Für VR herunterladen",
      "Feeling experimental?": "Experimentierfreudig?",
      "UNLOCK A WORLD OF PERKS WITH NITRO": "SCHALTE MIT NITRO EINE WELT VOLLER VORTEILE FREI",
      "Subscribe": "Abonnieren",
      "WHAT’S NEW": "WAS GIBT'S NEUES",
      "EXPLORE THE BEST OF NITRO": "ENTDECKE DAS BESTE VON NITRO",
      "PICK YOUR PLAN": "WÄHLE DEIN ABO",
      "QUESTIONS?": "FRAGEN?",
      "WHAT ARE YOU WAITING FOR?": "WORAUF WARTEST DU NOCH?",
      "Work at Zycord": "Arbeite bei Zycord",
      "See All Jobs": "Alle Jobs ansehen"
    }
  };
  function getSavedLanguage() {
    try {
      const code = window.localStorage.getItem("zy_site_lang_code") || "en-US";
      const label = window.localStorage.getItem("zy_site_lang") || "English";
      return { code, label };
    } catch (_e) {
      return { code: "en-US", label: "English" };
    }
  }
  function applySiteLanguage(langCode, langLabel) {
    if (typeof document === "undefined") return;
    const normalizedCode = langCode || "en-US";
    const isRTL = normalizedCode === "ar";
    document.documentElement.setAttribute("lang", normalizedCode);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.body.classList.toggle("is-rtl", isRTL);
    try {
      window.localStorage.setItem("zy_site_lang_code", normalizedCode);
      if (langLabel) {
        window.localStorage.setItem("zy_site_lang", langLabel);
      }
    } catch (_e) {
    }
    const labels = document.querySelectorAll("[data-lang-label]");
    for (let i = 0; i < labels.length; i++) {
      if (langLabel) labels[i].textContent = langLabel;
    }
    const dict = TRANSLATIONS[normalizedCode] || TRANSLATIONS[normalizedCode.split("-")[0]] || null;
    const selectors = [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      ".zy-nav-link > span",
      ".zy-dd-col-title",
      ".zy-dd-link > span:first-child",
      ".zy-btn-login",
      ".zy-btn > span",
      ".zy-white-pill-btn > span:first-of-type",
      ".zy-footer-col-title",
      ".zy-footer-links a",
      ".zy-faq-tab-btn",
      ".zy-accordion-trigger > span:first-child",
      ".zy-eyebrow",
      ".zy-plan-checklist li span",
      "th"
    ].join(",");
    const nodes = document.querySelectorAll(selectors);
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el.children.length > 0 && el.tagName !== "P" && el.tagName !== "H1" && el.tagName !== "H2" && el.tagName !== "H3") {
        continue;
      }
      let orig = el.getAttribute("data-zy-orig");
      if (!orig) {
        orig = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (!orig) continue;
        el.setAttribute("data-zy-orig", orig);
      }
      if (!dict || normalizedCode.startsWith("en")) {
        if (el.textContent !== orig) {
          el.textContent = orig;
        }
      } else if (dict[orig]) {
        el.textContent = dict[orig];
      }
    }
  }

  // assets/public/jsx/Navbar.jsx
  var NAVIGATION_ITEMS = [
    { label: "Download", href: "/download", key: "download" },
    { label: "Nitro", href: "/nitro", key: "nitro" },
    {
      label: "Discover",
      href: "/discover",
      key: "discover",
      decor: "/site/media/discord/nav-discover-scroll.webp",
      decorStyle: { width: "120px", right: "-38px", bottom: "-42px" },
      columns: [
        {
          title: "Resources",
          links: [
            { label: "Server Directory", href: "/discover#directory" },
            { label: "Trending Games", href: "/discover#trending" }
          ]
        }
      ]
    },
    {
      label: "Safety",
      href: "/safety",
      key: "safety",
      is2Col: true,
      decor: "/site/media/discord/nav-safety-egg.webp",
      decorStyle: { width: "126px", right: "-36px", bottom: "-44px" },
      columns: [
        {
          title: "Resources",
          links: [
            { label: "Family Center", href: "/safety#family-center" },
            { label: "Safety Library", href: "/safety#safety-library" },
            { label: "Safety News", href: "/safety#safety-news" },
            { label: "Teen Charter", href: "/safety#teen-charter" },
            { label: "Zycord Player's Guide", href: "/safety#players-guide" },
            { label: "Community Guidelines", href: "/guidelines", external: true }
          ]
        },
        {
          title: "Hubs",
          links: [
            { label: "Parent Hub", href: "/safety#parent-hub" },
            { label: "Policy Hub", href: "/safety#policy-hub" },
            { label: "Privacy Hub", href: "/safety#privacy-hub" },
            { label: "Transparency Hub", href: "/safety#transparency-hub" },
            { label: "Wellbeing Hub", href: "/safety#wellbeing-hub" }
          ]
        }
      ]
    },
    {
      label: "Quests",
      href: "/quests",
      key: "quests",
      decor: "/site/media/discord/nav-quests-trophy.webp",
      decorStyle: { width: "128px", right: "-42px", bottom: "-46px" },
      columns: [
        {
          title: "Resources",
          links: [
            { label: "Advertising", href: "/quests" },
            { label: "Success Stories", href: "/quests#stories" },
            { label: "Quests FAQ", href: "/quests#faq" }
          ]
        }
      ]
    },
    {
      label: "Support",
      href: "/support",
      key: "support",
      decor: "/site/media/discord/nav-support-nelly.webp",
      decorStyle: { width: "136px", right: "-44px", bottom: "-46px" },
      columns: [
        {
          title: "Resources",
          links: [
            { label: "Help Center", href: "/support" },
            { label: "Feedback", href: "/feedback" },
            { label: "Submit a Request", href: "/feedback#request" },
            { label: "System Status", href: "/status" }
          ]
        }
      ]
    },
    {
      label: "Blog",
      href: "/blog",
      key: "blog",
      isWide: true,
      decor: "/site/media/discord/nav-blog-cube.webp",
      decorStyle: { width: "134px", right: "-42px", bottom: "-46px" },
      columns: [
        {
          title: "Collections",
          links: [
            { label: "Featured", href: "/blog" },
            { label: "Community", href: "/blog#community" },
            { label: "Zycord HQ", href: "/blog#hq" },
            { label: "Engineering & Developers", href: "/blog#engineering" },
            { label: "How to Zycord", href: "/blog#guides" },
            { label: "Policy & Safety", href: "/blog#safety" },
            { label: "Product & Features", href: "/blog#product" }
          ]
        }
      ]
    },
    {
      label: "Developers",
      href: "/developers",
      key: "developers",
      isWide: true,
      decor: "/site/media/discord/nav-developers-clyde.webp",
      decorStyle: { width: "142px", right: "-48px", bottom: "-52px" },
      columns: [
        {
          title: "Learn",
          links: [
            { label: "Zycord for Game Developers", href: "/developers" },
            { label: "Integration", href: "/developers#rich-presence" },
            { label: "Social Commerce", href: "/developers#commerce" },
            { label: "Apps & Activities", href: "/developers/applications" },
            { label: "Developer Newsletter", href: "/developers#newsletter" },
            { label: "Developer Case Studies", href: "/developers#cases" }
          ],
          subSection: {
            title: "Build",
            links: [
              { label: "Official Game Communities", href: "/discover", external: true },
              { label: "Developer Portal", href: "/developers/applications", external: true },
              { label: "Documentation", href: "/developers/docs", external: true },
              { label: "Developer Help Center", href: "/support", external: true }
            ]
          }
        }
      ]
    },
    { label: "Careers", href: "/careers", key: "careers" }
  ];
  function hasActiveSession() {
    try {
      const raw = window.localStorage.getItem("token");
      if (!raw) return false;
      const cleaned = raw.replace(/^"|"$/g, "").trim();
      return cleaned.length > 10;
    } catch (_e) {
      return false;
    }
  }
  function getCurrentPathKey() {
    const path = (window.location.pathname || "/").toLowerCase();
    if (path === "/" || path === "/index.html") return "home";
    if (path.startsWith("/download")) return "download";
    if (path.startsWith("/nitro")) return "nitro";
    if (path.startsWith("/discover")) return "discover";
    if (path.startsWith("/safety")) return "safety";
    if (path.startsWith("/quests") || path.startsWith("/ads/quests")) return "quests";
    if (path.startsWith("/support")) return "support";
    if (path.startsWith("/blog")) return "blog";
    if (path.startsWith("/careers")) return "careers";
    if (path.startsWith("/developers")) return "developers";
    if (path.startsWith("/status")) return "status";
    return "";
  }
  function DropdownMenu({ item }) {
    if (!item.columns || !item.columns.length) return null;
    const ddClass = [
      "zy-nav-dropdown",
      item.is2Col ? "is-2col" : "",
      item.isWide ? "is-wide" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ h("div", { className: ddClass, role: "menu" }, /* @__PURE__ */ h("div", { className: "zy-dd-cols" }, item.columns.map((col) => /* @__PURE__ */ h("div", { className: "zy-dd-col" }, col.title ? /* @__PURE__ */ h("div", { className: "zy-dd-col-title" }, col.title) : null, /* @__PURE__ */ h("ul", { className: "zy-dd-list" }, (col.links || []).map((lnk) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { className: "zy-dd-link", href: lnk.href }, /* @__PURE__ */ h("span", null, lnk.label), lnk.external ? /* @__PURE__ */ h("span", { className: "zy-dd-ext", "aria-hidden": "true" }, /* @__PURE__ */ h("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("line", { x1: "7", y1: "17", x2: "17", y2: "7" }), /* @__PURE__ */ h("polyline", { points: "7 7 17 7 17 17" }))) : null)))), col.subSection ? /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", { className: "zy-dd-divider" }), /* @__PURE__ */ h("div", { className: "zy-dd-col-title" }, col.subSection.title), /* @__PURE__ */ h("ul", { className: "zy-dd-list" }, (col.subSection.links || []).map((sl) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { className: "zy-dd-link", href: sl.href }, /* @__PURE__ */ h("span", null, sl.label), sl.external ? /* @__PURE__ */ h("span", { className: "zy-dd-ext", "aria-hidden": "true" }, /* @__PURE__ */ h("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("line", { x1: "7", y1: "17", x2: "17", y2: "7" }), /* @__PURE__ */ h("polyline", { points: "7 7 17 7 17 17" }))) : null))))) : null))), item.decor ? /* @__PURE__ */ h(
      "img",
      {
        className: "zy-dd-decor",
        src: item.decor,
        alt: "",
        "aria-hidden": "true",
        style: item.decorStyle || {}
      }
    ) : null);
  }
  function ZycordNavbar() {
    const activeKey = getCurrentPathKey();
    const authed = hasActiveSession();
    const authHref = authed ? "/app" : "/login";
    const authLabel = authed ? "Open Zycord" : "Log In";
    const setDrawer = (open) => {
      const drawer = document.getElementById("zy-mobile-drawer");
      const backdrop = document.getElementById("zy-drawer-backdrop");
      const openBtn = document.getElementById("zy-mobile-open");
      if (!drawer || !backdrop || !openBtn) return;
      drawer.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    const closeAllNavDropdowns = (exceptLi) => {
      const openItems = document.querySelectorAll(".zy-nav-item.is-open");
      for (let i = 0; i < openItems.length; i++) {
        if (openItems[i] !== exceptLi) {
          openItems[i].classList.remove("is-open");
          const trigger = openItems[i].querySelector(".zy-nav-link");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
        }
      }
      if (!exceptLi) {
        document.body.classList.remove("has-nav-dd-open");
      }
    };
    if (typeof document !== "undefined" && !window.__zyNavDdBound) {
      window.__zyNavDdBound = true;
      document.addEventListener("click", (ev) => {
        if (!ev.target || !ev.target.closest || !ev.target.closest(".zy-nav-item.has-dropdown")) {
          closeAllNavDropdowns(null);
        }
      });
      document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") {
          closeAllNavDropdowns(null);
        }
      });
    }
    return /* @__PURE__ */ h(Fragment, null, /* @__PURE__ */ h("div", { className: "zy-nav-page-blur", id: "zy-nav-page-blur", "aria-hidden": "true" }), /* @__PURE__ */ h("header", { className: "zy-navbar", id: "zy-navbar" }, /* @__PURE__ */ h("div", { className: "zy-navbar-inner" }, /* @__PURE__ */ h("a", { className: "zy-brand", href: "/", "aria-label": "Zycord Home" }, /* @__PURE__ */ h("span", { className: "zy-brand-mark" }, /* @__PURE__ */ h(ZycordMark, { size: 22, color: "currentColor" })), /* @__PURE__ */ h("span", null, "Zycord")), /* @__PURE__ */ h("nav", { "aria-label": "Primary Navigation" }, /* @__PURE__ */ h("ul", { className: "zy-nav-links" }, NAVIGATION_ITEMS.map((item) => {
      const hasDropdown = Boolean(item.columns && item.columns.length);
      const isActive = item.key === activeKey;
      return /* @__PURE__ */ h(
        "li",
        {
          className: `zy-nav-item${hasDropdown ? " has-dropdown" : ""}`,
          onMouseEnter: hasDropdown ? () => document.body.classList.add("has-nav-dd-open") : void 0,
          onMouseLeave: hasDropdown ? (e) => {
            if (!e.currentTarget.classList.contains("is-open")) {
              document.body.classList.remove("has-nav-dd-open");
            }
          } : void 0
        },
        /* @__PURE__ */ h(
          "a",
          {
            className: `zy-nav-link${isActive ? " is-active" : ""}`,
            href: item.href,
            "aria-haspopup": hasDropdown ? "true" : void 0,
            "aria-expanded": hasDropdown ? "false" : void 0,
            onClick: hasDropdown ? (e) => {
              const li = e.currentTarget.closest(".zy-nav-item");
              if (!li) return;
              if (!li.classList.contains("is-open")) {
                e.preventDefault();
                closeAllNavDropdowns(li);
                li.classList.add("is-open");
                e.currentTarget.setAttribute("aria-expanded", "true");
                document.body.classList.add("has-nav-dd-open");
              }
            } : void 0
          },
          /* @__PURE__ */ h("span", null, item.label),
          hasDropdown ? /* @__PURE__ */ h(
            "svg",
            {
              className: "zy-nav-chevron",
              viewBox: "0 0 16 16",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            },
            /* @__PURE__ */ h("polyline", { points: "3.5 6 8 10.5 12.5 6" })
          ) : null
        ),
        hasDropdown ? /* @__PURE__ */ h(DropdownMenu, { item }) : null
      );
    }))), /* @__PURE__ */ h("div", { className: "zy-nav-actions" }, /* @__PURE__ */ h(
      "a",
      {
        className: "zy-btn zy-btn-login",
        "data-zy-login-cta": true,
        href: authHref
      },
      authLabel
    ), /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "zy-mobile-toggle",
        id: "zy-mobile-open",
        "aria-label": "Open Navigation Menu",
        "aria-expanded": "false",
        onClick: () => setDrawer(true)
      },
      /* @__PURE__ */ h(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.2",
          "stroke-linecap": "round"
        },
        /* @__PURE__ */ h("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
        /* @__PURE__ */ h("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
        /* @__PURE__ */ h("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
      )
    )))), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-drawer-backdrop",
        id: "zy-drawer-backdrop",
        onClick: () => setDrawer(false)
      }
    ), /* @__PURE__ */ h(
      "aside",
      {
        className: "zy-mobile-drawer",
        id: "zy-mobile-drawer",
        "aria-label": "Mobile Navigation"
      },
      /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-drawer-header" }, /* @__PURE__ */ h("a", { className: "zy-brand", href: "/" }, /* @__PURE__ */ h("span", { className: "zy-brand-mark" }, /* @__PURE__ */ h(ZycordMark, { size: 22, color: "#ffffff" })), /* @__PURE__ */ h("span", null, "Zycord")), /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "zy-mobile-toggle",
          style: { display: "inline-flex" },
          id: "zy-mobile-close",
          "aria-label": "Close Menu",
          onClick: () => setDrawer(false)
        },
        /* @__PURE__ */ h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), /* @__PURE__ */ h("line", { x1: "6", y1: "6", x2: "18", y2: "18" }))
      )), /* @__PURE__ */ h("ul", { className: "zy-drawer-links" }, /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { href: "/" }, /* @__PURE__ */ h("span", null, "Home"), /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→"))), NAVIGATION_ITEMS.map((item) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h(
        "a",
        {
          className: item.key === activeKey ? "is-active" : "",
          href: item.href
        },
        /* @__PURE__ */ h("span", null, item.label),
        /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→")
      ))), /* @__PURE__ */ h("li", null, /* @__PURE__ */ h("a", { href: "/status" }, /* @__PURE__ */ h("span", null, "System Status"), /* @__PURE__ */ h("span", { "aria-hidden": "true" }, "→"))))),
      /* @__PURE__ */ h("div", { className: "zy-drawer-footer" }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/app" }, "Open Zycord in Browser"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, "Download for Windows"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost", href: authHref }, authLabel))
    ));
  }

  // assets/public/jsx/Footer.jsx
  var FOOTER_COLUMNS = [
    {
      title: "Product",
      links: [
        { label: "Download", href: "/download" },
        { label: "Nitro", href: "/nitro" },
        { label: "Status", href: "/status" },
        { label: "App Directory", href: "/application-directory" },
        { label: "Gift Cards", href: "/gift-cards" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/company" },
        { label: "Jobs", href: "/careers" },
        { label: "Brand", href: "/branding" },
        { label: "Newsroom", href: "/newsroom" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Support", href: "/support" },
        { label: "Safety", href: "/safety" },
        { label: "Blog", href: "/blog" },
        { label: "Creators", href: "/creators" },
        { label: "Community", href: "/community" },
        { label: "Developers", href: "/developers" },
        { label: "Quests", href: "/ads/quests" },
        { label: "Official 3rd Party Merch", href: "/merch" },
        { label: "Feedback", href: "/feedback" }
      ]
    },
    {
      title: "Policies",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Cookie Settings", href: "#cookie-settings", isCookieSettings: true },
        { label: "Guidelines", href: "/guidelines" },
        { label: "Acknowledgements", href: "/acknowledgements" },
        { label: "Licenses", href: "/licenses" },
        { label: "Company Information", href: "/company-information" }
      ]
    }
  ];
  var LANGUAGES = [
    { code: "cs", label: "Čeština" },
    { code: "da", label: "Dansk" },
    { code: "de", label: "Deutsch" },
    { code: "en-US", label: "English" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Español" },
    { code: "es-419", label: "Español (América Latina)" },
    { code: "fr", label: "Français" },
    { code: "hr", label: "Hrvatski" },
    { code: "it", label: "Italiano" },
    { code: "lt", label: "Lietuviškai" },
    { code: "hu", label: "Magyar" },
    { code: "nl", label: "Nederlands" },
    { code: "no", label: "Norsk" },
    { code: "pl", label: "Polski" },
    { code: "pt-BR", label: "Português do Brasil" },
    { code: "ro", label: "Română" },
    { code: "fi", label: "Suomi" },
    { code: "sv-SE", label: "Svenska" },
    { code: "vi", label: "Tiếng Việt" },
    { code: "tr", label: "Türkçe" },
    { code: "el", label: "Ελληνικά" },
    { code: "bg", label: "Български" },
    { code: "ru", label: "Русский" },
    { code: "uk", label: "Українська" },
    { code: "hi", label: "हिन्दी" },
    { code: "th", label: "ไทย" },
    { code: "zh-CN", label: "中文" },
    { code: "ja", label: "日本語" },
    { code: "zh-TW", label: "繁體中文" },
    { code: "ko", label: "한국어" },
    { code: "ar", label: "العربية" }
  ];
  function openCookieSettingsModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById("zy-cookie-modal-backdrop");
    if (modal) modal.classList.add("is-open");
  }
  function closeCookieSettingsModal() {
    const modal = document.getElementById("zy-cookie-modal-backdrop");
    if (modal) modal.classList.remove("is-open");
  }
  function ZycordFooter() {
    let currentLang = "English";
    try {
      const saved = window.localStorage.getItem("zy_site_lang");
      if (saved) currentLang = saved;
    } catch (_e) {
    }
    const toggleLangMenu = (e) => {
      e.stopPropagation();
      const wrap = document.getElementById("zy-lang-dropdown-wrap");
      const btn = document.getElementById("zy-lang-picker");
      if (!wrap) return;
      const open = !wrap.classList.contains("is-open");
      wrap.classList.toggle("is-open", open);
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    const selectLanguage = (langObj, e) => {
      e.stopPropagation();
      currentLang = langObj.label;
      applySiteLanguage(langObj.code, langObj.label);
      const navCodeEl = document.getElementById("zy-nav-lang-code");
      if (navCodeEl) navCodeEl.textContent = (langObj.code || "en").split("-")[0].toUpperCase();
      const items = document.querySelectorAll("[data-lang-option]");
      for (let i = 0; i < items.length; i++) {
        const isSelected = items[i].getAttribute("data-lang-option") === langObj.code;
        items[i].classList.toggle("is-selected", isSelected);
        items[i].setAttribute("aria-selected", isSelected ? "true" : "false");
      }
      const wrap = document.getElementById("zy-lang-dropdown-wrap");
      const btn = document.getElementById("zy-lang-picker");
      if (wrap) wrap.classList.remove("is-open");
      if (btn) btn.setAttribute("aria-expanded", "false");
    };
    if (typeof document !== "undefined" && !window.__zyLangOutsideBound) {
      window.__zyLangOutsideBound = true;
      document.addEventListener("click", (ev) => {
        const wrap = document.getElementById("zy-lang-dropdown-wrap");
        const btn = document.getElementById("zy-lang-picker");
        if (wrap && wrap.classList.contains("is-open") && !wrap.contains(ev.target)) {
          wrap.classList.remove("is-open");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape") {
          const wrap = document.getElementById("zy-lang-dropdown-wrap");
          const btn = document.getElementById("zy-lang-picker");
          if (wrap && wrap.classList.contains("is-open")) {
            wrap.classList.remove("is-open");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
          closeCookieSettingsModal();
        }
      });
    }
    return /* @__PURE__ */ h("footer", { className: "zy-footer" }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-footer-grid" }, /* @__PURE__ */ h("div", { className: "zy-footer-brand-col" }, /* @__PURE__ */ h("a", { className: "zy-footer-logo-link", href: "/", "aria-label": "Zycord Home" }, /* @__PURE__ */ h(ZycordMark, { size: 44, color: "#ffffff" })), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-footer-col-title", style: { marginBottom: "8px" } }, "Language"), /* @__PURE__ */ h("div", { className: "zy-lang-dropdown-wrap", id: "zy-lang-dropdown-wrap" }, /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "zy-lang-picker",
        id: "zy-lang-picker",
        "aria-haspopup": "listbox",
        "aria-expanded": "false",
        "aria-label": "Select Language",
        onClick: toggleLangMenu
      },
      /* @__PURE__ */ h("span", { "data-lang-label": true }, currentLang),
      /* @__PURE__ */ h(
        "svg",
        {
          className: "zy-lang-chevron",
          width: "16",
          height: "16",
          viewBox: "0 0 16 16",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        },
        /* @__PURE__ */ h("polyline", { points: "4 6 8 10 12 6" })
      )
    ), /* @__PURE__ */ h(
      "ul",
      {
        className: "zy-lang-menu",
        id: "zy-lang-menu",
        role: "listbox",
        "aria-label": "Languages"
      },
      LANGUAGES.map((l) => {
        const selected = l.label === currentLang;
        return /* @__PURE__ */ h(
          "li",
          {
            role: "option",
            "aria-selected": selected ? "true" : "false",
            "data-lang-option": l.code,
            className: `zy-lang-option${selected ? " is-selected" : ""}`,
            onClick: (e) => selectLanguage(l, e)
          },
          /* @__PURE__ */ h("span", null, l.label)
        );
      })
    ))), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { className: "zy-footer-col-title", style: { marginBottom: "10px" } }, "Social"), /* @__PURE__ */ h("div", { className: "zy-social-row" }, /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/community",
        "aria-label": "X / Twitter",
        title: "X / Twitter"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/community",
        "aria-label": "Instagram",
        title: "Instagram"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/community",
        "aria-label": "Facebook",
        title: "Facebook"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/community",
        "aria-label": "YouTube",
        title: "YouTube"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }))
    ), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-social-btn",
        href: "/community",
        "aria-label": "TikTok",
        title: "TikTok"
      },
      /* @__PURE__ */ h("svg", { viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ h("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" }))
    )))), FOOTER_COLUMNS.map((col) => /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("h3", { className: "zy-footer-col-title" }, col.title), /* @__PURE__ */ h("ul", { className: "zy-footer-links" }, col.links.map((l) => /* @__PURE__ */ h("li", null, /* @__PURE__ */ h(
      "a",
      {
        href: l.href,
        onClick: l.isCookieSettings ? openCookieSettingsModal : void 0
      },
      l.label
    )))))))), /* @__PURE__ */ h("div", { className: "zy-wordmark-container", "aria-hidden": "true" }, /* @__PURE__ */ h(
      "svg",
      {
        className: "zy-wordmark-svg",
        viewBox: "0 0 1765 340",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      },
      /* @__PURE__ */ h(
        "text",
        {
          x: "882.5",
          y: "236",
          "text-anchor": "middle",
          fill: "#E0E3FF",
          "font-family": "Poppins, 'Inter', system-ui, sans-serif",
          "font-weight": "900",
          "font-size": "312",
          "letter-spacing": "-12",
          textLength: "1710",
          lengthAdjust: "spacingAndGlyphs"
        },
        "Zycord"
      )
    )), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-cookie-modal-backdrop",
        id: "zy-cookie-modal-backdrop",
        onClick: (e) => {
          if (e.target.id === "zy-cookie-modal-backdrop") closeCookieSettingsModal();
        }
      },
      /* @__PURE__ */ h("div", { className: "zy-cookie-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "zy-cookie-title" }, /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" } }, /* @__PURE__ */ h("h3", { id: "zy-cookie-title", className: "zy-heading-sm", style: { fontSize: "22px" } }, "PRIVACY & COOKIE PREFERENCES"), /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "zy-btn zy-btn-ghost zy-btn-sm",
          onClick: closeCookieSettingsModal,
          "aria-label": "Close Cookie Preferences"
        },
        "✕"
      )), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px", marginTop: "10px" } }, "Zycord uses strictly necessary local storage and session cookies to authenticate your account, maintain WebSocket Gateway connections, and store your local End-to-End Encryption (E2EE) key vault. We do not sell personal data or run third-party ad trackers."), /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" } }, /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.06)" } }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { style: { fontWeight: "700", fontSize: "14px", color: "#fff" } }, "Strictly Necessary & Authentication"), /* @__PURE__ */ h("div", { style: { fontSize: "12px", color: "var(--color-fog)" } }, "Session tokens, E2EE Key Vault, WebRTC preferences")), /* @__PURE__ */ h("span", { style: { fontSize: "12px", fontWeight: "700", color: "var(--color-spring-green)" } }, "Always Active")), /* @__PURE__ */ h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.06)" } }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", { style: { fontWeight: "700", fontSize: "14px", color: "#fff" } }, "UI & Language Preferences"), /* @__PURE__ */ h("div", { style: { fontSize: "12px", color: "var(--color-fog)" } }, "Remembers your selected language and theme settings")), /* @__PURE__ */ h("input", { type: "checkbox", checked: true, readOnly: true, style: { width: "18px", height: "18px", accentColor: "#5865f2" } }))), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", href: "/privacy" }, "Privacy Policy"), /* @__PURE__ */ h("button", { type: "button", className: "zy-btn zy-btn-primary zy-btn-sm", onClick: closeCookieSettingsModal }, "Save Preferences")))
    ));
  }

  // assets/public/jsx/pages/HomePage.jsx
  function HomePage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "hero-section" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "32px", top: "8%", left: "5%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-m.svg", alt: "", "aria-hidden": "true", className: "zy-star d2", style: { width: "22px", top: "15%", right: "7%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-sm.svg", alt: "", "aria-hidden": "true", className: "zy-star d3", style: { width: "16px", bottom: "18%", left: "11%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d4", style: { width: "28px", bottom: "14%", right: "12%" } }), /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "hero-grid" }, /* @__PURE__ */ h("div", { className: "hero-copy" }, /* @__PURE__ */ h("div", { className: "hero-crown-wrap" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/careers-crown.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-crown",
        "data-zy-parallax": "0.14",
        "data-zy-parallax-rotate": "-8"
      }
    )), /* @__PURE__ */ h("h1", { className: "zy-display", style: { whiteSpace: "nowrap" } }, "GROUP CHAT", /* @__PURE__ */ h("br", null), "THAT'S ALL", /* @__PURE__ */ h("br", null), "FUN & GAMES"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.")), /* @__PURE__ */ h("div", { className: "hero-art-stage" }, /* @__PURE__ */ h("div", { className: "hero-art-glow" }), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-trophy.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-trophy-blur",
        "data-zy-parallax": "-0.16",
        "data-zy-parallax-rotate": "10"
      }
    ), /* @__PURE__ */ h("div", { className: "hero-3d-composite" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-base-clean-2026.webp",
        alt: "Zycord 3D Desktop and Mobile Interface",
        className: "hero-main-devices-img",
        fetchpriority: "high"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-girl-2026.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-girl"
      }
    ), /* @__PURE__ */ h("div", { className: "hero-char-clyde-wrap" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-clyde.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-clyde"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-clyde-shadow.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-clyde-shadow"
      }
    )), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-wumpus-leaf.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-wumpus-leaf"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-wumpus.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-wumpus"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/hero-boy.webp",
        alt: "",
        "aria-hidden": "true",
        className: "hero-char-boy"
      }
    )))), /* @__PURE__ */ h("div", { className: "hero-bottom-ctas" }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" }), /* @__PURE__ */ h("path", { d: "M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" })), /* @__PURE__ */ h("span", null, "Download for Windows")), /* @__PURE__ */ h(
      "a",
      {
        className: "zy-btn zy-btn-primary",
        "data-zy-open-app": true,
        "data-zy-open-label-authed": "Open Zycord in your browser",
        href: "/app"
      },
      /* @__PURE__ */ h("span", null, "Open Zycord in your browser")
    )))), /* @__PURE__ */ h("section", { className: "zy-section", id: "chat" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/party-wumpus.gif",
        alt: "",
        "aria-hidden": "true",
        style: {
          position: "absolute",
          top: "-82px",
          right: "186px",
          width: "152px",
          zIndex: 0,
          pointerEvents: "none"
        }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-egg.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.18",
        "data-zy-parallax-rotate": "-10",
        style: {
          width: "clamp(180px, 14vw, 224px)",
          bottom: "-148px",
          left: "-42px",
          zIndex: 1,
          filter: "blur(3px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.48))",
          opacity: "0.92"
        }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-magenta",
        style: { backgroundImage: "url('/site/media/discord/sec1-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec1-chat-fun.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec1-chat-fun.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "MAKE YOUR GROUP CHATS MORE FUN"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or text chat. Set your avatar and a custom status, and write your own profile to show up in chat your way.")))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "video" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-clyde-cube.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.16",
        "data-zy-parallax-rotate": "12",
        style: {
          width: "clamp(155px, 12.5vw, 188px)",
          bottom: "-135px",
          left: "92px",
          zIndex: 1,
          filter: "blur(2.5px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.46))",
          opacity: "0.9"
        }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "STREAM LIKE YOU'RE IN THE SAME ROOM"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "High quality and low latency streaming makes it feel like you're hanging out on the couch with friends while playing a game, watching shows, looking at photos, or idk doing homework or something.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-cerulean",
        style: { backgroundImage: "url('/site/media/discord/sec2-bkg.svg')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec2-stream.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec2-stream.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "voice" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-box.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.14",
        "data-zy-parallax-rotate": "-8",
        style: {
          width: "clamp(185px, 14.5vw, 226px)",
          top: "-98px",
          right: "42px",
          zIndex: 6
        }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-emerald",
        style: { backgroundImage: "url('/site/media/discord/sec3-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec3-hop-in.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec3-hop-in.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "HOP IN WHEN YOU'RE FREE, NO NEED TO CALL"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Easily hop in and out of voice or text chats without having to call or invite anyone, so your party chat lasts before, during, and after your game session.")))))), /* @__PURE__ */ h("div", { className: "zy-marquee-band", "aria-hidden": "true" }, /* @__PURE__ */ h("div", { className: "zy-marquee-track" }, [0, 1, 2, 3].map(() => /* @__PURE__ */ h("div", { className: "zy-marquee-item" }, /* @__PURE__ */ h("span", null, "TALK"), /* @__PURE__ */ h("span", { className: "zy-marquee-icon" }, /* @__PURE__ */ h(ZycordMark, { size: 44, color: "#ffffff" })), /* @__PURE__ */ h("span", null, "PLAY"), /* @__PURE__ */ h("span", { className: "zy-marquee-icon" }, /* @__PURE__ */ h(ZycordMark, { size: 44, color: "#ffffff" })), /* @__PURE__ */ h("span", null, "CHAT"), /* @__PURE__ */ h("span", { className: "zy-marquee-icon" }, /* @__PURE__ */ h(ZycordMark, { size: 44, color: "#ffffff" })), /* @__PURE__ */ h("span", null, "HANG OUT"), /* @__PURE__ */ h("span", { className: "zy-marquee-icon" }, /* @__PURE__ */ h(ZycordMark, { size: 44, color: "#ffffff" })))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "presence" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-coin.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.18",
        "data-zy-parallax-rotate": "14",
        style: {
          width: "clamp(175px, 14vw, 228px)",
          bottom: "-86px",
          left: "-68px",
          filter: "blur(3px) drop-shadow(0 20px 34px rgba(0, 0, 0, 0.48))",
          opacity: "0.88",
          zIndex: 1
        }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "SEE WHO'S AROUND TO CHILL"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "See who's around, playing games, or just hanging out. For supported games, you can see what modes or characters your friends are playing and directly join up.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-magenta",
        style: { backgroundImage: "url('/site/media/discord/sec4-bkg.svg')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec4-chill.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec4-chill.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "activities", style: { paddingTop: "136px" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-turnip.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.14",
        "data-zy-parallax-rotate": "-8",
        style: {
          width: "clamp(155px, 12.5vw, 196px)",
          bottom: "-54px",
          left: "-24px",
          zIndex: 8
        }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-plump.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        "data-zy-parallax": "0.16",
        "data-zy-parallax-rotate": "10",
        style: {
          width: "clamp(150px, 12vw, 192px)",
          bottom: "-142px",
          right: "88px",
          filter: "blur(3.5px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45))",
          opacity: "0.86",
          zIndex: 1
        }
      }
    ), /* @__PURE__ */ h("div", { className: "zy-sec5-3d-wrap" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/sec5-card-characters.png",
        alt: "",
        "aria-hidden": "true",
        className: "zy-sec5-char-bot"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/sec5-woman-bottom.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-sec5-char-top"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/sec5-garfield-simon.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-sec5-char-friends"
      }
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-card is-sec5" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid is-reversed" }, /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-emerald",
        style: { backgroundImage: "url('/site/media/discord/sec5-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec5-activities.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec5-activities.mp4", type: "video/mp4" })
      )
    ), /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "ALWAYS HAVE SOMETHING TO DO TOGETHER"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Watch videos, play built-in games, listen to music, or just scroll together and spam memes. Seamlessly text, call, video chat, and play games, all in one group chat."))))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "platforms" }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "WHEREVER YOU GAME, HANG OUT HERE"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "On your PC, phone, or console, you can still hang out on Zycord. Easily switch between devices and use tools to manage multiple group chats with friends.")), /* @__PURE__ */ h(
      "div",
      {
        className: "zy-scene-stage stage-cerulean",
        style: { backgroundImage: "url('/site/media/discord/sec6-bkg.webp')" }
      },
      /* @__PURE__ */ h(
        "video",
        {
          className: "zy-stage-video",
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          poster: "/site/media/discord/sec6-platforms.webp"
        },
        /* @__PURE__ */ h("source", { src: "/site/media/discord/sec6-platforms.mp4", type: "video/mp4" })
      )
    ))))), /* @__PURE__ */ h("section", { className: "final-horizon-section", id: "about" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/star-lg.svg", alt: "", "aria-hidden": "true", className: "zy-star d1", style: { width: "30px", top: "10%", left: "14%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/star-m.svg", alt: "", "aria-hidden": "true", className: "zy-star d3", style: { width: "22px", top: "16%", right: "16%" } }), /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h(
      "h2",
      {
        className: "zy-display",
        style: {
          fontSize: "clamp(32px, 4.8vw, 58px)",
          maxWidth: "920px",
          margin: "0 auto"
        }
      },
      "YOU CAN'T SCROLL ANYMORE. BETTER GO CHAT."
    ), /* @__PURE__ */ h("div", { className: "hero-bottom-ctas", style: { marginTop: "32px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/download/windows" }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" }), /* @__PURE__ */ h("path", { d: "M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" })), /* @__PURE__ */ h("span", null, "Download for Windows")))), /* @__PURE__ */ h("div", { className: "final-horizon-art" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-horizon.webp",
        alt: "Zycord Cosmic Horizon Lineup",
        className: "final-horizon-bg",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/dev-clyde-3d.webp",
        alt: "",
        "aria-hidden": "true",
        className: "final-horizon-clyde",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-smoke.gif",
        alt: "",
        "aria-hidden": "true",
        className: "final-horizon-smoke",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-wumpus-leaf.webp",
        alt: "",
        "aria-hidden": "true",
        className: "final-horizon-leaf",
        loading: "lazy"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/footer-wumpus-sitting.webp",
        alt: "Wumpus sitting on the cosmic horizon",
        className: "final-horizon-wumpus",
        loading: "lazy"
      }
    ))));
  }

  // assets/public/jsx/pages/SubPages.jsx
  function DownloadPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-subhero" }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-subhero-inner" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/prop-coin.webp",
        alt: "",
        "aria-hidden": "true",
        style: { width: "86px", height: "auto", marginBottom: "6px", filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.45))" }
      }
    ), /* @__PURE__ */ h("h1", { className: "zy-subhero-title" }, "Download Zycord wherever you hang out"), /* @__PURE__ */ h("p", { className: "zy-subhero-sub" }, "Talk, play, and hang out with friends around the world over voice, video, or text. Available on Windows, macOS, Linux, iOS, Android, and consoles."), /* @__PURE__ */ h("div", { style: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/download/windows", style: { padding: "18px 36px", fontSize: "18px" } }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" }), /* @__PURE__ */ h("path", { d: "M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" })), /* @__PURE__ */ h("span", null, "Download for Windows")))), /* @__PURE__ */ h("div", { className: "zy-dl-hero-stage" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-clyde-point.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "clamp(110px, 14vw, 195px)", left: "-4%", bottom: "12%", zIndex: 4 }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-hero.webp",
        alt: "Zycord Desktop and Mobile Interface",
        className: "zy-dl-hero-img"
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-leaf.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "clamp(72px, 8vw, 118px)", right: "8%", bottom: "36%", zIndex: 4 }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-wumpus-point.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "clamp(130px, 16vw, 230px)", right: "-5%", bottom: "4%", zIndex: 5 }
      }
    )))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "24px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-alt-row" }, /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("h2", { className: "zy-alt-title" }, "Download for desktop"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Use Zycord to easily talk while playing your favorite PC games, show what you’re playing as your status, and stream your games to your friends."), /* @__PURE__ */ h("div", { className: "zy-pill-btn-row" }, /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", href: "/download/windows?platform=osx" }, /* @__PURE__ */ h("svg", { width: "24", height: "25", viewBox: "0 0 24 25", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M19.6239 8.31868C19.5079 8.40869 17.4597 9.56281 17.4597 12.1291C17.4597 15.0974 20.066 16.1475 20.144 16.1735C20.132 16.2375 19.7299 17.6116 18.7698 19.0118C17.9138 20.2439 17.0197 21.474 15.6595 21.474C14.2994 21.474 13.9494 20.6839 12.3792 20.6839C10.849 20.6839 10.305 21.5 9.06087 21.5C7.81675 21.5 6.94866 20.3599 5.95056 18.9597C4.79444 17.3156 3.86035 14.7613 3.86035 12.3371C3.86035 8.44869 6.3886 6.38649 8.87685 6.38649C10.199 6.38649 11.3011 7.25458 12.1312 7.25458C12.9213 7.25458 14.1534 6.33448 15.6575 6.33448C16.2276 6.33448 18.2758 6.38649 19.6239 8.31868ZM14.9435 4.68832C15.5655 3.95024 16.0056 2.92614 16.0056 1.90204C16.0056 1.76003 15.9936 1.61601 15.9676 1.5C14.9555 1.538 13.7513 2.17407 13.0253 3.01615C12.4552 3.66422 11.9232 4.68832 11.9232 5.72642C11.9232 5.88244 11.9492 6.03845 11.9612 6.08846C12.0252 6.10046 12.1292 6.11446 12.2332 6.11446C13.1413 6.11446 14.2834 5.5064 14.9435 4.68832Z" })), /* @__PURE__ */ h("span", null, "macOS")), /* @__PURE__ */ h("div", { className: "zy-action-dropdown", "data-zy-dropdown": true }, /* @__PURE__ */ h("button", { type: "button", className: "zy-white-pill-btn", "data-zy-dropdown-toggle": true, style: { border: "none", cursor: "pointer" } }, /* @__PURE__ */ h("svg", { width: "24", height: "25", viewBox: "0 0 24 25", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M4 4.5H11.5848V12.0815H4V4.5ZM12.4152 4.5H20V12.0815H12.4152V4.5ZM4 12.9152H11.5848V20.5H4V12.9152ZM12.4152 12.9152H20V20.5H12.4152" })), /* @__PURE__ */ h("span", null, "Windows"), /* @__PURE__ */ h("svg", { className: "zy-action-dropdown-arrow", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("polyline", { points: "3.5 6 8 10.5 12.5 6" }))), /* @__PURE__ */ h("div", { className: "zy-action-dropdown-menu", role: "menu" }, /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?arch=x64" }, /* @__PURE__ */ h("span", null, "x64"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?arch=arm64" }, /* @__PURE__ */ h("span", null, "ARM64"), /* @__PURE__ */ h("span", null, "↓")))), /* @__PURE__ */ h("div", { className: "zy-action-dropdown", "data-zy-dropdown": true }, /* @__PURE__ */ h("button", { type: "button", className: "zy-white-pill-btn", "data-zy-dropdown-toggle": true, style: { border: "none", cursor: "pointer" } }, /* @__PURE__ */ h("svg", { width: "24", height: "25", viewBox: "0 0 24 25", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M6.09159 20.5316C7.0409 20.645 8.10753 21.2599 9.00016 21.3685C9.89759 21.4818 10.1753 20.7574 10.1753 20.7574C10.1753 20.7574 11.1852 20.5316 12.2469 20.5056C13.3096 20.4758 14.3156 20.7266 14.3156 20.7266C14.3156 20.7266 14.5107 21.1734 14.8749 21.3685C15.2391 21.5674 16.0231 21.5943 16.5256 21.0648C17.0291 20.5316 18.3724 19.8599 19.1267 19.44C19.8858 19.0191 19.7465 18.3773 19.2699 18.1822C18.7934 17.9872 18.4032 17.6797 18.433 17.0897C18.459 16.5046 18.0122 16.1145 18.0122 16.1145C18.0122 16.1145 18.4032 14.8269 18.0391 13.7603C17.6749 12.6986 16.4738 10.9911 15.5504 9.70743C14.6271 8.41988 15.4111 6.93343 14.5704 5.03377C13.7296 3.13126 11.5494 3.24371 10.3743 4.05463C9.19913 4.8656 9.55942 6.87668 9.6161 7.83085C9.67279 8.78017 9.64204 9.45948 9.53347 9.7036C9.4249 9.95148 8.66679 10.8518 8.1633 11.6061C7.66079 12.3642 7.29656 13.9295 6.92856 14.5752C6.56822 15.2171 6.81999 15.8022 6.81999 15.8022C6.81999 15.8022 6.56827 15.8887 6.36936 16.3096C6.17427 16.7256 5.78416 16.9245 5.08176 17.0601C4.38416 17.2032 4.38416 17.6529 4.55233 18.1564C4.72142 18.6589 4.55233 18.9404 4.35725 19.5823C4.16222 20.2241 5.13845 20.4191 6.09159 20.5316ZM15.9597 17.6038C16.4584 17.8219 17.1752 17.5182 17.3933 17.3001C17.6105 17.083 17.7642 16.7601 17.7642 16.7601C17.7642 16.7601 17.9823 16.8687 17.9602 17.2136C17.9371 17.5634 18.1101 18.062 18.4368 18.235C18.7635 18.407 19.2622 18.6472 19.0037 18.8874C18.7404 19.1276 17.2838 19.7138 16.8485 20.1711C16.4171 20.6256 15.8502 20.9975 15.5052 20.8879C15.1564 20.7794 14.8518 20.3028 15.0018 19.6052C15.1564 18.9105 15.2871 18.1485 15.265 17.7132C15.242 17.278 15.1564 16.6919 15.265 16.6054C15.3736 16.5198 15.5466 16.5611 15.5466 16.5611C15.5466 16.5611 15.46 17.3867 15.9597 17.6038ZM12.7235 5.84474C13.2039 5.84474 13.5912 6.32131 13.5912 6.90743C13.5912 7.32348 13.3961 7.68383 13.1107 7.8568C13.0387 7.82703 12.9637 7.79337 12.8811 7.75874C13.054 7.67325 13.1741 7.45514 13.1741 7.20337C13.1741 6.87383 12.9714 6.60286 12.7167 6.60286C12.4688 6.60286 12.2622 6.87377 12.2622 7.20337C12.2622 7.32354 12.292 7.4436 12.341 7.53777C12.1911 7.4772 12.0556 7.42537 11.9471 7.38405C11.8904 7.24085 11.8567 7.07943 11.8567 6.90748C11.8568 6.32137 12.243 5.84474 12.7235 5.84474ZM11.5339 7.67617C11.7703 7.71748 12.4198 7.99903 12.6601 8.08548C12.9003 8.16811 13.1664 8.32183 13.1405 8.4756C13.1107 8.63411 12.9868 8.63411 12.6601 8.83303C12.3372 9.02811 11.632 9.46337 11.4062 9.49314C11.1813 9.52291 11.0535 9.39605 10.8132 9.24137C10.573 9.08377 10.1224 8.71577 10.2358 8.52074C10.2358 8.52074 10.5884 8.25074 10.7422 8.1124C10.8959 7.9692 11.2937 7.63194 11.5339 7.67617ZM10.4981 6.01388C10.8767 6.01388 11.1851 6.46451 11.1851 7.01988C11.1851 7.1208 11.1736 7.21491 11.1554 7.30908C11.0612 7.33886 10.9671 7.38788 10.8767 7.46668C10.8325 7.50417 10.7911 7.53777 10.7537 7.57526C10.8132 7.46286 10.8363 7.30143 10.8094 7.13228C10.7575 6.83251 10.5548 6.61057 10.3559 6.64034C10.156 6.674 10.0368 6.9488 10.0849 7.25246C10.1378 7.55994 10.3366 7.78183 10.5394 7.74823C10.5509 7.7444 10.5615 7.74057 10.573 7.73668C10.476 7.83085 10.3856 7.91348 10.2915 7.98074C10.0176 7.85291 9.8149 7.47051 9.8149 7.01988C9.81496 6.46068 10.1186 6.01388 10.4981 6.01388ZM8.38902 13.2838C8.77913 12.6689 9.03084 11.3246 9.42096 10.8778C9.81496 10.4319 10.1186 9.48165 9.98021 9.06177C9.98021 9.06177 10.821 10.0678 11.4062 9.90251C11.9923 9.73337 13.3096 8.75428 13.5047 8.92245C13.6998 9.09154 15.3774 12.7813 15.5465 13.9564C15.7156 15.1306 15.4341 16.0281 15.4341 16.0281C15.4341 16.0281 14.7923 15.8589 14.7096 16.249C14.627 16.643 14.627 18.0699 14.627 18.0699C14.627 18.0699 13.7593 19.271 12.416 19.4698C11.0727 19.6649 10.4 19.5227 10.4 19.5227L9.64576 18.6588C9.64576 18.6588 10.2319 18.5724 10.1492 17.9834C10.0666 17.3982 8.35816 16.5872 8.05067 15.8589C7.7433 15.1305 7.9941 13.8997 8.38902 13.2838ZM5.0673 17.6903C5.13456 17.402 6.00507 17.4021 6.33947 17.1993C6.67387 16.9966 6.74107 16.4143 7.01113 16.2606C7.27724 16.103 7.76924 16.6622 7.97199 16.9773C8.1709 17.2848 8.9329 18.6291 9.24422 18.9634C9.55936 19.3007 9.84862 19.7475 9.75827 20.1491C9.67279 20.5507 9.19907 20.8438 9.19907 20.8438C8.77536 20.9745 7.59347 20.4643 7.05639 20.2394C6.5193 20.0136 5.1529 19.9463 4.97707 19.7475C4.79645 19.5447 5.06353 19.0979 5.13462 18.6742C5.19799 18.2456 4.99913 17.9795 5.0673 17.6903Z" })), /* @__PURE__ */ h("span", null, "Linux"), /* @__PURE__ */ h("svg", { className: "zy-action-dropdown-arrow", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("polyline", { points: "3.5 6 8 10.5 12.5 6" }))), /* @__PURE__ */ h("div", { className: "zy-action-dropdown-menu", role: "menu" }, /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?platform=linux&format=deb" }, /* @__PURE__ */ h("span", null, "deb"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?platform=linux&format=tar.gz" }, /* @__PURE__ */ h("span", null, "tar.gz"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?platform=linux&format=rpm" }, /* @__PURE__ */ h("span", null, "rpm"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?platform=linux&format=pkg.tar.zst" }, /* @__PURE__ */ h("span", null, "pkg.tar.zst"), /* @__PURE__ */ h("span", null, "↓")))))), /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-green" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-desktop-card.webp", alt: "Download Zycord for Desktop" }))), /* @__PURE__ */ h("div", { className: "zy-alt-row is-reversed" }, /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-blue" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-mobile-card.webp", alt: "Download Zycord for Mobile" })), /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("h2", { className: "zy-alt-title" }, "Download for mobile"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Out and about? Sunk in a massive beanbag? Bring Zycord with you and chat whenever, have fun with friends, or just see what’s up."), /* @__PURE__ */ h("div", { className: "zy-pill-btn-row" }, /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", "data-zy-open-app": true, href: "/app" }, /* @__PURE__ */ h("svg", { width: "24", height: "25", viewBox: "0 0 24 25", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M19.6239 8.31868C19.5079 8.40869 17.4597 9.56281 17.4597 12.1291C17.4597 15.0974 20.066 16.1475 20.144 16.1735C20.132 16.2375 19.7299 17.6116 18.7698 19.0118C17.9138 20.2439 17.0197 21.474 15.6595 21.474C14.2994 21.474 13.9494 20.6839 12.3792 20.6839C10.849 20.6839 10.305 21.5 9.06087 21.5C7.81675 21.5 6.94866 20.3599 5.95056 18.9597C4.79444 17.3156 3.86035 14.7613 3.86035 12.3371C3.86035 8.44869 6.3886 6.38649 8.87685 6.38649C10.199 6.38649 11.3011 7.25458 12.1312 7.25458C12.9213 7.25458 14.1534 6.33448 15.6575 6.33448C16.2276 6.33448 18.2758 6.38649 19.6239 8.31868ZM14.9435 4.68832C15.5655 3.95024 16.0056 2.92614 16.0056 1.90204C16.0056 1.76003 15.9936 1.61601 15.9676 1.5C14.9555 1.538 13.7513 2.17407 13.0253 3.01615C12.4552 3.66422 11.9232 4.68832 11.9232 5.72642C11.9232 5.88244 11.9492 6.03845 11.9612 6.08846C12.0252 6.10046 12.1292 6.11446 12.2332 6.11446C13.1413 6.11446 14.2834 5.5064 14.9435 4.68832Z" })), /* @__PURE__ */ h("span", null, "App Store")), /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", "data-zy-open-app": true, href: "/app" }, /* @__PURE__ */ h("svg", { width: "24", height: "25", viewBox: "0 0 24 25", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M12.411 13.3719L4.51124 21.248L4.65636 21.3458C5.01074 21.5483 5.44836 21.5517 5.80498 21.3537L15.1942 16.1484L12.411 13.3719ZM4.08374 20.0858L11.6145 12.5776L4.08374 5.0694V20.0858ZM19.9979 11.5145L16.3192 9.47488L13.2075 12.5776L16.218 15.5802L19.9979 13.4855C20.3602 13.2841 20.5841 12.9084 20.5841 12.5C20.5841 12.0916 20.3602 11.7159 19.9979 11.5145ZM4.65636 3.65415L4.42799 3.82515L12.411 11.7834L15.2955 8.90789L5.80498 3.64628C5.44836 3.44828 5.01074 3.45165 4.65636 3.65415Z" })), /* @__PURE__ */ h("span", null, "Google Play"))))), /* @__PURE__ */ h("div", { className: "zy-alt-row" }, /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("h2", { className: "zy-alt-title" }, "Link your console"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Coordinate from the couch and talk with your Zycord friends across PC, mobile, and your fellow console users — supported platforms even let you stream your game directly from your console."), /* @__PURE__ */ h("div", { className: "zy-pill-btn-row" }, /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", href: "/blog" }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M14.6814 7.63604V12.9786C16.9395 14.0641 18.7164 12.9772 18.7164 10.1098C18.7164 7.16804 17.6761 5.86227 14.6087 4.81347C13.4028 4.40838 10.8827 3.73515 9.29913 3.4502V19.402L13.2409 20.5474V7.16849C13.2409 6.54142 13.5219 6.12277 13.9748 6.26736C14.5659 6.43137 14.6814 7.00852 14.6814 7.63604ZM19.7146 14.4624C18.5436 13.9992 17.0516 13.8401 15.8335 13.9805L13.5759 14.5016V16.2555L16.5739 15.1539C17.0853 14.9626 17.8355 14.9216 18.25 15.0634C18.6644 15.2052 18.5865 15.4749 18.0758 15.6658L13.5759 17.3387V19.0285L19.6907 16.737C20.5126 16.4222 20.8483 15.9806 20.8483 15.9806C21.1835 15.5387 21.0345 14.8977 19.7146 14.4624ZM3.33921 15.4713C2.69265 15.9491 2.94775 16.7166 4.34774 17.1764C5.86965 17.6763 7.32914 17.9804 8.71894 17.7357L8.99585 17.6859V16.1144L7.70419 16.4963C7.16946 16.6879 6.38308 16.7279 5.94907 16.5864C5.51511 16.4446 5.5968 16.1749 6.13157 15.984L8.99585 15.0096V13.2532L4.95387 14.6976C3.93724 15.0297 3.33921 15.4713 3.33921 15.4713Z" })), /* @__PURE__ */ h("span", null, "Playstation")), /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", href: "/blog" }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M11.9824 4C10.4899 4 9.06724 4.41739 7.88739 5.14783C8.8 4.7 11.1 6.2 11.98 6.75C12.9 6.2 15.2 4.7 16.08 5.15C14.9 4.42 13.48 4 11.9824 4ZM6.15 6.54C4.83 7.97 4 9.88 4 12C4 16.42 7.57 20 11.98 20C14.31 20 16.43 18.99 17.88 17.39C16.8 14.8 13.1 10.8 11.98 9.95C10.8 10.8 7.1 14.8 6.15 17.43C5.7 15.8 7.5 11.5 10.5 8.17C9.5 7.1 7.5 6.1 6.15 6.54ZM17.85 6.57C16.5 6.1 14.5 7.1 13.47 8.17C16.5 11.5 18.3 15.8 17.92 17.39C19.2 15.97 20 14.09 20 12C19.97 9.91 19.17 8 17.85 6.57Z" })), /* @__PURE__ */ h("span", null, "Xbox")))), /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-pink" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-console-card.webp", alt: "Link your console to Zycord" }))), /* @__PURE__ */ h("div", { className: "zy-alt-row is-reversed" }, /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-blue", style: { minHeight: "340px", background: "linear-gradient(145deg, #1b4be6 0%, #4b73ff 48%, #10164f 100%)" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-card-apps.webp", alt: "Download Zycord for VR", style: { maxHeight: "340px" } })), /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("h2", { className: "zy-alt-title" }, "Download for VR"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Connect with your Zycord communities and DMs from wherever the virtual world takes you. On supported platforms, you’ll be able to join video calls with a digital avatar."), /* @__PURE__ */ h("div", { className: "zy-pill-btn-row" }, /* @__PURE__ */ h("a", { className: "zy-white-pill-btn", "data-zy-open-app": true, href: "/app" }, /* @__PURE__ */ h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, /* @__PURE__ */ h("path", { d: "M2.59229 14.6835C2.59229 15.6148 2.79343 16.3298 3.05634 16.7624C3.40103 17.329 3.91515 17.569 4.43928 17.569C5.11531 17.569 5.73376 17.3985 6.92558 15.7234C7.88037 14.3807 9.00543 12.4961 9.76241 11.3146L11.0444 9.31292C11.9349 7.92278 12.9656 6.37741 14.1474 5.32993C15.1123 4.47497 16.153 4 17.2004 4C18.959 4 20.634 5.03561 21.916 6.97792C23.319 9.10512 24 11.7845 24 14.5495C24 16.1933 23.6812 17.401 23.1387 18.3552C22.6145 19.278 21.593 20.2 19.8745 20.2V17.569C21.3459 17.569 21.7132 16.195 21.7132 14.6225C21.7132 12.3816 21.1991 9.89476 20.0665 8.11785C19.2628 6.85748 18.2212 6.08734 17.0753 6.08734C15.8359 6.08734 14.8385 7.03729 13.7176 8.73108C13.1217 9.63098 12.5099 10.7277 11.8231 11.9651L11.0669 13.3265C9.54792 16.0635 9.16317 16.6869 8.40367 17.7157C7.07247 19.5172 5.93574 20.2 4.43928 20.2C2.66407 20.2 1.54152 19.4188 0.846293 18.2416C0.278759 17.2823 0 16.0236 0 14.5894L2.59229 14.6835Z" }), /* @__PURE__ */ h("path", { d: "M2.04395 7.16367C3.23243 5.30194 4.94755 4 6.91472 4C8.05396 4 9.18652 4.34266 10.3692 5.32399C11.6628 6.39692 13.0416 8.16365 14.7617 11.0754L15.3785 12.1204C16.8674 14.6411 17.7146 15.938 18.2103 16.5495C18.8479 17.3349 19.2945 17.569 19.8745 17.569C21.3459 17.569 21.7132 16.195 21.7132 14.6225L24 14.5495C24 16.1933 23.6812 17.401 23.1387 18.3552C22.6145 19.278 21.593 20.2 19.8745 20.2C18.8062 20.2 17.8598 19.9642 16.8132 18.9608C16.0086 18.1907 15.068 16.8226 14.3444 15.5928L12.1919 11.9388C11.112 10.1051 10.1213 8.73786 9.54791 8.1187C8.93113 7.45289 8.13826 6.64883 6.87299 6.64883C5.84892 6.64883 4.97926 7.3791 4.25148 8.49614L2.04395 7.16367Z" }), /* @__PURE__ */ h("path", { d: "M6.873 6.64883C5.84894 6.64883 4.97927 7.3791 4.2515 8.49614C3.22242 10.0746 2.59229 12.4257 2.59229 14.6835C2.59229 15.6148 2.79343 16.3298 3.05634 16.7624L0.846293 18.2416C0.278759 17.2823 0 16.0236 0 14.5894C0 11.9813 0.70441 9.26288 2.04396 7.16366C3.23244 5.30194 4.94756 4 6.91473 4L6.873 6.64883Z" })), /* @__PURE__ */ h("span", null, "Meta Quest"))))), /* @__PURE__ */ h("div", { className: "zy-ptb-card" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-ptb-3d.png",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "118px", top: "-36px", left: "4%" }
      }
    ), /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/download-trophy.webp",
        alt: "",
        "aria-hidden": "true",
        className: "zy-float-prop",
        style: { width: "112px", bottom: "-32px", right: "5%" }
      }
    ), /* @__PURE__ */ h("h2", { className: "zy-alt-title", style: { textAlign: "center" } }, "Feeling experimental?"), /* @__PURE__ */ h("p", { className: "zy-body-lg", style: { maxWidth: "600px", textAlign: "center" } }, "Try out the newest features before they launch by using our Public Test Build."), /* @__PURE__ */ h("div", { className: "zy-pill-btn-row", style: { justifyContent: "center" } }, /* @__PURE__ */ h("div", { className: "zy-action-dropdown", "data-zy-dropdown": true }, /* @__PURE__ */ h("button", { type: "button", className: "zy-white-pill-btn", "data-zy-dropdown-toggle": true, style: { border: "none", cursor: "pointer", padding: "16px 28px", fontSize: "16px" } }, /* @__PURE__ */ h("span", null, "Download Test Build"), /* @__PURE__ */ h("svg", { className: "zy-action-dropdown-arrow", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("polyline", { points: "3.5 6 8 10.5 12.5 6" }))), /* @__PURE__ */ h("div", { className: "zy-action-dropdown-menu", role: "menu", style: { minWidth: "230px" } }, /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&platform=osx" }, /* @__PURE__ */ h("span", null, "Mac"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&arch=x64" }, /* @__PURE__ */ h("span", null, "Windows 64-bit"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&arch=arm64" }, /* @__PURE__ */ h("span", null, "Windows ARM64"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&platform=linux&format=deb" }, /* @__PURE__ */ h("span", null, "Linux deb"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&platform=linux&format=tar.gz" }, /* @__PURE__ */ h("span", null, "Linux tar.gz"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&platform=linux&format=rpm" }, /* @__PURE__ */ h("span", null, "Linux rpm"), /* @__PURE__ */ h("span", null, "↓")), /* @__PURE__ */ h("a", { className: "zy-action-dropdown-item", href: "/download/windows?channel=ptb&platform=linux&format=pkg.tar.zst" }, /* @__PURE__ */ h("span", null, "Linux pkg.tar.zst"), /* @__PURE__ */ h("span", null, "↓")))))))));
  }
  function QuestsPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(
      "section",
      {
        className: "zy-subhero",
        style: {
          backgroundImage: "linear-gradient(180deg, rgba(16,18,56,0.58) 0%, rgba(16,18,56,0.95) 100%), url('/site/media/discord/quests-hero-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "80px",
          paddingBottom: "76px"
        }
      },
      /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-subhero-inner" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord Quests & Advertising"), /* @__PURE__ */ h("h1", { className: "zy-subhero-title" }, "ADVERTISE WHERE THE WORLD PLAYS"), /* @__PURE__ */ h("p", { className: "zy-subhero-sub" }, "Break through to some of the most passionate audiences of players with Zycord Quests — where players earn exclusive collectibles for playing and streaming."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", "data-zy-open-app": true, href: "/app" }, "Explore Quests in App"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/nitro" }, "View Collectibles Shop")), /* @__PURE__ */ h(
        "img",
        {
          src: "/site/media/discord/quests-cauldron.avif",
          alt: "",
          "aria-hidden": "true",
          style: { width: "164px", height: "auto", marginTop: "18px", filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.5))" }
        }
      )))
    ), /* @__PURE__ */ h("section", { className: "zy-section", id: "stories", style: { paddingTop: "36px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "740px", margin: "0 auto 40px" } }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "DESIGNED FOR GAME PLAYERS"), /* @__PURE__ */ h("p", { className: "zy-body-lg", style: { marginTop: "12px" } }, "Players love our Quest format because they are rewarded for engaging. It’s a win-win for players and game studios.")), /* @__PURE__ */ h("div", { className: "zy-alt-row" }, /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Step 1"), /* @__PURE__ */ h("h3", { className: "zy-alt-title" }, "1. THEY ACCEPT YOUR QUEST"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Actions include watching a trailer, playing a game, streaming to friends in a voice channel, and more.")), /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-indigo" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-1.webp", alt: "1. They accept your Quest" }))), /* @__PURE__ */ h("div", { className: "zy-alt-row is-reversed" }, /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-blue" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-2.webp", alt: "2. Play or Watch" })), /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Step 2"), /* @__PURE__ */ h("h3", { className: "zy-alt-title" }, "2. PLAY OR WATCH"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Taking the requested action inside Zycord or the connected game automatically progresses and completes the Quest."))), /* @__PURE__ */ h("div", { className: "zy-alt-row" }, /* @__PURE__ */ h("div", { className: "zy-alt-copy" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Step 3"), /* @__PURE__ */ h("h3", { className: "zy-alt-title" }, "3. AND COLLECT REWARDS"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Rewards include in-game loot, Orbs, and exclusive Zycord Avatar Decorations, Nameplates, and Profile Effects.")), /* @__PURE__ */ h("div", { className: "zy-alt-media-card is-pink" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-step-3.webp", alt: "3. And Collect Rewards" }))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Quest Formats"), /* @__PURE__ */ h("h2", { className: "zy-heading" }, "EXPLORE OUR SOLUTIONS"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Whether you’re promoting a tentpole game launch, seasonal update, or community tournament, Quests connect with players at scale."), /* @__PURE__ */ h("div", { style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" } }, /* @__PURE__ */ h("div", { className: "zy-card", style: { padding: "18px 22px" } }, /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "19px" } }, "PLAY QUESTS"), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, "Rewards both new and returning players for playing or streaming your game to friends.")), /* @__PURE__ */ h("div", { className: "zy-card", style: { padding: "18px 22px" } }, /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "19px" } }, "VIDEO QUESTS & MISSIONS"), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, "Interactive video trailers and native mini-missions that unlock instant profile cosmetics.")))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple", style: { flexDirection: "column", gap: "18px" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-wumpus-banner.webp", alt: "Zycord Quests Hero Banner", style: { width: "100%", height: "auto", borderRadius: "24px" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-missions.webp", alt: "Zycord Quests Interactive Missions", style: { width: "100%", height: "auto", borderRadius: "24px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "faq", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { maxWidth: "860px" } }, /* @__PURE__ */ h("h2", { className: "zy-heading", style: { textAlign: "center", marginBottom: "28px" } }, "QUESTS FAQ"), /* @__PURE__ */ h("div", { className: "zy-accordion" }, /* @__PURE__ */ h("div", { className: "zy-accordion-item is-open" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-accordion-trigger", "data-zy-accordion-trigger": true, "aria-expanded": "true" }, /* @__PURE__ */ h("span", null, "Where do my unlocked Quest rewards appear?"), /* @__PURE__ */ h("span", { className: "zy-accordion-icon" }, "▾")), /* @__PURE__ */ h("div", { className: "zy-accordion-content" }, "All unlocked Avatar Decorations, Nameplates, Profile Effects, and Profile Frames appear directly in ", /* @__PURE__ */ h("strong", null, "User Settings → Profiles"), " inside Zycord.")), /* @__PURE__ */ h("div", { className: "zy-accordion-item" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-accordion-trigger", "data-zy-accordion-trigger": true, "aria-expanded": "false" }, /* @__PURE__ */ h("span", null, "Can developers create custom activities and Rich Presence quests?"), /* @__PURE__ */ h("span", { className: "zy-accordion-icon" }, "▾")), /* @__PURE__ */ h("div", { className: "zy-accordion-content" }, "Yes! Visit the ", /* @__PURE__ */ h("a", { href: "/developers/applications", style: { color: "#fff", textDecoration: "underline" } }, "Zycord Developer Portal"), " to configure Rich Presence assets, Profile Widgets, and embedded Activities."))))));
  }
  function BlogPage() {
    const posts = [
      {
        cat: "Product & Features",
        id: "product",
        img: "/site/media/discord/sec1-chat-fun.webp",
        title: "Introducing Full Profile Collectibles: Avatar Decorations, Nameplates, Effects & Frames",
        desc: "Customize every layer of your Zycord identity with 1,099+ collectibles across 9 categories, full-card profile effects, and non-obscuring perimeter frames."
      },
      {
        cat: "Engineering & Developers",
        id: "engineering",
        img: "/site/media/discord/dev-hero-16x9.webp",
        title: "How Zycord Routes Sub-20ms WebRTC Voice & 1080p 60fps Video Streams",
        desc: "A deep dive into our SFU media architecture, Opus audio packet prioritization, and hardware-accelerated screen sharing."
      },
      {
        cat: "Policy & Safety",
        id: "safety",
        img: "/site/media/discord/safety-card-1.png",
        title: "End-to-End Encrypted Direct Messages & Passkey Authentication",
        desc: "Protecting private conversations with zero-knowledge client-side WebCrypto keys, recovery codes, and WebAuthn security."
      },
      {
        cat: "Community",
        id: "community",
        img: "/site/media/discord/sec5-activities.webp",
        title: "Community Spotlight: Hosting 100-Player Esports Watch Parties",
        desc: "See how gaming communities use Stage channels, custom soundboards, and Role Icons to run weekly tournaments."
      },
      {
        cat: "Zycord HQ",
        id: "hq",
        img: "/site/media/discord/careers-office-1.webp",
        title: "Inside Zycord HQ: Building the Future of Real-Time Hangouts",
        desc: "Meet the engineering and design teams crafting a faster, more expressive communication platform."
      },
      {
        cat: "How to Zycord",
        id: "guides",
        img: "/site/media/discord/sec4-chill.webp",
        title: "How to Link Steam, Spotify, GitHub, PlayStation & Xbox for Rich Presence",
        desc: "Step-by-step guide to connecting your accounts so friends can see what you're playing and jump right into your lobby."
      }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nav-blog-cube.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "132px", top: "-42px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord Blog & Newsroom")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "STORIES, UPDATES & ENGINEERING"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "The latest product releases, engineering deep-dives, community spotlights, and safety updates from the Zycord team.")), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-magenta" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/quests-missions.webp", alt: "Zycord Featured Update", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, posts.map((p) => /* @__PURE__ */ h("article", { className: "zy-card", id: p.id }, /* @__PURE__ */ h("img", { src: p.img, alt: p.title, style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("span", { className: "zy-eyebrow", style: { alignSelf: "flex-start", marginTop: "6px" } }, p.cat), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "20px" } }, p.title), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, p.desc), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", href: "/app" }, "Try it in Zycord →"))))))));
  }
  function AppDirectoryPage() {
    const apps = [
      { name: "ZyGuard AutoMod", cat: "Moderation & Security", installs: "42,800+ Servers", img: "/site/media/discord/safety-card-1.png", desc: "Real-time raid protection, regex keyword filters, anti-phishing links, and automated audit logs." },
      { name: "WatchParty Cinema", cat: "Activities & Watch Together", installs: "68,400+ Servers", img: "/site/media/discord/sec5-activities.webp", desc: "Synchronized YouTube, Twitch, and media playback right inside any Zycord voice channel." },
      { name: "Tempo Hi-Fi Music", cat: "Music & Soundboard", installs: "91,200+ Servers", img: "/site/media/discord/sec2-stream.webp", desc: "Lossless 384kbps Opus audio streaming, playlists, and live DJ queue management." },
      { name: "QuestMaster RPG", cat: "Games & Trivia", installs: "54,100+ Servers", img: "/site/media/discord/quests-card-1.webp", desc: "Turn-based multiplayer dungeon raids, leaderboards, and custom server loot drops." },
      { name: "GitPulse Notifier", cat: "Developer Tools", installs: "31,900+ Servers", img: "/site/media/discord/dev-card-apps.webp", desc: "Instant rich webhook embeds for GitHub commits, PR reviews, CI/CD builds, and releases." },
      { name: "LevelUp XP & Roles", cat: "Community Engagement", installs: "77,500+ Servers", img: "/site/media/discord/sec6-platforms.webp", desc: "Customizable rank cards, voice activity XP rewards, and automated role promotions." }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/prop-rupee-gem.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "136px", top: "-44px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Official App Directory")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "SUPERCHARGE YOUR SERVER WITH APPS"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Discover thousands of verified bots, slash-command utilities, multiplayer voice Activities, and automated moderation tools built on the Zycord API."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/app" }, "Browse in Zycord"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/developers/applications" }, "Build Your Own App"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-card-apps.webp", alt: "Zycord App Directory", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, apps.map((a) => /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: a.img, alt: a.name, style: { width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "6px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, a.cat), /* @__PURE__ */ h("span", { style: { fontSize: "12px", color: "var(--color-spring-green)", fontWeight: "700" } }, a.installs)), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, a.name), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, a.desc), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/app" }, "Add to Server"))))))));
  }
  function GiftCardsPage() {
    const tiers = [
      { title: "1 Month Zycord Nitro", price: "$9.99", badge: "Popular Gift", img: "/site/media/discord/nitro-perk-1.webp", desc: "Unlock 1080p 60fps HD streaming, 500MB uploads, custom emojis everywhere, and 2 free Server Boosts for 30 days." },
      { title: "1 Year Zycord Nitro", price: "$99.99", badge: "Best Value · 2 Months Free", img: "/site/media/discord/nitro-perk-2.webp", desc: "A full year of complete profile customization, animated avatars, custom banners, profile effects, and 2 Server Boosts." },
      { title: "Shop Collectibles Bundle", price: "$14.99", badge: "Exclusive Cosmetics", img: "/site/media/discord/nitro-perk-3.webp", desc: "Gift instant access to 1,099+ avatar decorations, animated nameplates, and full-card profile effects." }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nitro-wumpus-jetpack.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "148px", top: "-52px", right: "5%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord Nitro Gift Cards")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "GIVE THE GIFT OF NITRO"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Share HD streaming, animated profile themes, custom emojis, and Server Boosts with your favorite squadmates in seconds."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/nitro" }, "Gift Nitro Now"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/app" }, "Redeem a Gift Code"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-magenta" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nitro-banner-media.webp", alt: "Zycord Nitro Gift Cards", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, tiers.map((t) => /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: t.img, alt: t.title, style: { width: "100%", height: "190px", objectFit: "contain", background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "16px" } }), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, t.badge), /* @__PURE__ */ h("span", { className: "zy-heading-sm", style: { fontSize: "22px", color: "var(--color-spring-green)" } }, t.price)), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, t.title), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, t.desc), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/app" }, "Send Digital Gift"))))))));
  }
  function CompanyPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/hero-wumpus.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "136px", top: "-46px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "About Zycord")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "CREATE SPACE FOR EVERYONE TO FIND BELONGING"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Zycord is the real-time voice, video, and text communication platform where gaming squads, open-source builders, and world-class communities hang out every day."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/careers" }, "Explore Careers"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/newsroom" }, "Visit Newsroom"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-cerulean" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-hero.webp", alt: "About Zycord", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-office-1.webp", alt: "Our Story", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "BUILT FOR REAL FRIENDSHIPS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Unlike endless social feeds designed for passive scrolling, Zycord is designed for active conversation — jumping into voice channels, streaming games, and building lasting memories.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-office-2.webp", alt: "Engineering Excellence", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "SUB-20MS GLOBAL INFRASTRUCTURE"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Powered by ultra-low-latency WebRTC voice, 1080p 60fps screen sharing, and end-to-end encrypted direct messaging with Passkey security.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-office-3.webp", alt: "Privacy First", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "SAFETY & TRANSPARENCY"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Your conversations belong to you. We empower communities with granular role permissions, AutoMod filters, and zero-knowledge encrypted DMs."))))));
  }
  function BrandingPage() {
    const colors = [
      { name: "Zycord Blurple", hex: "#5865F2", rgb: "RGB(88, 101, 242)" },
      { name: "Deep Space Indigo", hex: "#1B1D68", rgb: "RGB(27, 29, 104)" },
      { name: "Spring Green", hex: "#57F287", rgb: "RGB(87, 242, 135)" },
      { name: "Fuchsia Pulse", hex: "#EB459E", rgb: "RGB(235, 69, 158)" },
      { name: "Solar Amber", hex: "#FEE75C", rgb: "RGB(254, 231, 92)" },
      { name: "Midnight Onyx", hex: "#0B0C20", rgb: "RGB(11, 12, 32)" }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-crown.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "110px", top: "-40px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Official Brand Guidelines")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "OUR BRAND, LOGOS & DESIGN SYSTEM"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Download official Zycord marks, mascot artwork, color tokens, and typography guidelines for press, creators, and community partners."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/favicon.svg", download: "Zycord-Logo.svg" }, "Download SVG Logo Kit"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/branding/preview.html" }, "Interactive Brand Preview"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple", style: { minHeight: "280px", flexDirection: "column", gap: "16px" } }, /* @__PURE__ */ h("img", { src: "/favicon.svg", alt: "Zycord Mark", style: { width: "112px", height: "112px", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.45))" } }), /* @__PURE__ */ h("div", { className: "zy-display", style: { fontSize: "42px" } }, "Zycord")))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("h2", { className: "zy-heading", style: { marginBottom: "24px" } }, "OFFICIAL COLOR PALETTE"), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, colors.map((c) => /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("div", { style: { height: "120px", borderRadius: "16px", background: c.hex, border: "1px solid rgba(255,255,255,0.22)" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "20px", marginTop: "8px" } }, c.name), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontFamily: "monospace", fontSize: "14px" } }, c.hex, " · ", c.rgb)))))));
  }
  function NewsroomPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nav-blog-cube.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "128px", top: "-42px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Press & Media Center")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "ZYCORD NEWSROOM"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Official announcements, company milestones, media resources, and executive briefings from Zycord HQ."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/branding" }, "Download Media Kit"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/blog" }, "Read Engineering Blog"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-sunset" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/careers-office-4.webp", alt: "Zycord Newsroom", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h(BlogPage, null));
  }
  function CreatorsPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-trophy.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "118px", top: "-40px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord for Creators")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "TURN YOUR AUDIENCE INTO A THRIVING COMMUNITY"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Host live Stage events, sync Twitch & YouTube subscriber roles automatically, and reward your biggest supporters with custom collectibles."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/app" }, "Launch Your Creator Server"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/community" }, "Community Guidelines"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-magenta" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec2-stream.webp", alt: "Zycord for Creators", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec3-hop-in.webp", alt: "Subscriber Role Sync", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "TWITCH & YOUTUBE ROLE SYNC"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Automatically grant exclusive VIP channels, custom role icons, and soundboard perks to your Twitch subscribers and YouTube channel members.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec5-activities.webp", alt: "Stage Channels", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "STAGE CHANNELS & AMAs"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Run moderated town halls, live podcast recordings, and interactive Q&A sessions with raised-hand speaker queues for thousands of listeners.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec1-chat-fun.webp", alt: "Server Shop & Perks", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "CUSTOM EMOJIS & SOUNDBOARDS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Upload your channel's iconic memes, animated emotes, and catchphrases so your community can react in voice and text."))))));
  }
  function CommunityPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec5-card-characters.png", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "156px", top: "-52px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Zycord Communities")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "WHERE PASSIONATE COMMUNITIES GROW"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "From university study groups and open-source maintainers to global esports organizations, Zycord gives community leaders every tool to welcome and organize members."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/discover" }, "Explore Public Servers"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/app" }, "Create a Community Server"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-emerald" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec6-platforms.webp", alt: "Zycord Community", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/safety-card-2.webp", alt: "Onboarding", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "GUIDED SERVER ONBOARDING"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Welcome new members with interactive role-picker questions, custom rules screening, and curated default channels.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/sec4-chill.webp", alt: "Forum Channels", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "FORUM & THREAD CHANNELS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Keep busy discussions organized with searchable topic tags, pinned guidelines, and dedicated threads that never clutter main chat.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/safety-card-4.png", alt: "Community Insights", style: { width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "AUTO-MODERATION & SAFETY"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Protect your space effortlessly with customizable keyword filters, raid alerts, and granular role-based permission hierarchies."))))));
  }
  function MerchPage() {
    const items = [
      { name: "Wumpus Plushie Collector Edition", price: "$34.00", tag: "Limited Drop", img: "/site/media/discord/hero-wumpus.webp", desc: "Ultra-soft 12-inch embroidered Wumpus plush with magnetic leaf accessory." },
      { name: "Blurple Heavyweight Hoodie", price: "$68.00", tag: "Apparel", img: "/site/media/discord/nitro-wumpus-wheel.webp", desc: "450gsm brushed cotton fleece in signature Zycord Blurple with puff-print wordmark." },
      { name: "3D Keycap & Desk Mat Bundle", price: "$49.00", tag: "Hardware Gear", img: "/site/media/discord/dev-clyde-3d.webp", desc: "Artisan resin Clyde keycap paired with an XXL stitched-edge midnight desk pad." }
    ];
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nitro-star.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "110px", top: "-36px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Official Zycord Store")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "OFFICIAL MERCH & COLLECTIBLES"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Rep your favorite hangout IRL with limited-edition apparel, plushies, desk gear, and digital profile collectibles."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/app" }, "Open Digital Collectibles Shop"), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "/gift-cards" }, "Shop Gift Cards"))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nitro-banner-media.webp", alt: "Zycord Merch", style: { width: "100%", height: "auto", borderRadius: "20px" } })))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-grid-3" }, items.map((it) => /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: it.img, alt: it.name, style: { width: "100%", height: "200px", objectFit: "contain", background: "rgba(255,255,255,0.05)", padding: "18px", borderRadius: "16px" } }), /* @__PURE__ */ h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, it.tag), /* @__PURE__ */ h("span", { className: "zy-heading-sm", style: { fontSize: "20px", color: "var(--color-spring-green)" } }, it.price)), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, it.name), /* @__PURE__ */ h("p", { className: "zy-body", style: { fontSize: "14px" } }, it.desc), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "10px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/app" }, "View in Shop"))))))));
  }
  function FeedbackPage() {
    function handleFeedbackSubmit(e) {
      e.preventDefault();
      const statusEl = document.getElementById("zy-feedback-status");
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.textContent = "Thank you! Your feedback has been submitted to the Zycord Product Team.";
      }
      e.target.reset();
    }
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "48px", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/download-clyde-point.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "124px", top: "-42px", right: "6%" } }), /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Product Feedback & Feature Requests")), /* @__PURE__ */ h("h1", { className: "zy-display" }, "HELP SHAPE THE FUTURE OF ZYCORD"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Have an idea for Voice & Video, Collectibles, Server Moderation, or Developer APIs? Submit your feedback directly to our engineering team.")), /* @__PURE__ */ h("div", { className: "zy-card", style: { background: "rgba(13, 15, 44, 0.88)" } }, /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px" } }, "Submit a Feature Request"), /* @__PURE__ */ h("form", { onSubmit: handleFeedbackSubmit, style: { display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" } }, /* @__PURE__ */ h("select", { required: true, style: { padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px" } }, /* @__PURE__ */ h("option", { value: "voice", style: { background: "#1b1e4b" } }, "Voice, Video & Screen Share"), /* @__PURE__ */ h("option", { value: "chat", style: { background: "#1b1e4b" } }, "Text Channels, Threads & Polls"), /* @__PURE__ */ h("option", { value: "nitro", style: { background: "#1b1e4b" } }, "Nitro & Profile Collectibles"), /* @__PURE__ */ h("option", { value: "api", style: { background: "#1b1e4b" } }, "Bots, Webhooks & Developer API"), /* @__PURE__ */ h("option", { value: "safety", style: { background: "#1b1e4b" } }, "Safety, Privacy & Moderation")), /* @__PURE__ */ h(
      "input",
      {
        type: "text",
        required: true,
        placeholder: "Short title for your suggestion...",
        style: { padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px" }
      }
    ), /* @__PURE__ */ h(
      "textarea",
      {
        rows: "4",
        required: true,
        placeholder: "Describe how this feature would help you and your server...",
        style: { padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px", resize: "vertical" }
      }
    ), /* @__PURE__ */ h("button", { type: "submit", className: "zy-btn zy-btn-primary" }, "Submit Feedback"), /* @__PURE__ */ h("div", { id: "zy-feedback-status", style: { display: "none", padding: "12px", borderRadius: "12px", background: "rgba(87, 242, 135, 0.18)", border: "1px solid rgba(87, 242, 135, 0.45)", color: "#57f287", fontWeight: "700", fontSize: "14px" } }))))))));
  }

  // assets/public/jsx/pages/DevelopersHubPage.jsx
  function DevelopersHubPage() {
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("section", { className: "zy-subhero", style: { paddingTop: "76px", paddingBottom: "48px" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-fire-extinguisher.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "92px", top: "10%", left: "6%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-spider.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "86px", top: "14%", right: "8%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-magnet.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "84px", bottom: "10%", left: "9%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-cog.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "88px", bottom: "12%", right: "10%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-rubber-duck.png", alt: "", "aria-hidden": "true", className: "zy-float-prop", style: { width: "90px", top: "42%", left: "3%" } }), /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-clyde-3d.webp", alt: "", "aria-hidden": "true", className: "zy-float-prop tilt", style: { width: "104px", top: "40%", right: "3%" } }), /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-subhero-inner" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, /* @__PURE__ */ h("span", { className: "zy-eyebrow-dot", "data-zy-status-dot": true }), /* @__PURE__ */ h("span", null, "Zycord Developer Platform · Social SDK, Bots & Activities")), /* @__PURE__ */ h("h1", { className: "zy-subhero-title" }, "Zycord for Game Developers"), /* @__PURE__ */ h("p", { className: "zy-subhero-sub" }, "Tools, integrations, and platform capabilities for game developers and bot builders to tap into the power of Zycord.")))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "12px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { className: "zy-showcase-card" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "BUILD ON THE SOCIAL LAYER OF GAMES"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Players already spend time together on Zycord before, during, and after they play. Zycord is where the social layer of games lives today — and our developer platform lets you tap into that time to drive more players, more playtime, and richer community experiences."), /* @__PURE__ */ h("div", { style: { display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary", href: "/developers/applications" }, /* @__PURE__ */ h("span", null, "Open Developer Portal")), /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary", href: "#sdk-quickstart" }, /* @__PURE__ */ h("span", null, "Explore the Platform")))), /* @__PURE__ */ h("div", { className: "zy-scene-stage stage-blurple" }, /* @__PURE__ */ h(
      "img",
      {
        src: "/site/media/discord/dev-hero-16x9.webp",
        alt: "Zycord Developer Ecosystem — Chat, Playtime, Rich Presence & Apps",
        style: { width: "100%", height: "auto", borderRadius: "24px", display: "block" }
      }
    )))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "780px", margin: "0 auto 36px" } }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "REACH THE WORLD’S MOST ENGAGED GAMING AUDIENCE")), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card", style: { background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px" } }, /* @__PURE__ */ h("div", { className: "zy-display", style: { fontSize: "52px" } }, "90M+"), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "6px" } }, "Daily Active Players"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Reach players and communities who gather on Zycord every single day across desktop, web, and mobile.")), /* @__PURE__ */ h("article", { className: "zy-card", style: { background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px", position: "relative" } }, /* @__PURE__ */ h("img", { src: "/site/media/discord/nav-blog-cube.webp", alt: "", "aria-hidden": "true", style: { width: "68px", position: "absolute", top: "18px", right: "18px" } }), /* @__PURE__ */ h("div", { className: "zy-display", style: { fontSize: "52px" } }, "90%+"), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "6px" } }, "Play Video Games"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Meet players where they connect before, during, and after play with unified Rich Presence and party invites.")), /* @__PURE__ */ h("article", { className: "zy-card", style: { background: "linear-gradient(155deg, #2432a8 0%, #5865f2 100%)", padding: "32px 28px" } }, /* @__PURE__ */ h("div", { className: "zy-display", style: { fontSize: "52px" } }, "~40%"), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "6px" } }, "Start a Game Within an Hour"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Of watching someone stream that game in a voice channel on PC."))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "rich-presence", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "780px", margin: "0 auto 36px" } }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "HOW GAMES USE ZYCORD TO DRIVE GROWTH")), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-icon-1.png", alt: "", style: { width: "64px", height: "64px", objectFit: "contain" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "Connect your game to Zycord"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Social Layer integration links in-game accounts with Zycord accounts, so players stay connected beyond the session.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-icon-2.png", alt: "", style: { width: "64px", height: "64px", objectFit: "contain" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "Stay top of mind beyond gameplay"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Live Rich Presence, custom status badges, and Profile Widgets keep your game present in conversations on Zycord.")), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-icon-3.webp", alt: "", style: { width: "64px", height: "64px", objectFit: "contain" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "22px", marginTop: "8px" } }, "Turn social activity into outcomes"), /* @__PURE__ */ h("p", { className: "zy-body" }, "With your game connected to Zycord, you can drive longer playtime, reach new players, and launch embedded Activities."))))), /* @__PURE__ */ h("section", { className: "zy-section", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container" }, /* @__PURE__ */ h("div", { style: { textAlign: "center", maxWidth: "780px", margin: "0 auto 40px" } }, /* @__PURE__ */ h("span", { className: "zy-eyebrow" }, "Valuable Individually. Incredibly Powerful Together."), /* @__PURE__ */ h("h2", { className: "zy-heading", style: { marginTop: "14px" } }, "EXPLORE THE ZYCORD DEVELOPER SUITE")), /* @__PURE__ */ h("div", { className: "zy-grid-3" }, /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-portal-card.png", alt: "Developer Portal", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "DEVELOPER PORTAL"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Create applications, generate Bot tokens, configure OAuth2 redirect URIs, upload Rich Presence assets, and build Profile Widgets."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-primary zy-btn-sm", href: "/developers/applications" }, "Manage Applications →"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-docs-card.png", alt: "API Documentation", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "API & GATEWAY DOCS"), /* @__PURE__ */ h("p", { className: "zy-body" }, "100% compatible with Zycord REST API v9/v10 and WebSocket Gateway opcodes, intents, slash commands, and webhooks."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-secondary zy-btn-sm", href: "/_spacebar/api/openapi.json", target: "_blank", rel: "noopener" }, "OpenAPI JSON Spec ↗"))), /* @__PURE__ */ h("article", { className: "zy-card" }, /* @__PURE__ */ h("img", { src: "/site/media/discord/dev-help-card.png", alt: "Social SDK & Activities", style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" } }), /* @__PURE__ */ h("h3", { className: "zy-heading-sm", style: { fontSize: "24px", marginTop: "8px" } }, "SOCIAL SDK & ACTIVITIES"), /* @__PURE__ */ h("p", { className: "zy-body" }, "Embed multiplayer HTML5/WebGL games directly inside Zycord voice channels or sync unified friend lists and party invites."), /* @__PURE__ */ h("div", { style: { marginTop: "auto", paddingTop: "12px" } }, /* @__PURE__ */ h("a", { className: "zy-btn zy-btn-ghost zy-btn-sm", href: "/developers/applications" }, "Create an Activity →")))))), /* @__PURE__ */ h("section", { className: "zy-section", id: "sdk-quickstart", style: { paddingTop: "16px" } }, /* @__PURE__ */ h("div", { className: "zy-container", style: { position: "relative" } }, /* @__PURE__ */ h("div", { className: "zy-showcase-card", id: "commerce" }, /* @__PURE__ */ h("div", { className: "zy-showcase-grid" }, /* @__PURE__ */ h("div", { className: "zy-showcase-copy" }, /* @__PURE__ */ h("h2", { className: "zy-heading" }, "DROP-IN API & GATEWAY COMPATIBILITY"), /* @__PURE__ */ h("p", { className: "zy-body-lg" }, "Connect your automated bots, slash command services, or custom HTTP/WebSocket clients directly to Zycord's REST and Gateway endpoints."), /* @__PURE__ */ h("div", { className: "zy-tab-strip", "data-zy-tabs": "dev-code-panels" }, /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn is-active", "data-zy-tab": "bot", style: { display: "inline-flex", alignItems: "center", gap: "7px" } }, /* @__PURE__ */ h("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("rect", { x: "3", y: "11", width: "18", height: "10", rx: "2" }), /* @__PURE__ */ h("circle", { cx: "12", cy: "5", r: "2" }), /* @__PURE__ */ h("path", { d: "M12 7v4" }), /* @__PURE__ */ h("line", { x1: "8", y1: "16", x2: "8.01", y2: "16" }), /* @__PURE__ */ h("line", { x1: "16", y1: "16", x2: "16.01", y2: "16" })), /* @__PURE__ */ h("span", null, "Gateway Bot")), /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn", "data-zy-tab": "rest", style: { display: "inline-flex", alignItems: "center", gap: "7px" } }, /* @__PURE__ */ h("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), /* @__PURE__ */ h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })), /* @__PURE__ */ h("span", null, "REST v9 Message")), /* @__PURE__ */ h("button", { type: "button", className: "zy-tab-btn", "data-zy-tab": "oauth", style: { display: "inline-flex", alignItems: "center", gap: "7px" } }, /* @__PURE__ */ h("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }, /* @__PURE__ */ h("path", { d: "m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" })), /* @__PURE__ */ h("span", null, "OAuth2 Flow")))), /* @__PURE__ */ h("div", { className: "zy-app-window", id: "dev-code-panels" }, /* @__PURE__ */ h("div", { className: "zy-app-titlebar" }, /* @__PURE__ */ h("div", { className: "zy-window-dots" }, /* @__PURE__ */ h("span", { className: "zy-window-dot red" }), /* @__PURE__ */ h("span", { className: "zy-window-dot amber" }), /* @__PURE__ */ h("span", { className: "zy-window-dot green" })), /* @__PURE__ */ h("span", null, "zycord-sdk-quickstart.ts"), /* @__PURE__ */ h("span", { style: { color: "var(--color-spring-green)" } }, "v9 / v10 Ready")), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "bot",
        style: {
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Connect a Bot to the Zycord WebSocket Gateway
const ws = new WebSocket("wss://" + location.host + "/?v=9&encoding=json");

ws.onopen = () => {
  ws.send(JSON.stringify({
    op: 2, // IDENTIFY
    d: {
      token: "Bot YOUR_ZYCORD_BOT_TOKEN",
      intents: 513, // GUILDS | GUILD_MESSAGES
      properties: { $os: "linux", $browser: "zycord-bot", $device: "zycord-bot" }
    }
  }));
};`)
    ), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "rest",
        style: {
          display: "none",
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Send an Embed & ActionRow via Zycord REST API v9
await fetch("/api/v9/channels/CHANNEL_ID/messages", {
  method: "POST",
  headers: {
    "Authorization": "Bot YOUR_ZYCORD_BOT_TOKEN",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    content: "[READY] Tournament Match Lobby Open!",
    embeds: [{ title: "Squad Lobby #4", color: 0x5865f2 }]
  })
});`)
    ), /* @__PURE__ */ h(
      "pre",
      {
        "data-zy-panel": "oauth",
        style: {
          display: "none",
          margin: 0,
          padding: "20px",
          background: "#0d0f1d",
          color: "#d6deff",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          lineHeight: "1.6",
          overflowX: "auto"
        }
      },
      /* @__PURE__ */ h("code", null, `// Authorize Users or Install Bots via OAuth2
const authorizeUrl = new URL("/oauth2/authorize", location.origin);
authorizeUrl.searchParams.set("client_id", "YOUR_APP_CLIENT_ID");
authorizeUrl.searchParams.set("scope", "bot applications.commands identify");
authorizeUrl.searchParams.set("permissions", "8"); // Administrator`)
    )))))));
  }

  // assets/public/jsx/index.jsx
  var PAGE_COMPONENTS = {
    home: HomePage,
    download: DownloadPage,
    quests: QuestsPage,
    blog: BlogPage,
    developers: DevelopersHubPage,
    "application-directory": AppDirectoryPage,
    "gift-cards": GiftCardsPage,
    company: CompanyPage,
    branding: BrandingPage,
    newsroom: NewsroomPage,
    creators: CreatorsPage,
    community: CommunityPage,
    merch: MerchPage,
    feedback: FeedbackPage
  };
  function bindScrollNavbar() {
    const navbar = document.getElementById("zy-navbar");
    if (!navbar) return;
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function upgradeAuthLinks() {
    const authed = hasActiveSession();
    const appBtns = document.querySelectorAll("[data-zy-open-app]");
    for (let i = 0; i < appBtns.length; i++) {
      const btn = appBtns[i];
      btn.setAttribute("href", "/app");
      if (authed && btn.hasAttribute("data-zy-open-label-authed")) {
        const span = btn.querySelector("span") || btn;
        span.textContent = btn.getAttribute("data-zy-open-label-authed");
      }
    }
  }
  function hydrateLiveStatus() {
    fetch("/status/summary.json", { credentials: "same-origin" }).then((r) => {
      if (!r.ok) throw new Error("status unavailable");
      return r.json();
    }).then((data) => {
      const status = data && data.overallStatus || "operational";
      let label = "All Systems Operational";
      let color = "#57f287";
      if (status === "degraded") {
        label = "Partial Degradation";
        color = "#fda220";
      } else if (status === "outage") {
        label = "Service Disruption";
        color = "#de2761";
      }
      const labels = document.querySelectorAll("[data-zy-status-label]");
      for (let i = 0; i < labels.length; i++) {
        labels[i].textContent = label;
      }
      const dots = document.querySelectorAll("[data-zy-status-dot]");
      for (let j = 0; j < dots.length; j++) {
        dots[j].style.background = color;
        dots[j].style.boxShadow = "0 0 10px " + color;
      }
    }).catch(() => {
    });
  }
  function bindAccordions() {
    const triggers = document.querySelectorAll("[data-zy-accordion-trigger]");
    for (let i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function() {
        const item = this.closest(".zy-accordion-item");
        if (!item) return;
        const isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        this.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      });
    }
  }
  function bindTabGroups() {
    const groups = document.querySelectorAll("[data-zy-tabs]");
    for (let i = 0; i < groups.length; i++) {
      ((group) => {
        const buttons = group.querySelectorAll("[data-zy-tab]");
        const targetContainerId = group.getAttribute("data-zy-tabs");
        const container = targetContainerId ? document.getElementById(targetContainerId) : group.parentElement;
        if (!container) return;
        for (let b = 0; b < buttons.length; b++) {
          buttons[b].addEventListener("click", function() {
            const tabName = this.getAttribute("data-zy-tab");
            for (let k = 0; k < buttons.length; k++) {
              buttons[k].classList.toggle("is-active", buttons[k] === this);
            }
            const panels = container.querySelectorAll("[data-zy-panel]");
            for (let p = 0; p < panels.length; p++) {
              const match = panels[p].getAttribute("data-zy-panel") === tabName;
              panels[p].style.display = match ? "" : "none";
            }
          });
        }
      })(groups[i]);
    }
  }
  function bindReactions() {
    const pills = document.querySelectorAll("[data-zy-reaction]");
    for (let i = 0; i < pills.length; i++) {
      pills[i].addEventListener("click", function() {
        const countNode = this.querySelector("[data-zy-reaction-count]");
        if (!countNode) return;
        const current = parseInt(countNode.textContent || "0", 10) || 0;
        const inactive = this.classList.contains("is-inactive");
        if (inactive) {
          this.classList.remove("is-inactive");
          countNode.textContent = String(current + 1);
        } else {
          this.classList.add("is-inactive");
          countNode.textContent = String(Math.max(1, current - 1));
        }
      });
    }
  }
  function bindScrollParallax() {
    const items = document.querySelectorAll("[data-zy-parallax]");
    if (!items.length) return;
    let ticking = false;
    const updateParallax = () => {
      ticking = false;
      const vh = window.innerHeight || 900;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const speed = parseFloat(el.getAttribute("data-zy-parallax") || "0.18");
        const maxRot = parseFloat(el.getAttribute("data-zy-parallax-rotate") || "0");
        const parent = el.parentElement || el;
        const rect = parent.getBoundingClientRect();
        const centerDelta = vh * 0.5 - (rect.top + rect.height * 0.5);
        const clamped = Math.max(-650, Math.min(650, centerDelta));
        const translateY = clamped * speed;
        const rotateDeg = clamped / 500 * maxRot;
        el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) rotate(${rotateDeg.toFixed(2)}deg)`;
      }
    };
    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    updateParallax();
  }
  function bindActionDropdowns() {
    const toggles = document.querySelectorAll("[data-zy-dropdown-toggle]");
    if (!toggles.length) return;
    const closeAll = (except) => {
      const openMenus = document.querySelectorAll(".zy-action-dropdown.is-open");
      for (let i = 0; i < openMenus.length; i++) {
        if (openMenus[i] !== except) {
          openMenus[i].classList.remove("is-open");
        }
      }
    };
    for (let i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const wrap = this.closest(".zy-action-dropdown");
        if (!wrap) return;
        const willOpen = !wrap.classList.contains("is-open");
        closeAll(wrap);
        wrap.classList.toggle("is-open", willOpen);
      });
    }
    document.addEventListener("click", (e) => {
      if (!e.target || !e.target.closest || !e.target.closest(".zy-action-dropdown")) {
        closeAll(null);
      }
    });
  }
  function bindCarousels() {
    const wraps = document.querySelectorAll("[data-zy-carousel]");
    for (let i = 0; i < wraps.length; i++) {
      ((wrap) => {
        const track = wrap.querySelector("[data-zy-carousel-track]");
        const prevBtn = wrap.querySelector("[data-zy-carousel-prev]");
        const nextBtn = wrap.querySelector("[data-zy-carousel-next]");
        if (!track) return;
        const getStep = () => Math.max(280, Math.round(track.clientWidth * 0.65));
        if (prevBtn) {
          prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            track.scrollBy({ left: -getStep(), behavior: "smooth" });
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            track.scrollBy({ left: getStep(), behavior: "smooth" });
          });
        }
      })(wraps[i]);
    }
  }
  function bindJobFilters() {
    const items = document.querySelectorAll("[data-zy-job-filter]");
    if (!items.length) return;
    const labelEl = document.querySelector("[data-zy-job-filter-label]");
    const cards = document.querySelectorAll("[data-zy-job-dept]");
    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function(e) {
        e.preventDefault();
        const dept = this.getAttribute("data-zy-job-filter") || "all";
        const text = this.textContent || "Featured";
        if (labelEl) labelEl.textContent = text;
        for (let k = 0; k < items.length; k++) {
          items[k].classList.toggle("is-active", items[k] === this);
        }
        for (let c = 0; c < cards.length; c++) {
          const cardDept = cards[c].getAttribute("data-zy-job-dept") || "";
          const show = dept === "all" || cardDept.toLowerCase() === dept.toLowerCase();
          cards[c].style.display = show ? "" : "none";
        }
        const dd = this.closest(".zy-action-dropdown");
        if (dd) dd.classList.remove("is-open");
      });
    }
  }
  function initSiteJSX() {
    const navMount = document.querySelector("[data-zy-navbar]");
    if (navMount) {
      replaceJSX(navMount, /* @__PURE__ */ h(ZycordNavbar, null));
      bindScrollNavbar();
    }
    const pageMount = document.querySelector("[data-zy-jsx-page]");
    if (pageMount) {
      const pageName = pageMount.getAttribute("data-zy-jsx-page");
      const PageComp = PAGE_COMPONENTS[pageName];
      if (PageComp) {
        mountJSX(pageMount, /* @__PURE__ */ h(PageComp, null));
      }
    }
    const footerMount = document.querySelector("[data-zy-footer]");
    if (footerMount) {
      replaceJSX(footerMount, /* @__PURE__ */ h(ZycordFooter, null));
    }
    upgradeAuthLinks();
    hydrateLiveStatus();
    bindAccordions();
    bindTabGroups();
    bindReactions();
    bindScrollParallax();
    bindActionDropdowns();
    bindCarousels();
    bindJobFilters();
    const savedLang = getSavedLanguage();
    applySiteLanguage(savedLang.code, savedLang.label);
  }
  window.ZycordSite = {
    NAVIGATION_ITEMS,
    FOOTER_COLUMNS,
    hasActiveSession,
    PAGE_COMPONENTS,
    applySiteLanguage,
    getSavedLanguage
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteJSX);
  } else {
    initSiteJSX();
  }
})();
