'use client'

import { useState, useEffect } from 'react'

import Profile from '@components/Profile'
import { useSearchParams } from 'next/navigation'

const UserProfile = ({ params }) => {
    const searchParams = useSearchParams();
    const username = searchParams.get('name');

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${params?.id}/posts`);
            const data = await response.json();

            setPosts(data);           
        }

        if (params?.id) {
            fetchPosts();
        }
    }, [params.id]);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    };

    const handleDelete = async (post) => {
        const hasConfirmed = confirm('Are you sure you want to delete this prompt?');

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'DELETE',
                })

                const filteredPosts = posts.filter((p) => p._id !== post._id);
                setPosts(filteredPosts);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <Profile
            name={`${username}'s`}
            desc={`Welcome to ${username}'s personalized profile page`}
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default UserProfile