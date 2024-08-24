import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteservice from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteservice.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
        }
      });
    } else { 
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteservice.deletePost(post.$id).then(status)({
      if(status) {
        appwriteservice.deleteFile(post.featuredImage);
        navigate("/");
      },
    });
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex gap-4">
            {isAuthor && (
              <>
                <Link to={`/edit/${post.$id}`}>
                  <Button>Edit</Button>
                </Link>
                <Button onClick={deletePost}>Delete</Button>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <img
            src={appwriteservice.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          />
        </div>
        <div className="mt-4">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}
