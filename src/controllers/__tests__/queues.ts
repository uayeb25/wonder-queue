import app from "../../app";
import request from "supertest";

jest.setTimeout(30000);

describe("POST /writer", () => {
  
    it("should return an array with two elements, without pass queue name", async () => {
        const result = await request(app)
        .post("/writer")
        .send({
            messages: [{
                x: 1,
                y: 1
            },{
                x: 1,
                y:2
         }]
        });
        expect(result.body.length).toEqual(2);
    });

    it("if we set queue attribute with a non-exist queue, we have to get a empty array as a result", async () => {
        const result = await request(app)
        .post("/writer")
        .send({
            messages: [{
                x: 1,
                y: 1
            },{
                x: 1,
                y:2
            }],
            queue: "x"
        });
        expect(result.body.length).toEqual(0);
    });

});

describe("GET /queue", () => {
  
    it("If we consume our endpoint to know size of our default queue it should be 2", async () => {
        const result = await request(app)
        .get("/queue");
        expect(result.body).toEqual({
            size: 2
        });
    });

});


describe("POST /queue", () => {
  
    it("should create a new queue", async () => {
        const result = await request(app)
        .post("/queue")
        .send({
            queue: "requests"
        });
        expect(result.body).toEqual({
            successed: true
        });
    });

    it("if we set queue attribute with a different default queue we should get an array with 2 elements", async () => {
        const result = await request(app)
        .post("/writer")
        .send({
            messages: [{
                id: "1",
                title: "how to get hired in AskWonder?",
                author: "Wonder Name here"
            },{
                id: "2",
                title: "how approve wonder test?",
                author: "Wonder Name here"
            }],
            queue: "requests"
        });
        expect(result.body.length).toEqual(2);
    });

});

describe("PUT /writer", () => {
  

    it("subscription is NOT A REAL ENDPOINT, but we create this to simulate a client that take a queue's messages", async () => {
        const result = await request(app)
        .put("/queue");
        expect(result.body.successed).toEqual(true);
    });

    it("If we run again our endpoint to subscribe in our currently queue taken, it sould be false successed", async () => {
        const result = await request(app)
        .put("/queue");
        expect(result.body.successed).toEqual(false);
    });

    it("Inserting new elements in our queue", async () => {
        const result = await request(app)
        .post("/writer")
        .send({
            messages: [{
                x: 1,
                y: 1
            },{
                x: 1,
                y:2
         }]
        });
        expect(result.body.length).toEqual(2);
    });

    it("Now current size: 4", async () => {
        const result = await request(app)
        .get("/queue");
        expect(result.body).toEqual({
            size: 4
        });
    });

    it("finnaly if we run our subscription we should receive a true successed for these new two elements, extra parameter: time we want subscribe only for two seconds", async () => {
        const result = await request(app)
        .put("/queue")
        .send({
            time: 2
        });

        expect(result.body.successed).toEqual(true);
    });

    it('waiting 4 seconds', async () => {
        await new Promise(res => setTimeout(() => {
          expect(true).toBe(true)
          res()
        }, 4000))
    });

    it("we should have available two messages again", async () => {
        const result = await request(app)
        .put("/queue");
        expect(result.body.successed).toEqual(true);
    });
    
});

describe("POST /operations", () => {

    it("We run our worker: operations, it consume from our default queue and compute sums, it should return NOT PENDINGS all our elements are taken", async () => {
        const result = await request(app)
        .post("/operations");
        expect(result.body).toEqual({
            message: "Not pending"
        });
    });

    it("Inserting new elements in our queue", async () => {
        const result = await request(app)
        .post("/writer")
        .send({
            messages: [{
                x: 1,
                y: 1
            },{
                x: 1,
                y:2
         }]
        });
        expect(result.body.length).toEqual(2);
    });

    it("We run our worker: operations, it consume from our default queue and compute sums, it should return 2 and 3 as result", async () => {
        const result = await request(app)
        .post("/operations");
        expect(result.body[0].result).toEqual(2);
        expect(result.body[1].result).toEqual(3);
    });

});


describe("POST /researchs", () => {

    it("should return 2 elements in our second queue previously created", async () => {
        const result = await request(app)
        .get("/queue/requests");
        expect(result.body).toEqual({
            size: 2
        });
    });

    it("We run our worker: researches, research requested are assigned to researchers", async () => {
        const result = await request(app)
        .post("/researchs")
        .send({
            queue: "requests"
        });

        expect(result.body.length).toEqual(2);
        expect(result.body[0].result.researcher.length>0).toEqual(true);
        expect(result.body[1].result.researcher.length>0).toEqual(true);
    });

});