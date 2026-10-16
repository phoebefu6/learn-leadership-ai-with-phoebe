// Node runner: loads assets/org-sample.js and assets/org-live.js exactly as the browser does and
// prints the canon as JSON. Exits 1 if selfTest() fails, or if it PASSES with the planted fault.
// Compare with the Python reference: python3 materials/compare-ladder.py
const fs = require("fs"), path = require("path"), vm = require("vm");
const repo = process.argv[2] || path.join(__dirname, "..");
const ctx = { window: {} }; ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(repo, "assets/org-sample.js"), "utf8"), ctx);
const api = require(path.join(path.resolve(repo), "assets/org-live.js"));
const c = api.canon(ctx.window.ORG_SAMPLE);
if (c.selfTest !== true || c.selfTestFault !== false) {
  process.stderr.write("selfTest " + c.selfTest + " / with planted fault " + c.selfTestFault + "\n");
  process.stdout.write(JSON.stringify(c));
  process.exit(1);
}
delete c.selfTest; delete c.selfTestFault;
process.stdout.write(JSON.stringify(c));
