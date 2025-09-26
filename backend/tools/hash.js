const bcrypt = require("bcrypt");

(async () => {
  const pwd = process.argv[2];
  if (!pwd) {
    console.error("Usage: node tools/hash.js <password>");
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 12);
  console.log("bcrypt hash:\n", hash);
})();
