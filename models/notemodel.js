var mon = require('mongoose')

var bookSchema = mon.Schema({
  title: String,
  chapters: Number,
  _creator: String,
});

var noteSchema = mon.Schema({
  body: String,
  chapter: Number,
  book: String,
  _creator: String,
});

var Book = mon.model('Book', bookSchema);
var Note = mon.model('Note', noteSchema);

exports.Book = Book;
exports.Note = Note;