const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(process.cwd(), "src", "data", "users.json");

async function run() {
  if (!fs.existsSync(dbPath)) {
    console.error("users.json not found at", dbPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(dbPath, "utf8");
  const users = JSON.parse(raw);
  let changed = false;
  for (const u of users) {
    if (u.passwordEnv) {
      const val = process.env[u.passwordEnv];
      if (!val) {
        console.warn(
          `env var ${u.passwordEnv} not set; skipping user ${u.email}`,
        );
        continue;
      }
      if (!val.startsWith("$2")) {
        const hash = await bcrypt.hash(val, 10);
        u.password = hash;
        delete u.passwordEnv;
        changed = true;
        console.log(`hashed password for ${u.email}`);
      } else {
        u.password = val;
        delete u.passwordEnv;
        changed = true;
        console.log(`moved hashed env password into file for ${u.email}`);
      }
    }
  }
  if (changed) {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), "utf8");
    console.log("users.json updated");
  } else {
    console.log("no changes");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
