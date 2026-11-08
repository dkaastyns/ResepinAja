-- ============================================================
-- ResepinAja - Full Database Setup (Schema + Seed)
-- Jalankan script ini langsung di Supabase SQL Editor
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Pengguna ResepinAja',
  email       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
);

-- 3. TABLE: recipes
CREATE TABLE IF NOT EXISTS public.recipes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  image            TEXT,
  category         TEXT NOT NULL DEFAULT 'Makanan Utama',
  ingredients      JSONB NOT NULL DEFAULT '[]',
  instructions     JSONB NOT NULL DEFAULT '[]',
  preparation_time INTEGER NOT NULL DEFAULT 0,
  cooking_time     INTEGER NOT NULL DEFAULT 0,
  servings         INTEGER NOT NULL DEFAULT 1,
  difficulty       TEXT NOT NULL DEFAULT 'mudah' CHECK (difficulty IN ('mudah', 'sedang', 'sulit')),
  is_public        BOOLEAN NOT NULL DEFAULT TRUE,
  is_sample        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recipes_category_idx    ON public.recipes (category);
CREATE INDEX IF NOT EXISTS recipes_difficulty_idx  ON public.recipes (difficulty);
CREATE INDEX IF NOT EXISTS recipes_user_id_idx     ON public.recipes (user_id);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx  ON public.recipes (created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_is_public_idx   ON public.recipes (is_public);

-- 4. TABLE: favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_unique UNIQUE (user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx   ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites (recipe_id);

-- 5. TABLE: meal_plans
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  plan_date  DATE NOT NULL,
  meal_type  TEXT NOT NULL CHECK (meal_type IN ('sarapan', 'makan_siang', 'makan_malam', 'camilan')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT meal_plans_unique_slot UNIQUE (user_id, plan_date, meal_type)
);

CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx  ON public.meal_plans (user_id);
CREATE INDEX IF NOT EXISTS meal_plans_date_idx     ON public.meal_plans (plan_date);

-- 6. TABLE: shopping_list
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  quantity   TEXT NOT NULL DEFAULT '',
  unit       TEXT NOT NULL DEFAULT '',
  is_checked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shopping_list_user_id_idx ON public.shopping_list (user_id);

-- 7. FUNCTION & TRIGGERS: auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_recipes_updated_at ON public.recipes;
CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_meal_plans_updated_at ON public.meal_plans;
CREATE TRIGGER set_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_shopping_list_updated_at ON public.shopping_list;
CREATE TRIGGER set_shopping_list_updated_at
  BEFORE UPDATE ON public.shopping_list
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. TRIGGER: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna ResepinAja'),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

-- Policies: Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies: Recipes
DROP POLICY IF EXISTS "Anyone can view public recipes" ON public.recipes;
CREATE POLICY "Anyone can view public recipes" ON public.recipes FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recipes" ON public.recipes;
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id AND is_sample = FALSE);

DROP POLICY IF EXISTS "Users can delete own recipes" ON public.recipes;
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id AND is_sample = FALSE);

-- Policies: Favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Policies: Meal Plans
DROP POLICY IF EXISTS "Users can view own meal plans" ON public.meal_plans;
CREATE POLICY "Users can view own meal plans" ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own meal plans" ON public.meal_plans;
CREATE POLICY "Users can insert own meal plans" ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own meal plans" ON public.meal_plans;
CREATE POLICY "Users can update own meal plans" ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own meal plans" ON public.meal_plans;
CREATE POLICY "Users can delete own meal plans" ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);

-- Policies: Shopping List
DROP POLICY IF EXISTS "Users can view own shopping list" ON public.shopping_list;
CREATE POLICY "Users can view own shopping list" ON public.shopping_list FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into own shopping list" ON public.shopping_list;
CREATE POLICY "Users can insert into own shopping list" ON public.shopping_list FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own shopping list" ON public.shopping_list;
CREATE POLICY "Users can update own shopping list" ON public.shopping_list FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own shopping list" ON public.shopping_list;
CREATE POLICY "Users can delete from own shopping list" ON public.shopping_list FOR DELETE USING (auth.uid() = user_id);


-- 10. SEED DATA (12 Resep Awal)
INSERT INTO public.recipes (
  title, description, image, category, ingredients, instructions,
  preparation_time, cooking_time, servings, difficulty, is_public, is_sample, created_at
)
VALUES
(
  'Nasi Goreng Spesial',
  'Nasi goreng dengan cita rasa gurih dan pedas yang menggugah selera. Cocok untuk sarapan atau makan malam cepat.',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
  'Makanan Utama',
  '[
    {"name": "Nasi putih", "quantity": "2", "unit": "piring"},
    {"name": "Telur ayam", "quantity": "2", "unit": "butir"},
    {"name": "Bawang merah", "quantity": "4", "unit": "siung"},
    {"name": "Bawang putih", "quantity": "3", "unit": "siung"},
    {"name": "Cabai merah", "quantity": "2", "unit": "buah"},
    {"name": "Kecap manis", "quantity": "2", "unit": "sdm"},
    {"name": "Minyak goreng", "quantity": "3", "unit": "sdm"},
    {"name": "Garam", "quantity": "secukupnya", "unit": ""},
    {"name": "Merica", "quantity": "secukupnya", "unit": ""},
    {"name": "Daun bawang", "quantity": "2", "unit": "batang"}
  ]'::jsonb,
  '[
    "Haluskan bawang merah, bawang putih, dan cabai merah.",
    "Panaskan minyak goreng di wajan dengan api sedang.",
    "Tumis bumbu halus hingga harum dan matang.",
    "Masukkan telur dan orak-arik hingga setengah matang.",
    "Tambahkan nasi putih, aduk rata dengan bumbu.",
    "Tuangkan kecap manis, garam, dan merica. Aduk merata.",
    "Masak hingga nasi goreng matang dan sedikit kering.",
    "Sajikan dengan taburan daun bawang dan acar."
  ]'::jsonb,
  10, 15, 2, 'mudah', TRUE, TRUE, '2024-01-10T08:00:00Z'
),
(
  'Ayam Bakar Madu',
  'Ayam bakar dengan balutan madu yang manis dan saus kecap pedas yang harum. Tekstur luar crispy, dalam juicy.',
  'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80',
  'Makanan Utama',
  '[
    {"name": "Ayam", "quantity": "1", "unit": "ekor"},
    {"name": "Madu", "quantity": "3", "unit": "sdm"},
    {"name": "Kecap manis", "quantity": "4", "unit": "sdm"},
    {"name": "Bawang putih", "quantity": "5", "unit": "siung"},
    {"name": "Jahe", "quantity": "2", "unit": "cm"},
    {"name": "Kunyit", "quantity": "1", "unit": "cm"},
    {"name": "Serai", "quantity": "2", "unit": "batang"},
    {"name": "Air jeruk nipis", "quantity": "2", "unit": "sdm"},
    {"name": "Garam", "quantity": "1", "unit": "sdt"}
  ]'::jsonb,
  '[
    "Bersihkan ayam dan potong menjadi beberapa bagian.",
    "Haluskan bawang putih, jahe, dan kunyit.",
    "Campurkan bumbu halus dengan madu, kecap manis, air jeruk nipis, dan garam.",
    "Lumuri ayam dengan bumbu marinasi dan diamkan 1–2 jam.",
    "Bakar ayam di atas bara api atau oven 180°C.",
    "Sambil dibakar, olesi dengan sisa bumbu secara berkala.",
    "Bakar hingga matang dan berwarna cokelat keemasan.",
    "Sajikan dengan lalapan dan sambal."
  ]'::jsonb,
  20, 40, 4, 'sedang', TRUE, TRUE, '2024-01-12T09:00:00Z'
),
(
  'Soto Ayam Lamongan',
  'Soto ayam khas Lamongan dengan kuah kuning bening yang segar dan gurih. Disajikan dengan soun, telur rebus, dan koya.',
  'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
  'Sup & Soto',
  '[
    {"name": "Ayam kampung", "quantity": "1/2", "unit": "ekor"},
    {"name": "Bawang merah", "quantity": "8", "unit": "siung"},
    {"name": "Bawang putih", "quantity": "5", "unit": "siung"},
    {"name": "Jahe", "quantity": "3", "unit": "cm"},
    {"name": "Kunyit", "quantity": "2", "unit": "cm"},
    {"name": "Serai", "quantity": "2", "unit": "batang"},
    {"name": "Daun salam", "quantity": "3", "unit": "lembar"},
    {"name": "Daun jeruk", "quantity": "4", "unit": "lembar"},
    {"name": "Air", "quantity": "2", "unit": "liter"},
    {"name": "Garam", "quantity": "secukupnya", "unit": ""},
    {"name": "Merica", "quantity": "secukupnya", "unit": ""}
  ]'::jsonb,
  '[
    "Rebus ayam dengan air hingga empuk, angkat dan suwir-suwir dagingnya.",
    "Haluskan bawang merah, bawang putih, jahe, dan kunyit.",
    "Tumis bumbu halus dengan serai dan daun-daunan hingga harum.",
    "Masukkan tumisan bumbu ke dalam kaldu ayam.",
    "Tambahkan garam dan merica, masak dengan api kecil 20 menit.",
    "Siapkan mangkuk dengan soun, kubis, dan telur rebus.",
    "Tuangkan kuah panas dan tambahkan suwiran ayam.",
    "Sajikan dengan koya, sambal, dan emping."
  ]'::jsonb,
  30, 60, 6, 'sedang', TRUE, TRUE, '2024-01-15T10:00:00Z'
),
(
  'Mie Goreng Jawa',
  'Mie goreng khas Jawa dengan bumbu rempah yang kaya rasa, manis gurih, dan sedikit pedas.',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
  'Makanan Utama',
  '[
    {"name": "Mie telur", "quantity": "200", "unit": "gram"},
    {"name": "Telur ayam", "quantity": "2", "unit": "butir"},
    {"name": "Ayam suwir", "quantity": "100", "unit": "gram"},
    {"name": "Kubis", "quantity": "100", "unit": "gram"},
    {"name": "Tomat", "quantity": "1", "unit": "buah"},
    {"name": "Bawang merah", "quantity": "5", "unit": "siung"},
    {"name": "Bawang putih", "quantity": "3", "unit": "siung"},
    {"name": "Kecap manis", "quantity": "3", "unit": "sdm"},
    {"name": "Minyak goreng", "quantity": "3", "unit": "sdm"}
  ]'::jsonb,
  '[
    "Rebus mie telur hingga al dente, tiriskan.",
    "Haluskan bawang merah dan bawang putih.",
    "Panaskan minyak, tumis bumbu halus hingga harum.",
    "Masukkan telur, orak-arik sebentar.",
    "Tambahkan ayam suwir dan kubis, tumis sebentar.",
    "Masukkan mie, kecap manis, dan tomat.",
    "Aduk rata dan masak hingga matang.",
    "Sajikan dengan bawang goreng dan acar."
  ]'::jsonb,
  15, 20, 2, 'mudah', TRUE, TRUE, '2024-01-18T11:00:00Z'
),
(
  'Rendang Daging Sapi',
  'Rendang sapi asli Minang dengan bumbu rempah lengkap yang dimasak lama hingga kering dan meresap sempurna.',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
  'Makanan Utama',
  '[
    {"name": "Daging sapi", "quantity": "1", "unit": "kg"},
    {"name": "Santan kelapa", "quantity": "1", "unit": "liter"},
    {"name": "Serai", "quantity": "4", "unit": "batang"},
    {"name": "Daun jeruk", "quantity": "8", "unit": "lembar"},
    {"name": "Daun kunyit", "quantity": "2", "unit": "lembar"},
    {"name": "Cabai merah", "quantity": "15", "unit": "buah"},
    {"name": "Bawang merah", "quantity": "15", "unit": "siung"},
    {"name": "Bawang putih", "quantity": "8", "unit": "siung"},
    {"name": "Jahe", "quantity": "3", "unit": "cm"},
    {"name": "Lengkuas", "quantity": "3", "unit": "cm"}
  ]'::jsonb,
  '[
    "Potong daging sapi menjadi potongan sedang.",
    "Haluskan cabai, bawang merah, bawang putih, jahe, dan lengkuas.",
    "Masukkan daging, bumbu halus, serai, dan daun-daunan ke dalam wajan.",
    "Tuangkan santan dan masak dengan api sedang sambil diaduk.",
    "Setelah mendidih, kecilkan api dan masak terus.",
    "Aduk sesekali hingga santan menyusut dan berminyak.",
    "Lanjutkan memasak hingga rendang berwarna cokelat gelap.",
    "Sajikan dengan nasi hangat."
  ]'::jsonb,
  30, 180, 8, 'sulit', TRUE, TRUE, '2024-01-20T12:00:00Z'
),
(
  'Pisang Goreng Crispy',
  'Pisang goreng renyah dengan lapisan tepung yang tipis dan gurih. Camilan favorit semua usia.',
  'https://images.unsplash.com/photo-1587334206888-db4b82f54f09?w=800&q=80',
  'Camilan',
  '[
    {"name": "Pisang kepok", "quantity": "5", "unit": "buah"},
    {"name": "Tepung terigu", "quantity": "150", "unit": "gram"},
    {"name": "Tepung beras", "quantity": "50", "unit": "gram"},
    {"name": "Air", "quantity": "150", "unit": "ml"},
    {"name": "Gula pasir", "quantity": "1", "unit": "sdm"},
    {"name": "Garam", "quantity": "1/2", "unit": "sdt"},
    {"name": "Minyak goreng", "quantity": "secukupnya", "unit": ""}
  ]'::jsonb,
  '[
    "Kupas pisang dan belah menjadi 2 bagian memanjang.",
    "Campurkan tepung terigu, tepung beras, gula, garam, dan air.",
    "Aduk adonan hingga halus dan tidak bergerindil.",
    "Panaskan minyak dalam wajan dengan api sedang.",
    "Celupkan pisang ke dalam adonan tepung.",
    "Goreng pisang hingga kuning keemasan dan crispy.",
    "Angkat dan tiriskan di atas tisu dapur.",
    "Sajikan selagi hangat."
  ]'::jsonb,
  10, 15, 5, 'mudah', TRUE, TRUE, '2024-01-22T13:00:00Z'
),
(
  'Gado-Gado Jakarta',
  'Sayuran segar dan lontong dengan siraman bumbu kacang khas Jakarta yang kaya rasa dan creamy.',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'Vegetarian',
  '[
    {"name": "Tahu", "quantity": "2", "unit": "potong"},
    {"name": "Tempe", "quantity": "100", "unit": "gram"},
    {"name": "Bayam", "quantity": "100", "unit": "gram"},
    {"name": "Tauge", "quantity": "100", "unit": "gram"},
    {"name": "Kubis", "quantity": "100", "unit": "gram"},
    {"name": "Telur rebus", "quantity": "2", "unit": "butir"},
    {"name": "Kacang tanah", "quantity": "200", "unit": "gram"},
    {"name": "Cabai merah", "quantity": "5", "unit": "buah"},
    {"name": "Bawang putih", "quantity": "3", "unit": "siung"},
    {"name": "Kecap manis", "quantity": "2", "unit": "sdm"},
    {"name": "Air jeruk nipis", "quantity": "1", "unit": "sdm"}
  ]'::jsonb,
  '[
    "Rebus semua sayuran hingga matang, tiriskan.",
    "Goreng tahu dan tempe hingga kuning keemasan.",
    "Sangrai kacang tanah, lalu haluskan bersama cabai dan bawang putih.",
    "Tambahkan kecap manis, air jeruk nipis, garam, dan sedikit air panas.",
    "Aduk bumbu kacang hingga konsistensi yang diinginkan.",
    "Susun sayuran, tahu, tempe, dan telur di piring.",
    "Siram dengan bumbu kacang.",
    "Taburi bawang goreng dan emping."
  ]'::jsonb,
  20, 25, 4, 'sedang', TRUE, TRUE, '2024-01-25T14:00:00Z'
),
(
  'Bubur Ayam Jakarta',
  'Bubur ayam lembut dengan topping lengkap — ayam suwir, cakwe, kerupuk, dan kuah kaldu gurih.',
  'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
  'Sarapan',
  '[
    {"name": "Beras", "quantity": "200", "unit": "gram"},
    {"name": "Ayam", "quantity": "1/2", "unit": "ekor"},
    {"name": "Jahe", "quantity": "2", "unit": "cm"},
    {"name": "Bawang putih", "quantity": "4", "unit": "siung"},
    {"name": "Serai", "quantity": "1", "unit": "batang"},
    {"name": "Air", "quantity": "1.5", "unit": "liter"},
    {"name": "Garam", "quantity": "secukupnya", "unit": ""},
    {"name": "Merica", "quantity": "secukupnya", "unit": ""},
    {"name": "Minyak wijen", "quantity": "1", "unit": "sdt"}
  ]'::jsonb,
  '[
    "Rebus ayam dengan jahe dan serai hingga empuk.",
    "Angkat ayam, suwir daging ayam, simpan kaldu.",
    "Masak beras dengan kaldu ayam dan bawang putih halus.",
    "Aduk terus hingga beras hancur dan menjadi bubur.",
    "Tambahkan garam, merica, dan minyak wijen.",
    "Masak hingga bubur mencapai kekentalan yang diinginkan.",
    "Sajikan dengan ayam suwir, cakwe, daun bawang, dan bawang goreng."
  ]'::jsonb,
  15, 45, 4, 'mudah', TRUE, TRUE, '2024-01-28T07:00:00Z'
),
(
  'Es Teh Susu Boba',
  'Minuman es teh susu dengan boba kenyal yang manis. Menyegarkan dan cocok dinikmati kapan saja.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'Minuman',
  '[
    {"name": "Teh hitam", "quantity": "2", "unit": "kantong"},
    {"name": "Susu segar", "quantity": "200", "unit": "ml"},
    {"name": "Mutiara tapioka", "quantity": "100", "unit": "gram"},
    {"name": "Gula pasir", "quantity": "3", "unit": "sdm"},
    {"name": "Air panas", "quantity": "300", "unit": "ml"},
    {"name": "Es batu", "quantity": "secukupnya", "unit": ""}
  ]'::jsonb,
  '[
    "Rebus mutiara tapioka hingga mengembang dan kenyal, kurang lebih 15 menit.",
    "Rendam dalam air gula hangat, sisihkan.",
    "Seduh kantong teh dalam air panas 5 menit.",
    "Tambahkan gula ke dalam teh panas, aduk rata.",
    "Dinginkan teh di kulkas.",
    "Campurkan teh dingin dengan susu segar.",
    "Siapkan gelas dengan es batu dan boba.",
    "Tuangkan campuran teh susu dan nikmati."
  ]'::jsonb,
  10, 20, 2, 'mudah', TRUE, TRUE, '2024-02-01T15:00:00Z'
),
(
  'Klepon Pandan',
  'Kue tradisional berbentuk bulat dengan isian gula merah cair dan balutan kelapa parut. Manis dan legit.',
  'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
  'Dessert',
  '[
    {"name": "Tepung ketan", "quantity": "250", "unit": "gram"},
    {"name": "Air pandan", "quantity": "150", "unit": "ml"},
    {"name": "Gula merah", "quantity": "150", "unit": "gram"},
    {"name": "Kelapa parut", "quantity": "200", "unit": "gram"},
    {"name": "Garam", "quantity": "1/2", "unit": "sdt"}
  ]'::jsonb,
  '[
    "Campurkan tepung ketan dengan air pandan dan garam.",
    "Uleni hingga adonan kalis dan tidak lengket.",
    "Iris halus gula merah untuk isian.",
    "Ambil sejumput adonan, pipihkan, isi dengan gula merah.",
    "Bulatkan dan pastikan isian tertutup rapat.",
    "Rebus klepon dalam air mendidih hingga mengapung.",
    "Angkat dan gulingkan dalam kelapa parut yang sudah dikukus.",
    "Sajikan segera selagi hangat."
  ]'::jsonb,
  25, 20, 20, 'sedang', TRUE, TRUE, '2024-02-05T16:00:00Z'
),
(
  'Udang Saus Tiram',
  'Udang segar tumis dengan saus tiram yang gurih, manis, dan sedikit pedas. Siap saji dalam waktu singkat.',
  'https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=800&q=80',
  'Seafood',
  '[
    {"name": "Udang segar", "quantity": "500", "unit": "gram"},
    {"name": "Saus tiram", "quantity": "3", "unit": "sdm"},
    {"name": "Kecap manis", "quantity": "1", "unit": "sdm"},
    {"name": "Bawang putih", "quantity": "5", "unit": "siung"},
    {"name": "Jahe", "quantity": "2", "unit": "cm"},
    {"name": "Cabai merah", "quantity": "3", "unit": "buah"},
    {"name": "Minyak goreng", "quantity": "3", "unit": "sdm"},
    {"name": "Daun bawang", "quantity": "2", "unit": "batang"}
  ]'::jsonb,
  '[
    "Bersihkan udang, buang kulit dan usus.",
    "Iris bawang putih, jahe, dan cabai.",
    "Panaskan minyak, tumis bawang putih, jahe, dan cabai.",
    "Masukkan udang, tumis hingga berubah warna.",
    "Tambahkan saus tiram dan kecap manis.",
    "Aduk rata dan masak hingga udang matang.",
    "Tambahkan daun bawang, aduk sebentar.",
    "Sajikan segera dengan nasi putih."
  ]'::jsonb,
  10, 10, 3, 'mudah', TRUE, TRUE, '2024-02-08T17:00:00Z'
),
(
  'Roti Bakar Avocado',
  'Roti bakar dengan topping avocado lembut, telur mata sapi, dan taburan biji wijen. Sarapan modern yang sehat dan mengenyangkan.',
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800&q=80',
  'Sarapan',
  '[
    {"name": "Roti tawar", "quantity": "2", "unit": "lembar"},
    {"name": "Alpukat", "quantity": "1", "unit": "buah"},
    {"name": "Telur ayam", "quantity": "2", "unit": "butir"},
    {"name": "Lemon", "quantity": "1/2", "unit": "buah"},
    {"name": "Garam", "quantity": "secukupnya", "unit": ""},
    {"name": "Merica hitam", "quantity": "secukupnya", "unit": ""},
    {"name": "Biji wijen", "quantity": "1", "unit": "sdt"},
    {"name": "Minyak zaitun", "quantity": "1", "unit": "sdt"}
  ]'::jsonb,
  '[
    "Bakar roti tawar hingga keemasan.",
    "Ambil daging alpukat, haluskan dengan garpu.",
    "Tambahkan perasan lemon, garam, dan merica ke alpukat.",
    "Goreng telur mata sapi dengan sedikit minyak.",
    "Oleskan alpukat di atas roti bakar.",
    "Letakkan telur mata sapi di atas alpukat.",
    "Taburi dengan biji wijen dan merica hitam.",
    "Sajikan segera."
  ]'::jsonb,
  5, 10, 2, 'mudah', TRUE, TRUE, '2024-02-10T08:30:00Z'
);
