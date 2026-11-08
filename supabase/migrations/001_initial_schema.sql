-- ============================================================
-- ResepinAja - Database Migration
-- Supabase PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- TABLE: profiles
-- ============================================================
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

COMMENT ON TABLE public.profiles IS 'Profil pengguna ResepinAja';


-- ============================================================
-- TABLE: recipes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  image            TEXT,
  category         TEXT NOT NULL DEFAULT 'Makanan Utama',
  ingredients      JSONB NOT NULL DEFAULT '[]',
  instructions     JSONB NOT NULL DEFAULT '[]',
  preparation_time INTEGER NOT NULL DEFAULT 0,  -- in minutes
  cooking_time     INTEGER NOT NULL DEFAULT 0,  -- in minutes
  servings         INTEGER NOT NULL DEFAULT 1,
  difficulty       TEXT NOT NULL DEFAULT 'mudah'
                     CHECK (difficulty IN ('mudah', 'sedang', 'sulit')),
  is_public        BOOLEAN NOT NULL DEFAULT TRUE,
  is_sample        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.recipes     IS 'Koleksi resep masakan';
COMMENT ON COLUMN public.recipes.ingredients  IS 'Array of {name, quantity, unit}';
COMMENT ON COLUMN public.recipes.instructions IS 'Array of string steps';
COMMENT ON COLUMN public.recipes.is_sample    IS 'TRUE = resep bawaan sistem';

CREATE INDEX IF NOT EXISTS recipes_category_idx    ON public.recipes (category);
CREATE INDEX IF NOT EXISTS recipes_difficulty_idx  ON public.recipes (difficulty);
CREATE INDEX IF NOT EXISTS recipes_user_id_idx     ON public.recipes (user_id);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx  ON public.recipes (created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_is_public_idx   ON public.recipes (is_public);
CREATE INDEX IF NOT EXISTS recipes_title_search_idx
  ON public.recipes USING gin(to_tsvector('indonesian', title));


-- ============================================================
-- TABLE: favorites
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT favorites_unique UNIQUE (user_id, recipe_id)
);

COMMENT ON TABLE public.favorites IS 'Resep favorit per pengguna';

CREATE INDEX IF NOT EXISTS favorites_user_id_idx   ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON public.favorites (recipe_id);


-- ============================================================
-- TABLE: meal_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  plan_date  DATE NOT NULL,
  meal_type  TEXT NOT NULL
               CHECK (meal_type IN ('sarapan', 'makan_siang', 'makan_malam', 'camilan')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT meal_plans_unique_slot UNIQUE (user_id, plan_date, meal_type)
);

COMMENT ON TABLE public.meal_plans IS 'Rencana menu harian/mingguan per pengguna';

CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx  ON public.meal_plans (user_id);
CREATE INDEX IF NOT EXISTS meal_plans_date_idx     ON public.meal_plans (plan_date);


-- ============================================================
-- TABLE: shopping_list
-- ============================================================
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

COMMENT ON TABLE public.shopping_list IS 'Daftar belanja bahan makanan per pengguna';

CREATE INDEX IF NOT EXISTS shopping_list_user_id_idx ON public.shopping_list (user_id);


-- ============================================================
-- FUNCTION: auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_shopping_list_updated_at
  BEFORE UPDATE ON public.shopping_list
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================================
-- FUNCTION: auto-create profile on new user signup
-- ============================================================
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;


-- --- profiles ---
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- --- recipes ---
-- Anyone (including anon) can read public/sample recipes
CREATE POLICY "Anyone can view public recipes"
  ON public.recipes FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

-- Only authenticated users can insert their own recipes
CREATE POLICY "Users can insert own recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own non-sample recipes
CREATE POLICY "Users can update own recipes"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = user_id AND is_sample = FALSE);

-- Users can only delete their own non-sample recipes
CREATE POLICY "Users can delete own recipes"
  ON public.recipes FOR DELETE
  USING (auth.uid() = user_id AND is_sample = FALSE);


-- --- favorites ---
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);


-- --- meal_plans ---
CREATE POLICY "Users can view own meal plans"
  ON public.meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON public.meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON public.meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON public.meal_plans FOR DELETE
  USING (auth.uid() = user_id);


-- --- shopping_list ---
CREATE POLICY "Users can view own shopping list"
  ON public.shopping_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own shopping list"
  ON public.shopping_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping list"
  ON public.shopping_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own shopping list"
  ON public.shopping_list FOR DELETE
  USING (auth.uid() = user_id);
