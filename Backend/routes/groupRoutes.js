const express = require("express");
const router  = express.Router();
const gc      = require("../controllers/groupController");

router.post("/",                gc.createGroup);   // POST /api/groups
router.get("/",                 gc.getGroups);     // GET  /api/groups?member=0x...
router.get("/:id",              gc.getGroupById);  // GET  /api/groups/:id
router.delete("/:id",           gc.deleteGroup);   // DELETE /api/groups/:id
router.post("/:id/members",     gc.addMember);     // POST /api/groups/:id/members
router.post("/:id/members/confirm", gc.confirmMember); // POST /api/groups/:id/members/confirm
router.post("/:id/members/decline", gc.declineMember); // POST /api/groups/:id/members/decline
router.post("/:id/fund",        gc.fundPool);      // POST /api/groups/:id/fund

module.exports = router;