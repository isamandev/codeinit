import "dotenv/config";
import { PrismaClient } from "../src/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const fullStackDevChapters = [
  {
    title: "Module 1: Syntax & Variables",
    lessons: [
      {
        title: "Introduction to Programming",
        duration: "8:24",
        videoLabel: "Introduction to Programming — Video Lesson",
        intro:
          "Programming is the process of giving instructions to a computer to solve problems. Before writing a single line of code, you need to understand how computers think: step by step, with absolute precision.",
        codeBlock: '// Your first program\nconsole.log("Hello, World!");',
        body: "Every concept in this course builds on what came before. Take time to run each example, break it intentionally, then fix it — that is how real learning happens.",
      },
      {
        title: "Variables & Data Types",
        duration: "12:05",
        videoLabel: "Variables & Data Types — Video Lesson",
        intro:
          "Variables are named containers that hold values. In JavaScript you declare them with let, const, or var — each with different rules about when the value can change.",
        codeBlock:
          'let name = "Alice";    // string\nconst age = 30;        // number\nlet active = true;     // boolean\nlet score = null;      // null',
        body: "Prefer const by default. Only use let when you know the variable must be reassigned. Avoid var — it has scope rules that lead to subtle bugs.",
      },
      {
        title: "Operators & Expressions",
        duration: "10:47",
        videoLabel: "Operators & Expressions — Video Lesson",
        intro:
          "Operators let you compute new values from existing ones. An expression is any valid combination of values, variables, and operators that resolves to a value.",
        codeBlock:
          "let x = 10;\nlet y = 3;\n\nconsole.log(x + y);   // 13\nconsole.log(x % y);   // 1  (remainder)\nconsole.log(x ** 2);  // 100 (exponent)\n\n// Comparison (always returns boolean)\nconsole.log(x === 10); // true — strict equality",
        body: 'Always use === (strict equality) instead of == (loose equality). The loose version coerces types in ways that cause bugs, e.g. "5" == 5 is true.',
      },
      { title: "String Operations" },
      { title: "Comments & Code Style" },
    ],
  },
  {
    title: "Module 2: Control Flow",
    lessons: [
      { title: "If / Else Statements" },
      { title: "Switch Statements" },
      { title: "Logical Operators" },
      { title: "Ternary & Short-Circuit" },
    ],
  },
  {
    title: "Module 3: Loops & Iteration",
    lessons: [
      { title: "While Loops" },
      { title: "For Loops" },
      { title: "Loop Control (break/continue)" },
      { title: "Nested Loops" },
      { title: "Iterators & Generators" },
    ],
  },
  {
    title: "Module 4: Functions",
    lessons: [
      { title: "Defining Functions" },
      { title: "Parameters & Arguments" },
      { title: "Return Values" },
      { title: "Scope & Closures" },
      { title: "Arrow Functions" },
    ],
  },
  {
    title: "Module 5: Arrays & Objects",
    lessons: [
      { title: "Arrays Basics" },
      { title: "Array Methods" },
      { title: "Objects & Properties" },
      { title: "Destructuring" },
      { title: "Spread & Rest" },
    ],
  },
  {
    title: "Module 6: DOM Manipulation",
    lessons: [
      { title: "Selecting Elements" },
      { title: "Events & Listeners" },
      { title: "Modifying the DOM" },
      { title: "Forms & Validation" },
    ],
  },
];

async function seedFullStackDevCourse() {
  const course = await prisma.course.upsert({
    where: { slug: "full-stack-dev" },
    update: {},
    create: {
      slug: "full-stack-dev",
      title: "Full Stack Dev",
      description: "Programming Course",
    },
  });

  for (
    let chapterIndex = 0;
    chapterIndex < fullStackDevChapters.length;
    chapterIndex++
  ) {
    const chapterData = fullStackDevChapters[chapterIndex];

    const existingChapter = await prisma.chapter.findFirst({
      where: { courseId: course.id, title: chapterData.title },
    });

    const chapter =
      existingChapter ??
      (await prisma.chapter.create({
        data: {
          courseId: course.id,
          title: chapterData.title,
          order: chapterIndex,
        },
      }));

    for (
      let lessonIndex = 0;
      lessonIndex < chapterData.lessons.length;
      lessonIndex++
    ) {
      const lessonData = chapterData.lessons[lessonIndex];

      const existingLesson = await prisma.lesson.findFirst({
        where: { chapterId: chapter.id, title: lessonData.title },
      });

      if (existingLesson) continue;

      await prisma.lesson.create({
        data: {
          chapterId: chapter.id,
          title: lessonData.title,
          order: lessonIndex,
          duration: lessonData.duration ?? null,
          videoLabel: lessonData.videoLabel ?? null,
          intro: lessonData.intro ?? null,
          codeBlock: lessonData.codeBlock ?? null,
          body: lessonData.body ?? null,
        },
      });
    }
  }
}

async function seedAdminUser() {
  const hashedPassword = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@codeinit.dev" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@codeinit.dev",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
}

async function main() {
  console.log("Starting database seed...");
  await seedFullStackDevCourse();
  await seedAdminUser();
  console.log("Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
