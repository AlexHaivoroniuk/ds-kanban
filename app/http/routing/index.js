"use strict";

const Router = require('koa-router');
const router = new Router();

const {
  UsersController,
  BoardsController,
  ListsController,
  TasksController,
  AttachmentsController,
} = require('../controllers/index');

const userController = new UsersController();
const boardsController = new BoardsController();
const listsController = new ListsController();
const tasksController = new TasksController();
const attachmentsController = new AttachmentsController();

const notImplemented = (ctx, next) => (ctx.status = 501, next());

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.del('/user/:id', userController.deleteUser);

router.get('/boards', boardsController.getBoards);
router.get('/board/:id', boardsController.getBoard);
router.post('/board', boardsController.createBoard);
router.put('/board/:id', boardsController.updateBoard);
router.del('/board/:id', boardsController.deleteBoard);

router.get('/board/:boardId/lists', listsController.getLists);
router.get('/board/:boardId/list/:listId', listsController.getList);
router.post('/board/:boardId/list', listsController.createList);
router.put('/board/:boardId/list/:listId', listsController.updateList);
router.del('/board/:boardId/list/:listId', listsController.deleteList);

router.get('/list/:listId/tasks', tasksController.getTasks);
router.get('/list/:listId/task/:taskId', tasksController.getTask);
router.post('/list/:listId/task', tasksController.createTask);
router.put('/list/:listId/task/:taskId', tasksController.updateTask);
router.del('/list/:listId/task/:taskId', tasksController.deleteTask);

router.get('/attachment/:id', attachmentsController.download.bind(attachmentsController));
router.post('/attachment', attachmentsController.upload.bind(attachmentsController));
router.del('/attachment/:id', attachmentsController.del.bind(attachmentsController));

router.get('/notifications/', notImplemented);

module.exports = router;