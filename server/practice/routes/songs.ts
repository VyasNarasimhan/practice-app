import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import db from '../../db/db';

export const router: Router = Router();

router.get('/getSongs/:name', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params.name);
  res.send({ success: true, songs: await getSongsAsJson(req.params.name)});
});

router.put('/loadSongs', async (req: Request, res: Response, next: NextFunction) => {
  const json = req.body.songs;
  const userInfo = JSON.parse(req.body.user);
  const userId = (await db.query('SELECT id FROM users WHERE username=$1', [userInfo.username])).rows[0].id;
  for (const category of json) {
    await db.query('INSERT INTO categories (name, user_id) VALUES ($1, $2)', [category.name, userId]);
    const categoryId = (await db.query('SELECT id FROM categories WHERE name=$1 AND user_id=$2', [category.name, userId])).rows[0].id;
    for (const song of category.songs) {
      const ragam = song.ragam || '';
      const talam = song.talam || '';
      const metronome = song.metronome || null;
      const composer = song.composer || '';
      await db.query('INSERT INTO songs (name, date, talam, ragam, composer, metronome, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [song.name, song.date, talam, ragam, composer, metronome, userId, categoryId]);
    }
  }
  res.send( {success: true, songs: await getSongsAsJson(userInfo.username)});
});

router.post('/editSong', async (req: Request, res: Response, next: NextFunction) => {
  const song = req.body.song;
  // tslint:disable-next-line: max-line-length
  const exists = (await db.query('SELECT * FROM songs WHERE id=$1 AND category_id=$2 AND user_id=$3', [song.id, song.category_id, req.body.user.id])).rowCount;
  if (req.body.action === 'save') {
    if (exists === 1) {
      // tslint:disable-next-line: max-line-length
      res.send({ updated: (await db.query('UPDATE songs SET name=$1, talam=$2, ragam=$3, composer=$4, metronome=$5 WHERE id=$6', [song.name, song.talam, song.ragam, song.composer, song.metronome, song.id])).rowCount });
    } else {
      res.status(422).send({ error: 'Song does not exist' });
    }
  } else if (req.body.action === 'add') {
    if (exists === 0) {
      const addNewSong = await db.query('INSERT INTO songs (name, date, talam, ragam, composer, metronome, user_id, category_id) VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7)', [song.name, song.talam, song.ragam, song.composer, song.metronome, req.body.user.id, song.category]);
      // tslint:disable-next-line: max-line-length
      const newId = (await db.query('SELECT id FROM songs WHERE name=$1 AND user_id=$2 AND category_id=$3', [song.name, req.body.user.id, song.category])).rows[0].id;
      res.send({ updated: addNewSong.rowCount, id: newId });
    } else {
      res.status(422).send({ error: 'Song already exists' });
    }
  }
});

router.post('/editCategory', async (req: Request, res: Response, next: NextFunction) => {
  const category = req.body.category;
  console.log(req.body.user);
  // tslint:disable-next-line: max-line-length
  const exists = (await db.query('SELECT * FROM categories WHERE id=$1 AND user_id=$2', [category.id, req.body.user.id])).rowCount;
  if (req.body.action === 'save') {
    if (exists === 1) {
      res.send({ updated: (await db.query('UPDATE categories SET name=$1 WHERE id=$2', [category.name, category.id])).rowCount });
    } else {
      res.status(422).send({ error: 'Category does not exist' });
    }
  } else if (req.body.action === 'add') {
    if (exists === 0) {
      const addNewCategory = await db.query('INSERT INTO categories (name,  user_id) VALUES ($1, $2)', [category.name, req.body.user.id]);
      // tslint:disable-next-line: max-line-length
      const newId = (await db.query('SELECT id FROM categories WHERE name=$1 AND user_id=$2', [category.name, req.body.user.id])).rows[0].id;
      res.send({ updated: addNewCategory.rowCount, id: newId });
    } else {
      res.status(422).send({ error: 'Category already exists' });
    }
  }
});

router.get('/changeStatus/:id/:date', async (req: Request, res: Response, next: NextFunction) => {
  const songId = req.params.id;
  const date = req.params.date;
  res.send({ updated: (await db.query('UPDATE songs SET date=$1 WHERE id=$2', [date, songId])).rowCount });
});

router.delete('/deleteSong/:id', async (req: Request, res: Response, next: NextFunction) => {
  const songId = req.params.id;
  res.send({ updated: (await db.query('DELETE FROM songs WHERE id=$1', [songId])).rowCount });
});

router.delete('/deleteCategory/:id', async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.id;
  res.send({ updated: (await db.query('DELETE FROM categories WHERE id=$1', [categoryId])).rowCount });
});

// tslint:disable-next-line: typedef
async function getSongsAsJson(username: string) {
  const categories = (await db.query('SELECT categories.id, categories.name from categories INNER JOIN users ON users.username=$1 AND users.id=categories.user_id', [username])).rows;
  const result: {name: string, id: number, songs: {}[]}[] = [];
  for (const category of categories) {
    const retrievedSongs = (await db.query('SELECT * FROM songs WHERE category_id=$1', [category.id])).rows;
    result.push({name: category.name, id: category.id, songs: retrievedSongs});
  }
  return result;
}
