const Task = require("../../models/task.model");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  //SORT
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End sort


  // Phân trang
  let limitItems = 4; // neu k gui len thi de mac dinh nhu nay
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (page - 1) * limitItems;
  // Hết Phân trang

  // Tìm kiếm
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
  // Hết Tìm kiếm


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

module.exports.changeMultiPatch = async (req, res) => {
  const status = req.body.status; // nhung thu vien body parser vao moi dung body dc
  const ids = req.body.ids;

  if (status) {
    const tasks = await Task.updateMany({
      _id: {
        $in: ids
      } // cap nhat cac id trong mang ids
    }, {
      status: status
    })
  };

  res.json({
    code: "success",
    message: "Thành công !"
  })
}

module.exports.createPost = async (req, res) => {
  const data = req.body;
  data.createdBy = req.user.id;
  const task = new Task(data);

  await task.save();

  res.json({
    code: "success",
    message: "Tạo công việc thành công!",
    data: task
  });
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  data.updatedBy = req.user.id;

  await Task.updateOne({
    _id: id
  }, data)

  res.json({
    code: "success",
    message: "Thay đổi thành công"
  })
}

module.exports.deleteMultiPatch = async (req, res) => {
  const ids = req.body.ids;

  await Task.updateMany({
    _id: {
      $in: ids
    }
  }, {
    deleted: true
  });

  res.json({
    code: "success",
    message: "Xóa thành công!"
  })
}