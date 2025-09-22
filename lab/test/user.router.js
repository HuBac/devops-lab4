const app = require("../src/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../src/dbClient");

chai.use(chaiHttp);

describe("User REST API", () => {
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb();
  });

  after(() => {
    app.close();
    db.quit();
  });

  describe("POST /user", () => {
    it("create a new user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });

    it("pass wrong parameters", (done) => {
      const user = {
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res).to.be.json;
          done();
        })
        .catch((err) => {
          throw err;
        });
    });
  });

  describe("GET /user", () => {
    // first for succesfully getting a user :
    it("Succesfully getting a user", (done) => {
      // first we create the user we want to get
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .post("/user")
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201);
          chai.expect(res.body.status).to.equal("success");
          // this one calls the get request after waiting for the post to create it
          return chai.request(app).get("/user/" + user.username);
        })
        .then((res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.status).to.equal("success");
          done();
        })
        .catch((err) => done(err));
    });
    it("cannot get a user when it does not exist", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      chai
        .request(app)
        .get("/user/" + user.username)
        .then((res) => {
          chai.expect(res).to.have.status(404);
          chai.expect(res.body.status).to.equal("error");
          chai.expect(res.body.msg).to.equal("User not found");
          done();
        })
        .catch((err) => done(err));
    });
  });
});