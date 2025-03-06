// http://localhost:3000/posts

const postsContainer = document.getElementById('postsContainer');

async function getPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function createPost(posts) {
    try {
        posts.forEach(post => {
            postsContainer.innerHTML += `<div class="post">
                <h2>${post.title}</h2>
                <p>${post.text}</p>
                <button class="editPostButton" data-id="${post.id}">Редагувати</button>
                <button class="deletePostButton" data-id="${post.id}">Видалити</button>
                <div class="commentsContainer" data-id="${post.id}">
                    <h3>Коментарі:</h3>
                    <ul>
                        ${post.comments.map(comment => `<li>${comment.text}</li>`).join('')}
                    </ul>
                    <form class="createCommentForm" data-post-id="${post.id}">
                        <input type="text" class="commentInput" placeholder="Новий коментар" required />
                        <button type="submit">Додати коментар</button>
                    </form>
                </div>
            </div>`;
        });
    } catch (error) {
        console.error(error);
    }
}

getPosts().then(posts => createPost(posts));

// Оновлення поста
// async function updatePost(id, title, content) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }

// Видалення поста
// async function deletePost(id) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }

// Додавання коментаря до поста
// async function createComment(postId, comment) {
//     try {
//     } catch (error) {
//         console.error(error);
//     }
// }

// Оновлення відображення постів на сторінці
// function renderPosts(posts) {
// }

// Обробник події для створення поста
// document.getElementById('createPostForm').addEventListener('submit', cb);

// Обробник події для редагування поста
// document.addEventListener('click', cb);

// Обробник події для видалення поста
// document.addEventListener('click', cb);

// Обробник події для додавання коментаря
// document.addEventListener('submit', cb);

// Запуск додатку
// async function startApp() {
//     const posts = await getPosts();
//     renderPosts(posts);
// }