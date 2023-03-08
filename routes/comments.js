const express = require('express');
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware");
const Users = require('../schemas/user.js');

//댓글 조회
router.get("/:postId/comments", authMiddleware, async (req, res) => {
 try{
    //객체구조분해할당으로  nickname을 가져와야 user의 모든값을 가져오지않는다.
    const {nickname} = res.locals.user;
    const comments = await Comment.find({}).sort({ createdAt: -1 });

    if (!comments) {
        return res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다."})
    }
    const data = [];
    for (let i = 0; i < comments.length; i++) {
        data.push({
            commentId: comments[i]["_id"],
            nickname: nickname,
            content: comments[i]["content"],
            createdAt: comments[i]["createdAt"],
            updatedAt: comments[i]["updatedAt"],
        });

    }
    res.json({ data });
}catch(err){
    return res.status(400).json({errorMessage:"댓글 조회에 실패하였습니다."})
}
});

//댓글작성 API
router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try{
    const { postId } = req.params;
    const { comment } = req.body;
    console.log(postId, comment);
  
    const onedata = await Posts.findOne({ _id: postId }).exec();

    console.log("onedata:", onedata);
    if (!onedata) {
      return res.status(412).json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
    if (!comment || comment.length > 500) {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    const now = new Date();
    const created_Comment = await Comment.create({
      postId,
      comment,
      createdAt: now,
      updatedAt: now,
    });
    console.log("------", created_Comment);
    res.json({
      data: created_Comment,
      Message: "댓글을 생성하였습니다.",
    }); 
  
}catch(err){
    if(err.name === "ValidationError") {
        return res.status(412).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
    } else if(err.name === "TokenExpiredError" || err.name === "JsonWebTokenError"){
        return res. status(403).json({errorMessage:"전달된 쿠키에서 오류가 발생하였습니다."})
    } else{
        return res.status(400).json({errorMessage:"댓글 작성에 실패하였습니다."})
    }
}
})

//댓글 수정 api
router.put("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
try{
    const { commentId } = req.params;
    const { comment } = req.body;

    //$set을 사용해야 해당 필드만 바뀌게된다.
    const result = await Comment.updateOne({ _id: commentId }, { $set: { comment: comment } });
    console.log(result)

    if (!result) {
        return res.status(400).json({errorMessage: "게시글이 존재하지 않습니다." })
    }
    if(!comment){
        res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
    }
    res.status(200).json({Message: "댓글을 수정하였습니다."})
} catch(err){
    if(err.name === "CastError") {
        return res.status(404).json({errorMessage:"댓글이 존재하지 않습니다."})
    }
    if(err.message === "Forbidden") {
        return res.status(403).json({errorMessage:"댓글의 수정 권한이 존재하지 않습니다."})
    }
    if(err.massage === "jwt expired" || err.message === "invalid token"){
        return res.status(403).json({errorMessage:"전달된 쿠키에서 오류가 발생하였습니다."})
    }
    return res.status(400).json({errorMessage: "댓글 수정에 실패하였습니다."})
}
})

//댓글삭제 api
router.delete("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const { postId, commentId } = req.params;
try{
    const post = await Posts.findOne({_id: postId});
    if(!post) {
        return res.status(404).json({errorMessage:"게시글이 존재하지 않습니다."})
    }
    const delete_Comment = await Comment.findOne({ _id : commentId });
    console.log(delete_Comment)
    if (!delete_Comment) {
        return res.status(404).json({errorMessage: "댓글 조회에 실패하였습니다."})
    }
    
    await delete_Comment.deleteOne({ _id: commentId });

    res.json({Message: "댓글을 삭제하였습니다."})
}catch(err){
    if(err.kind === "ObjectId") {
        return res.status(400).json({ errorMessage: "올바르지 않은 Object ID입니다."})
    } else {
        return res.status(500).json({errorMessage: "예상치 못한 오류가 발생했습니다."})
    }
}
})

module.exports = router;