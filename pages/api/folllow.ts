import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import useSWR from "swr";
import fetcher from "@/libs/fetcher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { username } = req.body;

    const { currentUser } = await serverAuth(req, res);

    if (!username || typeof username !== 'string') {
      throw new Error('Invalid ID');
    }
    const { data, error, isLoading, mutate } = useSWR(username ? `http://localhost:3000/users/${username}` : null, fetcher);
    const user = data

    if (!user) {
      throw new Error('Invalid ID');
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === 'POST') {
      updatedFollowingIds.push(username);

      // NOTIFICATION PART START
      try {
        await prisma.notification.create({
          data: {
            body: 'Someone followed you!',
            username,
          },
        });

        await prisma.user.update({
          where: {
            id: username,
          },
          data: {
            hasNotification: true,
          }
        });
      } catch (error) {
        console.log(error);
      }
      // NOTIFICATION PART END
      
    }

    if (req.method === 'DELETE') {
      updatedFollowingIds = updatedFollowingIds.filter((followingId) => followingId !== username);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        followingIds: updatedFollowingIds
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}