const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const password2 = "GBDx_7h-w-XxNLe";
const username = "fullstackopen";
const dbName = "testnaBaza";

const url = `mongodb+srv://${username}:${password}@cluster0.lzvgd.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  mongoose.connect(url).then((_) => {
    Contact.find({}).then((result) => {
      result.forEach((contact) => console.log(contact));
      mongoose.connection.close();
    });
  });
} else if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
      });
      return contact.save();
    })
    .then(() => {
      console.log(
        `Added ${process.argv[3]} number ${process.argv[4]} to phonebook`
      );
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
