const AUTHOR = require("../models/author.model");

const getAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await AUTHOR.findOne({ where: { id } });

    res.status(200).json({ status: "success", data: author });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const getAuthors = async (req, res) => {
  try {
    const authors = await AUTHOR.findAll({
        attributes:['qualification']
    });
    res.status(200).json({ status: "success", data: authors });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const createAuthor = async (req, res) => {
  try {
    const { experience, qualification } = req.body;

    const data = await AUTHOR.create({ experience, qualification });

    res.status(200).json({ status: "success", msg: "post author", data });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience, qualification } = req.body;

    const author = await AUTHOR.findOne({where:{id}})
    if(!author){

        res.status(401).json({ status: "error", msg: "incorrect author id " });
    }

    const data = await AUTHOR.update(
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

    const data = await AUTHOR.destroy({ where: { id } });

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
