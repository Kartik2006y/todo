const Note = require("../models/Note");
const asyncHandler = require("../middleware/asyncHandler");

const getNotes = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = { userId: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const notes = await Note.find(query).sort({ updatedAt: -1 });
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Note title and content are required");
  }

  const note = await Note.create({
    title,
    content,
    userId: req.user._id,
  });

  res.status(201).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  note.title = req.body.title ?? note.title;
  note.content = req.body.content ?? note.content;

  const updatedNote = await note.save();
  res.json(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  await note.deleteOne();
  res.json({ message: "Note deleted successfully" });
});

module.exports = { getNotes, createNote, updateNote, deleteNote };
