const os = require("os");

function getSystemInfo() {
  console.log("=== System Information ===");

  console.log("System Architecture:", os.arch());
  console.log("Number of CPU Cores:", os.cpus().length);

  const cpu = os.cpus()[0];
  console.log("CPU Model:", cpu.model);
  console.log("CPU Speed:", cpu.speed + " MHz");

  console.log("Total Memory:", (os.totalmem() / (1024 ** 3)).toFixed(2) + " GB");
  console.log("Free Memory:", (os.freemem() / (1024 ** 3)).toFixed(2) + " GB");

  const heapUsed = process.memoryUsage().heapUsed / (1024 ** 2);
  console.log("Heap Memory Usage:", heapUsed.toFixed(2) + " MB");

  
  console.log("Hostname:", os.hostname());
  console.log("OS Type:", os.type(), os.release());
}

module.exports = { getSystemInfo };
