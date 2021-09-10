import { NextFunction, Request, Response, Router } from 'express';
import * as bcrypt from 'bcrypt';
import db from '../../db/db';

export const router: Router = Router();

const SALT = 9;

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    if (!user.username && !user.password) {
        res.status(422).send({ error: 'Not all data was filled out' });
    }
    const dbUser = (await db.query('SELECT * FROM users WHERE username=$1', [user.username])).rows[0];
    if (!!dbUser) {
        if (bcrypt.compareSync(user.password, dbUser.password)) {
            const userSongs = await getSongsAsJson(user.username);
            res.send({ user : {id: dbUser.id, email: dbUser.email, username: dbUser.username}, songs: userSongs });
        } else {
            res.status(422).send({ error: 'Incorrect username or password' });
        }
    } else {
        res.status(422).send({ error: 'Account does not exist' });
    }
});

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        if (!user.username && !user.password && !user.email) {
            res.status(422).send({ error: 'Not all data was filled out' });
        }
        // tslint:disable-next-line: max-line-length
        const existingUserResult = await db.query('SELECT id, email, username FROM users WHERE email=$1 OR username=$2', [user.email.toUpperCase(), user.username]);
        if (existingUserResult.rows.length === 1) {
            res.status(422).send({ error: 'User with this email or username already exists' });
        } else {
            const userSongs = await getSongsAsJson(user.username);
            res.send({
            updated: (await db.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)',
                [
                user.email.toUpperCase(), user.username, bcrypt.hashSync(user.password, SALT)
                ])).rowCount,
                user: existingUserResult.rows, songs: userSongs
            });
        }
    } catch (err) {
        return next(err);
    }
});

// tslint:disable-next-line: typedef
async function getSongsAsJson(username: string) {
    const songs = (await db.query('SELECT songs.name, songs.date, songs.talam, songs.ragam, songs.composer, songs.metronome, categories.name AS category FROM songs INNER JOIN categories ON categories.id=songs.category_id INNER JOIN users ON users.username=$1 AND users.id=songs.user_id', [username])).rows;
    const result: {name: string, songs: {}[]}[] = [];
    for (const song of songs) {
        let categoryExists = false;
        for (const category of result) {
            if (category.name === song.category) {
                category.songs.push(song);
                categoryExists = true;
            }
        }
        if (!categoryExists) {
            result.push({name: song.category, songs: [song]});
        }
    }
    return result;
}

