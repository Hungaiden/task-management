const Task = require("../../models/task.model");

module.exports.index = async (req, res) => {
  const find = { 
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  }

  //SORT
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  const tasks = await Task.find(find).sort(sort);
  
  res.json(tasks);
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({
    _id: id,
    deleted: false
  });
  res.json(task);
}