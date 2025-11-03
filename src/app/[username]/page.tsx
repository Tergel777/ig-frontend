"use client";
 
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/UseAxios";
import { User } from "../types";
import { Grid3X3, Verified } from "lucide-react";
import { BadgeCheck } from "lucide-react"
import { Biohazard } from "lucide-react";
import { Post } from "../types";
import { PostCard } from "../components/PostCard";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfilePostCard } from "../components/profilepostcard";
import Link from "next/link";
const Page = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const [posts, setPosts] = useState<Post[]>([]);
  const router=useRouter()
  useEffect(() => {
    fetch("http://localhost:5500/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);
 
  useEffect(() => {
    axios
      .get(`/users/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((res) => {
        if (res.status === 404) {
          setIsNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
  fetch("http://localhost:5500/posts")
    .then((res) => res.json())
    .then((data) => {
      const userPosts = data.filter(
        (post: Post) => post.createdBy?.username === username
      );
      setPosts(userPosts);
    });
}, [username]);
 
  if (loading) return <>Loading...</>;
  if (isNotFound) return <>User with username {username} not found!</>;
 
  return <><div className="flex items-center flex-col gap-4">
    <Link href={"/"}>
    <div><Home/></div></Link>
<div className="w-[100px] h-[100px] border-2 border-gray-300 rounded-[50%] overflow-hidden">
  <img src="data:image/jpeg;base64,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"
   alt="avatar"
    className="w-full h-full object-cover" />
</div>
     <div className="flex items-center text-5xl font-bold gap-2"><BadgeCheck/>{username}</div>
     <div className="flex gap-1">
     <div className="">{username}:</div>
     <div className="text-gray-500">he/her</div>
     </div>
     <div className="flex gap-2">
     <div>{posts.length} posts</div>
     <div>0 followers</div>
     <div>0 following</div>
     </div>
     <div className="font-bold flex gap-1"><Biohazard/>{username}</div>
     <Grid3X3/>
     <hr className="w-400"></hr>
     <div className="w-[1300px] flex flex-wrap gap-10">
        {posts.map((post) => (
          <ProfilePostCard key={post._id} post={post} />
        ))}</div>
     </div></>
  
};

export default Page;