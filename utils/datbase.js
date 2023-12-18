const { MongoClient, ServerApiVersion } = require('mongodb');

const dbPassword = 'a1b2c3d45';
const uri = `mongodb+srv://ny9950610:${dbPassword}@cluster0.y8vnves.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        console.log('start connecting');
        await client.connect();
        console.log('connected');
        await client.db("login").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
        return client;
    } catch (err) {
        console.log(err);
    }
}

module.exports = run();