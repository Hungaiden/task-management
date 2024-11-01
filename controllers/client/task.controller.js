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
  // End sort


   // Phân trang
  let limitItems = 4;
  let page = 1;
  if(req.query.page) {
    page = parseInt(req.query.page);
  }
  if(req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  
  const tasks = await Task
    .find(find)
    .limit(limitItems)
    .skip(skip)
    .sort(sort);

  
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