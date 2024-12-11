<<<<<<< HEAD
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    image VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
); 

ALTER DATABASE `sql8750689` CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE posts CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE posts MODIFY title VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE posts MODIFY content TEXT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE users MODIFY username VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci;
=======
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    image VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
); 

ALTER DATABASE `sql8750689` CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE posts CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE posts MODIFY title VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE posts MODIFY content TEXT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE users MODIFY username VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci;
>>>>>>> cb358ef (Initial commit)
ALTER TABLE users MODIFY email VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci; 