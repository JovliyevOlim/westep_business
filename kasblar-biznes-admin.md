# Kasblar — Biznes Admin Ishlari (Phase 2)

> **Maqsad:** Kasblar katalogini biznes admin/super admin tomonidan CMS uslubida boshqarish — yangi kasb yaratish, tarjima qo'shish, kurslarni biriktirish, tartib o'zgartirish.
>
> **Hozirgi holat:** ✅ MVP read API tayyor (`/api/professions/*` public). ❌ Admin write API hali yo'q. ❌ Admin UI hali yo'q.
> **Permission:** `PROFESSION_MANAGE` — allaqachon `enums/Permissions.java`'ga qo'shilgan va `SUPER_ADMIN` rolida bor (`RolePermissionMatrix.java`).

---

## 1. Vazifa scope

Ikki bosqich:

### Bosqich A — Backend admin API
6 ta yangi endpoint `/api/admin/professions/*` ostida. JWT + `PROFESSION_MANAGE` permission.

### Bosqich B — Admin panel UI
Mavjud admin panelda (yoki yangisida) "Kasblar" sahifasi: CRUD jadval, tarjima formasi, kurs biriktirish, drag-and-drop reorder.

---

## 2. Backend — admin endpointlari

### 2.1 Routing

Yangi controller: `AdminProfessionController` (yoki mavjud `ProfessionController` ichida `/admin` sub-yo'l).

```
POST   /api/admin/professions                       — yangi kasb yaratish
PUT    /api/admin/professions/{id}                  — update (asosiy maydonlar)
DELETE /api/admin/professions/{id}                  — soft delete (is_active=false)
POST   /api/admin/professions/{id}/translations     — yangi til tarjimasini qo'shish/yangilash
POST   /api/admin/professions/{id}/courses          — kurslarni biriktirish/uzish
PUT    /api/admin/professions/{id}/order            — display_order o'zgartirish
```

Hammasi: `@PreAuthorize("hasAuthority('PROFESSION_MANAGE')")`.

### 2.2 Request DTO'lar

```java
// POST /api/admin/professions
public record ProfessionCreateRequest(
    @NotBlank @Size(max = 64) String slug,
    @NotBlank @Size(max = 8) String emoji,
    @NotBlank @Size(max = 32) String fieldKey,
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6,8}$") String gradFrom,
    @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6,8}$") String gradTo,
    @NotNull DemandTone demandTone,
    @NotNull Integer displayOrder,
    @Valid @NotNull ProfessionTranslationPayload uz, // uz majburiy
    @Valid List<ProfessionTranslationPayload> additional // ru, en — ixtiyoriy
) {}

public record ProfessionTranslationPayload(
    @NotBlank @Size(max = 2) String languageCode,
    @NotBlank @Size(max = 64) String title,
    @NotBlank @Size(max = 128) String tagline,
    @NotBlank String description,
    @NotBlank @Size(max = 32) String demandLabel,
    @NotBlank @Size(max = 32) String durationLabel,
    @NotBlank @Size(max = 64) String levelLabel,
    @NotNull List<String> skills,
    @NotNull List<String> roles
) {}

// POST /{id}/courses
public record ProfessionCoursesAttachRequest(
    @NotNull List<UUID> courseIds // null elementsiz, takror element olib tashlanadi
) {}

// PUT /{id}/order
public record ProfessionReorderRequest(@NotNull Integer displayOrder) {}
```

### 2.3 Validatsiya qoidalari

| Qoida | Joy |
|---|---|
| `slug` unique (deleted=false ichida) | `ProfessionRepository.existsBySlugAndDeletedFalse` allaqachon bor |
| `slug` kebab-case, ASCII transliteratsiya | Service'da `Slugify` helper qo'shish |
| `gradFrom`/`gradTo` hex format | DTO `@Pattern` |
| `uz` tarjima har doim majburiy (spec 4.1) | Service'da `if uz == null throw ValidationException` |
| `languageCode` faqat `uz | ru | en` | Enum yaratish (`SupportedLanguage`) yoki whitelist |
| Bog'lash uchun `Course` mavjud va `deleted=false` | `CourseRepository.existsById...` |

### 2.4 Soft delete xulqi

- `DELETE` faqat `active=false`/`deleted=true` qiladi, jadvalni o'chirmaydi
- Tarjima va kurs biriktirilishlari ham soft delete (cascade emas, alohida)
- Public read'da allaqachon `WHERE deleted=false AND active=true` bor — avtomatik yashiriniladi

### 2.5 Cache invalidation

Har bir yozish endpoint'i tegishli cache'larni tozalashi shart:

```java
@CacheEvict(cacheNames = {
    CacheConfig.PROFESSION_FIELDS_CACHE,
    CacheConfig.PROFESSION_LIST_CACHE,
    CacheConfig.PROFESSION_DETAIL_CACHE
}, allEntries = true)
```

Alohida `@CacheEvict` har bir method'da yoki bitta umumiy invalidator service.

### 2.6 Audit log

`createdBy`/`updatedBy` allaqachon `AbsEntity`'da bor — Spring Data Auditing orqali avtomatik to'ldiriladi. Qo'shimcha audit jadvaliga (kim, qachon, qaysi maydon o'zgardi) — agar kerak bo'lsa keyingi iteratsiya.

### 2.7 Test minimum

- 1 ta integratsiya test: create → list → detail → update → delete
- Permission test: PROFESSION_MANAGE'siz user 403 oladi
- Tarjima fallback: faqat `uz` bilan create → `?lang=en` so'rasa `uz` keladi

---

## 3. Backend — soha (fields) admin

Hozircha 5 ta soha hardcode seed'da. Agar admin yangi soha qo'shsa bo'lsin:

```
POST   /api/admin/professions/fields
PUT    /api/admin/professions/fields/{key}
DELETE /api/admin/professions/fields/{key}        — faqat hech bir kasb shu sohada bo'lmasa
POST   /api/admin/professions/fields/{key}/translations
```

MVP'da bu shart emas — yangi soha kerak bo'lsa `ProfessionDataInitializer`'ga qo'shib qayta deploy qilish ham yetadi.

---

## 4. Admin UI

### 4.1 Sahifa: "Kasblar" jadvali

| Ustun | Manba |
|---|---|
| Emoji | `emoji` |
| Title (uz) | `title` |
| Soha | `fieldLabel` |
| Demand | rangli chip (`demandTone`) |
| Kurslar | `courseCount` |
| Tartib | `displayOrder` + drag handle |
| Action | Edit, Translate, Manage Courses, Delete |

Filter: soha bo'yicha. Qidiruv: title/slug bo'yicha.

### 4.2 Forma: "Yangi kasb / Tahrirlash"

Tab'lar:
1. **Asosiy** — slug (avto, lekin tahrirlanadi), emoji, soha (dropdown), gradient (color picker x2), demandTone (radio), displayOrder
2. **uz tarjimasi** — title, tagline, description (markdown editor), demand/duration/level label, skills (chip input), roles (chip input)
3. **ru tarjimasi** (optional) — xuddi shu maydonlar, tab title'i tarjima holatini ko'rsatadi (`✓ to'liq` yoki `boʻsh`)
4. **en tarjimasi** (optional)
5. **Kurslar** — multi-select autocomplete (`Course` ro'yxati), drag-to-reorder

Submit:
- Yangi: `POST /api/admin/professions` (asosiy + uz majburiy, qolgan tab'lar bo'sh bo'lsa yuborilmaydi)
- Tahrirlash: `PUT /api/admin/professions/{id}` asosiy, har bir til uchun alohida `POST /{id}/translations`, kurslar uchun `POST /{id}/courses`

### 4.3 Drag-and-drop reorder

Jadval qatorlarini sudrash → `PUT /{id}/order` har bir o'zgargan qator uchun (yoki batch endpoint qo'shsa bo'ladi).

### 4.4 Delete confirmation

"Bu kasbni yashirasizmi? Foydalanuvchilarga ko'rinmaydi, lekin saqlanadi." → soft delete.

### 4.5 Permission gate

UI'da menyu element'i va sahifa faqat `PROFESSION_MANAGE` permission'i bor user'ga ko'rinadi. Hozircha bu `SUPER_ADMIN`'da bor — boshqa rollarga (masalan `CONTENT_EDITOR`) kerak bo'lsa `RolePermissionMatrix.java` orqali qo'shiladi.

---

## 5. Biznes admin (Westep Admin) operatsion ishlari

Backend va UI tayyor bo'lgach, biznes admin tomonidan amalda qilinishi kerak ishlar:

### 5.1 Birinchi sozlash

- [ ] Mavjud 6 ta seed kasbni ko'rib chiqish: matn, gradient, demand to'g'rimi?
- [ ] Har bir kasbga yetaklovchi 2–5 ta kursni biriktirish (`Course` katalogidan)
- [ ] Kurslarning `emoji` va `grad_from`/`grad_to` maydonlari to'ldirilgan bo'lsin (yo'q bo'lsa default'ga tushadi, lekin kontent yaxshi ko'rinishi uchun to'ldirish tavsiya etiladi)

### 5.2 Tarjimalar

- [ ] `ru` tarjimalarini har bir kasb uchun qo'shish (lokalizatsiya jamoasi)
- [ ] `en` tarjimalarini qo'shish (xalqaro auditoriya rejasida bo'lsa)
- [ ] Soha (`field`) tarjimalari: `IT → IT`, `Biznes → Бизнес/Business`, va h.k.

### 5.3 Yangi kasblar qo'shish

Kasblar katalogini kengaytirish — masalan:
- O'qituvchi, jurnalist, fotograf, oshpaz, logist, ...
- Har biri uchun: emoji, soha, gradient, demand, uz/ru tarjima, 2–5 ta kurs

### 5.4 Davriy yangilash

- Demand level'larni har 3–6 oyda qayta baholash (bozor o'zgarishi bilan)
- Yangi yetaklovchi kurslar paydo bo'lsa biriktirish
- Display order'ni eng mashhur/yangi kasblar yuqorida bo'lishi uchun sozlash

---

## 6. Vaqt baholash

| Ish | Taxminiy vaqt |
|---|---|
| Backend admin endpoint'lari (6 ta) + validatsiya + cache evict | 1–1.5 kun |
| Backend integratsiya testlari | 4 soat |
| Admin UI jadvali + forma | 1.5–2 kun |
| Drag-and-drop reorder + kurs biriktirish UI | 0.5 kun |
| Tarjima tab'lari + chip input'lar | 0.5 kun |
| Biznes admin: birinchi kontent to'ldirish (6 kasbga kurs + ru tarjima) | 0.5–1 kun (kontent jamoasi) |

**Jami:** ~4–5 kun development + 1 kun kontent.

---

## 7. Acceptance criteria

### Backend
- [ ] 6 ta admin endpoint ishlaydi, JWT + `PROFESSION_MANAGE` permission'siz 403
- [ ] Validatsiya: slug unique, hex format, uz majburiy, supported language
- [ ] Soft delete: `DELETE` keyin public list'da ko'rinmaydi
- [ ] Cache: yozishdan keyin keyingi GET fresh data qaytaradi (manual test)
- [ ] Integratsiya test: full CRUD lifecycle

### UI
- [ ] Kasblar jadvali, filter, qidiruv
- [ ] Create/Edit forma 3 ta til tab bilan
- [ ] Kurs biriktirish autocomplete + reorder
- [ ] Drag-and-drop display order
- [ ] Soft delete confirmation modal
- [ ] Permission gate (faqat ruxsati bor user'ga ko'rinadi)

### Kontent (biznes admin)
- [ ] 6 ta seed kasbga kurslar biriktirildi
- [ ] `ru` tarjima har bir kasb uchun tayyor
- [ ] Soha tarjimalari `ru` da to'ldirildi
- [ ] Mobil ilovada barcha til'larda real kontent ko'rinadi (mock yo'q)

---

## 8. Eslatmalar

- **Slug o'zgartirish:** mavjud kasb slug'i o'zgarsa, mobil ilova URL'lari (deep link) buziladi. Slug — immutable bo'lishi tavsiya etiladi, faqat title o'zgarishi mumkin.
- **Soha (`field`) o'zgartirish:** dropdown'dagi mavjud sohalar (`profession_fields` jadvalida) ichidan tanlash. Yangi soha qo'shish — alohida ish (3-bo'limga qarang).
- **Kurslar bo'g'liqligi:** `Course` soft delete bo'lsa, `profession_courses` junction ham public list'da ko'rinmaydi (service'da `course.deleted=false` filter bor).
- **Audit:** kim qachon o'zgartirgani `createdBy`/`updatedBy`'da. To'liq audit log kerak bo'lsa alohida jadval (`profession_audit`) yaratish.
