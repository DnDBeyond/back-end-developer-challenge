-- +migrate Up
create table damage_type(
    type text unique primary key not null
);

create table defense_type(
    type text unique primary key not null,
    modifier real not null
);

create table character(
    character_id int primary key not null,
    name text not null,
    max_hit_points int not null,
    current_hit_points int not null,
    level int not null,
    strength int not null,
    dexterity int not null,
    constitution int not null,
    intelligence int not null,
    wisdom int not null,
    charisma int not null
);

create table character_defense(
    character_defense_id int primary key not null,
    character_id int not null,
    damage_type text not null,
    defense_type text not null,
    foreign key(character_id) references character(character_id),
    foreign key(damage_type) references damage_type(type),
    foreign key(defense_type) references defense_type(type)
);

-- +migrate Down
drop table character_defense;
drop table character;
drop table defense_type;
drop table damage_type;