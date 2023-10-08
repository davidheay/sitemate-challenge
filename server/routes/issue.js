const router = require('express').Router();
const todoIssuesModel = require('../models/issue');

router.get('/api/issues', async (req, res)=>{
  try{
    const allTodoIssues = await todoIssuesModel.find({});
    res.status(200).json(allTodoIssues)
  }catch(err){
    res.json(err);
  }
})

router.post('/api/issue', async (req, res)=>{
  try{
    console.log(req.body);
    const newIssue = new todoIssuesModel({
      title: req.body.title,
      description: req.body.description
    })
    const saveIssue = await newIssue.save()
    res.status(200).json(saveIssue);
  }catch(err){
    res.json(err);
  }
})


router.put('/api/issue/:id', async (req, res)=>{
  try{
    const updateIssue = await todoIssuesModel.findByIdAndUpdate(req.params.id, {$set: req.body});
    res.status(200).json(updateIssue);
  }catch(err){
    res.json(err);
  }
})


router.delete('/api/issue/:id', async (req, res)=>{
  try{
    const deleteIssue = await todoIssuesModel.findByIdAndDelete(req.params.id);
    console.log("Log: Deleted id" + req.params.id);
    res.status(200).json('Issue Deleted');
  }catch(err){
    res.json(err);
  }
})


module.exports = router;