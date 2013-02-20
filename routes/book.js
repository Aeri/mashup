var notemodel = require('../models/notemodel');
var Book = notemodel.Book;
var Note =  notemodel.Note;

exports.create = function(req, res) {
  console.log("Book Created.");
  var newBook = new Book({ title: req.body.title, chapters : req.body.chapters, _creator: req.session.user });
  newBook.save(function (err) {
    if (err)
      console.log("Error saving book");
  });
  res.send("Book saved.");
};

exports.list = function(req, res) {
  Book.find({_creator: req.session.user}).populate('books').exec(function(err, db_books) {
    if (err)
      console.log("Error rendering book list.");
    res.render("book", {title:"List of Books", books: db_books});
  });
};

exports.remove = function(req, res) {
  console.log(req.body.title)
  Book.remove({title: req.body.title, _creator: req.session.user}).exec(function (err, book) {
    if (err)
      console.log("Error", err);
    console.log("Book removed.");
    res.send("Book removed.");
  });
  Note.remove({book: req.body.title, _creator: req.session.user}).exec(function (err, note) {
    if (err)
      console.log("Error", err)
    console.log("Associated notes removed.");
    res.redirect('/books');
  });
};

exports.displayNotes = function(req, res) {
  var title = req.params.title;
  var chapter = req.params.chapter;
  Book.findOne({title: title, _creator: req.session.user}).exec(function(err, book) {
    if (err)
      console.log("Error.");
    if (chapter > book.chapters)
      res.redirect('/books');
    else
      console.log("Notes for " + title + ", Chapter " + chapter);
      Note.find({book: title, _creator: req.session.user, chapter: chapter}).populate('notes').exec(function(err, db_notes) {
        if (err)
          console.log("Error rendering note list.");
        console.log(db_notes);
        res.render("note", {title: title, notes: db_notes, chapter: chapter, userID: req.session.user});
      });
  });
};

exports.createNote = function(req, res) {
  console.log("Note Created.");
  console.log(req.body.body);
  var newNote = new Note({ body: req.body.body, chapter: req.body.chapter, book: req.body.title,  _creator: req.session.user});
  newNote.save(function (err) {
    if (err)
      console.log("Error saving note");
  });
  res.send("Note saved.");
};

exports.removeNote = function(req, res) {
  console.log(req.body.id);
  Note.remove({ _id: req.body.id }).exec(function (err, note) {
    if (err)
      console.log("Error", err)
    res.send("Note removed.");
    console.log("Note removed.");
    res.redirect('/books/'+req.body.title+"/"+req.body.chapter);
  });
};