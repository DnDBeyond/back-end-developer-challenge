-- +migrate Up
-- damage types
insert into damage_type(type) values('bludgeoning'),
                                    ('piercing'),
                                    ('slashing'),
                                    ('fire'),
                                    ('cold'),
                                    ('acid'),
                                    ('thunder'),
                                    ('lightning'),
                                    ('poison'),
                                    ('radiant'),
                                    ('necrotic'),
                                    ('psychic'),
                                    ('force');

-- defense types
insert into defense_type(type, modifier) values('immunity', 0),
                                               ('resistance', 0.5),
                                               ('vulnerability', 2);

-- +migrate Down
-- damange types
delete from damage_type where type in ('bludgeoning', 'piercing', 'slashing', 'fire', 'cold', 'acid', 'thunder', 'lightning', 'poison', 'radiant', 'necrotic', 'psychic', 'force');
delete from defense_type where type in ('immunity', 'resistance', 'vulnerability');