const { exec } = require("child_process");

// Define the PowerShell command
const command = "tree ./src";

// Execute the command
exec(`powershell -Command "${command}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
