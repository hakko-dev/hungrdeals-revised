import mongoose from 'mongoose'
mongoose.set('useFindAndModify', false);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("mongodb connected")
});
mongoose.connect(process.env.MONGO_HOST, {useNewUrlParser: true});
export default mongoose
export const instance = db
