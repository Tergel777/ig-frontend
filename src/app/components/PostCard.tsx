import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useAxios } from "../hooks/UseAxios";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";

dayjs.extend(relativeTime);

export const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [totalComments, setTotalComments] = useState(3);
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const axios = useAxios();
  const { user } = useUser();

  useEffect(() => {
    if (user && post.likes) {
      const userId = user._id;
      setIsLiked(post.likes.some((like) => like.createdBy?._id === userId));
    }
  }, [user, post.likes]);

  const handleSubmitComment = async () => {
    try {
      const response = await axios.post(`/posts/${post._id}/comments`, { text });
      if (response.status === 200) {
        setText("");
        setComments([...comments, response.data]);
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (err) {
      toast.error("Сэтгэгдэл нэмэхэд алдаа гарлаа");
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.isLiked);
      setLikeCount((prev) => (response.data.isLiked ? prev + 1 : prev - 1));
    } catch (err) {
      toast.error("Лайк дарахад алдаа гарлаа");
    }
  };

  return (
    <div key={post._id} className="mb-4 border-b py-4 flex flex-col gap-4">
      <div className="flex gap-[10px]">
        <Link href={`/${post.createdBy?.username || ""}`}>
          <div className="font-bold">{post.createdBy?.username || "Unknown"}</div>
        </Link>
        <div className="font-bold">{dayjs(post.createdAt).fromNow()}</div>
      </div>

      {post.imageUrl && <img src={post.imageUrl} alt="" className="my-2" />}

      <div className="flex">
        <div
          className="hover:opacity-60 cursor-pointer"
          onClick={handleLike}
        >
          {isLiked ? <Heart fill="red" stroke="red" /> : <Heart />}
        </div>
      </div>

      <div>{likeCount} likes</div>
      <hr />

      <Link href={`/${post.createdBy?.username || ""}`}>
        <b>{post.createdBy?.username}</b>
      </Link>{" "}
      {post.description}

      {comments.slice(0, totalComments).map((comment) => (
        <div key={comment._id}>
          <b>{comment.createdBy?.username}: </b>
          {comment.text}
        </div>
      ))}

      {comments.length > 3 && totalComments <= 3 && (
        <div
          onClick={() => setTotalComments(100)}
          className="hover:underline cursor-pointer"
        >
          View all comments
        </div>
      )}

      <div className="relative mt-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="w-full resize-none border rounded p-1"
          rows={1}
        />
        {text.length > 0 && (
          <div
            onClick={handleSubmitComment}
            className="absolute hover:underline cursor-pointer right-2 top-1 font-bold text-blue-500"
          >
            Post
          </div>
        )}
      </div>
    </div>
  );
};
