import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const himnavigator = {
  id: "himnavigator",
  title: "Навигатор Химии",
  description:
    "Портал, объединяющий химическую промышленность России. Организован поиск по химическим веществам и продуктам, получаемым на основе их синтеза, а также по производителям веществ. Ресурс предполагает наполнение контентом силами производителей через функционал личного кабинета.",
  url: "https://chmtch.ru/",
  imageUrl: "http://localhost:9000/my-page/chmtch-screen.PNG",
  isPlaceholder: false,
  sortOrder: 1,
};

const placeholder = {
  id: "placeholder",
  title: "Список будет дополняться",
  description: "",
  url: null,
  imageUrl: null,
  isPlaceholder: true,
  sortOrder: 2,
};

async function main() {
  for (const project of [himnavigator, placeholder]) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
