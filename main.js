// http://localhost:3000/posts

const postsContainer = document.getElementById('postsContainer');
const createPostForm = document.getElementById('createPostForm');


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


async function addToServer(title, text) {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, text, comments: [] })
        });
        const post = await response.json();
        return post;
    } catch (error) {
        console.error(error);
    }
}

createPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = createPostForm.querySelector('#titleInput').value;
    const text = createPostForm.querySelector('#contentInput').value;
    addToServer(title, text);
    postsContainer.innerHTML = '';
    createPostForm.reset();
    getPosts().then(posts => createPost(posts));
});


// Видалення поста
async function deletePost(id) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: 'DELETE'
        });
        const post = await response.json();
        return post;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('deletePostButton')) {
        event.preventDefault();
        event.stopPropagation();
        const id = event.target.dataset.id;
        deletePost(id);
        postsContainer.innerHTML = '';
        getPosts().then(posts => createPost(posts));
    }
});

// Додавання коментаря до поста
async function createComment(postId, commentText) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        const post = await response.json();

        const newComment = {
            id: String(post.comments.length + 1),
            text: commentText
        };
        post.comments.push(newComment);

        const updateResponse = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comments: post.comments }) 
        });

        return await updateResponse.json();
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('submit', async (event) => {
    if (event.target.classList.contains('createCommentForm')) {
        event.preventDefault();
        const postId = event.target.dataset.postId;
        const commentInput = event.target.querySelector('.commentInput');
        const commentText = commentInput.value.trim();

        if (!commentText) return;

        await createComment(postId, commentText);
        commentInput.value = ''; 

        const posts = await getPosts(); 
        createPost(posts);
    }
});
