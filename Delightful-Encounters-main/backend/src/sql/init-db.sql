DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Article;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Likes;

-- Create User Table
CREATE TABLE User (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50),
    password VARCHAR(255) NOT NULL,  -- Hashed and salted password
    fname VARCHAR(50),
    lname VARCHAR(50),
    date_of_birth DATE,
    description TEXT,
    avatar VARCHAR(255),  -- URL
    admin BOOLEAN DEFAULT FALSE
);

-- Create Article Table
CREATE TABLE Article (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    published_date DATETIME NOT NULL,  -- UNIX timestamp in milliseconds
    author_id INT,
    image VARCHAR(255),  -- URL
    content TEXT,
    FOREIGN KEY (author_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Create Comment Table
CREATE TABLE Comment (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    comment_date DATETIME NOT NULL,  -- UNIX timestamp in milliseconds
    comment_user_id INT,
    comment_article_id INT,
    parent_comment_id INT,
    FOREIGN KEY (comment_user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_article_id) REFERENCES Article(article_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES Comment(comment_id) ON DELETE CASCADE
);

-- Create Likes Table
CREATE TABLE Likes (
    like_user_id INT,
    like_article_id INT,
    PRIMARY KEY (like_user_id, like_article_id),
    FOREIGN KEY (like_user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (like_article_id) REFERENCES Article(article_id) ON DELETE CASCADE
);

-- Insert Users
INSERT INTO User (username, password, fname, lname, date_of_birth, description, avatar, admin) VALUES
('admin', '$2b$10$3ljOIZkela7F.wjqTV/0u.CxhP8OFNc3B.G0Na85FxPEALSwzI0eq', 'admin', 'admin', '2000-01-01', 'admin with the power to delete users.', 'StockCake-MajesticLionPose.jpg', TRUE),
('user1', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'Mewtwo', 'Pokemon', '1996-02-06', 'A powerful pokemon', 'StockCake-FoxinFlight.jpg', FALSE),
('user2', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First2', 'Last2', '1992-01-01', 'Description2', 'StockCake-GiraffeEatingLeaves.jpg', FALSE),
('user3', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First3', 'Last3', '1993-01-01', 'Description3', 'StockCake-SunsetDolphinLeap.jpg', FALSE),
('user4', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First4', 'Last4', '1994-01-01', 'Description4', 'StockCake-ElephantCelebrationJoy.jpg', FALSE),
('user5', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First5', 'Last5', '1995-01-01', 'Description5', 'StockCake-CatEnjoyingSunlight.jpg', FALSE),
('user6', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First6', 'Last6', '1996-01-01', 'Description6', 'StockCake-DetectiveCatPoses.jpg', FALSE),
('user7', '$2b$10$4nzWr9Vi/WuAchtvMPbmguLmZpz0KMr8fAETekKM1h2WoejLC9mba', 'First7', 'Last7', '1997-01-01', 'Description7', 'StockCake-DogPreparesDinner.jpg', FALSE);

-- Insert Articles
INSERT INTO Article (title, published_date, author_id, image, content) VALUES
('The Agile Dog Jumping in Joy', 1577836800000, 1, 'StockCake-AgileDogJumping.jpg', 
'A thrilling story of an agile dog jumping around joyfully. This dog, known for its energetic spirit and boundless enthusiasm, spends its days leaping and playing in the vast, open fields. Every jump is a testament to its strength and agility, captivating anyone who watches. It is not just about the physical prowess; the dog’s sheer joy is contagious, spreading happiness wherever it goes. Whether it is chasing after a ball or just enjoying the freedom of the outdoors, this agile dog reminds us all of the simple pleasures in life.'),
('The Sunlit Cat Enjoying the Day', 1577923200000, 2, 'StockCake-CatEnjoyingSunlight.jpg', 
'A peaceful scene of a cat basking in the warm sunlight. This cat, with its soft fur glistening in the rays of the sun, finds the perfect spot to relax. It stretches out, purring softly, eyes half-closed in sheer contentment. The sunlight not only warms its body but also seems to brighten its spirits. As the day progresses, the cat occasionally moves to stay within the sunbeam, savoring each moment of tranquility. Its peaceful demeanor serves as a gentle reminder to appreciate the calm and beauty in everyday moments.'),
('Deer in the Stream on a Quiet Day', 1578009600000, 3, 'StockCake-DeerinStream.jpg', 
'A beautiful story of a deer standing calmly in a stream. The deer, with its graceful movements and alert eyes, blends harmoniously with the serene environment. The gentle flow of the stream, coupled with the rustling leaves, creates a perfect backdrop for this tranquil scene. As the deer takes delicate sips of water, it remains vigilant, aware of its surroundings yet completely at peace. This moment captures the essence of nature’s harmony, where every element coexists in perfect balance, offering a glimpse into the quiet beauty of the wilderness.'),
('The Detective Cat Solving Mysteries', 1578096000000, 4, 'StockCake-DetectiveCatPoses.jpg', 
'An intriguing tale of a clever cat solving mysteries. This detective cat, with its sharp instincts and keen sense of observation, unravels the most complex cases. With each mystery, it prowls through the shadows, its eyes glinting with intelligence and curiosity. No clue is too small, and no detail escapes its notice. The cat’s adventures take it to various places, from bustling city streets to quiet country lanes, each new challenge met with unwavering determination. Its success in solving mysteries earns it a reputation, making it a legendary figure in the animal world.'),
('The Dog Prepares Dinner for the Family', 1578182400000, 5, 'StockCake-DogPreparesDinner.jpg', 
'A heartwarming story of a dog preparing dinner. This remarkable dog, known for its loyalty and intelligence, surprises its family by taking on the task of preparing dinner. With a wagging tail and focused expression, it carefully selects ingredients and uses its paws to handle utensils. The aroma of a delicious meal fills the air, bringing smiles to everyone’s faces. The dog’s effort is not just about the food; it’s a testament to the strong bond and love it shares with its family. This act of kindness and initiative makes the meal truly special.'),
('Elephants Celebrate Joy Together', 1578268800000, 6, 'StockCake-ElephantCelebrationJoy.jpg', 
'A joyful gathering of elephants celebrating. In a lush, open field, a herd of elephants comes together to celebrate. Their trunks intertwined in a show of unity, they trumpet joyfully, the sound echoing through the surroundings. This gathering is a moment of pure happiness, where the elephants engage in playful activities, splashing water and trumpeting in delight. Each elephant, from the smallest calf to the largest adult, participates in this joyous occasion. Their celebration is a powerful reminder of the strength of community and the importance of shared moments of joy.'),
('The Fox in Flight Over the Fields', 1578355200000, 7, 'StockCake-FoxinFlight.jpg', 
'A majestic fox leaping over fields in full flight. With its sleek, red fur shimmering in the sunlight, the fox moves with incredible speed and agility. Each leap carries it gracefully over the tall grass, its keen eyes focused on the horizon. This scene is not just about physical prowess; it’s a display of the fox’s freedom and wild spirit. The fields, vast and open, provide the perfect playground for this agile creature. As it bounds across the landscape, the fox embodies the essence of untamed nature, full of life and energy.'),
('Giraffe Eating Leaves from Tall Trees', 1578441600000, 8, 'StockCake-GiraffeEatingLeaves.jpg', 
'A serene scene of a giraffe enjoying fresh leaves. The giraffe, with its long neck extended, reaches the highest branches of a tall tree. Each bite is taken with deliberate grace, savoring the tender leaves. This peaceful moment is set against the backdrop of a clear blue sky, with the giraffe’s spotted coat blending into the natural scenery. Its calm and steady movements create a sense of tranquility. Watching the giraffe, one is reminded of the beauty of nature and the simple pleasures of life, where every moment is savored in harmony with the surroundings.'),
('Kangaroo Poses for a Perfect Portrait', 1578528000000, 1, 'StockCake-KangarooPortraitPose.jpg', 
'A proud kangaroo posing for a portrait. Standing tall with a confident gaze, the kangaroo’s powerful physique is on full display. Its muscular build and alert posture reflect strength and readiness. This moment captures the essence of the kangaroo’s character: proud, strong, and resilient. The portrait, framed by the natural beauty of the outback, showcases not just the physical attributes but also the spirit of this remarkable animal. Each detail, from the texture of its fur to the determined look in its eyes, tells a story of survival and adaptability.'),
('The Majestic Lion Poses in Pride', 1578614400000, 2, 'StockCake-MajesticLionPose.jpg', 
'A lion posing majestically in the wild. With a mane flowing in the wind and a piercing gaze, the lion exudes power and grace. This king of the jungle stands atop a rocky outcrop, surveying its territory with a sense of regal authority. Every aspect of the lion, from its muscular build to its calm yet commanding presence, speaks of dominance and majesty. This scene captures a moment of pure splendor, where the lion’s natural beauty and strength are in full display. It’s a testament to the awe-inspiring power of nature’s greatest predators.'),
('The Yellow Bird Singing Joyfully', 1578700800000, 3, 'StockCake-MajesticYellowBird.jpg', 
'A bright yellow bird singing in the sunshine. Perched on a blooming branch, the bird’s vibrant plumage shines against the backdrop of a clear blue sky. Its melodic song fills the air, a joyful symphony that captures the essence of a sunny day. The bird’s song is not just a beautiful sound; it’s an expression of pure happiness and freedom. As it flits from branch to branch, the yellow bird spreads cheer and liveliness. This scene is a perfect example of nature’s simple yet profound beauty, where every note and every color come together in harmony.'),
('Dolphin Leaping at Sunset', 1578787200000, 4, 'StockCake-SunsetDolphinLeap.jpg', 
'A dolphin leaping gracefully at sunset. Against the backdrop of a setting sun, the dolphin’s sleek body arcs through the air, creating a stunning silhouette. The water sparkles with golden hues, reflecting the beauty of this moment. Each leap is a display of the dolphin’s agility and joy, as it dances with the waves. This scene captures the essence of freedom and the boundless energy of the ocean’s inhabitants. The dolphin’s leaps are not just a physical display but an expression of sheer joy, celebrating the beauty of life and nature. This mesmerizing moment at sunset is a reminder of the magical connections we share with the world around us.');

-- Inserting Comments for Articles
-- Article 1
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Amazing jump by the dog!', 1577837100000, 2, 1, NULL),
('Indeed, so agile!',  1577837400000, 3, 1, 1),
('I wish my dog could do that.', 1577837700000, 4, 1, 2),
('Practice makes perfect!', 1577838000000, 2, 1, 3),
('Absolutely!', 1577838300000, 3, 1, 4),
('Training is key.', 1577838600000, 4, 1, 5),
('Very true.', 1577838900000, 2, 1, 6),
('Impressive dog!', 1577839200000, 3, 1, 7);

-- Article 2
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Such a peaceful scene.', 1577923500000, 3, 2, NULL),
('Cats really know how to relax.',  1577923800000, 4, 2, 9),
('I love this picture.', 1577924100000, 5, 2, 10),
('Me too!', 1577924400000, 3, 2, 11),
('Sunlight makes everything better.', 1577924700000, 4, 2, 12),
('Agreed!',  1577925000000, 5, 2, 13),
('Perfect for a catnap.', 1577925300000, 3, 2, 14),
('Absolutely!', 1577925600000, 4, 2, 15);

-- Article 3
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Beautiful deer.', 1578010500000, 4, 3, NULL),
('So serene and calm.', 1578010800000, 5, 3, 17),
('Nature at its best.', 1578011100000, 6, 3, 18),
('I love streams.', 1578011400000, 4, 3, 19),
('Me too!', 1578011700000, 5, 3, 20),
('Deer are majestic.',1578012000000, 6, 3, 21),
('Absolutely!',1578012300000, 4, 3, 22),
('Perfect picture.', 1578012600000, 5, 3, 23);

-- Article 4
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Detective cat is amazing!', 1578096300000, 4, 4, NULL),
('Such a clever cat.', 1578096600000, 5, 4, 25),
('I love this cat.', 1578096900000, 6, 4, 26),
('Me too!', 1578097200000, 4, 4, 27),
('Cats are the best.', 1578097500000, 5, 4, 28),
('Absolutely!', 1578097800000, 6, 4, 29),
('Nature is amazing.', 1578098100000, 4, 4, 30),
('So true.', 1578098400000, 5, 4, 31);

-- Article 5
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Dogs are wonderful!', 1578182700000, 5, 5, NULL),
('Such a caring dog.', 1578183000000, 6, 5, 33),
('I love dogs.', 1578183300000, 7, 5, 34),
('Me too!', 1578183600000, 5, 5, 35),
('Dogs are the best.', 1578183900000, 6, 5, 36),
('Absolutely!', 1578184200000, 7, 5, 37),
('Nature is amazing.', 1578184500000, 5, 5, 38),
('So true.', 1578184800000, 6, 5, 39);

-- Article 6
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Elephants are majestic!', 1578270900000, 6, 6, NULL),
('Such a joyous celebration.', 1578271200000, 7, 6, 41),
('I love elephants.', 1578271500000, 8, 6, 42),
('Me too!', 1578271800000, 6, 6, 43),
('Nature is amazing.', 1578272100000, 7, 6, 44),
('Absolutely!', 1578272400000, 8, 6, 45),
('Elephants are the best.', 1578272700000, 6, 6, 46),
('So true.', 1578273000000, 7, 6, 47);

-- Article 7
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Foxes are so agile!', 1578357300000, 7, 7, NULL),
('Such a beautiful fox.', 1578357600000, 8, 7, 49),
('I love foxes.', 1578357900000, 1, 7, 50),
('Me too!', 1578358200000, 7, 7, 51),
('Foxes are the best.', 1578358500000, 8, 7, 52),
('Absolutely!', 1578358800000, 1, 7, 53),
('Nature is amazing.', 1578359100000, 7, 7, 54),
('So true.', 1578359400000, 8, 7, 55);

-- Article 8
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Giraffes are amazing!', 1578443700000, 8, 8, NULL),
('Such a tall animal.', 1578444000000, 1, 8, 57),
('I love giraffes.', 1578444300000, 2, 8, 58),
('Me too!', 1578444600000, 8, 8, 59),
('Nature is wonderful.', 1578444900000, 1, 8, 60),
('Absolutely!', 1578445200000, 2, 8, 61),
('Giraffes are the best.', 1578445500000, 8, 8, 62),
('So true.', 1578445800000, 1, 8, 63);

-- Article 9
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Kangaroos are so strong!', 1578530100000, 1, 9, NULL),
('Look at that pose.', 1578530400000, 2, 9, 65),
('I love kangaroos.', 1578530700000, 3, 9, 66),
('Me too!', 1578531000000, 1, 9, 67),
('Nature is amazing.', 1578531300000, 2, 9, 68),
('Absolutely!', 1578531600000, 3, 9, 69),
('Kangaroos are the best.', 1578531900000, 1, 9, 70),
('So true.', 1578532200000, 2, 9, 71);

-- Article 10
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Lions are majestic!', 1578616500000, 3, 10, NULL),
('Look at that pose.', 1578616800000, 4, 10, 73),
('I love lions.', 1578617100000, 5, 10, 74),
('Me too!', 1578617400000, 3, 10, 75),
('Nature is amazing.', 1578617700000, 4, 10, 76),
('Absolutely!', 1578618000000, 5, 10, 77),
('Lions are the best.', 1578618300000, 3, 10, 78),
('So true.', 1578618600000, 4, 10, 79);

-- Article 11
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Yellow birds are beautiful!', 1578702900000, 4, 11, NULL),
('Such a majestic bird.', 1578703200000, 5, 11, 81),
('I love birds.', 1578703500000, 6, 11, 82),
('Me too!', 1578703800000, 4, 11, 83),
('Nature is amazing.', 1578704100000, 5, 11, 84),
('Absolutely!', 1578704400000, 6, 11, 85),
('Birds are the best.', 1578704700000, 4, 11, 86),
('So true.', 1578705000000, 5, 11, 87);

-- Article 12
INSERT INTO Comment (content, comment_date, comment_user_id, comment_article_id, parent_comment_id) VALUES
('Dolphins are amazing!', 1578790500000, 5, 12, NULL),
('Such a beautiful leap.', 1578790800000, 6, 12, 89),
('I love dolphins.', 1578791100000, 7, 12, 90),
('Me too!', 1578791400000, 5, 12, 91),
('Nature is wonderful.', 1578791700000, 6, 12, 92),
('Absolutely!', 1578792000000, 7, 12, 93),
('Dolphins are the best.', 1578792300000, 5, 12, 94),
('So true.', 1578792600000, 6, 12, 95);

-- Likes
INSERT INTO Likes (like_user_id, like_article_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 2), (5, 2), (6, 2), (7, 3), (8, 3), (1, 4), (2, 4), (3, 4), (4, 5), (5, 5), (6, 5), (7, 6), (8, 6), (1, 7), (2, 7), (3, 7), (4, 8), (5, 8), (6, 8), (7, 9), (8, 9), (1, 10), (2, 10), (3, 10), (4, 11), (5, 11), (6, 11), (7, 12), (8, 12);
