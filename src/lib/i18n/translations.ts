export type Locale = "en" | "id";

export const translations = {
  en: {
    // Navbar
    nav: {
      home: "Home",
      explore: "Explore",
      planner: "Meal Planner",
      favorites: "Favorites",
      profile: "Profile",
      submit: "Add Recipe",
      login: "Sign In",
      register: "Sign Up",
      logout: "Sign Out",
      search: "Search recipes...",
    },
    // Landing page
    landing: {
      heroTitle: "Discover & Cook",
      heroHighlight: "Amazing Recipes",
      heroSubtitle:
        "Your personal recipe book — discover, save, plan and cook delicious meals from around the world.",
      heroCta: "Start Exploring",
      heroCtaSecondary: "Create Account",
      featuresTitle: "Everything You Need",
      featuresSubtitle: "to Master Your Kitchen",
      feature1Title: "Discover Recipes",
      feature1Desc:
        "Browse thousands of recipes from around the world, filtered by cuisine, category, or ingredients.",
      feature2Title: "Plan Your Week",
      feature2Desc:
        "Drag and drop recipes into your weekly meal planner. Never wonder what's for dinner again.",
      feature3Title: "Save Favorites",
      feature3Desc:
        "Bookmark your favorite recipes and build your personal collection for quick access anytime.",
      feature4Title: "Share & Review",
      feature4Desc:
        "Submit your own recipes and review others. Help the community discover new flavors.",
      categoriesTitle: "Explore by",
      categoriesHighlight: "Category",
      popularTitle: "Trending",
      popularHighlight: "Recipes",
      ctaTitle: "Ready to Start Cooking?",
      ctaSubtitle:
        "Join YummyBook today and never run out of meal ideas again.",
      ctaCta: "Create Free Account",
    },
    // Explore
    explore: {
      title: "Explore Recipes",
      subtitle: "Discover your next favorite meal",
      filterCategory: "Category",
      filterArea: "Cuisine",
      filterAll: "All",
      noResults: "No recipes found. Try a different search or filter.",
      loadMore: "Load More",
    },
    // Recipe detail
    recipe: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      reviews: "Reviews",
      relatedRecipes: "You Might Also Like",
      addFavorite: "Save to Favorites",
      removeFavorite: "Remove from Favorites",
      writeReview: "Write a Review",
      submitReview: "Submit Review",
      rating: "Rating",
      noReviews: "No reviews yet. Be the first!",
      watchVideo: "Watch Video",
      source: "Source",
      category: "Category",
      cuisine: "Cuisine",
    },
    // Recipe submit
    submit: {
      title: "Share Your Recipe",
      subtitle: "Add a new recipe to the community",
      recipeName: "Recipe Name",
      recipeCategory: "Category",
      recipeCuisine: "Cuisine / Area",
      recipeInstructions: "Instructions",
      recipeImage: "Recipe Image",
      recipeVideo: "Video URL (optional)",
      ingredientName: "Ingredient",
      ingredientMeasure: "Measure",
      addIngredient: "Add Ingredient",
      removeIngredient: "Remove",
      submitBtn: "Publish Recipe",
      preview: "Preview",
    },
    // Planner
    planner: {
      title: "Meal Planner",
      subtitle: "Plan your week with delicious meals",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
      addMeal: "Add Meal",
      clearWeek: "Clear Week",
      emptySlot: "Drop a recipe here",
    },
    // Profile
    profile: {
      title: "My Profile",
      myRecipes: "My Recipes",
      myFavorites: "My Favorites",
      myReviews: "My Reviews",
      editProfile: "Edit Profile",
      recipesCount: "Recipes",
      favoritesCount: "Favorites",
      reviewsCount: "Reviews",
    },
    // Auth
    auth: {
      loginTitle: "Welcome Back",
      loginSubtitle: "Sign in to your YummyBook account",
      registerTitle: "Join YummyBook",
      registerSubtitle: "Create your account and start cooking",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      loginBtn: "Sign In",
      registerBtn: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      forgotPassword: "Forgot password?",
    },
    // Footer
    footer: {
      tagline: "Your personal recipe book for discovering & planning meals.",
      quickLinks: "Quick Links",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: "© 2026 YummyBook. All rights reserved.",
    },
  },
  id: {
    // Navbar
    nav: {
      home: "Beranda",
      explore: "Jelajahi",
      planner: "Rencana Makan",
      favorites: "Favorit",
      profile: "Profil",
      submit: "Tambah Resep",
      login: "Masuk",
      register: "Daftar",
      logout: "Keluar",
      search: "Cari resep...",
    },
    // Landing page
    landing: {
      heroTitle: "Temukan & Masak",
      heroHighlight: "Resep Lezat",
      heroSubtitle:
        "Buku resep pribadimu — temukan, simpan, rencanakan dan masak hidangan lezat dari seluruh dunia.",
      heroCta: "Mulai Jelajahi",
      heroCtaSecondary: "Buat Akun",
      featuresTitle: "Semua yang Kamu Butuhkan",
      featuresSubtitle: "untuk Menguasai Dapurmu",
      feature1Title: "Temukan Resep",
      feature1Desc:
        "Jelajahi ribuan resep dari seluruh dunia, filter berdasarkan masakan, kategori, atau bahan.",
      feature2Title: "Rencanakan Mingguanmu",
      feature2Desc:
        "Seret dan letakkan resep ke planner mingguan. Tak perlu bingung lagi mau masak apa.",
      feature3Title: "Simpan Favorit",
      feature3Desc:
        "Tandai resep favoritmu dan bangun koleksi pribadi untuk akses cepat kapan saja.",
      feature4Title: "Bagikan & Review",
      feature4Desc:
        "Kirimkan resepmu sendiri dan review resep lainnya. Bantu komunitas menemukan cita rasa baru.",
      categoriesTitle: "Jelajahi berdasarkan",
      categoriesHighlight: "Kategori",
      popularTitle: "Resep",
      popularHighlight: "Populer",
      ctaTitle: "Siap Mulai Memasak?",
      ctaSubtitle:
        "Gabung YummyBook sekarang dan jangan pernah kehabisan ide masakan.",
      ctaCta: "Buat Akun Gratis",
    },
    // Explore
    explore: {
      title: "Jelajahi Resep",
      subtitle: "Temukan hidangan favoritmu berikutnya",
      filterCategory: "Kategori",
      filterArea: "Masakan",
      filterAll: "Semua",
      noResults: "Resep tidak ditemukan. Coba pencarian atau filter lain.",
      loadMore: "Muat Lebih",
    },
    // Recipe detail
    recipe: {
      ingredients: "Bahan-bahan",
      instructions: "Cara Memasak",
      reviews: "Ulasan",
      relatedRecipes: "Resep Lainnya",
      addFavorite: "Simpan ke Favorit",
      removeFavorite: "Hapus dari Favorit",
      writeReview: "Tulis Ulasan",
      submitReview: "Kirim Ulasan",
      rating: "Rating",
      noReviews: "Belum ada ulasan. Jadilah yang pertama!",
      watchVideo: "Tonton Video",
      source: "Sumber",
      category: "Kategori",
      cuisine: "Masakan",
    },
    // Recipe submit
    submit: {
      title: "Bagikan Resepmu",
      subtitle: "Tambahkan resep baru ke komunitas",
      recipeName: "Nama Resep",
      recipeCategory: "Kategori",
      recipeCuisine: "Masakan / Daerah",
      recipeInstructions: "Instruksi",
      recipeImage: "Gambar Resep",
      recipeVideo: "URL Video (opsional)",
      ingredientName: "Bahan",
      ingredientMeasure: "Takaran",
      addIngredient: "Tambah Bahan",
      removeIngredient: "Hapus",
      submitBtn: "Publikasikan Resep",
      preview: "Pratinjau",
    },
    // Planner
    planner: {
      title: "Rencana Makan",
      subtitle: "Rencanakan mingguanmu dengan hidangan lezat",
      breakfast: "Sarapan",
      lunch: "Makan Siang",
      dinner: "Makan Malam",
      monday: "Sen",
      tuesday: "Sel",
      wednesday: "Rab",
      thursday: "Kam",
      friday: "Jum",
      saturday: "Sab",
      sunday: "Min",
      addMeal: "Tambah Menu",
      clearWeek: "Hapus Semua",
      emptySlot: "Letakkan resep di sini",
    },
    // Profile
    profile: {
      title: "Profilku",
      myRecipes: "Resep Saya",
      myFavorites: "Favorit Saya",
      myReviews: "Ulasan Saya",
      editProfile: "Edit Profil",
      recipesCount: "Resep",
      favoritesCount: "Favorit",
      reviewsCount: "Ulasan",
    },
    // Auth
    auth: {
      loginTitle: "Selamat Datang Kembali",
      loginSubtitle: "Masuk ke akun YummyBook-mu",
      registerTitle: "Bergabung dengan YummyBook",
      registerSubtitle: "Buat akun dan mulai memasak",
      email: "Email",
      password: "Kata Sandi",
      confirmPassword: "Konfirmasi Kata Sandi",
      fullName: "Nama Lengkap",
      loginBtn: "Masuk",
      registerBtn: "Buat Akun",
      noAccount: "Belum punya akun?",
      hasAccount: "Sudah punya akun?",
      forgotPassword: "Lupa kata sandi?",
    },
    // Footer
    footer: {
      tagline: "Buku resep pribadimu untuk menemukan & merencanakan hidangan.",
      quickLinks: "Tautan Cepat",
      legal: "Legal",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan",
      copyright: "© 2026 YummyBook. Hak cipta dilindungi.",
    },
  },
} as const;

type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string;
};

export type TranslationKeys = DeepString<typeof translations.en>;

