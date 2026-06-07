const db = require("../models");



const getAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await db.author.findOne({ where: { id } });

    res.status(200).json({ status: "success", data: author });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const getAuthors = async (req, res) => {
  try {
    const authors = await db.author.findAll({
        attributes:['qualification']
    });
    res.status(200).json({ status: "success", data: authors });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const createAuthor = async (req, res) => {
  try {
    const { experience, qualification , user_id} = req.body;

    const data = await db.author.create({ experience, qualification ,user_id});

    res.status(200).json({ status: "success", msg: "post author", data });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience, qualification } = req.body;

    const author = await db.author.findOne({where:{id}})
    if(!author){

        res.status(401).json({ status: "error", msg: "incorrect author id " });
    }

    const data = await db.author.update(
      { experience, qualification },
      { where: { id } },
    );

    res.status(200).json({ status: "success", msg: "update author" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.author.destroy({ where: { id } });

    res.status(200).json({ status: "success", msg: "author deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAuthor,
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
