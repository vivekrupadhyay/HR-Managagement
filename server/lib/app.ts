import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as mongoose from "mongoose";
import Controller from "interfaces/controller.interface";
import cookieParser = require("cookie-parser");

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    cors({ origin: "*" });
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }
  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  private connectToTheDatabase(): void {
    const MONGO_URI =
      "mongodb+srv://virusDB:virus@1874@virus.iyst1.mongodb.net/virusDB?retryWrites=true&w=majority";
    const server = http.createServer(this.app);
    server.listen(process.env.PORT);
    server.on("listening", async () => {
      console.info(`Listening on port ${process.env.PORT}`);
      mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on("open", () => {
        console.info("Connected to Mongo.");
      });
      mongoose.connection.on("error", (err: any) => {
        console.error(err);
      });
    });
  }

  // private connectToTheDatabase() {
  //   const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
  //   const combineDbURI = () => {
  //     return `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
  //   };
  //   const connect = async function () {
  //     const uri = combineDbURI(); // Will return DB URI
  //     console.log(`Connecting to DB - uri: ${uri}`);
  //     return mongoose.connect(uri, { useNewUrlParser: true });
  //   };
  //   console.log(connect);
  // }
}
export default App;
