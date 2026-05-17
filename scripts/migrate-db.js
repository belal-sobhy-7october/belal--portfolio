const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "..", ".env");
let supabaseUrl, supabaseKey;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").trim();
    if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value;
    if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = value;
    if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY" && !supabaseKey)
      supabaseKey = value;
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log("Creating database tables...");

  try {
    // Create profile_settings table
    const { error: profileError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS profile_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name TEXT NOT NULL,
          title TEXT NOT NULL,
          bio TEXT,
          profile_image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (profileError && !profileError.message.includes("already exists")) {
      console.error("Error creating profile_settings table:", profileError);
    } else {
      console.log("✓ profile_settings table created");
    }

    // Create categories table
    const { error: categoriesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (
      categoriesError &&
      !categoriesError.message.includes("already exists")
    ) {
      console.error("Error creating categories table:", categoriesError);
    } else {
      console.log("✓ categories table created");
    }

    // Create skills table
    const { error: skillsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS skills (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (skillsError && !skillsError.message.includes("already exists")) {
      console.error("Error creating skills table:", skillsError);
    } else {
      console.log("✓ skills table created");
    }

    // Create projects table
    const { error: projectsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          thumbnail_url TEXT,
          tags TEXT[],
          github_url TEXT,
          live_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (projectsError && !projectsError.message.includes("already exists")) {
      console.error("Error creating projects table:", projectsError);
    } else {
      console.log("✓ projects table created");
    }

    // Create experiences table
    const { error: experiencesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS experiences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          duration TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (
      experiencesError &&
      !experiencesError.message.includes("already exists")
    ) {
      console.error("Error creating experiences table:", experiencesError);
    } else {
      console.log("✓ experiences table created");
    }

    // Create contact_info table
    const { error: contactError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_info (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          platform_name TEXT NOT NULL,
          value TEXT NOT NULL,
          icon_class TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (contactError && !contactError.message.includes("already exists")) {
      console.error("Error creating contact_info table:", contactError);
    } else {
      console.log("✓ contact_info table created");
    }

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error during table creation:", error);
    throw error;
  }
}

async function seedData() {
  console.log("Seeding database with initial data...");

  try {
    // Seed profile_settings
    const { error: profileError } = await supabase
      .from("profile_settings")
      .upsert(
        {
          full_name: "Belal Ebrahim Sobhy",
          title: "Full-stack Developer & Agentic Systems Engineer",
          bio: "Passionate about building scalable web applications and intelligent systems.",
          profile_image_url: null,
        },
        { onConflict: "id" },
      );

    if (profileError) {
      console.error("Error seeding profile_settings:", profileError);
    } else {
      console.log("✓ profile_settings seeded");
    }

    // Seed categories
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .upsert(
        [
          { name: "Frontend", slug: "frontend" },
          { name: "Backend", slug: "backend" },
          { name: "DevOps", slug: "devops" },
          { name: "AI/ML", slug: "ai-ml" },
        ],
        { onConflict: "slug" },
      )
      .select();

    if (categoriesError) {
      console.error("Error seeding categories:", categoriesError);
    } else {
      console.log("✓ categories seeded");
    }

    // Seed skills
    const frontendCategory = categories?.find((c) => c.slug === "frontend")?.id;
    const backendCategory = categories?.find((c) => c.slug === "backend")?.id;
    const devopsCategory = categories?.find((c) => c.slug === "devops")?.id;
    const aiCategory = categories?.find((c) => c.slug === "ai-ml")?.id;

    const { error: skillsError } = await supabase.from("skills").upsert(
      [
        { name: "React", category_id: frontendCategory },
        { name: "Next.js", category_id: frontendCategory },
        { name: "TypeScript", category_id: frontendCategory },
        { name: "Node.js", category_id: backendCategory },
        { name: "Python", category_id: backendCategory },
        { name: "PostgreSQL", category_id: backendCategory },
        { name: "Docker", category_id: devopsCategory },
        { name: "AWS", category_id: devopsCategory },
        { name: "Machine Learning", category_id: aiCategory },
        { name: "LangChain", category_id: aiCategory },
      ],
      { onConflict: "id" },
    );

    if (skillsError) {
      console.error("Error seeding skills:", skillsError);
    } else {
      console.log("✓ skills seeded");
    }

    // Seed projects
    const { error: projectsError } = await supabase.from("projects").upsert(
      [
        {
          title: "E-Commerce Platform",
          description:
            "A full-featured e-commerce platform with payment integration and inventory management.",
          thumbnail_url: null,
          tags: ["React", "Node.js", "PostgreSQL"],
          github_url: "https://github.com/belal/ecommerce",
          live_url: "https://ecommerce-demo.com",
        },
        {
          title: "AI Chat Assistant",
          description:
            "An intelligent chat assistant powered by LLMs with context awareness.",
          thumbnail_url: null,
          tags: ["Python", "LangChain", "OpenAI"],
          github_url: "https://github.com/belal/ai-chat",
          live_url: "https://ai-chat-demo.com",
        },
        {
          title: "Portfolio Website",
          description:
            "Modern portfolio website showcasing projects and skills.",
          thumbnail_url: null,
          tags: ["Next.js", "TailwindCSS", "Supabase"],
          github_url: "https://github.com/belal/portfolio",
          live_url: "https://belal.dev",
        },
      ],
      { onConflict: "id" },
    );

    if (projectsError) {
      console.error("Error seeding projects:", projectsError);
    } else {
      console.log("✓ projects seeded");
    }

    // Seed experiences
    const { error: experiencesError } = await supabase
      .from("experiences")
      .upsert(
        [
          {
            title: "Senior Full-Stack Developer",
            company: "Tech Company",
            duration: "2022 - Present",
            description:
              "Leading development of scalable web applications and mentoring junior developers.",
          },
          {
            title: "Software Engineer",
            company: "Startup Inc",
            duration: "2020 - 2022",
            description:
              "Built and maintained multiple client-facing applications using modern technologies.",
          },
        ],
        { onConflict: "id" },
      );

    if (experiencesError) {
      console.error("Error seeding experiences:", experiencesError);
    } else {
      console.log("✓ experiences seeded");
    }

    // Seed contact_info
    const { error: contactError } = await supabase.from("contact_info").upsert(
      [
        {
          platform_name: "WhatsApp",
          value: "https://wa.me/201060911823",
          icon_class: "fab fa-whatsapp",
        },
        {
          platform_name: "Email",
          value: "belal@example.com",
          icon_class: "fas fa-envelope",
        },
        {
          platform_name: "GitHub",
          value: "https://github.com/belal",
          icon_class: "fab fa-github",
        },
      ],
      { onConflict: "id" },
    );

    if (contactError) {
      console.error("Error seeding contact_info:", contactError);
    } else {
      console.log("✓ contact_info seeded");
    }

    console.log("All data seeded successfully!");
  } catch (error) {
    console.error("Error during data seeding:", error);
    throw error;
  }
}

async function main() {
  try {
    await createTables();
    await seedData();
    console.log("\n✅ Database migration and seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
