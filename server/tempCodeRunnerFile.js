const app = require("./app");

const http = require("http");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


process.on("uncaughtException", (err) => {
    console.log(err);
    console.log("UNCAUGHT Exception! Shutting down ...");
    process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
  });

  const DB = process.env.DBURI.replace(
    "<PASSWORD>",
    process.env.DBPASSWORD
  );
  
const server = http.createServer(app);
const port = process.env.PORT || 8000;


server.listen(port,()=>{
console.log(`app is running on port ${port}`);

});
process.on("unhandledRejection", (err) => {
    console.log(err);
    console.log("UNHANDLED REJECTION! Shutting down ...");
    server.close(() => {
      process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
    });
  });
  