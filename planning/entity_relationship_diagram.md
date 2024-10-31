# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]

## Add the Entity Relationship Diagram

```dbml
Table User {
  user_id integer [pk, increment]
  username varchar [not null]
  email varchar [unique, not null]
  password_hash varchar [not null]
  oauth_provider varchar
  preferred_genres varchar[]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table Book {
  book_id integer [pk, increment]
  google_books_id varchar [unique, not null]
  title varchar [not null]
  author varchar [not null]
  description text
  cover_image_url varchar
  genre varchar
  mood_score float
  rating float
  total_pages integer
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table Song {
  song_id integer [pk, increment]
  spotify_id varchar [unique, not null]
  title varchar [not null]
  artist varchar [not null]
  album varchar
  genre varchar
  mood_score float
  preview_url varchar
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table SuggestedTrack {
  suggested_track_id integer [pk, increment]
  book_id integer
  song_id integer
  match_score float
  created_at timestamp [default: `now()`]

  indexes {
    (book_id, song_id) [unique]
  }
}

Table Swipe {
  swipe_id integer [pk, increment]
  user_id integer
  book_id integer
  direction varchar [not null]
  swiped_at timestamp [default: `now()`]
}

Table ReadingProgress {
  progress_id integer [pk, increment]
  user_id integer
  book_id integer
  current_page integer
  progress_percentage float
  started_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]

  indexes {
    (user_id, book_id) [unique]
  }
}

Table Collection {
  collection_id integer [pk, increment]
  user_id integer
  name varchar [not null]
  description text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table CollectionItem {
  collection_item_id integer [pk, increment]
  collection_id integer
  book_id integer
  song_id integer
  added_at timestamp [default: `now()`]

  indexes {
    (collection_id, book_id, song_id) [unique]
  }
}

// Relationships
Ref: Swipe.user_id > User.user_id
Ref: Swipe.book_id > Book.book_id
Ref: SuggestedTrack.book_id > Book.book_id
Ref: SuggestedTrack.song_id > Song.song_id
Ref: ReadingProgress.user_id > User.user_id
Ref: ReadingProgress.book_id > Book.book_id
Ref: Collection.user_id > User.user_id
Ref: CollectionItem.collection_id > Collection.collection_id
Ref: CollectionItem.book_id > Book.book_id
Ref: CollectionItem.song_id > Song.song_id
```

![ERD](/Users/nguyen/Downloads/Visual Studio Code/Bookly/bookly_db.png)

| Column Name | Type    | Description            |
| ----------- | ------- | ---------------------- |
| id          | integer | primary key            |
| name        | text    | name of the shoe model |
| ...         | ...     | ...                    |
