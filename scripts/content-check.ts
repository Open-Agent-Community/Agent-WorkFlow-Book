import { existsSync } from "node:fs";
import path from "node:path";
import { checkContent } from "@/content/check";
import { loadBundle } from "@/content/index";
import { ContentError } from "@/content/markdown";

function main(): number {
  let bundle;
  try {
    bundle = loadBundle();
  } catch (error) {
    if (error instanceof ContentError) {
      console.error(`✗ schema  ${error.message}`);
      return 1;
    }
    throw error;
  }
  const issues = checkContent(bundle, {
    publicFileExists: (sitePath) => existsSync(path.join(process.cwd(), "public", sitePath)),
  });
  for (const issue of issues) {
    console.error(`✗ ${issue.rule.padEnd(9)} ${issue.source}: ${issue.message}`);
  }
  const counts = `${bundle.chapters.length} chapters, ${bundle.cases.length} cases, ${
    bundle.paths.length
  } paths, ${bundle.labs.length} labs, ${bundle.resources.length} resources`;
  if (issues.length > 0) {
    console.error(`content:check failed with ${issues.length} issue(s) (${counts})`);
    return 1;
  }
  console.log(`✓ content:check passed (${counts})`);
  return 0;
}

process.exitCode = main();
