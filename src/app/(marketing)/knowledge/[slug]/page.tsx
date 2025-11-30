import fs from "fs";
import path from "path";

import Markdown from "react-markdown";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content/knowledge"));
  return files.map((file) => ({ slug: file.replace(".md", "") }));
}

export default async function KnowledgePage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(
    process.cwd(),
    "content/knowledge",
    `${params.slug}.md`,
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <article className="prose mx-auto p-8">
      <Markdown>{content}</Markdown>
    </article>
  );
}
