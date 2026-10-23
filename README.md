# ورقة — نشر مجاني على Cloudflare Pages

موقع ثابت لمعالجة الملفات محليًا في المتصفح. لا يحتاج تثبيت حزم أو قاعدة بيانات.

## النشر

1. افتح Cloudflare Dashboard ثم Workers & Pages ثم Create application ثم Pages ثم Import an existing Git repository (قد تختلف أسماء الأزرار).
2. اربط GitHub واختر المستودع `mazooniosman299-blip/waraqa` فقط.
3. اختر الفرع `main` وFramework preset: `None`.
4. Build command: `node scripts/build.mjs`
5. Build output directory: `dist`
6. اترك Root directory فارغًا ثم اضغط Save and Deploy.

يحدّث البناء روابط canonical وخريطة الموقع وrobots.txt إلى عنوان المشروع المستقر على pages.dev. لا تضف تحويلًا عامًا إلى index.html: الصفحات ملفات HTML مستقلة.
عند ربط نطاق خاص لاحقًا، اضبط متغير `SITE_URL` على عنوانه الكامل مع https ثم أعد النشر.

## Google

كود AdSense ومعرّف `ca-pub-5086201923236113` وads.txt موجودة في المصدر.
بعد النشر جرّب إضافة العنوان الفعلي إلى AdSense. لا يوجد ضمان لقبول عنوان الاستضافة أو قبول الموقع أو بدء الأرباح.
اربط العنوان الجديد في Search Console وأرسل `/sitemap.xml`. ملف التحقق المنقول لا يغني عن التحقق من الملكية للعنوان الجديد.
المشروع لا يتضمن منصة CMP؛ هيئ رسالة الموافقة المعتمدة من Google في حسابك حيث تلزم قبل عرض الإعلانات للزوار المعنيين.

## تشغيل محلي

`python -m http.server 8000 --directory public`

لبناء نسخة محلية على عنوان تختاره: `SITE_URL=https://your-project.pages.dev node scripts/build.mjs`.

راجع README-AR.md لحدود أدوات التحويل. ملفات public الأصلية تحتفظ بعنوان Netlify السابق؛ نسخة dist الناتجة هي التي تحمل عنوان النشر الجديد.
