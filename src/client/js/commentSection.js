const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".video__comment-deleteBtn");

const addComment = (text, id, comment) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const ownerAvatar = document.createElement("img");
  ownerAvatar.setAttribute("src", comment.avatarUrl);
  ownerAvatar.className = "comments__avatar";

  const ownerNameSpan = document.createElement("span");
  ownerNameSpan.className = "comment__owner";
  ownerNameSpan.innerText = comment.ownername;

  const commentCreate = document.createElement("span");
  commentCreate.innerText = new Date(comment.createdAt).toLocaleTimeString(
    "ko-KR",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
  commentCreate.className = "comment__createdAt";

  const p = document.createElement("p");
  p.className = "comment__text";
  p.innerText = ` ${text}`;

  const span2 = document.createElement("span");
  span2.className = "video__comment-deleteBtn";
  span2.innerText = " 🗑️";

  span2.addEventListener("click", handleDelete);

  newComment.appendChild(ownerAvatar);
  newComment.appendChild(ownerNameSpan);
  newComment.appendChild(commentCreate);

  newComment.appendChild(p);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, comment, commentId } = await response.json();
    addComment(text, newCommentId, comment, commentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDelete = async (event) => {
  const li = event.target.parentElement;
  const commentId = event.target.parentElement.dataset.id;
  li.remove();
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
};

if (deleteBtn) {
  deleteBtn.forEach((btn) => btn.addEventListener("click", handleDelete));
}
