create table movie
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    title text not null,
    director text not null
);
