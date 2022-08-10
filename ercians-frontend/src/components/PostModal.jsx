import React, { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import Cookies from "universal-cookie";
import "../styles/PostModal.css";
import "../styles/Feed.css";
import "../styles/Post.css";
import { getCookie } from "../utils/cookieController";

const PostModal = ({ setModalClick }) => {
  const posts = useSelector((state) => state.posts.posts); // getting all the posts from redux-store
  const user = useSelector((state) => state.user.loggedInUser.data); // getitng user info from redux-store
  const [description, setDescription] = useState(""); // post description input box
  const [postImage, setPostImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setting form data for sending image upload to the server
    const postData = new FormData();
    postData.append("description", description);
    if (postImage) {
      postData.append("image", postImage);
    }

    // posting the post and sending request in backend
    const cookies = new Cookies();
    const token = getCookie("auth_token");

    const response = await axios({
      url: "http://127.0.0.1:8000/api/posts/",
      method: "post",
      data: postData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
    });

    setModalClick(false);
    window.location.reload(); // manual fix to a small bug
  };

  return (
    // event bubbling on PostModal
    <div className="postmodal" onClick={() => setModalClick(false)}>
      <div className="postmodal__modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <img
            className="post__profile__picture"
            src={"http://127.0.0.1:8000" + user.profile_picture}
          />
          <p className="post__header__right__name">{user.name}</p>
        </div>
        <div className="modal__middle">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <textarea
              rows={3}
              className="post__text"
              placeholder="Say Something..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              autoFocus
            ></textarea>
            <div className="upload">
              <label htmlFor="file">
                <div>
                  <ion-icon
                    id="photo-video-icon"
                    name="images-outline"
                  ></ion-icon>
                  Photo/video
                </div>
              </label>
              <input
                id="file"
                type="file"
                onChange={(e) => setPostImage(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary post_btn">
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
