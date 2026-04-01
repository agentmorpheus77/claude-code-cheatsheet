#!/usr/bin/env node

/**
 * Weekly update checker for Claude Code Cheatsheet.
 *
 * Fetches the official Claude Code documentation and checks for new
 * commands, flags, or features that should be added to the cheatsheet.
 *
 * Outputs: sets GitHub Actions output `has_updates` to 'true' or 'false'.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const DOCS_URL = "https://docs.anthropic.com/en/docs/claude-code/";
const CHEATSHEET_PATH = path.join(__dirname, "..", "data", "cheatsheet.json");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "ClaudeCodeCheatsheet/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetch(res.headers.location));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("Checking Claude Code docs for updates...");
  console.log(`Fetching: ${DOCS_URL}`);

  try {
    const html = await fetch(DOCS_URL);

    // Load current cheatsheet
    const cheatsheet = JSON.parse(fs.readFileSync(CHEATSHEET_PATH, "utf-8"));
    const existingKeys = new Set();
    for (const section of cheatsheet.sections) {
      for (const item of section.items) {
        existingKeys.add(item.key.toLowerCase());
      }
    }

    console.log(`Current cheatsheet has ${existingKeys.size} items`);
    console.log(`Fetched ${html.length} bytes from docs`);

    // Extract potential commands/flags from the docs page
    // Look for patterns like: `command`, --flag, /slash-command
    const codeBlockRegex = /<code[^>]*>([^<]+)<\/code>/g;
    const foundCommands = new Set();
    let match;
    while ((match = codeBlockRegex.exec(html)) !== null) {
      const cmd = match[1].trim();
      if (
        cmd.startsWith("claude ") ||
        cmd.startsWith("/") ||
        cmd.startsWith("--") ||
        cmd.startsWith("CLAUDE_")
      ) {
        foundCommands.add(cmd);
      }
    }

    console.log(`Found ${foundCommands.size} command-like strings in docs`);

    // Check for new items not in our cheatsheet
    const newItems = [];
    for (const cmd of foundCommands) {
      if (!existingKeys.has(cmd.toLowerCase())) {
        newItems.push(cmd);
      }
    }

    if (newItems.length > 0) {
      console.log(`Found ${newItems.length} potentially new items:`);
      newItems.forEach((item) => console.log(`  - ${item}`));

      // Update the lastChecked date
      cheatsheet.lastChecked = new Date().toISOString().split("T")[0];
      fs.writeFileSync(CHEATSHEET_PATH, JSON.stringify(cheatsheet, null, 2));

      // Set GitHub Actions output
      const outputFile = process.env.GITHUB_OUTPUT;
      if (outputFile) {
        fs.appendFileSync(outputFile, "has_updates=true\n");
      }
    } else {
      console.log("No new items found. Cheatsheet is up to date!");
      const outputFile = process.env.GITHUB_OUTPUT;
      if (outputFile) {
        fs.appendFileSync(outputFile, "has_updates=false\n");
      }
    }
  } catch (error) {
    console.error("Error checking for updates:", error.message);
    // Don't fail the workflow, just report no updates
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, "has_updates=false\n");
    }
  }
}

main();
