import argon2 from 'argon2';
import debug from 'debug';
import express from 'express';
import userService from '../services/users.service';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
  private static instance: UsersController;

  static getInstance() {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController();
    }
    return UsersController.instance;
  }

  async listUsers(req: express.Request, res: express.Response) {
    const users = await userService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = userService.readById(req.params.userId);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await userService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    log(await userService.patchById(req.body));
    res.status(204).send(``);
  }

  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await userService.updateById(req.body));
    res.status(204).send(``);
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await userService.deleteById(req.params.userId));
    res.status(204).send(``);
  }
}

export default UsersController.getInstance();
