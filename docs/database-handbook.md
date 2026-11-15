# Zycord PostgreSQL Master Database Handbook
> **دليل الإدارة الشامل والتحكم المباشر في قاعدة بيانات Zycord**
> يغطي هذا المستند جميع العمليات الإدارية، التعديلات المعمارية، تعديل التواريخ والشارات، إدارة السيرفرات والأعضاء، وميزات المقتنيات والأمان.

---

## الفهرس
1. [الاتصال المباشر بقاعدة البيانات](#1-الاتصال-المباشر-بقاعدة-البيانات)
2. [معمارية التواريخ وهيكل الـ Snowflake في ديسكورد](#2-معمارية-التواريخ-وهيكل-الـ-snowflake-في-ديسكورد)
3. [إدارة الحسابات والبروفايل (Users)](#3-إدارة-الحسابات-والبروفايل-users)
   - [تعديل تواريخ الإنشاء والنيترو](#تعديل-تواريخ-الإنشاء-والنيترو)
   - [نظام شارات ديسكورد الرسمية (Public Flags)](#نظام-شارات-ديسكورد-الرسمية-public-flags)
   - [نظام الشارات المخصصة (Custom Badges)](#نظام-الشارات-المخصصة-custom-badges)
   - [ربط الحسابات الخارجية الموثقة (Connected Accounts)](#ربط-الحسابات-الخارجية-الموثقة-connected-accounts)
   - [إلغاء وتخطي التحقق الثنائي (MFA / 2FA / Passkeys)](#إلغاء-وتخطي-التحقق-الثنائي-mfa--2fa--passkeys)
   - [منح صلاحيات الآدمن المطلقة (Super Admin Rights)](#منح-صلاحيات-الآدمن-المطلقة-super-admin-rights)
4. [إدارة السيرفرات (Guilds)](#4-إدارة-السيرفرات-guilds)
   - [ترقية السيرفر إلى المستوى الأقصى (Level 3 Boost)](#ترقية-السيرفر-إلى-المستوى-الأقصى-level-3-boost)
   - [تعيين رابط دعوة مخصص (Vanity URL)](#تعيين-رابط-دعوة-مخصص-vanity-url)
   - [نقل ملكية أي سيرفر](#نقل-ملكية-أي-سيرفر)
5. [إدارة الأعضاء والرتب (Members & Roles)](#5-إدارة-الأعضاء-والرتب-members--roles)
   - [تاريخ الانضمام وبوست السيرفر](#تاريخ-الانضمام-وبوست-السيرفر)
   - [فك الميوت والتايم آوت الإداري](#فك-الميوت-والتايم-آوت-الإداري)
   - [صلاحيات الرتب المطلقة (Administrator)](#صلاحيات-الرتب-المطلقة-administrator)
6. [القنوات والصوتيات (Channels & Voice)](#6-القنوات-والصوتيات-channels--voice)
   - [رفع جودة الصوت إلى 384kbps Ultra Quality](#رفع-جودة-الصوت-إلى-384kbps-ultra-quality)
   - [إلغاء الـ Slowmode من جميع القنوات](#إلغاء-الـ-slowmode-من-جميع-القنوات)
7. [المتجر والمقتنيات وإطارات الأفاتار (Collectibles & Steam Frames)](#7-المتجر-والمقتنيات-وإطارات-الأفاتار-collectibles--steam-frames)
   - [منح عناصر ومقتنيات رسمية في الحساب](#منح-عناصر-ومقتنيات-رسمية-في-الحساب)
   - [تثبيت إطار الأفاتار أو تأثير البروفايل مباشرة](#تثبيت-إطار-الأفاتار-أو-تأثير-البروفايل-مباشرة)
8. [إدارة النظام والأمان الشامل (System & Security)](#8-إدارة-النظام-والأمان-الشامل-system--security)
   - [بث إعلانات النظام لجميع المستخدمين (System Announcements)](#بث-إعلانات-النظام-لجميع-المستخدمين-system-announcements)
   - [حظر المخربين وعناوين IP على مستوى المنصة (Instance Bans)](#حظر-المخربين-وعناوين-ip-على-مستوى-المنصة-instance-bans)
   - [تنظيف ومسح الرسائل (Message Purge)](#تنظيف-ومسح-الرسائل-message-purge)
9. [الأمر الشامل لضبط حساب المطور بضغطة زر](#9-الأمر-الشامل-لضبط-حساب-المطور-بضغطة-زر)

---

## 1. الاتصال المباشر بقاعدة البيانات

قاعدة البيانات تعمل داخل حاوية Docker باسم `zycord-postgres-1` (قاعدة بيانات `zycord` ومستخدم `zycord`).

### فتح جلسة تفاعلية (Interactive Terminal):
```bash
docker compose exec -it postgres psql -U zycord -d zycord
```
*(للخروج اكتب `\q` واضغط Enter).*

### تنفيذ استعلام مباشر دون فتح الجلسة:
```bash
docker compose exec -T postgres psql -U zycord -d zycord -c "SELECT count(*) FROM users;"
```

---

## 2. معمارية التواريخ وهيكل الـ Snowflake في ديسكورد

في نظام Discord و Zycord، يتم التعامل مع التواريخ بثلاث طرق مختلفة:

1. **تاريخ إنشاء الحساب (Account Created Date):**
   - المعرفات (User IDs / Guild IDs / Message IDs) هي أرقام 64-بت تُعرف بـ **Twitter/Discord Snowflake**.
   - أول 42-بت من المعرف تمثل الوقت بالمللي ثانية منذ Discord Epoch (`2015-01-01T00:00:00.000Z` أو `1420070400000`).
   - يقوم تطبيق الويب بحساب تاريخ الإنشاء تلقائياً عبر:
     $$\text{Timestamp} = (\text{Snowflake} \gg 22) + 1420070400000$$
   - في عمود `created_at` في جدول `users` يتم تخزين تاريخ الإنشاء بصيغة `TIMESTAMP`.
   - كما يحتوي المشروع على باتش العميل `assets/client_patches/41-snowflake-timestamp.js` للتحكم الدقيق في تواريخ المعرفات على واجهة العميل.

2. **تاريخ الانضمام للسيرفر (Server Member Since):**
   - يُخزن مباشرة كقيمة زمنية في جدول `members` في عمود `joined_at` (`TIMESTAMP`).

3. **تاريخ النيترو وبوست السيرفر (Nitro & Boosting Since):**
   - في جدول `users`: عمود `premium_since` (`TIMESTAMP`).
   - في جدول `members`: عمود `premium_since` (`BIGINT` بالمللي ثانية، مثل `1577836800000`).

---

## 3. إدارة الحسابات والبروفايل (Users)

### تعديل تواريخ الإنشاء والنيترو
لجعل الحساب قديماً من عام 2016 مع نيترو كامل نشط منذ 2018:
```sql
UPDATE users 
SET created_at = '2016-01-01 12:00:00',
    premium_since = '2018-05-20 00:00:00',
    premium = true,
    premium_type = 2,     -- 2 = Nitro كامل (Boosts + All Perks)
    verified = true,       -- تفعيل علامة التحقق والبريد
    disabled = false,
    deleted = false
WHERE username = 'kyze';
```

### نظام شارات ديسكورد الرسمية (Public Flags)
يتم حساب شارات البروفايل عبر نظام الـ Bitwise Flag في عمودي `flags` و `public_flags`:

| الشارة | القيمة الرقمية (Bit Flag) | الوصف |
| :--- | :--- | :--- |
| **Discord Employee (Staff)** | `1` (1 << 0) | موظف ديسكورد الرسمي |
| **Partnered Server Owner** | `2` (1 << 1) | مالك سيرفر شريك معتمد |
| **HypeSquad Events** | `4` (1 << 2) | منسق فعاليات هايب سكواد |
| **Bug Hunter Level 1** | `8` (1 << 3) | صياد ثغرات برونزي |
| **House Bravery** | `64` (1 << 6) | هايب سكواد الشجاعة (البنفسجي) |
| **House Brilliance** | `128` (1 << 7) | هايب سكواد البراعة (الوردي) |
| **House Balance** | `256` (1 << 8) | هايب سكواد التوازن (الأخضر) |
| **Early Supporter** | `512` (1 << 9) | الداعم المبكر الأصلي (شارة النيترو القديم) |
| **Bug Hunter Level 2** | `16384` (1 << 14) | صياد ثغرات ذهبي |
| **Early Verified Bot Developer** | `131072` (1 << 17) | مطور بوتات موثق مبكر |
| **Certified Moderator** | `262144` (1 << 18) | مشرف مجتمعات معتمد من ديسكورد |
| **Active Developer** | `4194304` (1 << 22) | مطور نشط |

#### أمثلة تطبيق الشارات:
```sql
-- منح شارة الداعم المبكر (Early Supporter):
UPDATE users SET public_flags = 512, flags = 512 WHERE username = 'kyze';

-- دمج شارات متعددة (Early Supporter + Bravery + Bug Hunter = 584):
UPDATE users SET public_flags = 584, flags = 584 WHERE username = 'kyze';

-- منح باقة الشارات النادرة دفعة واحدة:
UPDATE users 
SET public_flags = (512 | 131072 | 262144 | 16384 | 4),
    flags = (512 | 131072 | 262144 | 16384 | 4)
WHERE username = 'kyze';
```

### نظام الشارات المخصصة (Custom Badges)
يدعم Zycord جدول `badges` لإضافة شارات حصرية خاصة بسيرفرك أو شبكتك مع أيقونة ورابط مخصص:
```sql
-- 1. إنشاء الشارة في النظام
INSERT INTO badges (id, description, icon, link)
VALUES ('dev_badge', 'Zycord Core Lead Architect', 'https://cdn.zyron.site/badge-icons/badge.png', 'https://zyron.site')
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;

-- 2. ربط الشارة بحساب المستخدم
UPDATE users 
SET badge_ids = ARRAY[1] 
WHERE username = 'kyze';
```

### ربط الحسابات الخارجية الموثقة (Connected Accounts)
تستطيع ربط أي منصة (Steam, GitHub, YouTube, Twitter, Spotify, Battle.net) وجعلها موثقة فوراً:
```sql
-- ربط حساب Steam موثق
INSERT INTO connected_accounts (id, user_id, type, name, verified, friend_sync, show_activity, visibility)
VALUES ('76561198000000000', (SELECT id FROM users WHERE username = 'kyze'), 'steam', 'KyzeOfficial', true, true, true, 1)
ON CONFLICT (id, user_id) DO UPDATE SET verified = true;

-- ربط حساب GitHub موثق
INSERT INTO connected_accounts (id, user_id, type, name, verified, friend_sync, show_activity, visibility)
VALUES ('github_kyze', (SELECT id FROM users WHERE username = 'kyze'), 'github', 'itsKyze', true, false, false, 1)
ON CONFLICT (id, user_id) DO UPDATE SET verified = true;
```

### إلغاء وتخطي التحقق الثنائي (MFA / 2FA / Passkeys)
في حال فقدان رمز Google Authenticator أو إقفال الحساب:
```sql
UPDATE users 
SET mfa_enabled = false, 
    totp_secret = NULL, 
    totp_last_ticket = NULL, 
    webauthn_enabled = false 
WHERE username = 'kyze';
```

### منح صلاحيات الآدمن المطلقة (Super Admin Rights)
قيمة الصلاحية القصوى التي تمنح وصول المشرف الكامل لكل إعدادات المنصة:
```sql
UPDATE users 
SET rights = 2251799813685247 
WHERE username = 'kyze';
```

---

## 4. إدارة السيرفرات (Guilds)

### ترقية السيرفر إلى المستوى الأقصى (Level 3 Boost)
لتفعيل جميع مزايا النيترو (أيقونة متحركة، بانر السيرفر، رتب بأيقونات، بث بدقة عالية):
```sql
UPDATE guilds 
SET premium_tier = 3,                       -- المستوى 3 الأقصى
    premium_subscription_count = 50,       -- 50 بوست
    max_video_channel_users = 100,         -- رفع حد كاميرات البث
    features = ARRAY[
        'COMMUNITY', 'VANITY_URL', 'BANNER', 'ANIMATED_ICON', 
        'INVITE_SPLASH', 'DISCOVERABLE', 'FEATURABLE', 
        'ROLE_ICONS', 'NEWS', 'PARTNERED', 'VERIFIED', 'VIP_REGIONS'
    ]
WHERE id = (SELECT guild_id FROM members WHERE id = (SELECT id FROM users WHERE username = 'kyze') LIMIT 1);
```

### تعيين رابط دعوة مخصص (Vanity URL)
تفعيل رابط مباشر مخصص للسيرفر:
```sql
UPDATE guilds 
SET vanity_url_code = 'kyze' 
WHERE name = 'اسم_السيرفر';
-- الرابط المباشر يصبح: app.zyron.site/invite/kyze
```

### نقل ملكية أي سيرفر
```sql
UPDATE guilds 
SET owner_id = (SELECT id FROM users WHERE username = 'kyze') 
WHERE id = 1571182826362007662;
```

---

## 5. إدارة الأعضاء والرتب (Members & Roles)

### تاريخ الانضمام وبوست السيرفر
```sql
UPDATE members 
SET joined_at = '2017-03-01 10:00:00',     -- انضم في 2017
    premium_since = 1577836800000          -- تاريخ بوست السيرفر
WHERE id = (SELECT id FROM users WHERE username = 'kyze');
```

### فك الميوت والتايم آوت الإداري
```sql
UPDATE members 
SET mute = false, 
    deaf = false, 
    communication_disabled_until = NULL 
WHERE id = (SELECT id FROM users WHERE username = 'kyze');
```

### صلاحيات الرتب المطلقة (Administrator)
صلاحية الـ Administrator الكاملة رقمها في ديسكورد هو `8`:
```sql
UPDATE roles 
SET permissions = '8' 
WHERE name = 'Admin';
```

---

## 6. القنوات والصوتيات (Channels & Voice)

### رفع جودة الصوت إلى 384kbps Ultra Quality
في ديسكورد الرسمي الحد الأقصى العادي هو 64kbps أو 96kbps. في Zycord تستطيع رفع الجودة إلى 384kbps لكافة الرومات الصوتية:
```sql
UPDATE channels 
SET bitrate = 384000 
WHERE type = 2; -- 2 تعني القنوات الصوتية (Voice)
```

### إلغاء الـ Slowmode من جميع القنوات
```sql
UPDATE channels 
SET rate_limit_per_user = 0 
WHERE rate_limit_per_user > 0;
```

---

## 7. المتجر والمقتنيات وإطارات الأفاتار (Collectibles & Steam Frames)

### منح عناصر ومقتنيات رسمية في الحساب
إدراج أي منتج أو إطار Steam في جدول مشتريات الحساب كملكية دائمة:
```sql
INSERT INTO collectible_purchases (user_id, sku_id, purchased_at)
VALUES 
    ((SELECT id FROM users WHERE username = 'kyze'), '1571178229987979265', NOW())
ON CONFLICT (user_id, sku_id) DO NOTHING;
```

### تثبيت إطار الأفاتار أو تأثير البروفايل مباشرة
```sql
UPDATE users 
SET avatar_decoration_data = jsonb_build_object(
    'asset', '1f1d53830d6e5e37cdc3edc57565dbbd',
    'sku_id', '1571178229987979265',
    'expires_at', null
) 
WHERE username = 'kyze';
```

---

## 8. إدارة النظام والأمان الشامل (System & Security)

### بث إعلانات النظام لجميع المستخدمين (System Announcements)
إرسال إشعار منبثق لجميع أعضاء المنصة:
```sql
INSERT INTO announcements (id, title, content, target, created_at)
VALUES ('1', 'Zycord Announcement', 'مرحباً بجميع الأعضاء! تم تحديث وتطوير المنصة بنجاح.', 'all', NOW())
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
```

### حظر المخربين وعناوين IP على مستوى المنصة (Instance Bans)
```sql
INSERT INTO instance_bans (id, ip, reason, user_id, offendor_id)
VALUES ('1', '192.168.1.50', 'Spam/Abuse', (SELECT id FROM users WHERE username = 'kyze'), '1570933566269845561');
```

### تنظيف ومسح الرسائل (Message Purge)
```sql
DELETE FROM messages 
WHERE author_id = 1570933566269845561;
```

---

## 9. الأمر الشامل لضبط حساب المطور بضغطة زر

لترقية وضبط حسابك بالكامل (تاريخ قديم + نيترو دائم + شارة Early Supporter + صلاحيات السوبر آدمن + توثيق الهاتف والبريد) في أمر طرفية واحد:

```bash
docker compose exec -T postgres psql -U zycord -d zycord -c "
UPDATE users 
SET 
    created_at = '2016-01-01 12:00:00',
    premium = true,
    premium_type = 2,
    premium_since = '2018-01-01 00:00:00',
    public_flags = 512,
    flags = 512,
    rights = 2251799813685247,
    verified = true,
    phone = '+2130549762873'
WHERE username = 'kyze';

UPDATE members 
SET 
    joined_at = '2017-01-01 12:00:00',
    premium_since = 1546300800000
WHERE id = (SELECT id FROM users WHERE username = 'kyze');
"
```
