import { connection as knex } from '../database/knex/index.js';
import { AppError } from '../utils/AppError.js';

export class NotesController {
  /** @type {import('express').RequestHandler} */
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const user_id = req.user.id;

    const [note_id] = await knex('notes').insert({
      title,
      description,
      user_id,
    });

    if (links && links.length > 0) {
      const linksToInsert = links.map((link) => {
        return {
          note_id,
          url: link,
        };
      });

      await knex('links').insert(linksToInsert);
    }

    if (tags && tags.length > 0) {
      const tagsToInsert = tags.map((name) => {
        return {
          note_id,
          name,
          user_id,
        };
      });

      await knex('tags').insert(tagsToInsert);
    }

    res.status(201).json();
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex('notes').where({ id }).first();
    const tags = await knex('tags').where({ note_id: id }).orderBy('name');
    const links = await knex('links').where({ note_id: id }).orderBy('created_at');

    res.status(200).json({
      ...note,
      tags,
      links,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    await knex('notes').where({ id }).delete();
    res.json();
  }

  /** @type {import('express').RequestHandler} */
  async list(req, res) {
    const { title, tags } = req.query;
    const user_id = req.user.id;

    let notes;

    if (user_id) {
      if (tags) {
        const tagList = tags.split(',').map((tag) => tag.trim());
        notes = await knex('tags')
          .select(['notes.id', 'notes.title', 'notes.user_id'])
          .where('notes.user_id', user_id)
          .whereLike('notes.title', `%${title ?? ''}%`)
          .whereIn('name', tagList)
          .innerJoin('notes', 'notes.id', 'tags.note_id')
          .groupBy('notes.id');
      } else {
        notes = await knex('notes')
          .where({ user_id })
          .whereLike('title', `%${title ?? ''}%`);
      }
    } else {
      throw new AppError('User not found.');
    }

    const userTags = await knex('tags').where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id == note.id);
      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.json(notesWithTags);
  }
}
