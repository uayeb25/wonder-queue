## WONDER QUEUE

Wonder Queue is a test development to address backend skills, implementing queue storage, in this case we develop the storage and library to manipulate our queue with local storage. To describe this project we detail all the main libraries used:


-	Typescript: as a programming standard.
-	Express: set our restful API.
-	Lokijs: manage our JavaScript in-memory. 
-	Momentjs: manipulate dates and times.
-	Jestjs: run our TDD
-	Nodemon: hot reloading

Main functionalities of our queue storage management:

-	In our .env we have defined our default queue, it means that we can call almost all our methods without specify queue.
-	We can create new queues.
-	In our .env we have defined our default expiration time, this integer is expressed in seconds. 
-	We develop and independent method to subscribed a worker in a queue. It was intentional to test when a client try to access messages already taken and how we can still adding new messages and how we can run a new worker and take these new ones. It mean that we can have many workers doing operation in the same queue but they are dealing with different messages. (on testing definitions these case are more clear)
-	we can write a batch of messages and receive a poll of ids as response. 
-	To guarantee a full execution of our workers each time a message is shift out the subscription’s queue expiration dates are updated by the same process. 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# build mode
$ npm run tsc
```
## Test

```bash
# unit tests
$ npm run test:unit
```